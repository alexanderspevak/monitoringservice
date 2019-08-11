import { MonitoredEndpoint } from '../entity'
import { validate } from 'class-validator'
import { Response, Next } from 'restify'
import { RequestUser, IUpdateKey } from '../types'
import { workers } from '../workers'
import { ControllerClass } from './ControllerClass'

export class MonitoredEndPointController extends ControllerClass {
  workersRepository = workers

  public saveEndpoint = async (req: RequestUser, res: Response) => {
    try {
      const monitoredEndpoint = this.parseMonitoredEndpoint(req, new MonitoredEndpoint())
      console.log('monitoredEndpoint', monitoredEndpoint)
      res.header('Content-Type', 'application/json')

      const errors = await validate(monitoredEndpoint)
      if (errors.length > 0) {
        res.status(400)

        return res.send(errors)
      }

      this.handleResponseSaveEndpoint(res, await this.workersRepository.saveMonitoredEndpoint(monitoredEndpoint), 'addEndpointCycle')
    } catch (error) {
      this.handleServerError(error, res)
    }
  }

  public updateEndpoint = async (req: RequestUser, res: Response) => {
    try {
      res.header('Content-Type', 'application/json')
      const id = this.getId(req, res)
      if (!id) {
        return
      }
      const userId = req.user.id
      const monitoredEndpoint = await this.findMonitoredEndpoint(id, userId)
      if (!monitoredEndpoint) {
        res.status(400)

        return res.send({ message: 'Endpoint non existant' })
      }
      const updatedMonitoredEndpoint = this.parseMonitoredEndpoint(req, monitoredEndpoint)
      const errors = await validate(updatedMonitoredEndpoint)
      if (errors.length > 0) {
        res.status(400)

        return res.send(errors)
      }

      this.handleResponseSaveEndpoint(res, await this.workersRepository.saveMonitoredEndpoint(updatedMonitoredEndpoint), 'updateEndpointCycle')
    } catch (error) {
      this.handleServerError(error, res)
    }
  }

  public deleteEndpoint = async (req: RequestUser, res: Response) => {
    try {
      res.header('Content-Type', 'application/json')
      const userId = req.user.id
      const id = this.getId(req, res)
      if (!id) {
        return
      }
      const monitoredEndpoint = await this.findMonitoredEndpoint(id, userId)

      if (!monitoredEndpoint) {
        this.handleNotFoundMonitoredEndpoint(res)

        return
      }

      const deleteResult = await this.workersRepository.monitoredEndpointRepository.delete(id)
      res.status(200)
      res.send({ message: 'Affected Rows: ' + deleteResult.raw.affectedRows })
      this.workersRepository.removeEndpointCycle(monitoredEndpoint)
    } catch (error) {
      this.handleServerError(error, res)
    }
  }

  public showEndpoints = async (req: RequestUser, res: Response, next: Next) => {
    try {
      const userId = req.user.id
      const monitoredEndpoints = await this.workersRepository.monitoredEndpointRepository.find({
        where: {
          user: userId
        }
      })
      res.header('Content-Type', 'application/json')
      res.send(monitoredEndpoints)
    } catch (error) {
      this.handleServerError(error, res)
    }
  }

  private findMonitoredEndpoint = async (id:number, userId:number) => {
    const monitoredEndpoint = await this.workersRepository.monitoredEndpointRepository.findOne({
      where: {
        user: userId,
        id: id
      }
    })

    if (!monitoredEndpoint) {
      return false
    }

    return monitoredEndpoint
  }

  private handleNotFoundMonitoredEndpoint = (res: Response) => {
    res.status(400)
    res.send('No such endpoint')
    return false
  }

  private parseMonitoredEndpoint = (req: RequestUser, monitoredEndpoint: MonitoredEndpoint) => {
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

    monitoredEndpoint.user = userId || monitoredEndpoint.user
    monitoredEndpoint.name = name || monitoredEndpoint.name
    monitoredEndpoint.url = url || monitoredEndpoint.url
    monitoredEndpoint.monitoredInterval = monitoredInterval ? parseInt(monitoredInterval) : monitoredEndpoint.monitoredInterval

    return monitoredEndpoint
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

  private getId = (req: RequestUser, res: Response):number|false => {
    const id = parseInt(req.body.id)
    if (id && typeof (id) === 'number') {
      return id
    }

    return this.handleResponseInvalidId(res)
  }

  private handleResponseInvalidId = (res: Response):false => {
    res.status(400)
    res.send({ message: 'endpoint id needed to update' })

    return false
  }
}

export const monitoredEndpointController = new MonitoredEndPointController()
