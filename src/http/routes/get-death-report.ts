import { LogRepository } from '@/application/repositories/log-repository'
import { GetDeathReport } from '@/application/use-cases/get-death-report'
import { BadRequestError } from '@/http/_errors/bad-request-error'
import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import path from 'node:path'
import { z } from 'zod'

export const getDeathReportController = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/reports/deaths',
    {
      schema: {
        tags: ['Reports'],
        summary:
          'Fetches a report by Death Means grouped by Match ID with total kills',
        response: {
          200: z.object({
            matches: z.array(
              z.object({
                id: z.string(),
                total_kills: z.number().nullable().default(0),
                kills_by_means: z.record(z.string(), z.number()),
              })
            ),
          }),
        },
      },
    },

    async (request, reply) => {
      const logFilePath = path.join(process.cwd(), './logs/qgames.log')
      const logRepository = new LogRepository(logFilePath)
      const parseMatchReport = new GetDeathReport(logRepository)

      const result = parseMatchReport.execute()

      if (result.isLeft()) {
        throw new BadRequestError()
      }

      return reply.status(200).send(result.value)
    }
  )
}
