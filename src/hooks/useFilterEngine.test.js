import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { products } from '../data/catalog';
import useFilterEngine from './useFilterEngine';

describe('useFilterEngine', () => {
  it('toggles vendors immutably and deselects back to all', () => {
    const { result } = renderHook(() => useFilterEngine());
    const original = result.current.selectedVendors;
    act(() => result.current.toggleVendor('Cisco'));
    expect(original.size).toBe(0);
    expect(result.current.selectedVendors.has('Cisco')).toBe(true);
    expect(result.current.filteredProducts.every((p) => p.vendor === 'Cisco')).toBe(true);
    act(() => result.current.toggleVendor('Cisco'));
    expect(result.current.selectedVendors.size).toBe(0);
  });

  it('toggles feature values and deletes empty filter groups', () => {
    const { result } = renderHook(() => useFilterEngine());
    act(() => {
      result.current.toggleFilterTag('ports', 24);
      result.current.toggleFilterTag('ports', 48);
    });
    expect(result.current.activeFilters).toEqual({ ports: [24, 48] });
    act(() => result.current.toggleFilterTag('ports', 24));
    expect(result.current.activeFilters).toEqual({ ports: [48] });
    act(() => result.current.toggleFilterTag('ports', 48));
    expect(result.current.activeFilters).toEqual({});
  });

  it('resets category-specific tags but preserves search, vendors and comparisons', () => {
    const { result } = renderHook(() => useFilterEngine());
    act(() => {
      result.current.toggleFilterTag('ports', 48);
      result.current.toggleVendor('Cisco');
      result.current.setSearchQuery('Cisco');
      result.current.toggleCompare(products[0]);
    });
    act(() => result.current.setActiveCategory('Wireless'));
    expect(result.current.activeFilters).toEqual({});
    expect(result.current.searchQuery).toBe('Cisco');
    expect(result.current.selectedVendors.has('Cisco')).toBe(true);
    expect(result.current.compareList).toHaveLength(1);
    expect(result.current.filteredProducts.every((p) => p.category === 'Wireless')).toBe(true);
  });

  it('keeps filters when reselecting the current category and rejects invalid categories/tags', () => {
    const { result } = renderHook(() => useFilterEngine());
    act(() => result.current.toggleFilterTag('ports', 24));
    act(() => result.current.setActiveCategory('Switching'));
    expect(result.current.activeFilters).toEqual({ ports: [24] });
    expect(() => result.current.setActiveCategory('Unknown')).toThrow('Unknown category');
    expect(() => result.current.toggleFilterTag('wifi_standard', 'Wi-Fi 7')).toThrow('Unsupported filter');
  });

  it('caps batched comparison additions at four, deduplicates, removes and clears', () => {
    const { result } = renderHook(() => useFilterEngine());
    act(() => products.slice(0, 6).forEach((p) => result.current.toggleCompare(p)));
    expect(result.current.compareList).toEqual(products.slice(0, 4));
    act(() => result.current.toggleCompare({ ...products[0] }));
    expect(result.current.compareList).toEqual(products.slice(1, 4));
    act(() => result.current.toggleCompare(products[5]));
    expect(result.current.compareList).toHaveLength(4);
    expect(new Set(result.current.compareList.map((p) => p.id)).size).toBe(4);
    act(() => result.current.clearCompare());
    expect(result.current.compareList).toEqual([]);
  });

  it('resets filters and search without changing category or shortlist', () => {
    const { result } = renderHook(() => useFilterEngine());
    act(() => result.current.setActiveCategory('Security'));
    act(() => {
      result.current.toggleFilterTag('auto_vpn_support', true);
      result.current.toggleVendor('Meraki');
      result.current.setSearchQuery('MX');
      result.current.toggleCompare(products[0]);
    });
    act(() => result.current.clearAllFilters());
    expect(result.current.activeCategory).toBe('Security');
    expect(result.current.activeFilters).toEqual({});
    expect(result.current.selectedVendors.size).toBe(0);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.compareList).toHaveLength(1);
    expect(result.current.filteredProducts.filter((p) => p.vendor !== 'Meraki').length).toBeGreaterThan(0);
  });
});
