import { User } from '../entity'
import { Request } from 'restify'

export interface RequestUser extends Request {
    user: User
}