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

  public async cancelShiftById(shiftId: string): Promise<void> {
    let shift = await this.repository.findOne(shiftId);
    if (!shift.shiftStatus || shift.shiftStatus === Status.BOOKED) {
      shift.shiftStatus = Status.CANCEL;
      this.repository.save(shift);
    }
  }
}

