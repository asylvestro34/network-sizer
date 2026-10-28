import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('catalog experience', () => {
  it('searches live, handles no results, and resets filters', async () => {
    const user = userEvent.setup();
    render(<App />);
    const search = screen.getByRole('searchbox');
    await user.type(search, 'no-such-product');
    expect(screen.getByText('No matching products found')).toBeVisible();
    await user.click(screen.getAllByRole('button', { name: 'Reset filters', exact: true })[0]);
    expect(search).toHaveValue('');
    expect(screen.getAllByRole('article').length).toBeGreaterThanOrEqual(8);
    await user.type(search, 'C9300-48P');
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'C9300-48P' })).toBeVisible();
  });

  it('enforces comparison capacity and supports drawer remove, collapse and clear', async () => {
    const user = userEvent.setup();
    render(<App />);
    const cards = screen.getAllByRole('article');
    for (const card of cards.slice(0, 4)) {
      await user.click(within(card).getByRole('button', { name: /^Compare / }));
    }
    expect(within(cards[4]).getByRole('button', { name: /^Compare / })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Compare \(4\)/ })).toBeVisible();
    await user.click(screen.getByRole('button', { name: /Compare \(4\)/ }));
    const table = screen.getByRole('table');
    expect(table).toBeVisible();
    expect(within(table).getAllByRole('columnheader')).toHaveLength(5);
    expect(screen.getByText('Test methods differ between vendors', { exact: false })).toBeVisible();
    await user.click(within(table).getByRole('button', { name: 'Remove C9200L-24P-4X from comparison' }));
    expect(within(cards[4]).getByRole('button', { name: /^Compare / })).toBeEnabled();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Compare shortlist/ })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Clear all', exact: true }));
    expect(screen.getByRole('button', { name: /Compare \(0\)/ })).toBeVisible();
  });

  it('preserves selected products across categories and compares different schemas', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: 'Compare C9200L-24P-4X', exact: true }));
    await user.click(screen.getByRole('button', { name: /Wireless: Wi-Fi/ }));
    await user.click(screen.getByRole('button', { name: 'Compare CW9176I', exact: true }));
    await user.click(screen.getByRole('button', { name: /Security: Firewalls/ }));
    await user.click(screen.getByRole('button', { name: 'Compare PA-440', exact: true }));
    await user.click(screen.getByRole('button', { name: /Compare \(3\)/ }));
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader')).toHaveLength(4);
    expect(within(table).getByText('18 Gbps aggregate PHY')).toBeVisible();
    expect(within(table).getByText('1.2 Gbps', { exact: true })).toBeVisible();
    const links = within(table).getAllByRole('link', { name: 'OEM datasheet' });
    expect(links).toHaveLength(3);
    for (const link of links) expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('opens empty and single-item drawers without losing the remove action', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /Compare \(0\)/ }));
    expect(screen.getByRole('heading', { name: 'Build your shortlist.' })).toBeVisible();
    await user.keyboard('{Escape}');
    await user.click(screen.getByRole('button', { name: 'Compare C9300-48P', exact: true }));
    await user.click(screen.getByRole('button', { name: /Compare \(1\)/ }));
    expect(screen.getByRole('heading', { name: 'One more makes a comparison.' })).toBeVisible();
    const drawer = screen.getByRole('region', { name: 'Product comparison' });
    await user.click(within(drawer).getByRole('button', { name: 'Remove C9300-48P from comparison' }));
    expect(screen.getByRole('heading', { name: 'Build your shortlist.' })).toBeVisible();
  });
});
