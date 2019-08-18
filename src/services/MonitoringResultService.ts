import { MonitoringResult } from '../entity'
import { Service } from './Service'
import { IFindOptions } from '../types'

export class MonitoringResultService extends Service {
  findWithTake (options: IFindOptions, take : number) {
    return this.repository.find({
      take,
      where: options,
      order: {
        dateOfCheck: 'DESC'
      }
    })
  }
}

export const monitoringResultService = new MonitoringResultService(MonitoringResult)
