import { Response } from 'restify'
import { Service } from '../services'

export abstract class ControllerClass <T extends Service> {
   service: T

   constructor (service: T) {
     this.service = service
   }

  handleServerError = (error:Error, res: Response) => {
    res.status(500)
    res.send(error)
  }
}
