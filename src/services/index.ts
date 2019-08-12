import { monitoredEndpointService } from './MonitoredEndpointService'
import { monitoringResultService } from './MonitoringResultService'

const setRepositories = () => {
  monitoredEndpointService.setRepository()
  monitoringResultService.setRepository()
}
export {
  monitoredEndpointService,
  monitoringResultService,
  setRepositories
}
