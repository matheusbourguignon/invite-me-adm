import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import bcrypt from 'bcryptjs' // Para comparar a senha
import jwt from 'jsonwebtoken' // Para gerar o token JWT

export async function login(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/login', {
            schema: {
                summary: 'Login to the application',
                tags: ['accounts'],
                body: z.object({
                    email: z.string().email("Invalid email format"),
                    password: z.string().min(6, "Password must be at least 6 characters long"),
                }),
                response: {
                    200: z.object({
                        accountId: z.string().uuid(),
                        token: z.string(), // Token JWT
                    }),
                    400: z.object({
                        message: z.string(),
                    }),
                    401: z.object({
                        message: z.string(),
                    }),
                    500: z.object({
                        message: z.string(),
                    })
                },
            },
        }, async (request, reply) => {
            try {
                const { email, password } = request.body

                // Verificar se a conta existe
                const account = await prisma.account.findUnique({
                    where: { email },
                })

                if (!account) {
                    reply.status(401).send({ message: 'Invalid email or password.' })
                    return
                }

                // Comparar a senha fornecida com a senha criptografada no banco de dados
                const isPasswordValid = await bcrypt.compare(password, account.password)

                if (!isPasswordValid) {
                    reply.status(401).send({ message: 'Invalid email or password.' })
                    return
                }

                // Se a senha for válida, gerar um token JWT
                const token = jwt.sign({ userId: account.id }, 'secret-key', { expiresIn: '1h' })

                return { accountId: account.id, token }
            } catch (error: unknown) {
                console.error('Error logging in:', error)

                const errorMessage = error instanceof Error ? error.message : 'Internal server error!'
                reply.status(500).send({ message: errorMessage })
            }
        })
}
