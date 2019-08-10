import { User } from '../../entity'
import { Connection } from 'typeorm'
import { ISeedUser } from '../../types'
import { seeds } from './seeds'
import { Seeder } from '../Seeder'

export class UserSeeding extends Seeder<User, ISeedUser> {
    seeds = seeds

    constructor (connection: Connection) {
      super()
      this.repository = connection.getRepository(User)
    }
}
