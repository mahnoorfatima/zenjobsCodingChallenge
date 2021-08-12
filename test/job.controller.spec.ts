import { JobController } from '../src/modules/job/job.controller';
import { JobService } from '../src/modules/job/job.service';
import { v4 as UUIDv4 } from 'uuid';

describe('JobController', () => {
    let jobController: JobController;
    let jobService: JobService;
  
    beforeEach(() => {
        jobService = new JobService(jobService);
        jobController = new JobController(jobService);
    });
  
    describe('cancel job', () => {
      it('should cancel job againts jobId', async () => {
        const job = {
            jobId: UUIDv4(),
            jobStatus: 'cancel',
            shifts: [{
                id: UUIDv4(),
                startTime: new Date(),
                endTime: new Date(),
                shiftStatus: 'cancel'
            }]
         };
        jest.spyOn(jobService, 'createJob').mockImplementation(() => job);
        expect(await jobController.cancelJob(job.jobId)).toBe(job);
      });
    });
  });