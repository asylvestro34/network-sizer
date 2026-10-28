import switches from './switches.json';
import wireless from './wireless.json';
import firewalls from './firewalls.json';

export const products = [...switches, ...wireless, ...firewalls];
export const categories = ['Switching', 'Wireless', 'Security'];
export const vendors = ['Cisco', 'Meraki', 'Aruba', 'Fortinet', 'Juniper', 'Arista', 'Palo Alto Networks'];
export const vendorColors = {
  Cisco: '#59c7f5',
  Meraki: '#73d68b',
  Aruba: '#ffac67',
  Fortinet: '#ff828e',
  Juniper: '#57d5cb',
  Arista: '#a5b4fc',
  'Palo Alto Networks': '#ffc177',
};
