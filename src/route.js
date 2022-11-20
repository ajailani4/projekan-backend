const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const { register, login } = require('./handler/user-handler');
const {
  getProjects,
  uploadProject,
  updateProject,
} = require('./handler/project-handler');

const prefix = '/api/v1';

const routes = [
  // Register
  {
    method: 'POST',
    path: `${prefix}/register`,
    options: { auth: false },
    handler: register,
  },
  // Login
  {
    method: 'POST',
    path: `${prefix}/login`,
    options: { auth: false },
    handler: login,
  },
  // Add a Project
  {
    method: 'POST',
    path: `${prefix}/projects`,
    options: {
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
    options: { auth: 'jwt' },
    handler: getProjects,
  },
  // Update a Project
  {
    method: 'PUT',
    path: `${prefix}/projects/{id}`,
    options: {
      auth: 'jwt',
      payload: {
        multipart: true,
      },
      validate: {
        params: Joi.object({
          id: Joi.objectId(),
        }),
      },
    },
    handler: updateProject,
  },
];

module.exports = routes;
