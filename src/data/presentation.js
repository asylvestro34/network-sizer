export function keySpecs(product) {
  switch (product.category) {
    case 'Switching':
      return [
        `${product.ports}x ${product.port_speed}`,
        product.poe_budget_watts ? `${product.poe_budget_watts}W ${product.poe_support}` : 'Non-PoE',
        product.uplinks,
      ];
    case 'Wireless':
      return [product.wifi_standard, `${product.max_phy_rate_gbps} Gbps aggregate PHY`, product.uplink_eth_speed];
    case 'Security':
      return [
        `${product.firewall_throughput_gbps} Gbps firewall`,
        product.threat_prevention_throughput_gbps === null
          ? 'Prevention rate not published'
          : `${product.threat_prevention_throughput_gbps} Gbps threat prevention`,
        `${product.ipsec_vpn_throughput_gbps} Gbps IPsec`,
      ];
    default:
      throw new Error(`Unknown category: ${product.category}`);
  }
}

const gbps = (value) => value === null ? 'Not published' : `${value} Gbps`;

export const comparisonRows = [
  ['Vendor', (p) => p.vendor],
  ['Model', (p) => p.model],
  ['Category', (p) => p.category],
  ['Form factor', (p) => p.form_factor ?? 'Indoor access point'],
  ['Access ports / standard', (p) => p.category === 'Switching' ? `${p.ports}x ${p.port_speed}` : p.wifi_standard ?? p.ports_interfaces],
  ['Key speeds', (p) => p.category === 'Wireless' ? `${gbps(p.max_phy_rate_gbps)} aggregate PHY` : p.category === 'Switching' ? p.uplinks : `${gbps(p.firewall_throughput_gbps)} firewall`],
  ['PoE / power', (p) => p.category === 'Switching' ? `${p.poe_support}; ${p.poe_budget_watts}W budget` : p.poe_requirement ?? p.power_description ?? 'AC powered; see OEM power table'],
  ['Stacking', (p) => p.stacking ?? 'Not applicable'],
  ['Threat prevention', (p) => p.category === 'Security' ? gbps(p.threat_prevention_throughput_gbps) : 'Not applicable'],
  ['NGFW detection (not prevention)', (p) => p.category === 'Security' ? gbps(p.ngfw_detection_throughput_gbps ?? null) : 'Not applicable'],
  ['IPsec VPN', (p) => p.category === 'Security' ? gbps(p.ipsec_vpn_throughput_gbps) : 'Not applicable'],
  ['Recommended users', (p) => p.category === 'Security' ? p.max_recommended_users ?? 'Not published (devices are not users)' : 'Not applicable'],
  ['Recommended devices (not users)', (p) => p.category === 'Security' ? p.recommended_devices ?? 'Not published' : 'Not applicable'],
  ['MIMO / spatial streams', (p) => p.category === 'Wireless' ? `${p.mimo}; ${p.spatial_streams} total client-serving streams` : 'Not applicable'],
  ['Radios / antennas', (p) => p.category === 'Wireless' ? `${p.radios}; ${p.antenna_type}` : 'Not applicable'],
  ['Ethernet uplink', (p) => p.uplink_eth_speed ?? p.uplinks ?? 'See interfaces'],
  ['SD-WAN / cloud Auto-VPN', (p) => p.category === 'Security' ? `${p.sdwan_capable ? 'SD-WAN capable' : 'No SD-WAN'} / ${p.auto_vpn_support ? 'Cloud Auto-VPN' : 'No Meraki Auto-VPN'}` : 'Not applicable'],
  ['Management', (p) => p.management.join(', ')],
  ['Measurement / configuration notes', (p) => p.spec_notes],
];
