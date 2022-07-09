const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('../lib/services/github');

describe('backend-express-template routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  it('should redirect to the github oauth page when logging in', async () => {
    const res = await request(app).get('/api/v1/github/login');
    expect(res.header.location).toMatch(
      /https:\/\/github.com\/login\/oauth\/authorize\?client_id=[\w\d]+&scope=user&redirect_uri=http:\/\/localhost:7890\/api\/v1\/github\/callback/i
    );
  });
  it('should login a user and redirect to /api/v1/github/posts', async () => {
    const res = await request
      .agent(app)
      .get('/api/v1/github/callback?code=42')
      .redirects(1);

    expect(res.body).toEqual({
      id: expect.any(String),
      username: 'mock_github_user',
      avatar: 'https://www.placecage.com/gif/300/300',
      email: 'mock-me@aol.com',
      iat: expect.any(Number),
      exp: expect.any(Number)
    });
  });
  afterAll(() => {
    pool.end();
  });
});
