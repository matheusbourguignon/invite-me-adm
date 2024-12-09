import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function checkIn(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/attendees/check-in', {
      schema: {
        summary: 'Check an attendee by email',
        tags: ['check-ins'],
        body: z.object({
          email: z.string().email() // Recebe o email do convidado
        }),
        response: {
          201: z.null(),
        }
      }
    }, async (request, reply) => {
      const { email } = request.body;

      // Buscar o convite baseado no email (e também no eventId, se necessário)
      const invite = await prisma.invite.findFirst({
        where: {
          email, // Buscar pelo email do convidado
          eventId: 'some-event-id' // Ajuste para o ID correto do evento, ou passe via parâmetro
        }
      });

      if (!invite) {
        throw new BadRequest('Invite not found');
      }

      // Verificar se o convidado já fez o check-in
      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          inviteId: invite.id, // Usando o inviteId
        }
      });

      if (attendeeCheckIn !== null) {
        throw new BadRequest('Attendee already checked in');
      }

      // Criar o check-in com base no inviteId
      await prisma.checkIn.create({
        data: {
          inviteId: invite.id, // Usando o inviteId aqui
        }
      });

      return reply.status(201).send();
    });
}
