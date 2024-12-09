import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', {
      schema: {
        summary: 'Get an event by ID or Name',
        tags: ['events'],
        params: z.object({
          eventId: z.string(), // Pode ser UUID ou nome
        }),
        response: {
          200: z.object({
            eventId: z.string().uuid(),
            title: z.string(),
            details: z.string().nullable(),
            maximumAttendees: z.number().nullable(),
            date: z.string(),
            time: z.string().nullable(),
          }),
          404: z.object({
            error: z.string(),
            message: z.string(),
          }), // Caso o evento não seja encontrado
          400: z.object({
            error: z.string(),
            message: z.string(),
          }), // Erro de requisição
        },
      },
    }, async (request, reply) => {
      const { eventId } = request.params;

      console.log("Received request to get event with ID or name:", eventId);

      try {
        // Verifica se o evento existe pelo ID (UUID) ou nome (slug)
        const event = await prisma.event.findFirst({
          where: {
            OR: [
              { id: eventId },      // Verifica pelo ID
              { title: eventId },   // Verifica pelo nome
            ],
          },
        });

        if (!event) {
          console.error("Event not found with ID or name:", eventId);
          return reply.status(404).send({
            error: 'Not Found',
            message: 'Event not found.',
          });
        }

        console.log("Event found:", event);

        // Retorna os dados do evento
        return {
          eventId: event.id,
          title: event.title,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          date: event.date.toISOString().split('T')[0], // Converte a data para o formato yyyy-mm-dd
          time: event.time,
        };
      } catch (error) {
        console.error("Error retrieving event:", error);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'There was an error retrieving the event.',
        });
      }
    });
}
