# network-sizer

An independent, vendor-agnostic enterprise networking catalog built with React,
Vite, Tailwind CSS, and Lucide icons. No backend, account, API key, external font,
analytics service, or runtime data request is required.

## Run locally

Use Node.js 22.12+ (or a newer supported LTS release).

```powershell
npm ci
npm run dev
```

The development server binds to `127.0.0.1`. To deploy, run `npm run build` and
serve the resulting `dist` directory with an HTTPS static host. There is no
client-side router, so no SPA route rewrite is needed. `npm run preview` serves
the production build locally; it is not a production server.

```powershell
npm test
npm run lint
npm run build
```

## Run in GitHub Codespaces

Commit and push the project, including `.devcontainer/devcontainer.json` and
`package-lock.json`, to GitHub. On the repository page, choose **Code > Codespaces
> Create codespace on main** (or your working branch).

The container provides Node.js 22 and runs `npm ci` automatically during creation.
After setup finishes, run this command in the Codespaces terminal:

```sh
npm run dev:codespaces
```

Port **5173** is forwarded privately and opens in a browser when the server starts.
If it does not open automatically, use **Open in Browser** for port 5173 in the
**Ports** panel. Keep that terminal running while using the app; Ctrl+C stops it.
For an existing codespace, choose **Codespaces: Rebuild Container** from the
command palette after adding or changing the container configuration.

The Codespaces command binds Vite to `0.0.0.0` inside the container on a fixed
port; `npm run dev` remains localhost-only for local use. Vite permits the exact
forwarded hostname derived from `CODESPACE_NAME` and
`GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN`, rather than disabling host checks.

Codespaces is a development environment, not permanent production hosting.
The app stops when the server or codespace stops, and Codespaces usage may incur
charges. Keep the forwarded port private; deploy `dist` to a static host for a
permanent public site.

## Catalog and public sources

The JSON files in `src\data` contain 9 switches, 9 access points, and 7 firewalls.
Each product includes a direct public OEM `datasheet_url` and `spec_notes` that
explain power configuration, management/licensing, or performance measurement.
The catalog is a sourced selection, not an exhaustive product or lifecycle list.
No prices, estimated user capacities, or reseller performance claims are used.
The OEM URLs are external references, not runtime dependencies; vendors can
change their documents and availability.

