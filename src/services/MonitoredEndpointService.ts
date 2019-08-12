import { MonitoredEndpoint } from '../entity'
import { Service } from './Service'

export class MonitoredEndpointService extends Service {
  public async saveMonitoredEndpoint (monitoredEndpoint: MonitoredEndpoint) {
    monitoredEndpoint.dateOfLastCheck = new Date()
    await this.repository.save(monitoredEndpoint)

    return monitoredEndpoint
  }
}

export const monitoredEndpointService = new MonitoredEndpointService(MonitoredEndpoint)
