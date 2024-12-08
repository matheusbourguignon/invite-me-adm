import fastify from "fastify";

import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { errorHandler } from "./error-handler";
import { checkIn } from "./routes/check-in";
import { createAccount } from "./routes/create-account";
import { createEvent } from "./routes/create-event";
import { createInvite } from "./routes/create-invite";
import { getAccount } from "./routes/get-account";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { getEvent } from "./routes/get-event";
import { getEventAttendees } from "./routes/get-event-attendees";
import { login } from "./routes/login";
import { registerForEvent } from "./routes/register-for-event";
import { updateAccount } from "./routes/update-account";


export const app = fastify()


app.register(fastifyCors, {
    origin:'*',
})

app.register(fastifySwagger, {
    swagger: {
        consumes: ['aplication/json'],
        produces: ['application/json'],
        info: {
          title: 'invite-me',
          description: 'Especificações da API para o back-end da aplicação invite-me.',
          version: '1.0.0'
        },
    },
    transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createInvite)
app.register(createAccount)
app.register(getAccount)
app.register(updateAccount); 
app.register(login)
app.register(createEvent)
app.register(registerForEvent)
app.register(getEvent)
app.register(getAttendeeBadge)
app.register(checkIn)
app.register(getEventAttendees)


app.setErrorHandler(errorHandler)
app.listen({ port: 3333 }).then(() => {
    console.log('HTTP server running');

})

//localhost:3333