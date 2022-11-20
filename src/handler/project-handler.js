const { uploadIcon } = require('../util/cloudinary-util');

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

module.exports = { uploadProject };
