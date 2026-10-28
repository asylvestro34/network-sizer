import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { vendorColors } from '../data/catalog';
import { keySpecs } from '../data/presentation';

export default function ProductCard({ product, isCompared, compareFull, toggleCompare }) {
  return (
    <article className={`product-card glass-panel ${isCompared ? 'is-compared' : ''}`} aria-label={product.model}>
      <div className="card-top">
        <span className="vendor-badge" style={{ color: vendorColors[product.vendor] }}>
          <span className="vendor-dot" style={{ backgroundColor: 'currentColor' }} aria-hidden="true" />
          {product.vendor}
        </span>
        <span className="card-category">{product.category}</span>
      </div>
      <p className="series-label">{product.series}</p>
      <h3>{product.model}</h3>
      <ul className="spec-tags" aria-label="Key specifications">
        {keySpecs(product).map((spec) => <li key={spec}>{spec}</li>)}
      </ul>
      <div className="management-pills" aria-label="Management options">
        {product.management.map((mode) => <span key={mode}>{mode}</span>)}
      </div>
      <details className="spec-details">
        <summary>Source & configuration notes</summary>
        <p>{product.spec_notes}</p>
        {product.additional_sources?.map((url, index) => (
          <a key={url} href={url} target="_blank" rel="noopener noreferrer">OEM supporting source {index + 1} <ArrowUpRight size={12} aria-hidden="true" /></a>
        ))}
      </details>
      <div className="card-actions">
        <a className="datasheet-link" href={product.datasheet_url} target="_blank" rel="noopener noreferrer" aria-label={`${product.model} public datasheet (opens in a new tab)`}>
          Datasheet <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <button
          className={`button compare-button ${isCompared ? 'selected' : ''}`}
          aria-pressed={isCompared}
          aria-label={`${isCompared ? 'Remove' : 'Compare'} ${product.model}${isCompared ? ' from comparison' : ''}`}
          disabled={!isCompared && compareFull}
          title={!isCompared && compareFull ? 'Four products selected. Remove one to add another.' : undefined}
          onClick={() => toggleCompare(product)}
        >
          {isCompared ? <Check size={15} aria-hidden="true" /> : <Plus size={15} aria-hidden="true" />}
          {isCompared ? 'Added' : 'Compare'}
        </button>
      </div>
    </article>
  );
}
