require('dotenv').config({ path: `${__dirname}/../config/.env` });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/userModel');

// DB_LOCAL should be set to a test database

describe('Test register route', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_LOCAL, {});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterEach(() => User.deleteMany({}));

  test('Should return 400 for empty values', async () => {
    const user = {};

    await request(app).post('/api/v1/auth/register').send(user).expect(400);
  });

  test('Should return 400 for empty password and email values', async () => {
    const user = {
      name: 'test',
    };

    await request(app).post('/api/v1/auth/register').send(user).expect(400);
  });

  test('Should return 400 for bad email value', async () => {
    const user = {
      name: 'test',
      email: 'test',
    };

    await request(app).post('/api/v1/auth/register').send(user).expect(400);
  });

  test('Should return 400 for empty password value', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
    };

    await request(app).post('/api/v1/auth/register').send(user).expect(400);
  });

  test('Should return 201 for user created', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app).post('/api/v1/auth/register').send(user).expect(201);
  });
});

describe('Test register route for duplicate emails', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_LOCAL, {});
  });
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('Should return 201 for user created', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app).post('/api/v1/auth/register').send(user).expect(201);
  });

  test('Should return 409 for duplicate email', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app).post('/api/v1/auth/register').send(user).expect(409);
  });
});

describe('Test forgot pasword endpoint', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_LOCAL, {});
  });
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('Should return 404 for user not found', async () => {
    const user = {
      email: 'test@test.com',
    };

    await request(app)
      .post('/api/v1/auth/forgot-password')
      .send(user)
      .expect(404);
  });

  test('Should return 201 for created user', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app).post('/api/v1/auth/register').send(user).expect(201);
  });

  test('Should return 200 for email sent to user', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: user.email })
      .expect(200);
  });
});
