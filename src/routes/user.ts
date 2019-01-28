import {Router}  from 'restify-router';
export const  userRouter=new Router();

userRouter.get('/users',(req,res,next)=>{
    res.send('hello users')
})
