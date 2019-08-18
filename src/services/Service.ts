import { getRepository, Repository } from 'typeorm'

export abstract class Service {
  private entity: any

  public repository : Repository<any>

  constructor (entity: any) {
    this.entity = entity
  }

  public setRepository () {
    this.repository = getRepository(this.entity)
  }
}
