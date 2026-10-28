import { Cable, ShieldCheck, Wifi } from 'lucide-react';

const tabs = [
  { category: 'Switching', description: 'Layers 2 / 3', Icon: Cable },
  { category: 'Wireless', description: 'Wi-Fi 6 / 6E / 7', Icon: Wifi },
  { category: 'Security', description: 'Firewalls & SD-WAN', Icon: ShieldCheck },
];

export default function CategorySelector({ activeCategory, setActiveCategory, counts }) {
  return (
    <nav className="category-selector" aria-label="Product categories">
      {tabs.map(({ category, description, Icon }) => (
        <button
          key={category}
          className={`category-tab ${activeCategory === category ? 'active' : ''}`}
          aria-label={`${category}: ${description}`}
          aria-current={activeCategory === category ? 'page' : undefined}
          onClick={() => setActiveCategory(category)}
        >
          <Icon size={23} aria-hidden="true" />
          <span className="category-copy"><strong>{category}</strong><small>{description}</small></span>
          <span className="category-count">{counts[category]}</span>
        </button>
      ))}
    </nav>
  );
}
