import 'reflect-metadata'
import * as restify from 'restify'
import { ISeedUser } from './types'
import { userRouter, monitoredEndPointRouter, monitoringResultRouter } from './routes'
import { User } from './entity'
import { Seeder } from './seeds/Seeder'

export class Server {
  seeders: [Seeder<User, ISeedUser>]

  constructor (seeders: [Seeder<User, ISeedUser>]) {
    this.seeders = seeders
  }

  public async start () {
    await Promise.all(this.startSeeders())
    const server = this.attachMiddleware(restify.createServer())

    server.listen(8080, () => {
      console.log('%s listening at %s', server.name, server.url)
      userRouter.applyRoutes(server)
      monitoredEndPointRouter.applyRoutes(server)
      monitoringResultRouter.applyRoutes(server)
      server.get(
        '/',
        (req: restify.Request, res: restify.Response): void => {
          res.send('<p> Hello </p>')
        })
    })
  }

  private startSeeders () {
    return this.seeders.map((seeder) => {
      return seeder.saveSeeds()
    })
  }

  private attachMiddleware (server: restify.Server): restify.Server {
    server.use(restify.plugins.acceptParser(server.acceptable))
    server.use(restify.plugins.queryParser())
    server.use(restify.plugins.bodyParser())
    server.pre(restify.plugins.pre.sanitizePath())

    return server
  }
}
