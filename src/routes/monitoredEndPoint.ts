import {Router}  from 'restify-router';
import {endPointController,loginMiddleWare} from '../controllers'

export const  monitoredEndPointRouter=new Router();
monitoredEndPointRouter.use(loginMiddleWare)
monitoredEndPointRouter.get('/endpoints',endPointController.showEndpoints)
monitoredEndPointRouter.post('/createendpoint',endPointController.createEndPoint)
monitoredEndPointRouter.put('/updateendpoint',endPointController.updateEndpoint)
monitoredEndPointRouter.del('/deleteendpoint',endPointController.deleteEndpoint)

