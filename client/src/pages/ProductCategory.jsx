import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useParams } from 'react-router-dom';
import { categories } from '../assets/assets';
import ProductCard from '../components/ProductCard';

const ProductCategory = () => {
  const { Products } = useAppContext();
  const { category } = useParams();

  if (!Products) return <p className="mt-16 text-center">Loading products...</p>;

  const searchCategory = categories.find(
    (item) => item.path.toLowerCase() === category?.toLowerCase()
  );

  const filteredProducts = Products.filter(
    (product) => product.category.toLowerCase() === category?.toLowerCase()
  ).filter((product) => product.inStock); // combined filters

  return (
    <div className="mt-16 flex flex-col">
      {searchCategory && (
        <div className="flex flex-col items-end w-max">
          <p className="text-2xl font-medium">
            {searchCategory.text.toUpperCase()}
          </p>
          <div className="w-16 h-0.5 bg-primary rounded-full"></div>
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <p className="mt-6 text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6 mt-6">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} Product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCategory;
