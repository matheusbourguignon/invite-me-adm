import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";

export async function createAccount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/accounts', {
      schema: {
        summary: 'Create an account',
        tags: ['accounts'],
        body: z.object({
          name: z.string().min(4), // Nome com no mínimo 4 caracteres
          email: z.string().email(), // Validação para email
          password: z.string().min(6), // Senha com no mínimo 6 caracteres
          birthdate: z.string().nullable(), // Data de nascimento opcional
          cellphone: z.number().nullable(), // Celular como número opcional
        }),
        response: {
          201: z.object({
            accountId: z.number(),
          }),
          400: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
            details: z.string(),
          }),
        },
      },
    }, async (request, reply) => {
      try {
        const { name, email, password, birthdate, cellphone } = request.body;

        // Verifica se já existe uma conta com o mesmo e-mail
        const existingAccount = await prisma.account.findUnique({
          where: {
            email,
          },
        });

        if (existingAccount) {
          return reply.status(400).send({
            message: "An account with this email already exists."
          });
        }

        // Validação e conversão do birthdate
        let parsedBirthdate: Date | null = null;
        if (birthdate) {
          // Verifica se a data está no formato ISO 8601
          const datePattern = /^\d{4}-\d{2}-\d{2}$/;
          if (!datePattern.test(birthdate)) {
            return reply.status(400).send({
              message: "Invalid birthdate format. Please provide a valid date in the format YYYY-MM-DD.",
            });
          }
          const parsedDate = new Date(birthdate);
          if (isNaN(parsedDate.getTime())) {
            return reply.status(400).send({
              message: "Invalid birthdate format. Please provide a valid date.",
            });
          }
          parsedBirthdate = parsedDate;
        }

        // Validação do celular (se fornecido)
        let formattedCellphone: bigint | null = null;
        if (cellphone) {
          formattedCellphone = BigInt(cellphone); // Certifica que é um BigInt
        }

        // Criptografa a senha antes de salvar
        const hashedPassword = await bcrypt.hash(password, 10);

        // Cria a conta no banco de dados
        const account = await prisma.account.create({
          data: {
            name,
            email,
            password: hashedPassword,
            birthdate: parsedBirthdate, // Usando a data validada ou null
            cellphone: formattedCellphone, // Usando o celular validado ou null
          },
        });

        // Retorna o ID da conta criada
        return { accountId: account.id };

      } catch (error) {
        console.error("Error creating account: ", error); // Logar o erro completo

        if (error instanceof Error) {
          return reply.status(500).send({
            message: "Internal server error!",
            details: error.message,
          });
        } else {
          return reply.status(500).send({
            message: "Internal server error!",
            details: "Unknown error occurred.",
          });
        }
      }
    });
}
