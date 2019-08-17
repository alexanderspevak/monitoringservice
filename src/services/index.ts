import { monitoredEndpointService, MonitoredEndpointService } from './MonitoredEndpointService'
import { monitoringResultService, MonitoringResultService } from './MonitoringResultService'
import { Service } from './Service'

const setRepositories = () => {
  monitoredEndpointService.setRepository()
  monitoringResultService.setRepository()
}
export {
  Service,
  MonitoredEndpointService,
  monitoredEndpointService,
  MonitoringResultService,
  monitoringResultService,
  setRepositories
}
