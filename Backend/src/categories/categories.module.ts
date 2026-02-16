import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. import TypeOrmModule
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity'; // 2. import Entity

@Module({
  imports: [TypeOrmModule.forFeature([Category])], // 3. เพิ่มบรรทัดนี้ เพื่อ register Repository
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}