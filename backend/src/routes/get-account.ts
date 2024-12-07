import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { BadRequest } from "./_errors/bad-request"

export async function getAccount(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/account/:accountId', { 
      schema: {
        summary: 'Get full user account by accountId',
        tags: ['accounts'],
        params: z.object({
          accountId: z.string().uuid("Invalid accountId format"),
        }),
        response: {
          200: z.object({
            accountId: z.string().uuid(),
            name: z.string(),
            email: z.string().email(),
            birthdate: z.string(),
            cellphone: z.string(),
            password: z.string(), // Incluindo a senha no retorno
          }),
          400: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    }, async (request, reply) => {
      try {
        const { accountId } = request.params

        // Buscar a conta com base no accountId
        const account = await prisma.account.findUnique({
          where: { id: accountId },
        })

        if (!account) {
          throw new BadRequest('Account not found.')
        }

        return {
          accountId: account.id,
          name: account.name,
          email: account.email,
          birthdate: account.birthdate.toISOString().split('T')[0], // Formatar a data no formato YYYY-MM-DD
          cellphone: account.cellphone.toString(), // Convertendo BigInt para string
          password: account.password, // Expondo a senha (não recomendado em produção)
        }
      } catch (error: unknown) {
        console.error('Error fetching account:', error)

        const errorMessage = error instanceof Error ? error.message : 'Internal server error!'
        reply.status(500).send({ message: errorMessage })
      }
    })
}
