import { ProvincesService } from './provinces.service';
import { CreateProvinceDto } from './dto/create-province.dto';
import { UpdateProvinceDto } from './dto/update-province.dto';
export declare class ProvincesController {
    private readonly provincesService;
    constructor(provincesService: ProvincesService);
    findAll(): Promise<import("./entities/province.entity").Province[]>;
    findOne(id: number): Promise<import("./entities/province.entity").Province>;
    create(createProvinceDto: CreateProvinceDto): Promise<import("./entities/province.entity").Province>;
    update(id: number, updateProvinceDto: UpdateProvinceDto): Promise<import("./entities/province.entity").Province>;
    remove(id: number): Promise<void>;
}
