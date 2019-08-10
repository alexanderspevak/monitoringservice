import { Repository } from 'typeorm'

export abstract class Seeder <T, U> {
  repository: Repository<T>

  abstract seeds: U[] = []

  public saveSeeds (): Promise<T[]> {
    return Promise.all(this.seeds.map(async (seed: U) => {
      let savedSeed = await this.repository.findOne(seed)
      if (!savedSeed) {
        savedSeed = await this.repository.save(seed)
      }

      return savedSeed
    }))
  }
}
