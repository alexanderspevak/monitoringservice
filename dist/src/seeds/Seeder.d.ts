import { Repository } from 'typeorm';
export declare abstract class Seeder<T, U> {
    repository: Repository<T>;
    abstract seeds: U[];
    saveSeeds(): Promise<T[]>;
}
