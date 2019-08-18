import { getRepository } from 'typeorm'
import { IFindOptions } from '../types'

export abstract class Service {
  private entity: any

  public repository : any

  constructor (entity: any) {
    this.entity = entity
  }

  public setRepository () {
    this.repository = getRepository(this.entity)
  }

  public save (entity: any) {
    this.repository.save(entity)

    return entity
  }

  public async delete (entity:any) {
    return this.repository.delete(entity.id)
  }

  public find (options: IFindOptions = {}) {
    return this.repository.find({
      where: options
    })
  }

  public findOne (options: IFindOptions) {
    return this.repository.findOne({
      where: options
    })
  }
}
