import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { PowerService } from './power.service';
import { CreatePowerDto } from './dto/create-power.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('power')
@Controller('power')
export class PowerController {
  constructor(private readonly powerService: PowerService) {}

  @Post()
  create(@Body() createPowerDto: CreatePowerDto) {
    return this.powerService.addPower(createPowerDto);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.powerService.getById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.powerService.removePower(+id);
  }
}
