import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query, UseInterceptors, ClassSerializerInterceptor, SerializeOptions } from '@nestjs/common';
import { TermdatesService } from './termdate.service';
import { CreateTermdateDto } from './dto/create-termdate.dto';
import { UpdateTermdateDto } from './dto/update-termdate.dto';


@Controller('termdates')
export class TermDatesController {
  constructor(private readonly termDatesService: TermdatesService) {}

  @Post()
  async create(@Body() createTermdateDto: CreateTermdateDto) {
    return this.termDatesService.create(createTermdateDto);
  }

  @Get()
  async findAll(@Query() query:{}) {
    return this.termDatesService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.termDatesService.findOne(+id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTermdateDto: UpdateTermdateDto) {
    return this.termDatesService.update(+id, updateTermdateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.termDatesService.remove(+id);
  }

};