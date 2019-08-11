import { MonitoredEndpoint, MonitoringResult } from '../entity'
import { getRepository } from 'typeorm'
import axios from 'axios'
import * as zlib from 'zlib'
import * as url from 'url'
import { endPointEmitter } from '../controllers/monitoredEndPoint'
import { Intervals } from '../interface'

export const intervals:Intervals = {}

export const startWorkers = () => {
  clearIntervalArray()
  const pointRepository = getRepository(MonitoredEndpoint)
  pointRepository.find()
    .then(endPoints => {
      endPoints.forEach(endPoint => {
        const parsedUrl:string = parseUrl(endPoint)
        startAxios(parsedUrl, endPoint)
      })
    })
  setInterval(() => {
    startWorkers()
  }, 60 * 60 * 1000)
}

const clearIntervalArray = () => {
  console.log('cleaning get request intervals', intervals)
  for (var interval in intervals) {
    if (intervals.hasOwnProperty(interval)) {
      clearInterval(intervals[interval])
      delete intervals[interval]
    }
  }
  console.log('cleaned intervals', intervals)
  console.log('New intervals cycle has started \n')
}
async function startAxios (url: string, endPoint: MonitoredEndpoint) {
  intervals[endPoint.id] = setInterval(
    () => {
      const pointRepository = getRepository(MonitoredEndpoint)
      const resultRepository = getRepository(MonitoringResult)
      const monitoringResult = new MonitoringResult()
      axios.get(url)
        .then((res) => {
          const payload: string = res.data ? res.data : 'no data provided'
          zlib.deflate(payload, (err, buffer) => {
            if (err && !buffer) {
              console.log('\x1b[31m', 'deflating err, can not save to database', err)
            } else {
              let httpCode: number
              httpCode = res.status ? res.status : 0
              monitoringResult.httpCode = httpCode
              monitoringResult.payload = buffer.toString('base64')
              monitoringResult.monitoredEndPoint = endPoint
              resultRepository.save(monitoringResult)
                .then(res => {
                  console.log('result saved to database', res.monitoredEndPoint)
                  console.log('statusCode: ', httpCode + '\n\n')
                })
                .catch(err => {
                  console.log('\x1b[31m', 'Error saving monitoringResult:')
                  console.log('\x1b[31m', 'Error:', err.message)
                })
            }
          })
          endPoint.dateOfLastCheck = new Date()
          pointRepository.save(endPoint)
            .catch(err => {
              console.log('\x1b[31m', 'Error saving :' + endPoint)
              console.log('\x1b[31m', 'Error:', err.message)
            })
        })
        .catch(err => {
          console.log('\x1b[31m', 'axios error', err)
          monitoringResult.httpCode = 500
          monitoringResult.payload = (new Buffer('no data provided')).toString('base64')
          monitoringResult.monitoredEndPoint = endPoint
          resultRepository.save(monitoringResult)
            .catch(err => {
              console.log('\x1b[31m', 'Error saving monitoringResult:')
              console.log('\x1b[31m', 'Error:', err.message)
            })
          endPoint.dateOfLastCheck = new Date()
          pointRepository.save(endPoint)
            .catch(err => {
              console.log('\x1b[31m', 'Error saving :' + endPoint)
              console.log('\x1b[31m', 'Error:', err.message)
            })
        })
    }, endPoint.monitoredInterval * 1000
  )
}

const parseUrl = (endPoint:MonitoredEndpoint):string => {
  const endPointUrl = endPoint.url
  const urlObj = url.parse(endPointUrl)
  urlObj.protocol = urlObj.protocol === 'http:' ? 'http' : 'https'
  urlObj.slashes = true
  const parsedUrl = url.format(urlObj)
  return parsedUrl.replace('///', '//')
}

endPointEmitter.on('delete', (id:number) => {
  clearInterval(intervals[id])
  delete intervals[id]
})

endPointEmitter.on('add', (endPoint:MonitoredEndpoint) => {
  startAxios(parseUrl(endPoint), endPoint)
})

endPointEmitter.on('update', (endPoint:MonitoredEndpoint) => {
  clearInterval(intervals[endPoint.id])
  delete intervals[endPoint.id]
  startAxios(parseUrl(endPoint), endPoint)
})
