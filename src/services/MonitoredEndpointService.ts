import { MonitoredEndpoint } from '../entity'
import { Service } from './Service'

export class MonitoredEndpointService extends Service {
  public async save (monitoredEndpoint: MonitoredEndpoint) {
    monitoredEndpoint.dateOfLastCheck = new Date()
    this.repository.save(monitoredEndpoint)

    return monitoredEndpoint
  }
}

export const monitoredEndpointService = new MonitoredEndpointService(MonitoredEndpoint)
