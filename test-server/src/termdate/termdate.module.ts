import { Module } from '@nestjs/common';
import { TermDatesController } from './termdate.controller';
import { TermdatesService } from './termdate.service';
import { Termdate } from './entities/termdate.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Termdate])],
  controllers: [TermDatesController],
  providers: [TermdatesService],
})
export class TermdateModule {}
