import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from './entities/province.entity';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';

@Injectable()
export class ProvincesService {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async findAll(): Promise<Province[]> {
    return this.provinceRepository.find({
      order: {
        id: 'ASC',
      },
    });
  }

  async findOne(id: number): Promise<Province> {
    const province = await this.provinceRepository.findOne({
      where: { id },
    });

    if (!province) {
      throw new NotFoundException('Province not found');
    }

    return province;
  }

  async create(createProvinceDto: CreateProvinceDto): Promise<Province> {
    const existingProvince = await this.provinceRepository.findOne({
      where: {
        name: createProvinceDto.name,
      },
    });

    if (existingProvince) {
      throw new ConflictException('Province already exists');
    }

    const province = this.provinceRepository.create({
      name: createProvinceDto.name.trim(),
    });

    return this.provinceRepository.save(province);
  }

  async update(
    id: number,
    updateProvinceDto: UpdateProvinceDto,
  ): Promise<Province> {
    const province = await this.findOne(id);

    if (updateProvinceDto.name) {
      const existingProvince = await this.provinceRepository.findOne({
        where: {
          name: updateProvinceDto.name.trim(),
        },
      });

      if (existingProvince && existingProvince.id !== id) {
        throw new ConflictException('Province already exists');
      }

      province.name = updateProvinceDto.name.trim();
    }

    return this.provinceRepository.save(province);
  }

  async remove(id: number): Promise<void> {
    const province = await this.findOne(id);

    await this.provinceRepository.remove(province);
  }
}