import { RotateCcw, SlidersHorizontal } from 'lucide-react';
import { filterGroups } from '../data/filters';

export default function FilterPills({ activeCategory, activeFilters, toggleFilterTag, clearAllFilters }) {
  return (
    <section className="filter-panel glass-panel" aria-label={`${activeCategory} filters`}>
      <div className="filter-heading">
        <h2><SlidersHorizontal size={16} aria-hidden="true" /> Refine your shortlist</h2>
        <button className="text-button" onClick={clearAllFilters}><RotateCcw size={14} aria-hidden="true" /> Reset filters</button>
      </div>
      <div className="filter-matrix">
        {filterGroups[activeCategory].map(({ key, label, options }) => (
          <fieldset key={key} className="filter-group">
            <legend>{label}</legend>
            <div className="pill-row">
              {options.map(({ value, label: optionLabel }) => {
                const selected = activeFilters[key]?.includes(value) ?? false;
                return (
                  <button
                    key={String(value)}
                    className={`filter-pill ${selected ? 'selected' : ''}`}
                    aria-pressed={selected}
                    onClick={() => toggleFilterTag(key, value)}
                  >{optionLabel}</button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>
      <p className="filter-note">Match any tag within a group, and every selected group. Ethernet tags match supported link rates.</p>
    </section>
  );
}
