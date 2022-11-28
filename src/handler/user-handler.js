const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateJwt } = require('../util/jwt-util');

const saltRounds = 10;

const register = async (request, h) => {
  const {
    username,
    password,
    name,
    email,
  } = request.payload;
  let response = '';

  try {
    // Check if already exists
    const user = await request.mongo.db.collection('users').findOne({ username });

    if (user) {
      response = h.response({
        code: 409,
        status: 'Conflict',
        message: 'Username already exists. Try another username',
      });

      response.code(409);

      return response;
    }

    // Insert a new user
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await request.mongo.db.collection('users')
      .insertOne({
        username,
        password: hashedPassword,
        name,
        email,
      });

    response = h.response({
      code: 201,
      status: 'Created',
      data: {
        username,
        accessToken: generateJwt(jwt, username),
      },
    });

    response.code(201);

    return response;
  } catch (e) {
    response = h.response({
      code: 400,
      status: 'Bad Request',
      message: 'error',
    });

    response.code(400);
  }

  return response;
};

const login = async (request, h) => {
  const { username, password } = request.payload;
  let response = '';

  try {
    const user = await request.mongo.db.collection('users').findOne({ username });

    if (user) {
      const hashedPassword = user.password;

      if (await bcrypt.compare(password, hashedPassword)) {
        response = h.response({
          code: 200,
          status: 'OK',
          data: {
            username,
            accessToken: generateJwt(jwt, username),
          },
        });

        response.code(200);

        return response;
      }
    }

    response = h.response({
      code: 401,
      status: 'Unauthorized',
      message: 'Username or password is incorrect',
    });

    response.code(401);

    return response;
  } catch (e) {
    response = h.response({
      code: 400,
      status: 'Bad Request',
      message: 'error',
    });

    response.code(400);
  }

  return response;
};

const getProfile = async (request, h) => {
  const { username } = request.auth.credentials;
  let response = '';

  try {
    const user = await request.mongo.db.collection('users').findOne({ username });

    if (!user) {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'User is not found',
      });

      response.code(404);

      return response;
    }

    response = h.response({
      code: 200,
      status: 'OK',
      data: {
        username: user.username,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    response = h.response({
      code: 400,
      status: 'Bad Request',
      message: 'error',
    });

    response.code(400);
  }

  return response;
};

module.exports = {
  register,
  login,
  getProfile,
};
