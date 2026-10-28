const option = (value, label = value) => ({ value, label });
const group = (key, label, options) => ({ key, label, options });

export const filterGroups = {
  Switching: [
    group('ports', 'Access ports', [option(8, '8 ports'), option(24, '24 ports'), option(48, '48 ports')]),
    group('speed', 'Port speed', [option('1g', '1G'), option('mgig', 'mGig'), option('10g', '10G+')]),
    group('poe', 'Power', [option('plus', 'PoE+'), option('bt', 'UPOE / bt'), option('none', 'Non-PoE')]),
    group('management', 'Management', [
      option('Cloud-Managed', 'Cloud'), option('On-Premises', 'On-prem'), option('CLI'),
    ]),
  ],
  Wireless: [
    group('wifi_standard', 'Wi-Fi standard', [
      option('Wi-Fi 6'), option('Wi-Fi 6E'), option('Wi-Fi 7'),
    ]),
    group('antenna', 'Antennas', [option('omni', 'Omni'), option('directional', 'Directional')]),
    group('uplink', 'Ethernet capability', [
      option(1, '1G'), option(2.5, '2.5G mGig'), option(5, '5G mGig'), option(10, '10G'),
    ]),
    group('management', 'Management', [option('Cloud-Managed', 'Cloud'), option('Controller-Based', 'Controller')]),
  ],
  Security: [
    group('throughput', 'Firewall throughput', [
      option('under1', '<1G'), option('1to5', '1-5G'), option('5plus', '5G+'),
    ]),
    group('sdwan_capable', 'WAN capabilities', [option(true, 'SD-WAN')]),
    group('auto_vpn_support', 'Cloud VPN', [option(true, 'Cloud Auto-VPN')]),
  ],
};

export function matchesFilter(product, key, value) {
  switch (key) {
    case 'speed':
      return value === '1g' ? product.port_speed === '1G'
        : value === 'mgig' ? product.port_speed.includes('mGig')
          : product.access_port_max_speed_gbps >= 10;
    case 'poe':
      return value === 'none' ? product.poe_budget_watts === 0
        : value === 'plus' ? product.poe_support === 'PoE+ (30W)'
          : /UPOE|802\.3bt/.test(product.poe_support);
    case 'management':
      return product.management.includes(value);
    case 'antenna':
      return product.antenna_type.toLowerCase().includes(value);
    case 'uplink':
      return product.uplink_supported_speeds_gbps.includes(value);
    case 'throughput': {
      const speed = product.firewall_throughput_gbps;
      return value === 'under1' ? speed < 1 : value === '1to5' ? speed >= 1 && speed < 5 : speed >= 5;
    }
    default:
      return product[key] === value;
  }
}

export function filterProducts(catalog, category, vendors, filters, query) {
  const search = query.trim().toLocaleLowerCase();
  return catalog.filter((product) =>
    product.category === category
    && (vendors.size === 0 || vendors.has(product.vendor))
    && (!search || [product.model, product.series, product.vendor].some((text) =>
      text.toLocaleLowerCase().includes(search)))
    && Object.entries(filters).every(([key, values]) =>
      values.length === 0 || values.some((value) => matchesFilter(product, key, value))),
  );
}
