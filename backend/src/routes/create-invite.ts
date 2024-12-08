import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/invites', {
      schema: {
        summary: 'Create an invite for an event',
        tags: ['invites'],
        body: z.object({
          name: z.string().min(4), // Nome do convidado
          email: z.string().email(), // Email do convidado
          eventId: z.string().uuid(), // ID do evento ao qual o convite pertence
        }),
        response: {
          201: z.object({
            inviteId: z.number(), // ID do convite recém-criado
          }),
        },
      },
    }, async (request, reply) => {
      const { name, email, eventId } = request.body;

      // Verificar se já existe um convite com o mesmo email para o evento
      const inviteFromEmail = await prisma.invite.findUnique({
        where: {
          eventId_email: { // Chave única composta entre eventId e email
            eventId,
            email,
          }
        }
      });

      if (inviteFromEmail) {
        throw new BadRequest('This email is already registered for this event');
      }

      // Criar o novo convite
      const invite = await prisma.invite.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      return { inviteId: invite.id };
    });
}
