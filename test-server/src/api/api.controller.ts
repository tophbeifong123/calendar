import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post()
  create(@Body() createApiDto: CreateApiDto) {
    return this.apiService.create(createApiDto);
  }

  @Get()
  findAll() {
    return this.apiService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiDto: UpdateApiDto) {
    return this.apiService.update(+id, updateApiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiService.remove(+id);
  }

  @Get('fetch-student-class-date')
  async fetchStudentClassDate(
    @Headers('token') token: string,
    @Query('eduTerm') eduTerm: string,
    @Query('eduYear') eduYear: string,
  ) {
    return this.apiService.fectStudentClassDate(token, eduTerm, eduYear);
  }

  @Get('fetch-student-exam-date')
  async fetchStudentExamDate(
    @Headers('token') token: string,
    @Query('eduTerm') eduTerm: string,
    @Query('eduYear') eduYear: string,
  ) {
    return this.apiService.fectStudentExamDate(token, eduTerm, eduYear);
  }

  @Get('fetch-student-detail')
  async fetchStudentDetail(@Headers('token') token: any) {
    return this.apiService.fectStudentDetail(token);
  }

  @Get('fetch-student-image')
  async fetchStudentImage(@Headers('token') token: any) {
    return this.apiService.fectStudentImage(token);
  }

  @Get('psu')
  async allApiTest(@Headers('token') token: string,@Headers('url') url: string) {
    return this.apiService.restApi(token,url);
  }
}
