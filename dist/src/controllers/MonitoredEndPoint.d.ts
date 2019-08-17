import { Response, Next } from 'restify';
import { RequestUser } from '../types';
import { ControllerClass } from './ControllerClass';
import { MonitoredEndpointService } from '../services';
export declare class MonitoredEndPointController extends ControllerClass<MonitoredEndpointService> {
    workersRepository: import("../workers").Workers;
    saveEndpoint: (req: RequestUser, res: Response) => Promise<any>;
    updateEndpoint: (req: RequestUser, res: Response) => Promise<any>;
    deleteEndpoint: (req: RequestUser, res: Response) => Promise<boolean | void>;
    showEndpoints: (req: RequestUser, res: Response, next: Next) => Promise<void>;
    private handleUpdateEndpoint;
    private findMonitoredEndpoint;
    private handleDeleteEndpoint;
    private handleNotFoundMonitoredEndpoint;
    private parseMonitoredEndpoint;
    private handleResponseSaveEndpoint;
    private getId;
    private handleResponseInvalidId;
}
export declare const monitoredEndpointController: MonitoredEndPointController;
