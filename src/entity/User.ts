import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { IsEmail } from 'class-validator'
import { MonitoredEndpoint } from './MonitoredEndpoint'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    userName: string;

    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Column({ unique: true })
    accessToken: string;

    @OneToMany(type => MonitoredEndpoint, monitoredEndPoint => monitoredEndPoint.user)
    monitoredEndPoints: MonitoredEndpoint[]
}
