"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvincesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const province_entity_1 = require("./entities/province.entity");
let ProvincesService = class ProvincesService {
    provinceRepository;
    constructor(provinceRepository) {
        this.provinceRepository = provinceRepository;
    }
    async findAll() {
        return this.provinceRepository.find({
            order: {
                id: 'ASC',
            },
        });
    }
    async findOne(id) {
        const province = await this.provinceRepository.findOne({
            where: { id },
        });
        if (!province) {
            throw new common_1.NotFoundException('Province not found');
        }
        return province;
    }
    async create(createProvinceDto) {
        const existingProvince = await this.provinceRepository.findOne({
            where: {
                name: createProvinceDto.name,
            },
        });
        if (existingProvince) {
            throw new common_1.ConflictException('Province already exists');
        }
        const province = this.provinceRepository.create({
            name: createProvinceDto.name.trim(),
        });
        return this.provinceRepository.save(province);
    }
    async update(id, updateProvinceDto) {
        const province = await this.findOne(id);
        if (updateProvinceDto.name) {
            const existingProvince = await this.provinceRepository.findOne({
                where: {
                    name: updateProvinceDto.name.trim(),
                },
            });
            if (existingProvince && existingProvince.id !== id) {
                throw new common_1.ConflictException('Province already exists');
            }
            province.name = updateProvinceDto.name.trim();
        }
        return this.provinceRepository.save(province);
    }
    async remove(id) {
        const province = await this.findOne(id);
        await this.provinceRepository.remove(province);
    }
};
exports.ProvincesService = ProvincesService;
exports.ProvincesService = ProvincesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(province_entity_1.Province)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ProvincesService);
//# sourceMappingURL=provinces.service.js.map