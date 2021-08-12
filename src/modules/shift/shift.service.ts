import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Shift } from './shift.entity';
import { Status } from '../../utils/enums/status';
import { JobService } from '../job/job.service';
import { ZenJobError } from '../../utils/error/zenjob-error.js'
import { v4 as UUIDv4 } from 'uuid';

@Injectable()
export class ShiftService {
  constructor(
    @InjectRepository(Shift)
    private readonly repository: Repository<Shift>,
  ) {}

  public async getShifts(uuid: string): Promise<Shift[]> {
    return this.repository.find({
      where: {
        jobId: uuid,
      },
    });
  }

  public async getShift(shiftId: string): Promise<Shift[]> {
    return this.repository.findOne({
      where: {
        jobId: shiftId,
      },
    });
  }

  public async bookTalent(talent: string, shiftId: string): Promise<void> {
    this.repository.findOne(shiftId).then(shift => {
      shift.talentId = talent;
      this.repository.save(shift);
    });
  }
  /**
   * @param oldShift {Shift}
   * @returns {Promise<*>}
   */
  public async createReplacementShifts(oldShift: Shift): Promise<void> {
    const startTime = oldShift.startTime;
    const endTime = oldShift.endTime;
    const shift = new Shift();
    shift.id = UUIDv4();
    shift.job = oldShift.job;
    shift.startTime = startTime;
    shift.endTime = endTime;
    shift.shiftStatus = Status.PENDING;
    return this.repository.save(shift);
  }

  /**
   * @param shiftId {String}
   * @returns {Promise<*>}
   */
  public async cancelShiftById(shiftId: string): Promise<void> {
    try {
      let shift = await this.repository.findOne(shiftId);
      // get shifts against jobId
      let shifts = await this.getShifts(shift.job.jobId);
      // check if single shift exist against shift's jobId then cancel the job status as well
      if (shifts && shifts.length === 1) {
        const jobService = new JobService(shift.job);
        await jobService.cancelJob(shift.job.jobId);
      }
      if (!shift.shiftStatus || shift.shiftStatus === Status.BOOKED) {
        shift.shiftStatus = Status.CANCEL;
        return this.repository.save(shift);
      }
    } catch (error) {
      throw new ZenJobError(500, JSON.stringify(error));
    }
  }

  /**
   * @param talentId {String}
   * @returns {Promise<*>}
   */
  public async cancelShiftsByTalent(talentId: string): Promise<void> {
    try {
      let shiftsByTalent = await this.repository.find({
        where: {
          talentId: talentId,
        },
      });
      shiftsByTalent.map(shift => {
        if (!shift.shiftStatus || shift.shiftStatus === Status.BOOKED) {
          shift.shiftStatus = Status.CANCEL;
        }
        return shift;
      });
      if (!shiftsByTalent.job && !shiftsByTalent.job.jobId) {
        throw new ZenJobError(500, 'job doesn\'t exist against job shifts');
      }
      // update shift status to cancel
      await this.repository.save(shiftsByTalent);
      // create replacement shifts 
      return this.createReplacementShifts(shiftsByTalent);
    } catch (error) {
      throw new ZenJobError(500, JSON.stringify(error));
    }
  }
}

