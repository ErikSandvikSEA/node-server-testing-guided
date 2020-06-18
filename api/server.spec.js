const supertest = require('supertest')
const db = require('../data/dbConfig')

const server = require('./server.js')


it('should use the testing environment', () => {
     expect(process.env.DB_ENV).toBe('testing')
})

describe('server.js',() => {
     afterEach(async () => {
          await db('hobbits').truncate()
     })


     describe('GET /', () => {
          it('should return 200 OK', () => {
               return supertest(server)
                    .get('/')
                    .then(res => {
                         expect(res.status).toBe(200)
               })
          })
          it('should return JSON', () => {
               return supertest(server)
                    .get('/')
                    .then(res => {
                         expect(res.type).toMatch(/json/i)
                    })
          })
          it('should return api up', () => {
               return supertest(server)
                    .get('/')
                    .then(res => {
                         expect(res.body.api).toBe('up')
                         expect(res.body).toEqual({ api: "up" })
                    })
          })
     })
     describe('POST /hobbits', () => {
          it('should save the hobbit', () => {
               const name = 'bilbo'

               return supertest(server)
                    .post('/hobbits')
                    .send({ name })
                    .then(res => {
                         expect(res.body.name).toBe(name)
                    })
          })

          it('should add multiple hobbits', async () => {
               const hobbits = [{name: 'gaffer'}, {name: 'frodo'}]
               
               await supertest(server).post('/hobbits').send(hobbits)

               let allHobbits = await supertest(server).get('/hobbits')
               expect(allHobbits.body).toHaveLength(2)

               await supertest(server).post('/hobbits').send({name: 'rose'})
               allHobbits = await supertest(server).get('/hobbits')
               expect(allHobbits.body).toHaveLength(3)
          })
     })
})