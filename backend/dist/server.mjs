import {
  getEvent
} from "./chunk-6YTUT2VF.mjs";
import {
  registerForEvent
} from "./chunk-FTBJWMFC.mjs";
import {
  errorHandler
} from "./chunk-DCZJQNPL.mjs";
import {
  checkIn
} from "./chunk-AWGYM26U.mjs";
import {
  createEvent
} from "./chunk-47IYSD4M.mjs";
import "./chunk-KDMJHR3Z.mjs";
import "./chunk-JRO4E4TH.mjs";
import {
  getAttendeeBadge
} from "./chunk-VPHRAPA7.mjs";
import {
  getEventAttendees
} from "./chunk-53IBHP2K.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["aplication/json"],
    produces: ["application/json"],
    info: {
      title: "invite-me",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o invite-me.",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333 }).then(() => {
  console.log("HTTP server running");
});
export {
  app
};
