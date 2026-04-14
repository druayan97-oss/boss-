import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

describe('App shell', () => {
  it('renders the branded shell and weekly route content', async () => {
    window.history.pushState({}, '', '/weekly');
    const { default: App } = await import('@/App');
    render(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '主导航' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '榜单' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: '猜 Boss' })).toHaveAttribute('href', '/play');
    expect(screen.getByText('Boss直评')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Prototype only' })).toBeInTheDocument();
  });
});
