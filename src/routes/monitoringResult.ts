import {Router}  from 'restify-router';
import {loginMiddleWare,monitoringResultController} from '../controllers'
export const  monitoringResultRouter=new Router();


monitoringResultRouter.use(loginMiddleWare)
monitoringResultRouter.get('/monitoringresults',monitoringResultController.showMonitoringResults)
