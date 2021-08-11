import { Controller, Post, Body, Get, Patch, HttpCode, ParseUUIDPipe, Param} from '@nestjs/common';
import { v4 as UUIDv4 } from 'uuid';
import { JobService } from './job.service';
import { ResponseDto } from '../../utils/ResponseDto';
import { ValidationPipe } from '../ValidationPipe';
import { JobRequest } from './dto/JobRequest';
import { JobRequestResponse } from './dto/JobRequestResponse';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async requestJob(
    @Body(new ValidationPipe<JobRequest>())
    dto: JobRequest,
  ): Promise<ResponseDto<JobRequestResponse>> {
    const job = await this.jobService.createJob(UUIDv4(), dto.start, dto.end);
    return new ResponseDto<JobRequestResponse>(new JobRequestResponse(job.id));
  }

  @Patch(':jobId/cancel')
  @HttpCode(204)
  async cancelJob(
    @Param('jobId', new ParseUUIDPipe()) jobId: string
  ): Promise<ResponseDto<JobRequestResponse>> {
    const updatedJob = await this.jobService.cancelJob(jobId);
    return new ResponseDto<JobRequestResponse>(new JobRequestResponse(updatedJob.id));
  }
}
