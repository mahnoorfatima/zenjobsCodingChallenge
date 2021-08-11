import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Shift } from './shift.entity';
import {Status} from '../../utils/enums/status'


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

  public async cancelShiftById(shiftId: string): Promise<void> {
    let shift = await this.repository.findOne(shiftId);
    if (!shift.shiftStatus || shift.shiftStatus === Status.BOOKED) {
      shift.shiftStatus = Status.CANCEL;
      this.repository.save(shift);
    }
  }

  public async cancelShiftsByTalent(talentId: string): Promise<void> {
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
    // update shift status to cancel
    await this.repository.save(shiftsByTalent);
    // create replacement shifts 
    return this.createReplacementShifts(shiftsByTalent);
  }
}

