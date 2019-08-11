import { Response } from 'restify'

export abstract class ControllerClass {
  handleServerError = (error:Error, res: Response) => {
    res.header('Content-Type', 'application/json')
    res.status(500)
    res.send(error)
  }
}
