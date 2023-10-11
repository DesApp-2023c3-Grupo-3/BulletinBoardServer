import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from 'cartelera-unahur';
import { SocketService } from 'src/plugins/socket/socket.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from 'src/entities/course.entity';
import { coursesStub } from './stubs/courses.stub';
import * as xlsx from 'xlsx';
import { ImageService } from '../image/image.service';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    private readonly socketService: SocketService,
    @Inject(ImageService)
    private readonly serviceImage: ImageService,
  ) {}

  public async create(createCourseDto: CreateCourseDto) {
    const newCourse = this.courseRepository.create(createCourseDto);
    const created = await this.courseRepository.save(newCourse);
    this.socketService.sendMessage('course', {
      id: 1,
      title: 'comision default',
      subject: 'materia default',
      classroom: 'aula default',
      schedule: 'horario default',
    });
    return created;
  }

  public async findAll() {
    return this.courseRepository.find();
  }

  public async findOne(id: number) {
    try {
      return this.courseRepository.find({ where: { id } });
    } catch (error) {
      throw new HttpException('Course not found', HttpStatus.BAD_REQUEST);
    }
  }

  public async update(id: number, updateCourseDto: UpdateCourseDto) {
    try {
      return this.courseRepository.update({ id }, updateCourseDto); // TODO: Revisar el output del update
    } catch (error) {
      throw new HttpException('Error on update', HttpStatus.BAD_REQUEST);
    }
  }

  public async remove(id: number) {
    try {
      return this.courseRepository.update(
        { id },
        {
          id,
          deletedAt: Date.now(), // TODO: Probar el borrado logico de @DeletedAtColumn
        },
      );
    } catch (error) {
      throw new HttpException('Error on delete', HttpStatus.BAD_REQUEST);
    }
  }

  public async findBySector(sectorId: number) {
    return coursesStub;
  }

  async createCommissionTemplate() {
    const data = [['Nombre', 'Hora inicio', 'Hora fin']];

    const worksheet = xlsx.utils.aoa_to_sheet(data);

    worksheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 15 }];

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Comisiones');
    const excelBuffer = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'buffer',
    });

    return excelBuffer;
  }

  async uploadCommission(file: Express.Multer.File) {
    try {
      const jsonCommisionPromise = this.serviceImage.createJson(file);
      const jsonCommision = await jsonCommisionPromise;

      const createdCourses = [];

      for (const rowData of jsonCommision) {
        const name = rowData['Nombre'];
        const startHour = rowData['Hora inicio'];
        const endHour = rowData['Hora fin'];

        const createCourseDto: CreateCourseDto = {
          name,
        };

        const newCourse = this.courseRepository.create(createCourseDto);
        const createdCourse = await this.courseRepository.save(newCourse);
        createdCourses.push(createdCourse);
      }

      return {
        message: 'Cursos creados exitosamente desde el archivo Excel',
        createdCourses,
      };
    } catch (error) {
      throw new HttpException(
        'Error en el proceso de carga',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
