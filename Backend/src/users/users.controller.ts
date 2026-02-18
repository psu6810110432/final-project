import { 
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException,
  UseInterceptors, UploadedFile, BadRequestException, ParseFilePipe, 
  MaxFileSizeValidator, FileTypeValidator
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 1. สมัครสมาชิก
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ---------------------------------------------------------
  // ✅ แก้ไขโปรไฟล์ตัวเอง + อัปโหลดรูปภาพ (มี Sharp Resize) 🖼️
  // ---------------------------------------------------------
  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file')) // รับไฟล์ชื่อ 'file' (ไม่ต้องใช้ storage diskStorage แล้ว เพราะเราจะจัดการเอง)
  async updateProfile(
    @Req() req, 
    @Body() body: UpdateUserDto, 
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false, // ไม่บังคับว่าต้องมีรูป (เผื่อแก้แค่ชื่อ)
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }), // Max 5MB
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|webp)' }), // รูปเท่านั้น
        ],
      }),
    ) file?: Express.Multer.File 
  ) {
    // ถ้ามีการอัปโหลดไฟล์มาด้วย ให้ทำการ Resize
    if (file) {
      const filename = `user-${req.user.id}-${Date.now()}.jpeg`;
      const uploadPath = path.join('./uploads/profiles', filename);

      // สร้างโฟลเดอร์ถ้ายังไม่มี
      if (!fs.existsSync('./uploads/profiles')) {
        fs.mkdirSync('./uploads/profiles', { recursive: true });
      }

      // ✅ ใช้ Sharp ย่อรูปและบันทึก
      await sharp(file.buffer)
        .resize(300, 300, { // บังคับขนาด 300x300
          fit: 'cover',
        })
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toFile(uploadPath);
      
      // เอาชื่อไฟล์ใส่เข้าไปใน DTO เพื่อไปอัปเดตลง DB
      body.userImage = filename;
    }
    
    // อัปเดตข้อมูล (ID เอาจาก Token เสมอ)
    return this.usersService.update(req.user.id, body); 
  }

  // 2. ดูรายชื่อ User ทั้งหมด (Admin)
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  // ✅ เพิ่ม Endpoint ดึง Profile ของตัวเอง (ที่ Frontend ต้องใช้)
  @Get('profile/me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req) {
    return this.usersService.findOne(req.user.id);
  }

  // 3. ดูข้อมูล User ตาม ID (Secure 🔒)
  @Get(':id')
  @UseGuards(AuthGuard('jwt')) 
  findOne(@Param('id') id: string, @Req() req) {
    if (req.user.role !== 'admin' && req.user.id !== id) {
        throw new ForbiddenException('คุณไม่มีสิทธิ์ดูข้อมูลผู้ใช้นี้');
    }
    return this.usersService.findOne(id);
  }

  // 4. แก้ไขข้อมูลโดย Admin (แบบมี Sharp ด้วยก็ได้ ถ้าขยันทำ)
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @UseInterceptors(FileInterceptor('file')) // ใช้ Sharp เหมือนกัน
  async update(
    @Param('id') id: string, 
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    if (file) {
      const filename = `user-${id}-${Date.now()}.jpeg`;
      const uploadPath = path.join('./uploads/profiles', filename);
      
      if (!fs.existsSync('./uploads/profiles')) fs.mkdirSync('./uploads/profiles', { recursive: true });

      await sharp(file.buffer)
        .resize(300, 300, { fit: 'cover' })
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toFile(uploadPath);

      updateUserDto.userImage = filename;
    }
    return this.usersService.update(id, updateUserDto);
  }

  // 5. ลบ User (Admin)
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // 6. เปลี่ยน Role (Admin)
  @Patch(':id/role')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  updateRole(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @Req() req: any) {
    if (id === req.user.id) { 
      throw new ForbiddenException('Admin cannot change their own role');
    }
    return this.usersService.updateRole(id, updateRoleDto.role);
  }
}