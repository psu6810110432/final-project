import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoomsService } from './rooms.service';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(@Body() body: { name: string }) {
    return this.roomsService.create(body);
  }

  @Get()
  findAll() {
    return this.roomsService.findAll();
  }
}