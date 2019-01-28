import {  MonitoredEndPoint } from '../entity'
import {  getRepository } from 'typeorm'
import { validate } from 'class-validator';


export const createEndPoint = async (req, res, next) => {
    const pointRepository = getRepository(MonitoredEndPoint)
    const userId = req.user.id;
    const { name, url } = req.body
    const monitoredInterval = parseInt(req.body.monitoredInterval)
    if (typeof (monitoredInterval) !== "number") {
        return res.send('Invalid interval')
    }
    console.log(name, url, monitoredInterval)
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
    await pointRepository.save(monitoredEndpoint)
        .then((endPoint) => {
            res.status(200)
            res.send(endPoint)
        })
        .catch(err => {
            res.send(err)
        })
}
export const updateEndpoint = async (req, res, next) => {
    const pointRepository = getRepository(MonitoredEndPoint)
    const id = parseInt(req.body.id);
    if (!id && typeof (id) !== "number") {
        return res.send('endpoint id needed to update')
    }
    let monitoredEndpoint = await pointRepository.findOne(id)
    if (!monitoredEndpoint) return res.send('Endpoint non existant')
    req.body.name ? monitoredEndpoint.name = req.body.name : false;
    req.body.url ? monitoredEndpoint.url = req.body.url : false;
    req.body.monitoredInterval ? monitoredEndpoint.monitoredInterval = req.body.monitoredInterval : false;
    const errors = await validate(monitoredEndpoint)
    if (errors.length > 0) {
        res.status(400)
        return res.send(errors)
    }
    await pointRepository.save(monitoredEndpoint)
        .then((endPoint) => {
            res.header('Content-Type', 'application/json')
            res.status(200)
            res.send(endPoint)
        })
        .catch(err => {
            res.send(err)
        })
}
export const deleteEndpoint = async (req, res, next) => {
    const pointRepository = getRepository(MonitoredEndPoint)
    if (!req.query.id) {
        return res.send('id needed to delete')
    }
    const id = parseInt(req.query.id)
    await pointRepository.delete(id)
        .then(point => {
            res.status(200)
            res.send('Affected Rows: ' + point.raw.affectedRows)
        })
        .catch(err => {
            res.status(500)
            res.send(err)
        })
}
export const showEndpoints = async (req, res, next) => {
    const pointRepository = getRepository(MonitoredEndPoint)
    const userId = req.user.id;
    pointRepository.find({ where: { user: userId } })
        .then(endpoints => {
            res.header('Content-Type', 'application/json')
            res.send(endpoints)
        })
        .catch(err => {
            res.status(500).send(err)
        })
}