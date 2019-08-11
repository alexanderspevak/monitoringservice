import { Router } from 'restify-router'
import { loginMiddleWare, monitoredEndpointController } from '../controllers'

export const monitoredEndPointRouter = new Router()

monitoredEndPointRouter.use(loginMiddleWare)
monitoredEndPointRouter.get('/endpoints', monitoredEndpointController.showEndpoints)
monitoredEndPointRouter.post('/createendpoint', monitoredEndpointController.saveEndpoint)
monitoredEndPointRouter.put('/updateendpoint', monitoredEndpointController.updateEndpoint)
monitoredEndPointRouter.del('/deleteendpoint', monitoredEndpointController.deleteEndpoint)
