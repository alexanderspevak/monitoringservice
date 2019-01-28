import {Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, ManyToOne} from "typeorm";
import {MonitoredEndPoint} from "./MonitoredEndpoint";
@Entity()
export class MonitoringResult {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    httpCode:number

    @CreateDateColumn()
    dateOfCheck:Date

    @Column()
    payload: string;

    @ManyToOne(type=>MonitoredEndPoint, monitoredEndPoint=>monitoredEndPoint.monitoringResult,{nullable:false})
    monitoredEndPoint:MonitoredEndPoint
}
