import { useMemo, useState } from 'react';
import { categories, products } from '../data/catalog';
import { filterGroups, filterProducts } from '../data/filters';

export const MAX_COMPARE = 4;

export default function useFilterEngine(catalog = products) {
  const [activeCategory, updateCategory] = useState('Switching');
  const [selectedVendors, setSelectedVendors] = useState(() => new Set());
  const [activeFilters, setActiveFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [compareList, setCompareList] = useState([]);

  function setActiveCategory(category) {
    if (!categories.includes(category)) throw new Error(`Unknown category: ${category}`);
    if (category !== activeCategory) {
      updateCategory(category);
      setActiveFilters({});
    }
  }

  function toggleVendor(vendor) {
    setSelectedVendors((current) => {
      const next = new Set(current);
      if (next.has(vendor)) next.delete(vendor);
      else next.add(vendor);
      return next;
    });
  }

  function toggleFilterTag(key, value) {
    const group = filterGroups[activeCategory].find((item) => item.key === key);
    if (!group?.options.some((item) => item.value === value)) {
      throw new Error(`Unsupported filter for ${activeCategory}: ${key}=${value}`);
    }
    setActiveFilters((current) => {
      const values = current[key] ?? [];
      const nextValues = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      const next = { ...current, [key]: nextValues };
      if (nextValues.length === 0) delete next[key];
      return next;
    });
  }

  function toggleCompare(product) {
    setCompareList((current) => current.some((item) => item.id === product.id)
      ? current.filter((item) => item.id !== product.id)
      : current.length < MAX_COMPARE ? [...current, product] : current);
  }

  function clearAllFilters() {
    setSelectedVendors(new Set());
    setActiveFilters({});
    setSearchQuery('');
  }

  const filteredProducts = useMemo(
    () => filterProducts(catalog, activeCategory, selectedVendors, activeFilters, searchQuery),
    [catalog, activeCategory, selectedVendors, activeFilters, searchQuery],
  );

  return {
    activeCategory, setActiveCategory, selectedVendors, activeFilters, searchQuery, setSearchQuery,
    compareList, filteredProducts, toggleVendor, toggleFilterTag, toggleCompare, clearAllFilters,
    clearCompare: () => setCompareList([]),
  };
}
