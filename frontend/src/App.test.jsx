import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App.jsx';

describe('Frontend React Single Page Application Tests', () => {
  const mockMeme = {
    id: 101,
    title: 'Unit Test Meme',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    caption: 'Mocked API response caption for unit testing',
    category: 'testing'
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders branding header and application title', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, source: 'database', data: mockMeme })
      })
    );

    render(<App />);

    expect(screen.getByText('MemeVault')).toBeInTheDocument();
    expect(screen.getByText('Random Tech & Dev Meme Generator')).toBeInTheDocument();
  });

  it('fetches and displays meme data from backend API', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, source: 'database', data: mockMeme })
      })
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Unit Test Meme')).toBeInTheDocument();
      expect(screen.getAllByText('Mocked API response caption for unit testing').length).toBeGreaterThan(0);
    });
  });

  it('handles button click to trigger new random meme generation', async () => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, source: 'database', data: mockMeme })
      })
    );

    render(<App />);

    const generateBtn = await waitFor(() => 
      screen.getByRole('button', { name: /Generate Random Meme/i })
    );

    expect(generateBtn).toBeInTheDocument();

    fireEvent.click(generateBtn);

    expect(global.fetch).toHaveBeenCalledWith('/api/meme/random');
  });
});
