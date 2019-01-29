import {Entity, PrimaryGeneratedColumn, Column,CreateDateColumn, ManyToOne} from "typeorm";
import {MonitoredEndPoint} from "./MonitoredEndpoint";
@Entity()
export class MonitoringResult {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    httpCode:number

    @CreateDateColumn()
    dateOfCheck:Date

    @Column({type:"longtext"})
    payload: string;    

    @ManyToOne(type=>MonitoredEndPoint, monitoredEndPoint=>monitoredEndPoint.monitoringResult,{nullable:false, onDelete:'CASCADE'})
    monitoredEndPoint:MonitoredEndPoint
}
