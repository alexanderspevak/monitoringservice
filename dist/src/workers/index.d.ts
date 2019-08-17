import { MonitoredEndpoint } from '../entity';
export declare class Workers {
    private intervals;
    monitoredEndpointService: import("../services").MonitoredEndpointService;
    monitoringResultService: import("../services").MonitoringResultService;
    start(): Promise<void>;
    startEndpointCycle(endpoint: MonitoredEndpoint): Promise<void>;
    private monitoredEndpointCallback;
    private saveMonitoringResult;
    saveMonitoredEndpoint(monitoredEndpoint: MonitoredEndpoint): Promise<false | MonitoredEndpoint>;
    private parseUrl;
    addEndpointCycle(endpoint: MonitoredEndpoint): void;
    removeEndpointCycle(endpoint: MonitoredEndpoint): void;
    updateEndpointCycle(endpoint: MonitoredEndpoint): void;
}
export declare const workers: Workers;
