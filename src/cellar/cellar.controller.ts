import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CellarService } from './cellar.service';
import { CreateCellarDto } from './dto/create-cellar.dto';
import { UpdateCellarDto } from './dto/update-cellar.dto';

@Controller('cellar')
export class CellarController {
  constructor(private readonly cellarService: CellarService) {}

  @Post()
  create(@Body() createCellarDto: CreateCellarDto) {
    return this.cellarService.create(createCellarDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Request() req) {
    console.log('user', req.user);
    return this.cellarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cellarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCellarDto: UpdateCellarDto) {
    return this.cellarService.update(+id, updateCellarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cellarService.remove(+id);
  }
}
