import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts,type Product } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading products...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">สินค้าแนะนำ</h1>
      
      {products.length === 0 ? (
        <p className="text-gray-500">ยังไม่มีสินค้าในขณะนี้</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Product Image */}
              <div className="h-48 bg-gray-200 w-full object-cover">
                 {/* ถ้ามีรูปให้แสดงรูป ถ้าไม่มีให้แสดง Placeholder */}
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
                <p className="text-sm text-gray-500 mb-2 truncate">{product.description || 'ไม่มีรายละเอียด'}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold text-blue-600">฿{product.price.toLocaleString()}</span>
                  <Link 
                    to={`/product/${product.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm transition-colors"
                  >
                    ดูรายละเอียด
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;