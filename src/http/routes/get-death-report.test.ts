import { app } from '@/http/app'
import request from 'supertest'

describe('GET /reports/deaths (e2e tests)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should parse the full death report', async () => {
    const response = await request(app.server).get('/reports/deaths').send()
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('matches')
    expect(response.body.matches).toHaveLength(20)
  })
})
