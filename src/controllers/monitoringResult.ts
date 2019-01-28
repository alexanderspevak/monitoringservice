import { User, MonitoredEndPoint, MonitoringResult } from '../entity'
import {  getRepository } from 'typeorm';
import * as util from 'util';
import * as zlib from 'zlib';
const unzip=util.promisify(zlib.unzip)

export const showMonitoringResults = async (req, res, next) => {
    const endPointRepository = getRepository(MonitoredEndPoint);
    const monitoredResultRepository = getRepository(MonitoringResult)
    const endPointId = req.query.id && typeof (parseInt(req.query.id)) === 'number' ? parseInt(req.query.id) : false;
    const limit = req.query.limit && typeof (parseInt(req.query.limit)) === 'number' ? req.query.limit : 10
    const userId = req.user.id
    if (endPointId) {
        const endPoint = await endPointRepository.find({ where: { user: userId } })
        if (!endPoint) {
            res.status(400);
            return res.send('No endpoint with id: ' + endPointId + ' under logged in user')
        }
        const monitoredResults = await monitoredResultRepository.find({
            take: limit,
            where: { monitoredEndPointId: endPointId }
        })
        let parsedMonitoredResults= await Promise.all(monitoredResults.map(async (monitoredResult)=>{
            const buffer=Buffer.from(monitoredResult.payload,'base64')
            return unzip(buffer)
            .then(unzipedPayload=>{
                monitoredResult.payload= unzipedPayload.toString()
                return monitoredResult
            })
            .catch(err=>{
                console.log(err)
            })
        }))
        res.header('Content-Type', 'application/json')
        res.status(200)
        res.send(parsedMonitoredResults)
    }else{
        res.status(400)
        res.send('EndPoint {id} needed in query parameter')
    }
}

