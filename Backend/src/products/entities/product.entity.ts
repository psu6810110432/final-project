import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartItem } from '../../cart_items/entities/cart_item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true }) // เพิ่มรายละเอียดสินค้า
  description: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: 'General' }) // เพิ่มหมวดหมู่
  category: string;

  @Column({ nullable: true })
  image: string;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];
}