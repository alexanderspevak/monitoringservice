import {Router}  from 'restify-router';
export const  userRouter=new Router();
import {Request,Response,Next} from 'restify'

userRouter.get('/users',(req:Request,res:Response,next:Next)=>{
    res.send('hello users')
})
