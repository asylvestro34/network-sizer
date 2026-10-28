import { ArrowDownUp, Network, Search, X } from 'lucide-react';
import { vendorColors, vendors } from '../data/catalog';

export default function Navbar({ searchQuery, setSearchQuery, selectedVendors, toggleVendor, compareCount, openComparison }) {
  return (
    <header className="navbar">
      <div className="page-shell">
        <div className="nav-main">
          <a href="#main" className="brand" aria-label="network-sizer home">
            <span className="brand-icon"><Network size={23} aria-hidden="true" /></span>
            <span>network<span className="text-accent">-</span>sizer<span className="brand-dot">.</span></span>
          </a>
          <div className="search-field">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search model, series, or vendor"
              placeholder="Search a model, series, or vendor..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            {searchQuery && <button className="icon-button" onClick={() => setSearchQuery('')} aria-label="Clear search"><X size={16} /></button>}
          </div>
          <button className="button compare-nav" onClick={openComparison} aria-controls="comparison-drawer">
            <ArrowDownUp size={16} aria-hidden="true" /> Compare <span className="count-badge">({compareCount})</span>
          </button>
        </div>
        <div className="vendor-bar" role="group" aria-label="Filter by vendor">
          <span className="eyebrow vendor-label">Vendors</span>
          {vendors.map((vendor) => (
            <button
              className={`vendor-pill ${selectedVendors.has(vendor) ? 'selected' : ''}`}
              key={vendor}
              aria-pressed={selectedVendors.has(vendor)}
              onClick={() => toggleVendor(vendor)}
            >
              <span className="vendor-dot" style={{ backgroundColor: vendorColors[vendor] }} aria-hidden="true" />
              {vendor}
            </button>
          ))}
          <span className="vendor-hint">Empty selection = all vendors</span>
        </div>
      </div>
    </header>
  );
}
