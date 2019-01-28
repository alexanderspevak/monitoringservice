import { MonitoredEndPoint, MonitoringResult } from '../entity'
import { getConnection, getRepository } from 'typeorm'
import axios from 'axios';
import * as url from 'url'

let intervals = []

export const startWorkers = () => {

    const pointRepository = getRepository(MonitoredEndPoint)
    pointRepository.find()
        .then(endPoints => {
            console.log(endPoints)
            endPoints.forEach(endPoint => {
                let endPointUrl = endPoint.url

                let urlObj = url.parse(endPointUrl);
                urlObj.protocol = urlObj.protocol === 'http' ? 'http' : 'https';
                urlObj.slashes = true

                const parsedUrl = url.format(urlObj)
                const removeExtraSlash = parsedUrl.replace('///', '//')
                startAxios(removeExtraSlash, endPoint)
                console.log('intervals',intervals)
            })
        })
}

async function startAxios(url: string, endPoint: MonitoredEndPoint) {
    const resultRepository = getRepository(MonitoringResult)
    intervals.push(setInterval(
        () => {
            axios.get(url)
                .then((res) => {
                    console.log('endpoint',endPoint)
                    console.log('status', res.status)
                    console.log('data', res.data)
                })
                .catch(err => {
                    console.log('error', err)
                })
        }, endPoint.monitoredInterval * 1000
    ))
}