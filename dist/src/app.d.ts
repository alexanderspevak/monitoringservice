import 'reflect-metadata';
import { ISeedUser } from './types';
import { User } from './entity';
import { Seeder } from './seeds/Seeder';
export declare class Server {
    seeders: [Seeder<User, ISeedUser>];
    constructor(seeders: [Seeder<User, ISeedUser>]);
    start(): Promise<void>;
    private startSeeders;
    private attachMiddleware;
}
