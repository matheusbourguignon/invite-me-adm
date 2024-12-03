import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { BadRequest } from "./_errors/bad-request";
import bcrypt from "bcryptjs";

export async function createAccount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post(
      '/create-account',
      {
        schema: {
          summary: 'Create a new account',
          tags: ['accounts'],
          body: z.object({
            name: z.string().min(1, 'Name is required'),
            email: z.string().email('Invalid email address'),
            date_of_birth: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), {
              message: 'Invalid date format. Please use YYYY-MM-DD',
            }),
            cellphone: z.string().regex(/^\d+$/, 'Phone must be a number'),
            password: z.string().min(6, 'Password must be at least 6 characters long'),
          }),
          response: {
            201: z.object({
              message: z.string(),
              account: z.object({
                id: z.number(),
                name: z.string(),
                email: z.string(),
              }),
            }),
            400: z.object({
              message: z.string(),
            }),
            500: z.object({
              message: z.string(),
            }),
          },
        },
      },
      async (request, reply) => {
        // Desestruturar corretamente 'cellphone'
        const { name, email, date_of_birth, cellphone, password } = request.body;

        // Verificar se o e-mail já existe no banco de dados
        const existingAccount = await prisma.account.findUnique({
          where: { email },
        });

        if (existingAccount) {
          throw new BadRequest('Email already in use');
        }

        // Criptografar a senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Garantir que date_of_birth seja um formato de data válido
        const formattedDateOfBirth = date_of_birth ? new Date(date_of_birth) : null;

        // Converter o celular para BigInt
        const formattedCellphone = BigInt(cellphone.replace(/\D/g, '')); // Remover qualquer caractere não numérico

        // Criar a conta no banco de dados
        try {
          const newAccount = await prisma.account.create({
            data: {
              name,
              email,
              date_of_birth: formattedDateOfBirth,
              cellphone: formattedCellphone, // Passar como BigInt
              password: hashedPassword,
            },
          });

          // Responder com sucesso
          return reply.status(201).send({
            message: 'Account created successfully',
            account: {
              id: newAccount.id,
              name: newAccount.name,
              email: newAccount.email,
            },
          });
        } catch (error) {
          console.error('Error creating account:', error); // Log de erro detalhado
          return reply.status(500).send({ message: 'Internal server error!' });
        }
      }
    );
}
