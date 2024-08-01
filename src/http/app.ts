import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { getMatchReportController } from './routes/get-match-report'
import { getDeathReportController } from './routes/get-death-report'

export const app = fastify()

app.withTypeProvider<ZodTypeProvider>()
app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Quake Log Parser API',
      description:
        'The Quake Log Parser API processes Quake III Arena log files to generate detailed reports of game statistics. It extracts information such as total kills, player names, individual player kills, and the means of death, presenting it in a structured JSON format. This API allows users to upload log files and retrieve game reports, facilitating easy analysis of gameplay data.',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyCors)

app.register(getMatchReportController)
app.register(getDeathReportController)
