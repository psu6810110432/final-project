import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 1. Import
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { Room } from './entities/room.entity'; // 2. Import Entity

@Module({
  imports: [TypeOrmModule.forFeature([Room])], // 3. เพิ่มบรรทัดนี้
  controllers: [RoomsController],
  providers: [RoomsService],
})
export class RoomsModule {}