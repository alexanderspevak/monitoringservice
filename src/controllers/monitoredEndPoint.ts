import { MonitoredEndPoint } from '../entity'
import { getRepository } from 'typeorm'
import { validate } from 'class-validator';
import {Response,Next} from 'restify'
import {RequestUser} from '../interface'
import * as EventEmitter from 'events'
export class EndPointEmitter extends EventEmitter { }
export const endPointEmitter = new EndPointEmitter()


export const createEndPoint = async (req:RequestUser, res:Response, next:Next) => {
    const pointRepository = getRepository(MonitoredEndPoint)
    const userId = req.user.id;
    const { name, url } = req.body
    const monitoredInterval = parseInt(req.body.monitoredInterval)
    if (typeof (monitoredInterval) !== "number") {
        return res.send('Invalid interval')
    }
    const monitoredEndpoint = new MonitoredEndPoint()
    monitoredEndpoint.name = name;
    monitoredEndpoint.url = url;
    monitoredEndpoint.monitoredInterval = monitoredInterval
    monitoredEndpoint.user = userId
    res.header('Content-Type', 'application/json')
    const errors = await validate(monitoredEndpoint)
    if (errors.length > 0) {
        res.status(400)
        return res.send(errors)
    }
    pointRepository.save(monitoredEndpoint)
        .then((endPoint) => {
            endPointEmitter.emit('add', endPoint)
            res.status(200)
            res.send(endPoint)
        })
        .catch(err => {
            res.send(err)
        })
}
export const updateEndpoint = async (req:RequestUser, res:Response, next:Next) => {
    const pointRepository = getRepository(MonitoredEndPoint)
    const id = parseInt(req.body.id);
    if (!id && typeof (id) !== "number") {
        return res.send('endpoint id needed to update')
    }
    const userId=req.user.id
    const monitoredEndpointArray = await pointRepository.find({ where: { user: userId, id:id } })
    let monitoredEndpoint=monitoredEndpointArray[0]
    if (!monitoredEndpoint) {
        return res.send('Endpoint non existant')
    }
    req.body.name ? monitoredEndpoint.name = req.body.name : false;
    req.body.url ? monitoredEndpoint.url = req.body.url : false;
    req.body.monitoredInterval && typeof (parseInt(req.body.monitoredInterval)) === 'number' ? monitoredEndpoint.monitoredInterval = parseInt(req.body.monitoredInterval) : false;
    const errors = await validate(monitoredEndpoint)
    if (errors.length > 0) {
        res.status(400)
        return res.send(errors)
    }
    await pointRepository.save(monitoredEndpoint)
        .then((endPoint) => {
            endPointEmitter.emit('update', endPoint)
            res.header('Content-Type', 'application/json')
            res.status(200)
            res.send(endPoint)
        })
        .catch(err => {
            res.send(err)
        })
}
export const deleteEndpoint = async (req:RequestUser, res:Response, next:Next) => {
    const userId=req.user.id
    const pointRepository = getRepository(MonitoredEndPoint)

    if (!req.query.id) {
        res.status(400)
        return res.send('id needed to delete')
    }
    const id = typeof (parseInt(req.query.id)) === "number" ? parseInt(req.query.id) : 0
    if (!id) {
        res.status(400)
        res.send("invalid id")
    }
    const monitoredEndpoint=await pointRepository.find({ where: { user: userId, id:id } })
    if (monitoredEndpoint[0] ) {
        return pointRepository.delete(id)
            .then(point => {
                endPointEmitter.emit('delete', id)
                res.status(200)
                res.send('Affected Rows: ' + point.raw.affectedRows)
            })
            .catch(err => {
                res.status(500)
                res.send(err)
            })
    }
    res.status(400)
    res.send('No endpoint with id of:' + id + ' under user id:' + userId)

}
export const showEndpoints = async (req:RequestUser, res:Response, next:Next) => {
    const pointRepository = getRepository(MonitoredEndPoint)
    const userId = req.user.id;
    pointRepository.find({ where: { user: userId } })
        .then(endpoints => {
            res.header('Content-Type', 'application/json')
            res.send(endpoints)
        })
        .catch(err => {
            res.status(500)
            res.send(err)
        })
}