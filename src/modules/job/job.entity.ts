import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Shift } from '../shift/shift.entity';
import {Status} from '../../utils/enums/status'

@Entity({ name: 'job_process' })
export class Job {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @VersionColumn()
  version: number;

  @Column()
  companyId: string;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @OneToMany(
    () => Shift,
    shift => shift.job,
    {
      cascade: true,
    },
  )
  shifts: Shift[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.PENDING
  })
  jobStatus: Status;
}
