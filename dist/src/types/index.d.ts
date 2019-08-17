/// <reference types="node" />
import { User } from '../entity';
import { Request } from 'restify';
export interface RequestUser extends Request {
    user: User;
}
export interface Intervals {
    [key: string]: NodeJS.Timer;
}
declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type ISeedUser = Omit<User, 'id' | 'monitoredEndPoints'>;
export declare type IUpdateKey = 'addEndpointCycle' | 'removeEndpointCycle' | 'updateEndpointCycle';
export {};
