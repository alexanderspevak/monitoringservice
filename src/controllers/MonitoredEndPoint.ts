import { MonitoredEndpoint } from '../entity'
import { validate } from 'class-validator'
import { Response } from 'restify'
import { RequestUser, IUpdateKey } from '../types'
import { workers } from '../workers'
import { ControllerClass } from './ControllerClass'
import { monitoredEndpointService, MonitoredEndpointService } from '../services'

export class MonitoredEndPointController extends ControllerClass<MonitoredEndpointService> {
  workersRepository = workers

  public saveEndpoint = async (req: RequestUser, res: Response) => {
    try {
      const monitoredEndpoint = this.parseMonitoredEndpoint(req, new MonitoredEndpoint())
      const errors = await validate(monitoredEndpoint)
      if (errors.length > 0) {
        res.status(400)

        return res.send(errors)
      }

      this.handleResponseSaveEndpoint(res, await this.service.save(monitoredEndpoint), 'addEndpointCycle')
    } catch (error) {
      this.handleServerError(error, res)
    }
  }

  public updateEndpoint = async (req: RequestUser, res: Response) => {
    try {
      const id = this.getId(req)
      if (!id) {
        return this.handleResponseInvalidId(res)
      }

      const userId = req.user.id
      const monitoredEndpoint = await this.findMonitoredEndpoint(id, userId)

      return monitoredEndpoint ? await this.handleUpdateEndpoint(req, res, monitoredEndpoint) : this.handleNotFoundMonitoredEndpoint(res)
    } catch (error) {
      this.handleServerError(error, res)
    }
  }

  public deleteEndpoint = async (req: RequestUser, res: Response) => {
    try {
      const userId = req.user.id
      const id = req.query.id
      if (!id) {
        return this.handleResponseInvalidId(res)
      }

      const monitoredEndpoint = await this.findMonitoredEndpoint(id, userId)

      return monitoredEndpoint ? await this.handleDeleteEndpoint(res, monitoredEndpoint) : this.handleNotFoundMonitoredEndpoint(res)
    } catch (error) {
      this.handleServerError(error, res)
    }
  }

  public showEndpoints = async (req: RequestUser, res: Response) => {
    try {
      const userId = req.user.id
      const monitoredEndpoints = await this.service.find({
        user: userId
      })

      res.send(monitoredEndpoints)
    } catch (error) {
      this.handleServerError(error, res)
    }
  }

  private handleUpdateEndpoint = async (req: RequestUser, res: Response, monitoredEndpoint: MonitoredEndpoint) => {
    const updatedMonitoredEndpoint = this.parseMonitoredEndpoint(req, monitoredEndpoint)
    const errors = await validate(updatedMonitoredEndpoint)
    if (errors.length > 0) {
      res.status(400)

      return res.send(errors)
    }
    const savedMonitoredEndpoint = await this.service.save(updatedMonitoredEndpoint)
    this.handleResponseSaveEndpoint(res, savedMonitoredEndpoint, 'updateEndpointCycle')
  }

  private findMonitoredEndpoint = async (id:number, userId:number) => {
    return await this.service.findOne({
      user: userId,
      id
    }) || false
  }

  private handleDeleteEndpoint = async (res: Response, monitoredEndpoint : MonitoredEndpoint) => {
    const deleteResult = await this.service.delete(monitoredEndpoint)
    res.status(200)
    res.send({ message: 'Affected Rows: ' + deleteResult.raw.affectedRows })

    return this.workersRepository.removeEndpointCycle(monitoredEndpoint)
  }

  private handleNotFoundMonitoredEndpoint = (res: Response) => {
    res.status(400)
    res.send('No such endpoint')
    return false
  }

  public parseMonitoredEndpoint = (req: RequestUser, monitoredEndpoint: MonitoredEndpoint) => {
    const {
      user: {
        id: userId
      },
      body: {
        name,
        url,
        monitoredInterval
      }
    } = req

    monitoredEndpoint.user = userId
    monitoredEndpoint.name = name || monitoredEndpoint.name
    monitoredEndpoint.url = this.parseUrl(url) || monitoredEndpoint.url
    monitoredEndpoint.monitoredInterval = monitoredInterval ? parseInt(monitoredInterval) : monitoredEndpoint.monitoredInterval

    return monitoredEndpoint
  }

  private parseUrl (url: string) {
    return url[url.length - 1] === '/' ? url.slice(0, -1) : url
  }

  private handleResponseSaveEndpoint (res: Response, monitoredEndpoint: MonitoredEndpoint | false, updateKey: IUpdateKey) {
    if (monitoredEndpoint) {
      this.workersRepository[updateKey](monitoredEndpoint)
      res.status(200)

      return res.send(monitoredEndpoint)
    }

    res.status(500)
    return res.send({ message: 'error saving monitoredEndpoint' })
  }

  public getId = (req: RequestUser): number|false => {
    const id = parseInt(req.body.id)

    return id && typeof (id) === 'number' ? id : false
  }

  private handleResponseInvalidId = (res: Response):false => {
    res.status(400)
    res.send({ message: 'endpoint id needed to update' })

    return false
  }
}

export const monitoredEndpointController = new MonitoredEndPointController(monitoredEndpointService)
