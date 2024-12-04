import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import bcrypt from 'bcryptjs' // Para criptografar a senha
import { BadRequest } from "./_errors/bad-request"

export async function updateAccount(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .put('/update-account', {
            schema: {
                summary: 'Update a user account',
                tags: ['accounts'],
                body: z.object({
                    userId: z.string().uuid(), // ID do usuário a ser atualizado
                    name: z.string().min(2, "Name must be at least 2 characters long").optional(),
                    email: z.string().email("Invalid email format").optional(),
                    birthdate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Birthdate must be in the format YYYY-MM-DD").optional(),
                    cellphone: z.string().min(10, "Phone number must be at least 10 digits").max(15, "Phone number is too long").optional(),
                    password: z.string().min(6, "Password must be at least 6 characters long").optional(),
                }),
                response: {
                    200: z.object({
                        message: z.string(),
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
                const { userId, name, email, birthdate, cellphone, password } = request.body

                // Verificar se o usuário existe
                const user = await prisma.account.findUnique({
                    where: { id: userId },
                })

                if (!user) {
                    throw new BadRequest('User not found.')
                }

                // Verificar se o e-mail já está em uso por outra conta
                if (email && email !== user.email) {
                    const existingEmail = await prisma.account.findUnique({
                        where: { email },
                    })

                    if (existingEmail) {
                        throw new BadRequest('An account with this email already exists.')
                    }
                }

                // Atualizar os dados do usuário
                const updatedData: any = {
                    name: name || user.name,
                    email: email || user.email,
                    birthdate: birthdate ? new Date(birthdate) : user.birthdate,
                    cellphone: cellphone || user.cellphone,
                }

                // Se uma nova senha foi fornecida, criptografá-la
                if (password) {
                    updatedData.password = await bcrypt.hash(password, 10)
                }

                const updatedUser = await prisma.account.update({
                    where: { id: userId },
                    data: updatedData,
                })

                return { message: 'User account updated successfully.' }
            } catch (error: unknown) {
                console.error('Error updating account:', error)

                // Verificar se o erro é uma instância de Error
                const errorMessage = error instanceof Error ? error.message : 'Internal server error!'

                reply.status(500).send({ message: errorMessage }) // Envia resposta de erro com a mensagem
            }
        })
}
