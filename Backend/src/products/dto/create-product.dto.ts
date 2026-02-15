export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  image?: string;
  color?: string;
  width?: string;
  length?: string;
  height?: string;
  isInstallable?: boolean;
}