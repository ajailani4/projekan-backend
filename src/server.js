const Hapi = require('@hapi/hapi');
const mongoDb = require('hapi-mongodb');
const dotenv = require('dotenv');
const hapiAuthJWT = require('hapi-auth-jwt2');
const routes = require('./route');
const { validateJwt } = require('./util/jwt-util');

const init = async () => {
  dotenv.config();

  const server = Hapi.server({
    port: process.env.PORT || 80,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Configure MongoDb
  await server.register({
    plugin: mongoDb,
    options: {
      url: process.env.MONGODB_URI,
      settings: {
        useUnifiedTopology: true,
      },
      decorate: true,
    },
  });

  // Configure auth using JWT
  await server.register(hapiAuthJWT);

  server.auth.strategy(
    'jwt',
    'jwt',
    {
      key: process.env.JWT_SECRET,
      validate: validateJwt,
      verifyOptions: { ignoreExpiration: true },
    },
  );

  // Setup routes
  server.route(routes);

  // Start the server
  await server.start();

  console.log(`Server running at: ${server.info.uri}`);
};

init();
