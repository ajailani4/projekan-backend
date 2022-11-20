const { uploadIcon } = require('../util/cloudinary-util');

const getProjects = async (request, h) => {
  const { username } = request.auth.credentials;
  let { page, size } = request.query;
  let response = '';

  try {
    page = Number(page) || 1;
    size = Number(size) || 10;

    const projects = await request.mongo.db.collection('projects')
      .find({ username })
      .skip((page - 1) * size)
      .limit(size)
      .toArray();

    response = h.response({
      code: 200,
      status: 'OK',
      data: projects,
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

const uploadProject = async (request, h) => {
  const {
    title,
    description,
    platform,
    category,
    deadline,
  } = request.payload;
  const { username } = request.auth.credentials;

  let { icon } = request.payload;
  let response = '';

  try {
    const uploadIconResult = await uploadIcon('projekan_project_icon', icon);
    icon = uploadIconResult.url;

    await request.mongo.db.collection('projects')
      .insertOne({
        username,
        title,
        description,
        platform,
        category,
        deadline,
        icon,
        tasks: [],
      });

    response = h.response({
      code: 201,
      status: 'Created',
      message: 'New project has been created',
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

module.exports = { getProjects, uploadProject };
