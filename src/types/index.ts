import { User } from '../entity'
import { Request } from 'restify'

export interface RequestUser extends Request {
  user: User
}

export interface Intervals {
  [key:string]: NodeJS.Timer
}
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ISeedUser = Omit<User, 'id'|'monitoredEndPoints'>
export type IUpdateKey = 'addEndpointCycle'|'removeEndpointCycle'|'updateEndpointCycle'
