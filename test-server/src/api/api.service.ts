import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ApiService {
  private readonly credential: string;
  constructor(private http: HttpService) { 
    this.credential = 'api_key=JwnMeh+gj2rjD4PmSRhgbz13m9mKx2EF';
   }
  

  create(createApiDto: CreateApiDto) {
    return 'This action adds a new api';
  }

  findAll() {
    return `This action returns all api`;
  }

  findOne(id: number) {
    return `This action returns a #${id} api`;
  }

  update(id: number, updateApiDto: UpdateApiDto) {
    return `This action updates a #${id} api`;
  }

  remove(id: number) {
    return `This action removes a #${id} api`;
  }

  async fectStudentClassDate(token: string, eduTerm: string, eduYear: string) {
    if (!token) {
      console.error("Access token is not available");
      return;
    }
    try {
      console.log(eduTerm,eduYear)
      const response = await this.http.get(
        'https://api-gateway.psu.ac.th/Test/regist/level2/StudentClassDate/token',
        {
          headers: {
            credential: this.credential,
            token: token,
          },
          params: {
            eduTerm: eduTerm,
            eduYear: eduYear,
          },
        },
      ).toPromise();

      return response.data.data;
    } catch (error) {
      console.error('Error fectStudentClassDate:', error);
      throw new Error('Failed to fectStudentClassDate');
    }
  }

  async fectStudentExamDate(token: string, eduTerm: string, eduYear: string) {
    if (!token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const response = await this.http.get(
        'https://api-gateway.psu.ac.th/Test/regist/level2/StudentExamdate/token',
        {
          headers: {
            credential: this.credential,
            token: token,
          },
          params: {
            eduTerm: eduTerm,
            eduYear: eduYear,
            offset: '0',
            limit: '20'
          },
        },
      ).toPromise();

      return response.data.data;
    } catch (error) {
      console.error('Error fectStudentExamDate:', error);
      throw new Error('Failed to fectStudentExamDate');
    }
  }

  async fectStudentDetail(token: string) {
    if (!token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const response = await this.http.get(
        'https://api-gateway.psu.ac.th/Test/regist/level2/StudentDetail/token',
        {
          headers: {
            credential: this.credential,
            token: token,
          },
        },
      ).toPromise();
      return response.data.data;
    } catch (error) {
      console.error('Error fectStudentDetail:', error);
      throw new Error('Failed to fectStudentDetail');
    }
  }

  async fectStudentImage(token: string) {
    if (!token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const response = await this.http.get(
        'https://api-gateway.psu.ac.th/Test/regist/level2/StudentImage/token',
        {
          headers: {
            credential: this.credential,
            token: token,
          },
        },
      ).toPromise();
      return response.data.data;
    } catch (error) {
      console.error('Error fectStudentImage:', error);
      throw new Error('Failed to fectStudentImage');
    }
  }

  async restApi(token: string,url: string) {
    if (!token) {
      console.error("Access token is not available");
      return;
    }
    try {
      const response = await this.http.get(
        `https://api-gateway.psu.ac.th/Test/regist/${url}`,
        {
          headers: {
            credential: this.credential,
            token: token,
          },
        },
      ).toPromise();
      return response.data.data;
    } catch (error) {
      console.error('Error fectStudentImage:', error);
      throw new Error('Failed to fectStudentImage');
    }
  }

  async fectHolidayFromGoogle() {
    try {
      const response = await this.http.get(
        `https://www.googleapis.com/calendar/v3/calendars/th.th%23holiday%40group.v.calendar.google.com/events?key=AIzaSyCh0pb-GeZ9Kd1YtbT_FLCZKIQ5lhFBS1k`,
        {

        },
      ).toPromise();
      return response.data;
    } catch (error) {
      console.error('Error fectHolidayFromGoogle:', error);
      throw new Error('Failed to fectHolidayFromGoogle');
    }
  }

}
