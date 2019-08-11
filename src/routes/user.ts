import { Router } from 'restify-router'
import { Request, Response } from 'restify'
export const userRouter = new Router()

userRouter.get('/users', (req:Request, res:Response) => {
  res.send('hello users')
})
