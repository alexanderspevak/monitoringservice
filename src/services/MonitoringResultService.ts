import { MonitoringResult } from '../entity'
import { Service } from './Service'

export class MonitoringResultService extends Service {

}

export const monitoringResultService = new MonitoringResultService(MonitoringResult)
