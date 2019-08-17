import { Response } from 'restify';
import { Service } from '../services';
export declare abstract class ControllerClass<T extends Service> {
    service: T;
    constructor(service: T);
    handleServerError: (error: Error, res: Response) => void;
}
