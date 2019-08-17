import { Response } from 'restify';
import { RequestUser } from '../types';
import { ControllerClass } from './ControllerClass';
import { MonitoredEndpointService, MonitoringResultService } from '../services';
export declare class MonitoringResultController extends ControllerClass<MonitoringResultService> {
    service: MonitoringResultService;
    monitoredEndpointService: MonitoredEndpointService;
    constructor(service: MonitoringResultService, monitoredEndpointService: MonitoredEndpointService);
    getMonitoredResults: (req: RequestUser, res: Response) => Promise<any>;
    handleNotFoundEndpoint: (res: Response, endpointId: number, userId: number) => Promise<any>;
    private parseEndpointId;
    private parseResponseLimit;
    private checkEndpoint;
    private getResults;
    private parseResults;
}
export declare const monitoringResultController: MonitoringResultController;
