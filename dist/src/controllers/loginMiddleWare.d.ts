import { Response, Next } from 'restify';
import { RequestUser } from '../types';
export declare const loginMiddleWare: (req: RequestUser, res: Response, next: Next) => Promise<any>;
