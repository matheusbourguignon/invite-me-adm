import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import bcrypt from 'bcryptjs' // Para criptografar a senha
import { BadRequest } from "./_errors/bad-request"

export async function createAccount(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/create-account', {
            schema: {
                summary: 'Create a user account',
                tags: ['accounts'],
                body: z.object({
                    name: z.string().min(2, "Name must be at least 2 characters long"),
                    email: z.string().email("Invalid email format"),
                    birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Birthdate must be in the format YYYY-MM-DD"),
                    cellphone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long"),
                    password: z.string().min(6, "Password must be at least 6 characters long"),
                }),
                response: {
                    201: z.object({
                        accountId: z.string().uuid(),
                    }),
                    400: z.object({
                        message: z.string(),
                    }),
                    500: z.object({
                        message: z.string(),
                    })
                },
            },
        }, async (request, reply) => {
            try {
                const { name, email, birthdate, cellphone, password } = request.body

                // Verificar se já existe uma conta com o mesmo e-mail
                const existingAccount = await prisma.account.findUnique({
                    where: { email },
                })

                if (existingAccount !== null) {
                    throw new BadRequest('An account with this email already exists.')
                }

                // Criptografar a senha
                const hashedPassword = await bcrypt.hash(password, 10)

                // Criar a nova conta
                const account = await prisma.account.create({
                    data: {
                        name,
                        email,
                        birthdate: new Date(birthdate), // Converter a string para Date
                        cellphone, // A variável cellphone já está como string
                        password: hashedPassword, // Senha criptografada
                    },
                })

                return { accountId: account.id }
            } catch (error: unknown) {
                console.error('Error creating account:', error)

                // Verificar se o erro é uma instância de Error
                const errorMessage = error instanceof Error ? error.message : 'Internal server error!'

                reply.status(500).send({ message: errorMessage }) // Envia resposta de erro com a mensagem
            }
        })
}
