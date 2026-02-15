import { IsString, IsNotEmpty, IsNumber, IsOptional, Min, IsBoolean } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณาระบุชื่อสินค้า' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'ราคาสินค้าต้องไม่ติดลบ' })
  price: number;

  @IsNumber()
  @Min(0, { message: 'จำนวนสินค้าต้องไม่ติดลบ' })
  stock: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  image?: string;

  // 👇 เพิ่มฟิลด์ใหม่ให้ครบตามที่คุณแก้ Entity ไปก่อนหน้านี้ พร้อม Decorator
  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  width?: string;

  @IsOptional()
  @IsString()
  length?: string;

  @IsOptional()
  @IsString()
  height?: string;

  @IsOptional()
  @IsBoolean()
  isInstallable?: boolean;
}