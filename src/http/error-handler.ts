import type { FastifyInstance } from 'fastify'
import { ZodError } from 'zod'

import { BadRequestError } from './_errors/bad-request-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    console.log(error.flatten().fieldErrors)
    return reply.status(400).send({
      message: error.flatten().fieldErrors,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(400).send({
      message: error.message,
    })
  }

  console.error(error) // TODO: Set observability integration

  return reply.status(500).send({ message: 'Internal server error' })
}
