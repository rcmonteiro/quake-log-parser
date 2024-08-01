import { LogRepository } from '@/application/repositories/log-repository'
import { GetMatchReport } from '@/application/use-cases/get-match-report'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import path from 'node:path'
import { z } from 'zod'

export const getMatchReportController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/reports/matches',
    {
      schema: {
        tags: ['Reports'],
        summary:
          'Fetches a report with player rankings, and grouped match information',
        response: {
          200: z.object({
            ranking: z.array(
              z.object({
                rank: z.number(),
                player: z.string(),
                score: z.number(),
              })
            ),
            matches: z.array(
              z.object({
                id: z.string(),
                total_kills: z.number().nullable().default(0),
                players: z.array(z.string()),
                kills: z.record(z.string(), z.number()),
              })
            ),
          }),
        },
      },
    },

    async (request, reply) => {
      const logFilePath = path.join(process.cwd(), './logs/qgames.log')
      const logRepository = new LogRepository(logFilePath)
      const parseMatchReport = new GetMatchReport(logRepository)

      const result = parseMatchReport.execute()

      if (result.isLeft()) {
        throw new BadRequestError()
      }

      return reply.status(200).send(result.value)
    }
  )
}
