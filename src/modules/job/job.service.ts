import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { v4 as UUIDv4 } from 'uuid';
import { eachDayOfInterval } from 'date-fns';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { Shift } from '../shift/shift.entity';
import {Status} from '../../utils/enums/status'
@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
  ) {}

  async createJob(uuid: string, date1: Date, date2: Date): Promise<Job> {
    date1.setUTCHours(8);
    date2.setUTCHours(17);
    const job = new Job();
    job.id = uuid;
    job.companyId = UUIDv4();
    job.startTime = date1;
    job.endTime = date2;

    job.shifts = eachDayOfInterval({ start: date1, end: date2 }).map(day => {
      const startTime = new Date(day);
      startTime.setUTCHours(8);
      const endTime = new Date(day);
      endTime.setUTCHours(17);
      const shift = new Shift();
      shift.id = UUIDv4();
      shift.job = job;
      shift.startTime = startTime;
      shift.endTime = endTime;
      return shift;
    });

    return this.jobRepository.save(job);
  }

  async cancelJob(jobId: string): Promise<Job> {
    if (jobId) {
      const jobDetails = await this.getJobById(jobId);
        // check job status doesn't exist (existing jobs will not have job status but can be updated by retrofit script) 
        // or is Booked 
      if(!jobDetails.jobStatus || jobDetails.jobStatus === Status.BOOKED) {
        jobDetails.jobStatus = Status.CANCEL;
        jobDetails.updatedAt = new Date();
        jobDetails.shifts = jobDetails.shifts.map(shift => {
          if (!shift.shiftStatus || shift.shiftStatus === Status.BOOKED) {
            shift.shiftStatus = Status.CANCEL;
          }
          return shift;
        });
      }
      return this.jobRepository.save(jobDetails);
    }
  }

  public async getJobs(): Promise<Job[]> {
    return this.jobRepository.find();
  }


  public async getJobById(jobId: string): Promise<Job> {
    return this.jobRepository.findOne(jobId);
  }
}