| Products | Public OEM document |
| --- | --- |
| C9200L-24P-4X | [Catalyst 9200](https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-9200-series-switches/nb-06-cat9200-ser-data-sheet-cte-en.html), switch configuration and available PoE tables |
| C9300-48P, C9300-24UX | [Catalyst 9300](https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-9300-series-switches/nb-06-cat9300-ser-data-sheet-cte-en.html), model, uplink module, and available PoE tables |
| MS130-24P | [MS130](https://documentation.meraki.com/Switching/MS_-_Switches/Product_Information/Overviews_and_Datasheets/MS130_Datasheet), hardware breakdown |
| MS250-48FP | [MS250](https://documentation.meraki.com/Switching/MS_-_Switches/Product_Information/Overviews_and_Datasheets/MS250_Datasheet), throughput/capabilities and physical tables |
| CX 6200F JL725A | [CX 6200](https://www.hpe.com/psnow/doc/a00094640enw), 24G Class 4 PoE 4SFP+ 370W SKU |
| CX 6300M JL663A | [CX 6300](https://www.hpe.com/psnow/doc/a00148251enw), 48-port non-PoE SFP56 SKU |
| EX4100-48P | [EX4100](https://www.juniper.net/gb/en/products/switches/ex-series/ex4100-line-of-ethernet-switches-datasheet.html), Table 1 and Virtual Chassis description |
| DCS-7050SX3-48YC8 | [7050X3](https://www.arista.com/assets/data/pdf/Datasheets/7050X3-Datasheet.pdf), technical specifications |
| CW9166I, CW9166D1 | [CW9166](https://documentation.meraki.com/Wireless/Product_Information/Overviews_and_Datasheets/CW9166_Datasheet), specifications and power-mode tables |
| CW9176I, CW9176D1 | [CW9176](https://documentation.meraki.com/Wireless/Product_Information/Overviews_and_Datasheets/CW9176I_%2F%2F_CW9176D1_Datasheet), radio, power, and interface specifications |
| MR46 | [MR46](https://documentation.meraki.com/Wireless/Product_Information/Overviews_and_Datasheets/MR46_Datasheet), specifications |
| MR57 | [MR57](https://documentation.meraki.com/Wireless/Product_Information/Overviews_and_Datasheets/MR57_Datasheet), specifications |
| AP-635 | [630 Series](https://www.hpe.com/psnow/doc/a00114648enw), radio, Ethernet, and power specifications |
| AP-655 | [650 Series](https://www.hpe.com/psnow/doc/a00119145enw), radio, Ethernet, and power specifications |
| FortiAP 831F | [FortiAP](https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/fortiap-series.pdf), 831F specification table |
| Secure Firewall 1210CE | [Secure Firewall 1200](https://www.cisco.com/c/en/us/products/collateral/security/firewalls/secure-firewall-1200-series-ds.html), Tables 5 and 6 (FTD) |
| Secure Firewall 3110 | [Secure Firewall 3100](https://www.cisco.com/c/en/us/products/collateral/security/firewalls/secure-firewall-3100-series-ds.html), Tables 1 and 2 (FTD) |
| MX75 | [MX75](https://documentation.meraki.com/SASE_and_SD-WAN/MX/Product_Information/Overviews_and_Datasheets/MX75_Datasheet), interfaces and throughput/capabilities |
| MX95 | [MX95/105](https://documentation.meraki.com/SASE_and_SD-WAN/MX/Product_Information/Overviews_and_Datasheets/MX95%2F%2F105_Datasheet), MX95 column |
| PA-440 | [PA-400](https://www.paloaltonetworks.com/content/dam/pan/en_US/assets/pdf/datasheets/pa-400-series/pa-400-series.pdf), PAN-OS 12.1, Tables 1 and 3 |
| PA-1410 | [PA-1400](https://www.paloaltonetworks.com/content/dam/pan/en_US/assets/pdf/datasheets/pa-1400-series/pa-1400-series.pdf), PAN-OS 12.1, Tables 1 and 3 |
| FortiGate 71F | [FortiGate](https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/fortigate-70f-series.pdf), current 71F specification table |

Some HPE document endpoints time out or restrict automated retrieval. Their
specifications were cross-checked against publicly indexed OEM datasheet text;
their live document delivery was not verified from this environment.

Examples whose exact public OEM documents could not be confirmed are not filled
with guessed specifications: FortiSwitch 448E, FortiAP 431F, and FortiGate 100F
are not in this initial catalog. The current Fortinet 70F-series document
explicitly describes the **71F**; that entry is labeled 71F, not silently
substituted for a 70F. The 831F is likewise explicitly labeled, not a 431F.

## Data interpretation

- `spatial_streams` is the sum across client-serving radios, not a single-client
  capability. Scanning and BLE radios are excluded. `mimo` describes per-radio
  capability, including mixed-radio models.
- `max_phy_rate_gbps` preserves the OEM's advertised aggregate theoretical
  rate, including chipset-rate caveats. It is not application throughput.
- Hardware labels are not forced into inaccurate enums: AP-635 is 2x2:2, MR46 is
  dual-band, CW9176 has a 10G uplink, MS130-24P has 1G uplinks, and Arista has
  25G access ports. Built-in directional antennas are not called external.
- PoE budgets describe the PSU configuration in `spec_notes`. Optional uplink
  modules are labeled optional. Fixed switches with replaceable power supplies
  or uplink modules are not labeled modular line-card chassis.
- Firewall throughput is **not normalized** across vendors. FTD FW+AVC+IPS,
  Fortinet Threat Protection Enterprise Mix, and Palo Alto appmix use different
  test methods. Cisco FTD and ASA results are not mixed.
- `null` means an OEM figure is not published for the corresponding metric;
  it is not a placeholder or zero. Meraki NGFW **detection** is stored and shown
  separately from threat prevention. Recommended devices, sessions, and VPN
  users are not relabeled as recommended general users.
- `auto_vpn_support` means **Meraki cloud Auto-VPN**, not generic IPsec, Fortinet
  ADVPN, or another vendor's automated tunnel provisioning. SD-WAN availability
  depends on software, feature scope, and licensing.

Before adding or updating a product, verify the exact SKU in the public OEM
datasheet, document software/test/PSU assumptions, and update the source table.
Do not copy a neighboring SKU's specs or infer unpublished capacity.

## Filtering and comparison

Vendor and tag buttons are toggles. Empty vendor selection includes every vendor;
multiple vendors are ORed. Tags within a group are ORed and selected groups are
ANDed. Search is case-insensitive, trimmed, and matches model, series, or vendor.
Search applies to the active category.

Switch speed tags describe access ports, not uplinks. The 1G switch tag selects
the 1G-only access class, mGig selects multigigabit copper models, and 10G+
selects access models capable of at least 10G. Wireless Ethernet tags match
supported link speeds, so a 5G port that supports 2.5G matches both tags.
Firewall buckets are `<1`, `1 <= speed < 5`, and `>=5` Gbps, without overlapping
boundaries.

Changing category resets feature tags but retains vendors, search, and the
shortlist. Reset filters clears vendors, tags, and search, not category or
comparison. Comparison accepts up to four products across categories; selected
items can always be removed even when the shortlist is full. Unselected Compare
buttons are disabled at capacity with visible limit guidance and live status.
The comparison drawer is nonmodal, keyboard accessible, horizontally scrollable,
and collapses on Escape. Comparison state lasts for the current page session;
it is not stored in local storage.
