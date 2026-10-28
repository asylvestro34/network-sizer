import { useEffect, useRef } from 'react';
import { ArrowUpRight, ChevronDown, ChevronUp, Columns3, X } from 'lucide-react';
import { comparisonRows } from '../data/presentation';
import { MAX_COMPARE } from '../hooks/useFilterEngine';

export default function ComparisonDrawer({ compareList, toggleCompare, clearCompare, isOpen, setIsOpen }) {
  const toggleRef = useRef(null);
  const tableRegionRef = useRef(null);

  useEffect(() => {
    if (isOpen) tableRegionRef.current?.focus();
  }, [isOpen]);

  function collapse() {
    setIsOpen(false);
    toggleRef.current?.focus();
  }

  function removeProduct(product) {
    toggleCompare(product);
    tableRegionRef.current?.focus();
  }

  return (
    <section id="comparison-drawer" className={`comparison-drawer ${isOpen ? 'expanded' : ''}`} aria-label="Product comparison">
      <div className="page-shell">
        <div className="drawer-toolbar">
          <button
            ref={toggleRef}
            className="drawer-toggle"
            aria-expanded={isOpen}
            aria-controls="comparison-content"
            onClick={() => isOpen ? collapse() : setIsOpen(true)}
          >
            <Columns3 size={20} aria-hidden="true" />
            <span>Compare shortlist <span className="muted">{compareList.length} / {MAX_COMPARE}</span></span>
            {isOpen ? <ChevronDown size={18} aria-hidden="true" /> : <ChevronUp size={18} aria-hidden="true" />}
          </button>
          <span className="drawer-hint">{compareList.length === MAX_COMPARE ? 'Shortlist full. Remove one to add another.' : 'Select 2-4 products to compare'}</span>
          <button className="text-button" onClick={clearCompare} disabled={compareList.length === 0}>Clear all</button>
        </div>
        <div
          id="comparison-content"
          hidden={!isOpen}
          className="drawer-content"
          ref={tableRegionRef}
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              collapse();
            }
          }}
        >
          {compareList.length < 2 ? (
            <div className="comparison-empty">
              <h2>{compareList.length ? 'One more makes a comparison.' : 'Build your shortlist.'}</h2>
              <p>Add {compareList.length ? 'another product' : '2-4 products'} using the Compare buttons on the cards.</p>
              {compareList.map((product) => (
                <button key={product.id} className="filter-pill selected" onClick={() => removeProduct(product)} aria-label={`Remove ${product.model} from comparison`}>
                  {product.model} <X size={14} aria-hidden="true" />
                </button>
              ))}
            </div>
          ) : (
            <div className="comparison-scroll" tabIndex={0} role="region" aria-label="Scrollable specification comparison">
              <table className="comparison-table">
                <caption>OEM specifications. Test methods differ between vendors; throughput figures are not equivalent benchmarks.</caption>
                <thead>
                  <tr>
                    <th scope="col">Specification</th>
                    {compareList.map((product) => (
                      <th scope="col" key={product.id}>
                        <span className="series-label">{product.vendor}</span>
                        <strong>{product.model}</strong>
                        <button className="text-button" onClick={() => removeProduct(product)} aria-label={`Remove ${product.model} from comparison`}><X size={13} aria-hidden="true" /> Remove</button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map(([label, getValue]) => (
                    <tr key={label}>
                      <th scope="row">{label}</th>
                      {compareList.map((product) => <td key={product.id}>{getValue(product)}</td>)}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">Public datasheets</th>
                    {compareList.map((product) => (
                      <td key={product.id}><a className="datasheet-link" href={product.datasheet_url} target="_blank" rel="noopener noreferrer">OEM datasheet <ArrowUpRight size={14} aria-hidden="true" /></a></td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
