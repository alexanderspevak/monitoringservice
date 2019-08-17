import { MonitoredEndPointController } from '../../../controllers/MonitoredEndPoint'
import { monitoredEndpointService } from '../../../services'
import { RequestUser } from '../../../types'
import { MonitoredEndpoint } from '../../../entity'

const monitoredEndpointController = new MonitoredEndPointController(monitoredEndpointService)

describe('unit test monitoredEndointController', () => {
  const request = {
    body: {
      name: 'endpoint',
      url: 'www.ahoj.cz',
      monitoredInterval: 5,
      id: 5
    }
  }

  const inputEndpoint = {
    id: 5,
    name: 'hi',
    url: 'www.hi.com',
    monitoredInterval: 7
  }

  const responseEndpoint = {
    id: 5,
    name: 'endpoint',
    url: 'www.ahoj.cz',
    monitoredInterval: 5
  }

  it('should return monitoredEndpointShape', () => {
    const monitoredEndpoint = monitoredEndpointController.parseMonitoredEndpoint(request as RequestUser, inputEndpoint as MonitoredEndpoint)
    expect(monitoredEndpoint).toEqual(responseEndpoint)
  })

  it('should return id', () => {
    expect(monitoredEndpointController.getId(request as RequestUser)).toBe(5)
  })
})
