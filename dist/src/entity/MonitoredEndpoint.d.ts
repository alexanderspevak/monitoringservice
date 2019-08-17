import { User } from './User';
import { MonitoringResult } from './MonitoringResult';
export declare class MonitoredEndpoint {
    id: number;
    name: string;
    url: string;
    monitoredInterval: number;
    dateOfCreation: Date;
    dateOfLastCheck: Date;
    user: User | number;
    monitoringResult: MonitoringResult[];
}
