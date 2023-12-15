import { Module } from '@nestjs/common';
import { PowerService } from './power.service';
import { PowerController } from './power.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Power } from '../entity/power.entity';
import { RedisModule } from 'src/database/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Power]), RedisModule],
  controllers: [PowerController],
  providers: [PowerService],
})
export class PowerModule {}
