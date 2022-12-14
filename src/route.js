const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const {
  register,
  login,
  getProfile,
} = require('./handler/user-handler');
const {
  getProjects,
  getProjectDetail,
  getProjectProgress,
  addProject,
  updateProject,
  deleteProject,
} = require('./handler/project-handler');
const {
  addTask,
  updateTask,
  deleteTask,
} = require('./handler/task-handler');

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
  // Get User
  {
    method: 'GET',
    path: `${prefix}/profile`,
    options: { auth: 'jwt' },
    handler: getProfile,
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
    handler: addProject,
  },
  // Get Projects
  {
    method: 'GET',
    path: `${prefix}/projects`,
    options: { auth: 'jwt' },
    handler: getProjects,
  },
  // Get Project Detail
  {
    method: 'GET',
    path: `${prefix}/projects/{id}`,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.objectId(),
        }),
      },
    },
    handler: getProjectDetail,
  },
  // Get Project Progress
  {
    method: 'GET',
    path: `${prefix}/project-progress/{id}`,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.objectId(),
        }),
      },
    },
    handler: getProjectProgress,
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
  // Delete a Project
  {
    method: 'DELETE',
    path: `${prefix}/projects/{id}`,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.objectId(),
        }),
      },
    },
    handler: deleteProject,
  },
  // Add a Task
  {
    method: 'POST',
    path: `${prefix}/tasks`,
    options: { auth: 'jwt' },
    handler: addTask,
  },
  // Update a Task
  {
    method: 'PUT',
    path: `${prefix}/tasks/{id}`,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.objectId(),
        }),
      },
    },
    handler: updateTask,
  },
  // Delete a Task
  {
    method: 'DELETE',
    path: `${prefix}/tasks/{id}`,
    options: {
      auth: 'jwt',
      validate: {
        params: Joi.object({
          id: Joi.objectId(),
        }),
      },
    },
    handler: deleteTask,
  },
];

module.exports = routes;
