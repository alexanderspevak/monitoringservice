import { User } from '../entity'
import {  getRepository } from 'typeorm'

export const loginMiddleWare = async (req, res, next) => {
    const userRepository = getRepository(User)
    res.header('Content-Type', 'text/html')
    const headers = req.headers
    if (!headers.accesstoken) {
        res.status(401)
        return res.send('Login to continue')
    }
    const user = await userRepository.findOne({
        'accessToken': headers.accesstoken
    })
    if (!user) {
        res.status(401)
        return res.send('Invalid Token, Login to continue')
    }
    req.user = user
    next()
}