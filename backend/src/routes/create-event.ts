import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { generateSlug } from "../utils/generate-slug";

export async function createEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events', {
      schema: {
        summary: 'Create an event',
        tags: ['events'],
        body: z.object({
          title: z.string().min(4), // Nome do evento
          details: z.string().nullable(), // Descrição do evento (opcional)
          maximumAttendees: z.number().int().positive().nullable(), // Capacidade máxima de participantes (opcional)
          date: z.string().refine(val => {
            // Verificar se o formato é dd/mm/yyyy
            const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
            return regex.test(val);
          }, { message: 'Invalid date format, please use dd/mm/yyyy' }),
          time: z.string().nullable(), // Horário do evento (opcional, pode ser nulo)
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(), // ID do evento criado
          }),
          400: z.object({
            error: z.string(),
            message: z.string(),
          }), // Erro de requisição
        },
      },
    }, async (request, reply) => {
      const {
        title,
        details,
        maximumAttendees,
        date, // Data do evento
        time, // Horário do evento
      } = request.body;

      console.log("Received request to create event:", {
        title,
        details,
        maximumAttendees,
        date,
        time,
      });

      const slug = generateSlug(title);

      // Verifica se já existe um evento com o mesmo slug
      const eventWithSameSlug = await prisma.event.findUnique({
        where: {
          slug,
        },
      });

      if (eventWithSameSlug !== null) {
        console.error("Event with the same slug already exists.");
        return reply.status(400).send({
          error: 'Bad Request',
          message: 'Another event with the same title already exists.',
        });
      }

      try {
        // Convertendo a data do formato dd/mm/yyyy para yyyy-mm-dd
        const [day, month, year] = date.split('/');
        const formattedDate = `${year}-${month}-${day}`;

        const parsedDate = new Date(formattedDate);
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid date format:", date);
          return reply.status(400).send({
            error: 'Bad Request',
            message: 'Invalid date format. Please use dd/mm/yyyy.',
          });
        }

        const eventDate = new Date(parsedDate);
        console.log("Parsed event date:", eventDate);

        // Criação do evento no banco de dados
        const event = await prisma.event.create({
          data: {
            title,
            details,
            maximumAttendees,
            slug,
            date: eventDate, // Definindo a data do evento
            time, // Definindo o horário do evento
          },
        });

        console.log("Event created successfully:", event);
        return { eventId: event.id };
      } catch (error) {
        console.error("Error creating event:", error);
        return reply.status(500).send({
          error: 'Internal Server Error',
          message: 'There was an error creating the event.',
        });
      }
    });
}
