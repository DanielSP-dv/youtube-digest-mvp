import { render, screen } from '@testing-library/react';
import RootLayout from './layout';

describe('RootLayout', () => {
  it('renders navigation links', () => {
    render(
      <RootLayout>
        <div />
      </RootLayout>
    );

    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Channels/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Playlists/i })).toBeInTheDocument();
  });
});
