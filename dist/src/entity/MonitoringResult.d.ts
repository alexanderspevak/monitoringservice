import { MonitoredEndpoint } from './MonitoredEndpoint';
export declare class MonitoringResult {
    id: number;
    httpCode: number;
    dateOfCheck: Date;
    payload: string;
    monitoredEndPoint: MonitoredEndpoint;
}
