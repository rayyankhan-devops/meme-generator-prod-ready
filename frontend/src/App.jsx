import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Database, Sparkles, Share2, ExternalLink, Check, Image as ImageIcon, Flame } from 'lucide-react';

export default function App() {
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbSource, setDbSource] = useState('connecting');
  const [copied, setCopied] = useState(false);

  const fetchRandomMeme = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/meme/random');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result && result.data) {
        setMeme(result.data);
        setDbSource(result.source || 'database');
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err) {
      console.error('Failed to fetch meme:', err);
      setError('Could not connect to backend API. Make sure the Node server is running.');
      // Emergency Client Fallback
      setMeme({
        id: 0,
        title: 'Network Error Meme',
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        caption: 'Backend server is offline! Run `npm start` in the backend folder.',
        category: 'error'
      });
      setDbSource('offline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomMeme();
  }, [fetchRandomMeme]);

  // Spacebar hotkey to generate meme
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        fetchRandomMeme();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchRandomMeme]);

  const handleShare = () => {
    if (meme?.image_url) {
      navigator.clipboard.writeText(meme.image_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="app-container">
      {/* Background ambient glow */}
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {/* Header */}
      <header className="app-header">
        <div className="brand">
          <div className="logo-icon">
            <Flame className="icon" />
          </div>
          <div>
            <h1 className="brand-title">MemeVault</h1>
            <p className="brand-subtitle">Random Tech & Dev Meme Generator</p>
          </div>
        </div>

        {/* Database Status Badge */}
        <div className={`status-pill ${dbSource}`}>
          <Database className="status-icon" />
          <span>
            {dbSource === 'database' && 'MySQL Active'}
            {dbSource === 'fallback' && 'Offline / Pre-seeded'}
            {dbSource === 'offline' && 'Backend Disconnected'}
            {dbSource === 'connecting' && 'Connecting...'}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        <div className="meme-card-wrapper">
          <div className="meme-card">
            {/* Category tag */}
            {meme && (
              <div className="meme-meta-header">
                <span className="category-badge">
                  <Sparkles size={14} />
                  {meme.category || 'general'}
                </span>
                <span className="meme-id">#MEME-{meme.id}</span>
              </div>
            )}

            {/* Meme Display Container */}
            <div className="image-frame">
              {loading ? (
                <div className="skeleton-loader">
                  <RefreshCw className="spin-icon" size={36} />
                  <p>Fetching hilarious meme from MySQL...</p>
                </div>
              ) : meme ? (
                <div className="meme-viewport">
                  <img
                    src={meme.image_url}
                    alt={meme.title}
                    className="meme-image"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="meme-overlay">
                    <h2 className="overlay-caption">{meme.caption || meme.title}</h2>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Meme Info */}
            {meme && !loading && (
              <div className="meme-info">
                <h2 className="meme-title">{meme.title}</h2>
                <p className="meme-caption">{meme.caption}</p>
              </div>
            )}

            {/* Actions Bar */}
            <div className="card-actions">
              <button
                className="btn btn-primary"
                onClick={fetchRandomMeme}
                disabled={loading}
              >
                <RefreshCw className={loading ? 'spin-icon' : ''} size={20} />
                <span>{loading ? 'Rolling...' : 'Generate Random Meme'}</span>
              </button>

              <button
                className={`btn btn-secondary ${copied ? 'copied' : ''}`}
                onClick={handleShare}
                disabled={!meme || loading}
                title="Copy Image URL"
              >
                {copied ? <Check size={18} /> : <Share2 size={18} />}
                <span>{copied ? 'Copied URL!' : 'Share'}</span>
              </button>

              {meme?.image_url && (
                <a
                  href={meme.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-icon"
                  title="Open Original Image"
                >
                  <ExternalLink size={18} />
                </a>
              )}
            </div>

            <div className="hotkey-tip">
              Press <kbd>Spacebar</kbd> for next meme!
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Single Page React Frontend • Single API Node.js Backend • MySQL Database</p>
      </footer>
    </div>
  );
}
