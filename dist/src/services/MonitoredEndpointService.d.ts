import { MonitoredEndpoint } from '../entity';
import { Service } from './Service';
export declare class MonitoredEndpointService extends Service {
    saveMonitoredEndpoint(monitoredEndpoint: MonitoredEndpoint): Promise<MonitoredEndpoint>;
}
export declare const monitoredEndpointService: MonitoredEndpointService;
