import {Router}  from 'restify-router';
import {endPointController} from '../controllers'

export const  monitoredEndPointRouter=new Router();
monitoredEndPointRouter.use(endPointController.loginMiddleWare)
monitoredEndPointRouter.get('/endpoints',endPointController.showEndpoints)
monitoredEndPointRouter.post('/createendpoint',endPointController.createEndPoint)
monitoredEndPointRouter.put('/updateendpoint',endPointController.updateEndpoint)
monitoredEndPointRouter.del('/deleteendpoint',endPointController.deleteEndpoint)

