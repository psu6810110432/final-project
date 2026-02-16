import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string; // เช่น "Waterproof", "Soft Touch"
}