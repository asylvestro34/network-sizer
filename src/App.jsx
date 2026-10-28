import { useState } from 'react';
import { ArrowUpRight, BookOpen, CheckCircle2 } from 'lucide-react';
import Navbar from './components/Navbar';
import CategorySelector from './components/CategorySelector';
import FilterPills from './components/FilterPills';
import ProductGrid from './components/ProductGrid';
import ComparisonDrawer from './components/ComparisonDrawer';
import useFilterEngine from './hooks/useFilterEngine';
import { categories, products } from './data/catalog';

const counts = Object.fromEntries(categories.map((category) => [category, products.filter((p) => p.category === category).length]));

export default function App() {
  const engine = useFilterEngine();
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const filterCount = engine.selectedVendors.size
    + Object.values(engine.activeFilters).reduce((sum, values) => sum + values.length, 0)
    + Number(Boolean(engine.searchQuery.trim()));

  return (
    <>
      <a className="skip-link" href="#main">Skip to products</a>
      <Navbar {...engine} compareCount={engine.compareList.length} openComparison={() => setComparisonOpen(true)} />
      <main id="main" className="page-shell main-content">
        <section className="hero">
          <div>
            <span className="hero-kicker"><span className="live-dot" /> OPEN CATALOG. CLEARER CHOICES.</span>
            <h1>The right fit.<br /><span>Your network. Your choice.</span></h1>
            <p>Find the hardware that fits your next deployment. Explore, filter, and compare enterprise networking &mdash; without the vendor bias.</p>
          </div>
          <aside className="source-card glass-panel">
            <BookOpen size={23} aria-hidden="true" />
            <strong>Specs, not sales pitches.</strong>
            <p>{products.length} real products. Public OEM datasheets. No partner rankings or sponsored results.</p>
            <a href="#catalog-notes">How to read this catalog <ArrowUpRight size={14} aria-hidden="true" /></a>
          </aside>
        </section>
        <CategorySelector activeCategory={engine.activeCategory} setActiveCategory={engine.setActiveCategory} counts={counts} />
        <FilterPills {...engine} />
        <section aria-label={`${engine.activeCategory} products`}>
          <div className="results-heading">
            <h2>{engine.activeCategory === 'Security' ? 'Security & firewalls' : engine.activeCategory} <span className="results-count">{engine.filteredProducts.length}</span></h2>
            <span className="result-status" role="status" aria-live="polite">
              {engine.filteredProducts.length} of {counts[engine.activeCategory]} products{filterCount ? ` / ${filterCount} active filters` : ' / All vendors'}
            </span>
          </div>
          <p className="sr-only" role="status" aria-live="polite">{engine.compareList.length} products selected for comparison.{engine.compareList.length === 4 ? ' Comparison limit reached. Remove a product before adding another.' : ''}</p>
          <ProductGrid products={engine.filteredProducts} {...engine} />
        </section>
        <footer id="catalog-notes" className="catalog-footer">
          <p><CheckCircle2 size={16} aria-hidden="true" /> Public sources. Independent comparisons.</p>
          <p>Catalog reviewed October 28, 2026. Specifications depend on software, licensing, power supply, and regional availability. PHY rates are theoretical aggregate rates, not client throughput. Firewall test methods differ; always consult the linked OEM datasheets before sizing a deployment.</p>
          <p>Vendor names are their owners&apos; trademarks. No affiliation or endorsement. This catalog is not a replacement for a capacity assessment.</p>
        </footer>
      </main>
      <ComparisonDrawer {...engine} isOpen={comparisonOpen} setIsOpen={setComparisonOpen} />
    </>
  );
}
