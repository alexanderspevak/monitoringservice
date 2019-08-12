import { promisify } from 'util'
import axios from 'axios'
import * as zlib from 'zlib'
import * as url from 'url'
import { Intervals } from '../types'
import { MonitoredEndpoint, MonitoringResult } from '../entity'
import { monitoredEndpointService, monitoringResultService } from '../services'

const deflate = promisify(zlib.deflate)

export class Workers {
  private intervals:Intervals = {}

  monitoredEndpointService = monitoredEndpointService

  monitoringResultService = monitoringResultService

  async start () {
    const monitoredEndpoints = await this.monitoredEndpointService.repository.find()
    monitoredEndpoints.forEach((endpoint: any) => this.startEndpointCycle(endpoint))
  }

  async startEndpointCycle (endpoint: MonitoredEndpoint) {
    this.intervals[endpoint.id] = setInterval(
      () => {
        this.monitoredEndpointCallback(endpoint)
      }, endpoint.monitoredInterval * 1000
    )
  }

  private monitoredEndpointCallback = async (endpoint: MonitoredEndpoint) => {
    try {
      const endpointResponse = await axios.get(this.parseUrl(endpoint))
      const monitoringResult = new MonitoringResult()
      const payload: string = endpointResponse.data || 'no data provided'
      const buffer = await deflate(payload)

      if (Buffer.isBuffer(buffer)) {
        monitoringResult.payload = buffer.toString('base64')
      }

      const httpCode = endpointResponse.status || 0
      monitoringResult.httpCode = httpCode
      monitoringResult.monitoredEndPoint = endpoint

      await this.saveMonitoringResult(monitoringResult)
      await this.saveMonitoredEndpoint(endpoint)
    } catch (err) {
      console.log('\x1b[31m', 'No response from endpoint', err)

      const monitoringResult = new MonitoringResult()
      monitoringResult.httpCode = 500
      monitoringResult.payload = (Buffer.from('no response provided')).toString('base64')
      monitoringResult.monitoredEndPoint = endpoint

      await this.saveMonitoringResult(monitoringResult)
      await this.saveMonitoredEndpoint(endpoint)
    }
  }

  private async saveMonitoringResult (monitoringResult: MonitoringResult) {
    try {
      if (!this.intervals[monitoringResult.monitoredEndPoint.id]) {
        return false
      }

      await this.monitoringResultService.repository.save(monitoringResult)
      console.log(`Monitoring result with endpointId: ${monitoringResult.monitoredEndPoint.id} saved with statusCode: `, monitoringResult.httpCode)

      return true
    } catch (error) {
      console.log('\x1b[31m', 'Error saving monitoringResult:')
      console.log('\x1b[31m', 'Error:', error.message)
      return false
    }
  }

  public async saveMonitoredEndpoint (monitoredEndpoint: MonitoredEndpoint) {
    try {
      monitoredEndpoint.dateOfLastCheck = new Date()
      await this.monitoredEndpointService.saveMonitoredEndpoint(monitoredEndpoint)

      return monitoredEndpoint
    } catch (error) {
      console.log('\x1b[31m', 'Error saving :' + monitoredEndpoint)
      console.log('\x1b[31m', 'Error:', error.message)

      return false
    }
  }

  private parseUrl (endPoint: MonitoredEndpoint): string {
    const endPointUrl = endPoint.url
    const urlObj = new URL(endPointUrl)
    urlObj.protocol = urlObj.protocol === 'http:' ? 'http' : 'https'
    const parsedUrl = url.format(urlObj)

    return parsedUrl.replace('///', '//')
  }

  public addEndpointCycle (endpoint: MonitoredEndpoint) {
    this.startEndpointCycle(endpoint)
  }

  public removeEndpointCycle (endpoint: MonitoredEndpoint) {
    clearInterval(this.intervals[endpoint.id])
    delete this.intervals[endpoint.id]
  }

  public updateEndpointCycle (endpoint: MonitoredEndpoint) {
    this.removeEndpointCycle(endpoint)
    this.addEndpointCycle(endpoint)
  }
}

export const workers = new Workers()
