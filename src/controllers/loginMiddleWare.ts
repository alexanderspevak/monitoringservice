import { User } from '../entity'
import { getRepository } from 'typeorm'
import { Response, Next } from 'restify'
import { RequestUser } from '../types'

export const loginMiddleWare = async (req: RequestUser, res: Response, next: Next) => {
  const userRepository = getRepository(User)
  const headers = req.headers
  if (!headers.accesstoken) {
    res.status(401)

    return res.send({ message: 'Login to continue' })
  }
  const accessToken: any = headers.accesstoken
  const user = await userRepository.findOne({
    accessToken: accessToken
  })
  if (!user) {
    res.status(401)

    return res.send({ message: 'Invalid Token, Login to continue' })
  }
  req.user = user
  next()
}
