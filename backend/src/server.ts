import fastify from "fastify";
import { serializerCompiler, validatorCompiler,} from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvent } from "./routes/register-for-event";

export const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent)
app.register(registerForEvent)

app.listen({ port: 3000 }).then(() => {
    console.log('HTTP server running');

})

//localhost:3333