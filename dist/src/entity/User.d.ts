import { MonitoredEndpoint } from './MonitoredEndpoint';
export declare class User {
    id: number;
    userName: string;
    email: string;
    accessToken: string;
    monitoredEndPoints: MonitoredEndpoint[];
}
