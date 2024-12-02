import fastify from "fastify";
import { z } from 'zod';
import { PrismaClient } from '@prisma/client'


const app = fastify()

const prisma = new PrismaClient({
    log: ['query'],
})

// Métodos HTTP: GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS,...

// Corpo da requisição (Request Body)
// Parâmetros de busca (search Params / Query Params)
// Parâmetros de rota (Route Params) 
// Cabeçalhos (Headers) 

// Semânticas = Significado

// Driver nativo / Query Builders / Orms

// Object Relational Mapping (Hibernate / Doctrine / ActiveRecord)

// JSON - Javascript Object Notation

app.post('/events', async (request, reply) => {
    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),

    })

    const data = createEventSchema.parse(request.body)

    const event = await prisma.event.create({
        data: {
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttendees,
            slug: new Date().toISOString(),
        }
    })

    return { eventId: event.id }
})

app.listen({ port: 3000 }).then(() => {
    console.log('HTTP server running');

})

//localhost:3333