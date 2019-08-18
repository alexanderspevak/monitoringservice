import { MonitoredEndpoint } from '../entity'
import { Service } from './Service'

export class MonitoredEndpointService extends Service {
  public async save (monitoredEndpoint: MonitoredEndpoint) {
    monitoredEndpoint.dateOfLastCheck = new Date()

    return this.repository.save(monitoredEndpoint)
  }
}

export const monitoredEndpointService = new MonitoredEndpointService(MonitoredEndpoint)
