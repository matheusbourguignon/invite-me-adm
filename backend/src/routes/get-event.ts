import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
 

export async function getEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId', { // Removida a vírgula extra aqui
      schema: {
        params: z.object({
          eventId: z.string().uuid(), // Validação de UUID para o parâmetro eventId
        }),
        response: {
          200: {
            event: z.object({
              id: z.string().uuid(),
              title: z.string(),
              slug: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              attendeesAmount: z.number().int(),
            })
          },
        }, // Você pode especificar o esquema de resposta, se necessário
      },
    }, async (request, reply) => {
      const { eventId } = request.params

      // Buscando o evento no banco de dados
      const event = await prisma.event.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          details: true,
          maximumAttendees: true,
          _count: {
             select: {
              Attendees: true,
             }
          },
        },
        where: {
          id: eventId,
        },
      });

      // Verificação se o evento existe
      if (event === null) {
        throw new Error('Event not found');
      }

      // Retornando o evento encontrado
      return reply.send({
         event: {
           id: event.id,
           title: event.title,
           slug: event.slug,
           details: event.details,
           maximumAttendees: event.maximumAttendees,
           attendeesAmount: event._count.Attendees,
         }, 
        });
    });
}
