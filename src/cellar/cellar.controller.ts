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
  ParseUUIDPipe,
  HttpCode,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CellarService } from './cellar.service';
import { CreateCellarDto } from './dto/create-cellar.dto';
import { UpdateCellarDto } from './dto/update-cellar.dto';

@Controller('cellar')
export class CellarController {
  constructor(private readonly cellarService: CellarService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createCellarDto: CreateCellarDto, @Request() req) {
    return this.cellarService.create(req.user.email, createCellarDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Request() req) {
    return this.cellarService.findAll(req.user.email);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.cellarService.findOne(req.user.email, id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCellarDto: UpdateCellarDto,
    @Request() req,
  ) {
    return this.cellarService.update(req.user.email, id, updateCellarDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.cellarService.remove(req.user.email, id);
  }
}
