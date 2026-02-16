import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Import
import { FeaturesService } from './features.service';
import { FeaturesController } from './features.controller';
import { Feature } from './entities/feature.entity'; // 2. Import Entity

@Module({
  imports: [TypeOrmModule.forFeature([Feature])], // 3. เพิ่มบรรทัดนี้
  controllers: [FeaturesController],
  providers: [FeaturesService],
})
export class FeaturesModule {}