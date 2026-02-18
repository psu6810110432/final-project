import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart_item.entity';
import { CreateCartItemDto } from './dto/create-cart_item.dto'; // ✅ ใช้ DTO
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  // 1. เพิ่มของใส่ตะกร้า (Logic เดิมของคุณ + Type ที่ถูกต้อง)
  async addToCart(createCartItemDto: CreateCartItemDto, user: User) { // ✅ แก้ any เป็น DTO
    const { productId, quantity, requestInstallation } = createCartItemDto;

    if (quantity <= 0) {
      throw new BadRequestException('จำนวนสินค้าที่เพิ่มเข้าตะกร้าต้องมากกว่า 0 ชิ้น');
    }

    // 1.1 เช็คสินค้า
    const product = await this.productsRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // 1.2 เช็คตะกร้าเดิม (ของ User คนนี้เท่านั้น)
    const existingItem = await this.cartItemsRepository.findOne({
      where: {
        user: { id: user.id },
        product: { id: product.id },
      },
    });

    // 1.3 เช็คสต็อก (Logic เดิมของคุณ)
    const currentQty = existingItem ? existingItem.quantity : 0;
    if (currentQty + quantity > product.stock) {
        throw new BadRequestException(
          `ของมีไม่พอครับ! (คลังมี: ${product.stock}, ตะกร้าคุณมี: ${currentQty}, จะเพิ่มอีก: ${quantity})`
        );
    }

    // 1.4 บันทึก
    if (existingItem) {
      existingItem.quantity += quantity;
      // อัปเดตตัวเลือกติดตั้งด้วยถ้ามีการส่งมาใหม่
      if (requestInstallation !== undefined) existingItem.requestInstallation = requestInstallation;
      return await this.cartItemsRepository.save(existingItem);
    } else {
      const newItem = this.cartItemsRepository.create({
        quantity,
        requestInstallation: requestInstallation || false,
        product,
        user,
      });
      return await this.cartItemsRepository.save(newItem);
    }
  }

  // 2. ลบของออกจากตะกร้า (Secure ✅)
  async remove(id: string, userId: string) {
    const item = await this.cartItemsRepository.findOne({
      where: { id, user: { id: userId } }, // ✅ เช็คว่าเป็นเจ้าของตะกร้าจริงๆ
    });

    if (!item) {
      throw new NotFoundException(`ไม่พบสินค้าในตะกร้า หรือคุณไม่มีสิทธิ์ลบ`);
    }

    return await this.cartItemsRepository.remove(item);
  }

  // 3. ล้างตะกร้าทั้งหมด (Secure ✅)
  async clearCart(userId: string) {
    await this.cartItemsRepository.delete({ user: { id: userId } }); // ✅ ลบเฉพาะของตัวเอง
    return {
      message: 'Cart cleared successfully',
      statusCode: 200
    };
  }

// 4. แก้ไขจำนวน (Secure + Logic เดิม ✅)
  async update(id: string, quantity: number, userId: string) {
    // 🚨 ป้องกันการส่งเลข 0 หรือเลขติดลบ
    if (quantity <= 0) {
      throw new BadRequestException('จำนวนสินค้าต้องมากกว่า 0 หากต้องการลบสินค้ากรุณากดลบรายการ');
    }

    const cartItem = await this.cartItemsRepository.findOne({
      where: { id },
      relations: ['product', 'user'],
    });

    if (!cartItem) throw new NotFoundException('Item not found');

    // 🛡️ Security: เช็คว่าเป็นของ user คนนี้จริงไหม?
    if (cartItem.user.id !== userId) {
        throw new ForbiddenException('คุณไม่มีสิทธิ์แก้ไขตะกร้าของคนอื่น');
    }

    // เช็คสต็อก (Logic เดิม)
    if (quantity > cartItem.product.stock) {
      throw new BadRequestException(`สินค้าหมด! เหลือเพียง ${cartItem.product.stock} ชิ้น`);
    }

    cartItem.quantity = quantity;
    return await this.cartItemsRepository.save(cartItem);
  }

// ใน Backend/src/cart_items/cart_items.service.ts

  async getCartSummary(userId: string) {
    const cartItems = await this.cartItemsRepository.find({
      where: { user: { id: userId } }, // ✅ ต้องกรองตาม userId
      relations: ['product'],
    });

    let subTotal = 0;
    let totalInstallationFee = 0;

    const items = cartItems.map((item) => {
      const totalLine = Number(item.product.price) * item.quantity;
      subTotal += totalLine;
      
      if (item.requestInstallation) {
          totalInstallationFee += 500; 
      }

      // ✅ แก้ตรงนี้: ส่ง product กลับไปทั้งก้อน (Frontend จะได้ใช้ item.product.name ได้)
      return {
        id: item.id,            // ID ของรายการในตะกร้า
        quantity: item.quantity,
        product: item.product,  // <--- ส่ง Object Product กลับไปตรงๆ
        requestInstallation: item.requestInstallation,
        total: totalLine        // (Optional) ส่งราคารวมต่อชิ้นไปด้วยก็ได้
      };
    });

    const shippingFee = subTotal >= 5000 ? 0 : 150;
    
    return {
      items: items,
      summary: {
        subTotal: subTotal,
        shippingFee: shippingFee,
        installationFee: totalInstallationFee,
        grandTotal: subTotal + shippingFee + totalInstallationFee
      }
    };
  }
}