import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';

describe('Backend API Test Suite', () => {
  it('GET /api/health - should return status ok with 200 HTTP code', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /api/meme/random - should return a valid random meme JSON object', async () => {
    const res = await request(app).get('/api/meme/random');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('title');
    expect(res.body.data).toHaveProperty('image_url');
    expect(typeof res.body.data.image_url).toBe('string');
  });

  it('GET /api/nonexistent - should return 404 for unknown endpoints', async () => {
    const res = await request(app).get('/api/nonexistent');
    expect(res.status).toBe(404);
  });
});
