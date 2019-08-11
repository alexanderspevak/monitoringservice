import * as util from 'util'
import * as zlib from 'zlib'
import { getRepository } from 'typeorm'
import { MonitoredEndpoint, MonitoringResult } from '../entity'
import { Response, Next } from 'restify'
import { RequestUser } from '../interface'
const unzip = util.promisify(zlib.unzip)

export const showMonitoringResults = async (req:RequestUser, res:Response, next:Next) => {
  const endPointRepository = getRepository(MonitoredEndpoint)
  const monitoredResultRepository = getRepository(MonitoringResult)
  const endPointId = req.query.id && typeof (parseInt(req.query.id)) === 'number' ? parseInt(req.query.id) : false
  const limit = req.query.limit && typeof (parseInt(req.query.limit)) === 'number' ? req.query.limit : 10
  const userId = req.user.id
  if (endPointId) {
    const endPoint = await endPointRepository.find({ where: { user: userId } })
    if (!endPoint) {
      res.status(400)
      return res.send('No endpoint with id: ' + endPointId + ' under logged in user')
    }
    const monitoredResults = await monitoredResultRepository.find({
      take: limit,
      where: { monitoredEndPointId: endPointId },
      order: {
        dateOfCheck: 'DESC'
      }
    })
    const parsedMonitoredResults = await Promise.all(monitoredResults.map(async (monitoredResult) => {
      const buffer = Buffer.from(monitoredResult.payload, 'base64')
      return unzip(buffer)
        .then((unzipedPayload: any) => {
          monitoredResult.payload = unzipedPayload.toString()
          return monitoredResult
        })
        .catch(err => {
          console.log(err.message)
        })
    }))
    res.header('Content-Type', 'application/json')
    res.status(200)
    res.send(parsedMonitoredResults)
  } else {
    res.status(400)
    res.send('EndPoint {id} needed in query parameter')
  }
}

class MonitoringResultController {
  monitoringResultRepository = getRepository(MonitoringResult)

  endpointRepository = getRepository(MonitoredEndpoint)

  public async getMonitoredResults (req: RequestUser, res: Response) {
    const {
      query: {
        id: userId,
        limit: uncheckedLimit
      } = {
        id: undefined,
        limit: undefined
      }
    } = req

    const endpointId = this.parseEndpointId(userId)
    const limit = this.parseResponseLimit(uncheckedLimit)

    if (endpointId) {
      if (!await this.checkEndpoint(endpointId)) {
        res.status(400)

        return res.send('No endpoint with id: ' + endpointId + ' under logged in user')
      }

      const monitoringResults = await this.parseResults(await this.getResults(endpointId, limit))
      res.header('Content-Type', 'application/json')
      res.status(200)

      return res.send(monitoringResults)
    }
    res.status(400)
    res.send('EndPoint {id} needed in query parameter')
  }

  private parseEndpointId (endpointId: unknown): number | false {
    if (endpointId && typeof endpointId === 'string' && typeof parseInt(endpointId) === 'number') {
      return parseInt(endpointId)
    }

    return false
  }

  private parseResponseLimit (limit: unknown): number {
    if (limit && typeof limit === 'string' && typeof parseInt(limit) === 'number') {
      return parseInt(limit)
    }

    return 10
  }

  private checkEndpoint (userId: number): Promise<MonitoredEndpoint|undefined> {
    return this.endpointRepository.findOne({ where: { user: userId } })
  }

  private async getResults (monitoredEndPointId: number, take: number): Promise<MonitoringResult[]> {
    return this.monitoringResultRepository.find({
      take,
      where: { monitoredEndPointId },
      order: {
        dateOfCheck: 'DESC'
      }
    })
  }

  private async parseResults (monitoringResults: MonitoringResult[]) {
    return Promise.all(monitoringResults.map(
      async (monitoringResult) => {
        const buffer = Buffer.from(monitoringResult.payload, 'base64')
        const unzipedPayload: any = await unzip(buffer)
        monitoringResult.payload = unzipedPayload.toString()

        return monitoringResult
      }))
  }
}

export const monitoringResultController = new MonitoringResultController()
