import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Power } from '../entity/power.entity';
import { Repository } from 'typeorm';
import { CreatePowerDto } from './dto/create-power.dto';
import { RedisCacheService } from 'src/database/redis-cache.service';

@Injectable()
export class PowerService {
  constructor(
    @InjectRepository(Power)
    private powerRepository: Repository<Power>,
    private readonly cache: RedisCacheService,
  ) {}

  async addPower(dto: CreatePowerDto): Promise<Power> {
    const { power } = dto;
    const addPower = this.powerRepository.create({
      power,
    });

    await this.powerRepository.save(addPower);
    return addPower;
  }

  async getById(id: number) {
    const cacheKey = `power_${id}`;
    const cachedPower = await this.cache.get(cacheKey);

    if (cachedPower) {
      return cachedPower;
    }

    const power = await this.powerRepository.findOne({ where: { id } });

    if (!power) {
      throw new NotFoundException(`Power with id ${id} not found`);
    }
    await this.cache.set(cacheKey, power.power, 60 * 60 * 21);

    const store = await this.cache.getAllKeys();
    // this.cache.resetCache();
    console.log(store);

    return power;
  }

  async removePower(id: number | null) {
    if (id === null || id === undefined) {
      return { message: 'Power id is not provided' };
    }

    const existingPower = await this.powerRepository.findOne({ where: { id } });

    if (!existingPower) {
      throw new NotFoundException(`Power with id ${id} not found`);
    }

    await this.powerRepository.delete(id);
    return { message: `Power ${id} deleted` };
  }
}
