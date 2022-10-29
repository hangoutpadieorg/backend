require('dotenv').config({ path: `${__dirname}/../config/.env` });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/userModel');

// DB_LOCAL should be set to a test database

describe('Test user register route', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_LOCAL, {});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterEach(() => User.deleteMany({}));

  test('Should return 400 for empty values', async () => {
    const user = {};

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(400);
  });

  test('Should return 400 for empty password and email values', async () => {
    const user = {
      name: 'test',
    };

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(400);
  });

  test('Should return 400 for bad email value', async () => {
    const user = {
      name: 'test',
      email: 'test',
    };

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(400);
  });

  test('Should return 400 for empty password value', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
    };

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(400);
  });

  test('Should return 201 for user created', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(201);
  });
});

describe('Test vendor register route', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_LOCAL, {});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterEach(() => User.deleteMany({}));

  test('Should return 201 for vendor created', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app)
      .post('/api/v1/auth/vendors/register')
      .send(user)
      .expect(201);
  });
});

describe('Test admin register route', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_LOCAL, {});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterEach(() => User.deleteMany({}));

  test('Should return 201 for admin created', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    const response = await request(app)
      .post('/api/v1/auth/users/register')
      .send(user);
    expect(response.body.user.role).toBe('admin');
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

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(201);
  });

  test('Should return 409 for duplicate email', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(409);
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

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(201);
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

describe('Test reset endpoint', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_LOCAL, {});
  });
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('Should return 201 for created user for reset-password endpoint', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(201);
  });

  test('Should return 200 for password reset', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    const response = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: user.email });

    const url = `/api/v1/auth/reset-password/${user.email}/${response.body.token}`;

    await request(app).patch(url).send({ password: 'testing123' }).expect(200);
  });
});

describe('Test change-password endpoint', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_LOCAL, {});
  });
  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test('Should return 201 for created user for registration endpoint', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    await request(app)
      .post('/api/v1/auth/users/register')
      .send(user)
      .expect(201);
  });

  test('Should return 200 for changed password', async () => {
    const user = {
      name: 'test',
      email: 'test@test.com',
      password: 'test123465',
    };

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(user)
      .expect(200);

    const userObj = {
      oldPassword: 'test123465',
      newPassword: 'testingnewpassword',
    };

    await request(app)
      .patch('/api/v1/auth/login')
      .send(userObj)
      .set('Authorization', `Bearer ${response.body.accessToken}`)
      .expect(200);
  });
});
