import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/invites', {
      schema: {
        summary: 'Register an invite',
        tags: ['invites'],
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            inviteId: z.number(),
          }),
        },
      },
    }, async (request, reply) => {
      const { eventId } = request.params;
      const { name, email } = request.body;

      const inviteFromEmail = await prisma.invite.findUnique({
        where: {
          eventId_email: {
            eventId,
            email,
          },
        },
      });

      if (inviteFromEmail) {
        throw new BadRequest('This e-mail is already registered for this event');
      }

      const [event, amountOfInvitesForEvent] = await Promise.all([
        prisma.event.findUnique({
          where: {
            id: eventId,
          },
        }),
        prisma.invite.count({
          where: {
            eventId,
          },
        }),
      ]);

      if (!event) {
        throw new BadRequest('Event not found');
      }

      if (event?.maximumAttendees && amountOfInvitesForEvent >= event?.maximumAttendees) {
        throw new BadRequest('The maximum number of invites for this event has been reached.');
      }

      const invite = await prisma.invite.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      return reply.status(201).send({ inviteId: invite.id });
    });
}

