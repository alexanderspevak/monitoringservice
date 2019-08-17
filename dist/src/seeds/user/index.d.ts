import { User } from '../../entity';
import { Connection } from 'typeorm';
import { ISeedUser } from '../../types';
import { Seeder } from '../Seeder';
export declare class UserSeeding extends Seeder<User, ISeedUser> {
    seeds: {
        userName: string;
        email: string;
        accessToken: string;
    }[];
    constructor(connection: Connection);
}
