import { promisify } from 'util'
import axios from 'axios'
import * as zlib from 'zlib'
import * as url from 'url'
import { IEndpointResponse, Intervals } from '../types'
import { MonitoredEndpoint, MonitoringResult } from '../entity'
import { monitoredEndpointService, monitoringResultService } from '../services'

const deflate = promisify(zlib.deflate)

export class Workers {
  private intervals: Intervals = {}

  monitoredEndpointService = monitoredEndpointService

  monitoringResultService = monitoringResultService

  async start () {
    const monitoredEndpoints = await this.monitoredEndpointService.find()
    monitoredEndpoints.forEach((endpoint: any) => this.startEndpointCycle(endpoint))
  }

  async startEndpointCycle (endpoint: MonitoredEndpoint) {
    this.intervals[endpoint.id] = setInterval(
      () => {
        this.monitoredEndpointCallback(endpoint)
      }, endpoint.monitoredInterval * 1000
    )
  }

  private monitoredEndpointCallback = async (monitoredEndpoint: MonitoredEndpoint) => {
    const endpointResponse = await this.getResponse(monitoredEndpoint)
    if (this.intervals[monitoredEndpoint.id]) {
      await this.saveMonitoringResult(monitoredEndpoint, endpointResponse)
      await this.saveMonitoredEndpoint(monitoredEndpoint)
    }
  }

  private getResponse = async (endpoint: MonitoredEndpoint) => {
    try {
      return await axios.get(this.parseUrl(endpoint))
    } catch (err) {
      return {
        data: 'httpmonitoring: No data provided',
        status: 500
      }
    }
  }

  private async saveMonitoringResult (monitoredEndpoint: MonitoredEndpoint, endpointResponse: IEndpointResponse) {
    try {
      const monitoringResult = await this.createMonitoringResult(monitoredEndpoint, endpointResponse)
      await this.monitoringResultService.save(monitoringResult)
      console.log(`Monitoring result with endpointId: ${monitoringResult.monitoredEndPoint.id} saved with statusCode: `, monitoringResult.httpCode)
    } catch (error) {
      console.log('\x1b[31m', 'Error saving monitoringResult:')
      console.log('\x1b[31m', 'Error:', error.message)
    }
  }

  public async saveMonitoredEndpoint (monitoredEndpoint: MonitoredEndpoint) {
    try {
      monitoredEndpoint.dateOfLastCheck = new Date()
      await this.monitoredEndpointService.save(monitoredEndpoint)
    } catch (error) {
      console.log('\x1b[31m', 'Error saving :' + monitoredEndpoint)
      console.log('\x1b[31m', 'Error:', error.message)
    }
  }

  private createMonitoringResult = async (monitoredEndpoint: MonitoredEndpoint, endpointResponse: IEndpointResponse) => {
    const monitoringResult = new MonitoringResult()
    const payload: string = endpointResponse.data
    const buffer = await deflate(payload)

    if (Buffer.isBuffer(buffer)) {
      monitoringResult.payload = buffer.toString('base64')
    }

    monitoringResult.httpCode = endpointResponse.status || 0
    monitoringResult.monitoredEndPoint = monitoredEndpoint

    return monitoringResult
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
