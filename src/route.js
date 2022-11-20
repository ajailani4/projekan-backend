const { register, login } = require('./handler/user-handler');
const { uploadProject, getProjects } = require('./handler/project-handler');

const prefix = '/api/v1';

const routes = [
  // Register
  {
    method: 'POST',
    path: `${prefix}/register`,
    config: { auth: false },
    handler: register,
  },
  // Login
  {
    method: 'POST',
    path: `${prefix}/login`,
    config: { auth: false },
    handler: login,
  },
  // Add a Project
  {
    method: 'POST',
    path: `${prefix}/projects`,
    config: {
      auth: 'jwt',
      payload: {
        multipart: true,
      },
    },
    handler: uploadProject,
  },
  // Get Projects
  {
    method: 'GET',
    path: `${prefix}/projects`,
    config: { auth: 'jwt' },
    handler: getProjects,
  },
];

module.exports = routes;
