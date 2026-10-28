import { describe, expect, it } from 'vitest';
import { categories, products, vendors } from './catalog';
import { filterGroups, filterProducts, matchesFilter } from './filters';
import { comparisonRows, keySpecs } from './presentation';

const byId = (id) => products.find((p) => p.id === id);
const filter = (category, filters = {}, query = '', vendors = new Set()) =>
  filterProducts(products, category, vendors, filters, query);

describe('OEM catalog integrity', () => {
  it('has unique IDs and the required category counts', () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(filter('Switching').length).toBeGreaterThanOrEqual(8);
    expect(filter('Wireless').length).toBeGreaterThanOrEqual(6);
    expect(filter('Security').length).toBeGreaterThanOrEqual(6);
  });

  it.each(products)('$model has complete sourced fields and renders every comparison row', (p) => {
    expect(categories).toContain(p.category);
    expect(vendors).toContain(p.vendor);
    expect(p.model.length).toBeGreaterThan(0);
    expect(p.series.length).toBeGreaterThan(0);
    expect(p.spec_notes.length).toBeGreaterThan(60);
    expect(p.management.length).toBeGreaterThan(0);
    const url = new URL(p.datasheet_url);
    expect(url.protocol).toBe('https:');
    expect(['www.cisco.com', 'documentation.meraki.com', 'www.hpe.com', 'www.juniper.net', 'www.arista.com', 'www.fortinet.com', 'www.paloaltonetworks.com']).toContain(url.hostname);
    expect(keySpecs(p)).toHaveLength(3);
    for (const [, getValue] of comparisonRows) {
      expect(getValue(p)).not.toBeUndefined();
      expect(getValue(p)).not.toBeNull();
    }
    if (p.category === 'Switching') {
      expect([8, 24, 48]).toContain(p.ports);
      expect(p.access_port_max_speed_gbps).toBeGreaterThan(0);
      expect(p.poe_budget_watts).toBeGreaterThanOrEqual(0);
      expect(p.form_factor).toMatch(/1RU Fixed|Modular/);
      expect(p.stacking).toBeTruthy();
      expect(p.uplinks).toBeTruthy();
    } else if (p.category === 'Wireless') {
      expect(['Wi-Fi 6', 'Wi-Fi 6E', 'Wi-Fi 7']).toContain(p.wifi_standard);
      expect(p.spatial_streams).toBeGreaterThan(0);
      expect(p.max_phy_rate_gbps).toBeGreaterThan(0);
      expect(p.uplink_supported_speeds_gbps.length).toBeGreaterThan(0);
      expect(p.radios).toBeTruthy();
      expect(p.antenna_type).toBeTruthy();
      expect(p.poe_requirement).toBeTruthy();
    } else {
      expect(p.firewall_throughput_gbps).toBeGreaterThan(0);
      expect(p.threat_prevention_throughput_gbps === null || p.threat_prevention_throughput_gbps > 0).toBe(true);
      expect(p.ipsec_vpn_throughput_gbps).toBeGreaterThan(0);
      expect(p.max_recommended_users === null || Number.isInteger(p.max_recommended_users)).toBe(true);
      expect(typeof p.auto_vpn_support).toBe('boolean');
      expect(typeof p.sdwan_capable).toBe('boolean');
      expect(p.ports_interfaces).toBeTruthy();
    }
  });

  it('does not fabricate incompatible hardware or benchmark equivalence', () => {
    expect(byId('meraki-ms130-24p').uplinks).toBe('4x 1G SFP');
    expect(byId('aruba-ap635').mimo).toBe('2x2:2');
    expect(byId('meraki-mr46').radios).toBe('Dual-Band 2.4/5 GHz');
    expect(byId('cisco-c9300-24ux').poe_budget_watts).toBe(560);
    expect(byId('meraki-mx75').threat_prevention_throughput_gbps).toBeNull();
    expect(byId('meraki-mx75').max_recommended_users).toBeNull();
    expect(byId('meraki-mx75').recommended_devices).toBe(200);
  });
});

describe('filter semantics', () => {
  it('matches vendor selections with OR and an empty set as all vendors', () => {
    const filtered = filter('Switching', {}, '', new Set(['Cisco', 'Meraki']));
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((p) => ['Cisco', 'Meraki'].includes(p.vendor))).toBe(true);
    expect(filter('Switching').length).toBeGreaterThan(filtered.length);
  });

  it('uses OR within a group and AND across groups', () => {
    const filtered = filter('Switching', { ports: [24, 48], poe: ['plus'], management: ['Cloud-Managed'] });
    expect(filtered.length).toBeGreaterThan(1);
    expect(filtered.every((p) => [24, 48].includes(p.ports) && p.poe_support === 'PoE+ (30W)' && p.management.includes('Cloud-Managed'))).toBe(true);
    expect(filter('Switching', { ports: [8] })).toHaveLength(0);
  });

  it.each(['  C9300-48p  ', '  CATALYST 9300 ', ' cisco '])('matches normalized model, series, and vendor search: %s', (query) => {
    expect(filter('Switching', {}, query)).toContainEqual(byId('cisco-c9300-48p'));
  });

  it('matches arrays, booleans, and exact numeric tags', () => {
    expect(filter('Security', { auto_vpn_support: [true] }).map((p) => p.vendor)).toEqual(['Meraki', 'Meraki']);
    expect(filter('Wireless', { management: ['Controller-Based'] }).some((p) => p.vendor === 'Meraki')).toBe(false);
    expect(filter('Switching', { ports: [24] }).every((p) => p.ports === 24)).toBe(true);
  });

  it('handles mGig, 10G+, power and directional aliases without string equality hacks', () => {
    expect(filter('Switching', { speed: ['mgig'] })).toContainEqual(byId('cisco-c9300-24ux'));
    expect(filter('Switching', { speed: ['10g'] })).toContainEqual(byId('arista-7050sx3-48yc8'));
    expect(filter('Switching', { poe: ['bt'] })).toContainEqual(byId('cisco-c9300-24ux'));
    expect(filter('Wireless', { antenna: ['directional'] }).map((p) => p.id)).toEqual(['cisco-cw9166d1', 'cisco-cw9176d1']);
    expect(filter('Wireless', { uplink: [2.5] })).toContainEqual(byId('meraki-mr57'));
    expect(filter('Wireless', { uplink: [10] }).map((p) => p.model)).toEqual(['CW9176I', 'CW9176D1']);
  });

  it.each([
    [0.999, 'under1'], [1, '1to5'], [4.999, '1to5'], [5, '5plus'], [10, '5plus'],
  ])('puts %s Gbps into exactly one throughput bucket', (speed, bucket) => {
    const p = { firewall_throughput_gbps: speed };
    const matching = ['under1', '1to5', '5plus'].filter((value) => matchesFilter(p, 'throughput', value));
    expect(matching).toEqual([bucket]);
  });

  it('evaluates every configured tag against its entire category without exceptions', () => {
    for (const category of categories) {
      for (const group of filterGroups[category]) {
        for (const { value } of group.options) {
          expect(() => filter(category, { [group.key]: [value] })).not.toThrow();
        }
      }
    }
  });
});
