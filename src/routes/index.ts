import { Router } from 'restify-router'
import { loginMiddleWare, monitoringResultController, monitoredEndpointController } from '../controllers'
import { Next, Request, Response } from 'restify'
export const router = new Router()

router.use((request: Request, response: Response, next: Next) => {
  response.header('Content-Type', 'application/json')
  next()
})
router.use(loginMiddleWare)
router.get('/monitoringresults', monitoringResultController.getMonitoredResults)
router.get('/endpoints', monitoredEndpointController.showEndpoints)
router.post('/createendpoint', monitoredEndpointController.saveEndpoint)
router.put('/updateendpoint', monitoredEndpointController.updateEndpoint)
router.del('/deleteendpoint', monitoredEndpointController.deleteEndpoint)
router.get('/users', (req:Request, res:Response) => {
  res.send('hello users')
})
