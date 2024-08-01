import { app } from '@/http/app'
import request from 'supertest'

describe('GET /reports/matches (e2e tests)', async () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  it('should parse the full matches report', async () => {
    const response = await request(app.server).get('/reports/matches').send()
    expect(response.statusCode).toEqual(200)
    expect(response.body).toHaveProperty('matches')
    expect(response.body.matches).toHaveLength(21)
    expect(response.body.matches[0]).toHaveProperty('id')
    expect(response.body.matches[0]).toHaveProperty('total_kills')
    expect(response.body.matches[0]).toHaveProperty('players')
    expect(response.body.matches[0]).toHaveProperty('kills')
    expect(response.body.matches[0]).toHaveProperty('ranking')
  })
})
