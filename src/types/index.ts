import { User } from '../entity'

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type ISeedUser = Omit<User, 'id'|'monitoredEndPoints'>
