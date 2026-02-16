import axios from 'axios';

// URL ของ Backend (NestJS รันที่ Port 3000)
const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: แนบ Token ไปกับทุก Request ถ้ามี Token ใน localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}
// --- API Functions ---

// 1. Login
export const loginUser = async (credentials: { username: string; password: string }) => {
  // ยิงไปที่ AuthController @Post('auth/login')
  const response = await api.post('/auth/login', credentials);
  return response.data; // คาดหวัง { access_token: "..." }
};

// 2. Register
export const registerUser = async (userData: any) => {
  // ยิงไปที่ UsersController @Post('users')
  const response = await api.post('/users', userData);
  return response.data;
};

// 3. Get User Profile (ตัวอย่าง: ต้องใช้ ID หรือมี Endpoint getProfile)
// เนื่องจาก Backend ให้ updateProfile แต่ดึงข้อมูลใช้ Get(':id') 
// เราจะพักไว้ก่อน รอเชื่อม Context เสร็จ

//4 Product
export const getAllProducts = async (): Promise<Product[]> => {
    const response = await api.get('/products');
    return response.data;
};
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};
export const getProductById = async (id: string): Promise<Product[]> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
};
export const createProduct = async (productData: any) => {
    const reponse = await api.post('/products', productData);
    return reponse.data;
};

export interface Category {
  id: number;
  name: string;
}

export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get('/categories');
  return response.data;
};

export const createCategory = async (name: string) => {
  const response = await api.post('/categories', { name });
  return response.data;
};

// 6. Rooms
export interface Room { id: number; name: string; }

export const getAllRooms = async (): Promise<Room[]> => {
  const response = await api.get('/rooms');
  return response.data;
};

export const createRoom = async (name: string) => {
  return await api.post('/rooms', { name });
};

// 7. Features
export interface Feature { id: number; name: string; }

export const getAllFeatures = async (): Promise<Feature[]> => {
  const response = await api.get('/features');
  return response.data;
};

export const createFeature = async (name: string) => {
  return await api.post('/features', { name });
};
export default api;