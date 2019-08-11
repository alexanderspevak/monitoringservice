import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, Unique } from 'typeorm'
import { User } from './User'
import { MonitoringResult } from './MonitoringResult'
import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, Validate, Min, Max } from 'class-validator'

@ValidatorConstraint({ name: 'isUrl', async: false })
class IsUrl implements ValidatorConstraintInterface {
  validate (url: string, args: ValidationArguments) {
    var pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&amp;a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i')
    return pattern.test(url)
  }

  defaultMessage (args: ValidationArguments) {
    return 'Url is not valid'
  }
}

@Unique(['user', 'url'])
@Entity()
export class MonitoredEndpoint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    @Validate(IsUrl)
    url: string;

    @Column()
    @Max(60)
    @Min(5)
    monitoredInterval: number;

    @CreateDateColumn()
    dateOfCreation: Date;

    @Column({ nullable: true })
    dateOfLastCheck: Date

    @ManyToOne(type => User, user => user.monitoredEndPoints, { nullable: false, onDelete: 'CASCADE' })
    user: User|number

    @OneToMany(type => MonitoringResult, monitoringResult => monitoringResult.monitoredEndPoint)
    monitoringResult: MonitoringResult[];
}
