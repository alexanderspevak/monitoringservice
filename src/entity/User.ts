import {Entity, PrimaryGeneratedColumn, Column,PrimaryColumn, OneToMany} from "typeorm";
import {IsEmail} from 'class-validator'
import {MonitoredEndPoint} from './MonitoredEndpoint'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique:true})
    userName: string;

    @Column({unique:true})
    @IsEmail()
    email: string;

    @Column({unique:true})
    accessToken: string;

    @OneToMany(type => MonitoredEndPoint, monitoredEndPoint => monitoredEndPoint.user)
    monitoredEndPoints: MonitoredEndPoint[];
}
