import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/get-event.ts
import { z } from "zod";
async function getEvent(app) {
  app.withTypeProvider().get("/events/:eventId", {
    // Removida a vírgula extra aqui
    schema: {
      summary: "Get an event",
      tags: ["events"],
      params: z.object({
        eventId: z.string().uuid()
        // Validação de UUID para o parâmetro eventId
      }),
      response: {
        200: {
          event: z.object({
            id: z.string().uuid(),
            title: z.string().min(4),
            slug: z.string(),
            details: z.string().nullable(),
            maximumAttendees: z.number().int().nullable(),
            attendeesAmount: z.number().int()
          })
        }
      }
      // Você pode especificar o esquema de resposta, se necessário
    }
  }, async (request, reply) => {
    const { eventId } = request.params;
    const event = await prisma.event.findUnique({
      select: {
        id: true,
        title: true,
        slug: true,
        details: true,
        maximumAttendees: true,
        _count: {
          select: {
            Attendees: true
          }
        }
      },
      where: {
        id: eventId
      }
    });
    if (event === null) {
      throw new BadRequest("Event not found");
    }
    return reply.send({
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        details: event.details,
        maximumAttendees: event.maximumAttendees,
        attendeesAmount: event._count.Attendees
      }
    });
  });
}

export {
  getEvent
};
