import {Router}  from 'restify-router';
export const  monitoringResultRouter=new Router();

monitoringResultRouter.get('/monitoringResults',(req,res,next)=>{
    res.send('hello results')
})
