import { PartialType } from '@nestjs/mapped-types';
import { CreateTermdateDto } from './create-termdate.dto';

export class UpdateTermdateDto extends PartialType(CreateTermdateDto) {}
