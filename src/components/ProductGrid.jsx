import { SearchX } from 'lucide-react';
import ProductCard from './ProductCard';
import { MAX_COMPARE } from '../hooks/useFilterEngine';

export default function ProductGrid({ products, compareList, toggleCompare, clearAllFilters }) {
  if (products.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <SearchX size={38} aria-hidden="true" />
        <h2>No matching products found</h2>
        <p>Try a broader search or remove a few filters.</p>
        <button className="button primary-button" onClick={clearAllFilters}>Reset filters</button>
      </div>
    );
  }
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isCompared={compareList.some((item) => item.id === product.id)}
          compareFull={compareList.length >= MAX_COMPARE}
          toggleCompare={toggleCompare}
        />
      ))}
    </div>
  );
}
