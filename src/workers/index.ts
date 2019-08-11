import { MonitoredEndpoint, MonitoringResult } from '../entity'
import { getRepository, Repository } from 'typeorm'
import axios from 'axios'
import * as zlib from 'zlib'
import * as url from 'url'
import { Intervals } from '../types'
import { promisify } from 'util'
const deflate = promisify(zlib.deflate)
// export const intervals:Intervals = {}
//
// export const startWorkers = () => {
//   clearIntervalArray()
//   const pointRepository = getRepository(MonitoredEndpoint)
//   pointRepository.find()
//     .then(endPoints => {
//       endPoints.forEach(endPoint => {
//         const parsedUrl:string = parseUrl(endPoint)
//         startAxios(parsedUrl, endPoint)
//       })
//     })
// }
//
// const clearIntervalArray = () => {
//   console.log('cleaning get request intervals', intervals)
//   for (var interval in intervals) {
//     if (intervals.hasOwnProperty(interval)) {
//       clearInterval(intervals[interval])
//       delete intervals[interval]
//     }
//   }
//   console.log('cleaned intervals', intervals)
//   console.log('New intervals cycle has started \n')
// }
// async function startAxios (url: string, endPoint: MonitoredEndpoint) {
//   intervals[endPoint.id] = setInterval(
//     () => {
//       const pointRepository = getRepository(MonitoredEndpoint)
//       const resultRepository = getRepository(MonitoringResult)
//       const monitoringResult = new MonitoringResult()
//       axios.get(url)
//         .then((res) => {
//           const payload: string = res.data ? res.data : 'no data provided'
//           zlib.deflate(payload, (err, buffer) => {
//             if (err && !buffer) {
//               console.log('\x1b[31m', 'deflating err, can not save to database', err)
//             } else {
//               let httpCode: number
//               httpCode = res.status ? res.status : 0
//               monitoringResult.httpCode = httpCode
//               monitoringResult.payload = buffer.toString('base64')
//               monitoringResult.monitoredEndPoint = endPoint
//               resultRepository.save(monitoringResult)
//                 .then(res => {
//                   console.log('result saved to database', res.monitoredEndPoint)
//                   console.log('statusCode: ', httpCode + '\n\n')
//                 })
//                 .catch(err => {
//                   console.log('\x1b[31m', 'Error saving monitoringResult:')
//                   console.log('\x1b[31m', 'Error:', err.message)
//                 })
//             }
//           })
//           endPoint.dateOfLastCheck = new Date()
//           pointRepository.save(endPoint)
//             .catch(err => {
//               console.log('\x1b[31m', 'Error saving :' + endPoint)
//               console.log('\x1b[31m', 'Error:', err.message)
//             })
//         })
//         .catch(err => {
//           console.log('\x1b[31m', 'axios error', err)
//           monitoringResult.httpCode = 500
//           monitoringResult.payload = (new Buffer('no data provided')).toString('base64')
//           monitoringResult.monitoredEndPoint = endPoint
//           resultRepository.save(monitoringResult)
//             .catch(err => {
//               console.log('\x1b[31m', 'Error saving monitoringResult:')
//               console.log('\x1b[31m', 'Error:', err.message)
//             })
//           endPoint.dateOfLastCheck = new Date()
//           pointRepository.save(endPoint)
//             .catch(err => {
//               console.log('\x1b[31m', 'Error saving :' + endPoint)
//               console.log('\x1b[31m', 'Error:', err.message)
//             })
//         })
//     }, endPoint.monitoredInterval * 1000
//   )
// }
//
// const parseUrl = (endPoint:MonitoredEndpoint):string => {
//   const endPointUrl = endPoint.url
//   const urlObj = new URL(endPointUrl)
//   urlObj.protocol = urlObj.protocol === 'http:' ? 'http' : 'https'
//   const parsedUrl = url.format(urlObj)
//   return parsedUrl.replace('///', '//')
// }
//
// endPointEmitter.on('delete', (id:number) => {
//   clearInterval(intervals[id])
//   delete intervals[id]
// })
//
// endPointEmitter.on('add', (endPoint:MonitoredEndpoint) => {
//   startAxios(parseUrl(endPoint), endPoint)
// })
//
// endPointEmitter.on('update', (endPoint:MonitoredEndpoint) => {
//   clearInterval(intervals[endPoint.id])
//   delete intervals[endPoint.id]
//   startAxios(parseUrl(endPoint), endPoint)
// })

export class Workers {
  private intervals:Intervals = {}

  monitoredEndpointRepository: Repository<MonitoredEndpoint>

  monitoringResultRepository: Repository<MonitoringResult>

  async start () {
    this.monitoredEndpointRepository = getRepository(MonitoredEndpoint)
    this.monitoringResultRepository = getRepository(MonitoringResult)
    const monitoredEndpoints = await this.monitoredEndpointRepository.find()
    monitoredEndpoints.forEach(endpoint => this.startEndpointCycle(endpoint))
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
      console.log('_________________________________________________')
    } catch (err) {
      console.log('\x1b[31m', 'No response from endpoint', err)

      const monitoringResult = new MonitoringResult()
      monitoringResult.httpCode = 500
      monitoringResult.payload = (Buffer.from('no response provided')).toString('base64')
      monitoringResult.monitoredEndPoint = endpoint

      await this.saveMonitoringResult(monitoringResult)
      await this.saveMonitoredEndpoint(endpoint)
      console.log('_________________________________________________')
    }
  }

  private async saveMonitoringResult (monitoringResult: MonitoringResult) {
    try {
      await this.monitoringResultRepository.save(monitoringResult)
      console.log('MOnitoring result saved with statusCode: ', monitoringResult.httpCode)

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
      await this.monitoredEndpointRepository.save(monitoredEndpoint)
      console.log('result saved to database', monitoredEndpoint)

      return monitoredEndpoint
    } catch (error) {
      console.log('\x1b[31m', 'Error saving :' + monitoredEndpoint)
      console.log('\x1b[31m', 'Error:', error.message)

      return false
    }
  }

  private parseUrl (endPoint:MonitoredEndpoint):string {
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
