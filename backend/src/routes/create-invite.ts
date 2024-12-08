import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
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

      // Criar o novo convite no banco de dados
      const invite = await prisma.invite.create({
        data: {
          name,
          email,
          eventId,
        },
      });

      // Enviar o convite por e-mail
      try {
        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });

        if (!event) {
          throw new BadRequest('Event not found');
        }

        const transporter = nodemailer.createTransport({
          service: "gmail", // ou outro serviço de sua preferência
          auth: {
            user: "seuemail@gmail.com", // Seu email
            pass: "suasenha", // Sua senha ou app password
          },
        });

        const mailOptions = {
          from: "seuemail@gmail.com",
          to: email,
          subject: `Convite para o evento: ${event.title}`,
          text: `
            Olá ${name},

            Você foi convidado para o evento "${event.title}"!

            Detalhes do evento:
            - Data: ${event.date}
            - Horário: ${event.time || "Não especificado"}

            Aguardamos sua presença!

            Atenciosamente,
            Equipe do evento
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Convite enviado para:", email);
      } catch (error) {
        console.error("Erro ao enviar o convite:", error);
        // Se falhar ao enviar o email, podemos ainda assim retornar o convite criado, mas com um erro no envio.
      }

      return { inviteId: invite.id };
    });
}
