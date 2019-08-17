import * as util from 'util'
import * as zlib from 'zlib'
import * as config from 'config'
import { MonitoredEndpoint, MonitoringResult } from '../entity'
import { Response } from 'restify'
import { RequestUser } from '../types'
import { ControllerClass } from './ControllerClass'
import {
  monitoredEndpointService,
  MonitoredEndpointService,
  monitoringResultService,
  MonitoringResultService
} from '../services'
const unzip = util.promisify(zlib.unzip)

export class MonitoringResultController extends ControllerClass <MonitoringResultService> {
  service: MonitoringResultService

  monitoredEndpointService: MonitoredEndpointService

  constructor (service: MonitoringResultService, monitoredEndpointService: MonitoredEndpointService) {
    super(service)
    this.monitoredEndpointService = monitoredEndpointService
  }

  public getMonitoredResults = async (req: RequestUser, res: Response) => {
    try {
      const {
        user: {
          id: userId = undefined
        } = {},
        query: {
          id,
          limit: uncheckedLimit
        } = {
          id: undefined,
          limit: undefined
        }
      } = req

      const endpointId = this.parseEndpointId(id)
      const limit = this.parseResponseLimit(uncheckedLimit)
      if (endpointId && userId) {
        if (!await this.checkEndpoint(userId, endpointId)) {
          res.status(400)

          return res.send(`No endpoint with id: ${endpointId} under logged in user`)
        }
        const monitoringResults = await this.parseResults(await this.getResults(endpointId, limit))
        res.status(200)

        return res.send(monitoringResults)
      }
      res.status(400)
      res.send({ message: 'EndPoint {id} needed in query parameter' })
    } catch (error) {
      this.handleServerError(error, res)
    }
  }

  public handleNotFoundEndpoint = async (res: Response, endpointId: number, userId: number) => {
    res.status(400)

    return res.send({ message: `No endpoint with id: ${endpointId} under logged in user` })
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

    return config.get('MonitoredEndpoint.responseLimit')
  }

  private checkEndpoint (userId: number, id: number): Promise<MonitoredEndpoint| undefined> {
    return this.monitoredEndpointService.repository.findOne({ where: { user: userId, id } })
  }

  private async getResults (monitoredEndPointId: number, take: number): Promise<MonitoringResult[]> {
    return this.service.repository.find({
      take,
      where: {
        monitoredEndPoint: monitoredEndPointId
      },
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

export const monitoringResultController = new MonitoringResultController(monitoringResultService, monitoredEndpointService)
