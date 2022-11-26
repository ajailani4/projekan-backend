const { uploadIcon } = require('../util/cloudinary-util');

const getProjects = async (request, h) => {
  const { username } = request.auth.credentials;
  const { ObjectID } = request.mongo;
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
      data: await Promise.all(projects.map(async (project) => ({
        id: project._id,
        title: project.title,
        description: project.description,
        platform: project.platform,
        category: project.category,
        deadline: project.deadline,
        icon: project.icon,
        tasks: await request.mongo.db.collection('tasks')
          .find({ projectId: ObjectID(project._id) })
          .toArray(),
      }))),
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

const addProject = async (request, h) => {
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

const updateProject = async (request, h) => {
  const { id } = request.params;
  const { ObjectID } = request.mongo;
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
    // Check if project exists
    const project = await request.mongo.db.collection('projects').findOne({ _id: ObjectID(id) });

    if (!project) {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'Project is not found',
      });

      response.code(404);

      return response;
    }

    // Update the icon if icon is changed
    if (icon) {
      const uploadIconResult = await uploadIcon('projekan_project_icon', icon);
      icon = uploadIconResult.url;

      await request.mongo.db.collection('projects')
        .updateOne(
          { _id: ObjectID(id) },
          {
            $set: {
              username,
              title,
              description,
              platform,
              category,
              deadline,
              icon,
            },
          },
        );

      response = h.response({
        code: 200,
        status: 'OK',
        message: 'Project has been updated',
      });

      response.code(200);

      return response;
    }

    await request.mongo.db.collection('projects')
      .updateOne(
        { _id: ObjectID(id) },
        {
          $set: {
            username,
            title,
            description,
            platform,
            category,
            deadline,
          },
        },
      );

    response = h.response({
      code: 200,
      status: 'OK',
      message: 'Project has been updated',
    });

    response.code(200);

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

const deleteProject = async (request, h) => {
  const { id } = request.params;
  const { ObjectID } = request.mongo;
  let response = '';

  try {
    // Check if project exists
    const project = await request.mongo.db.collection('projects').findOne({ _id: ObjectID(id) });

    if (!project) {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'Project is not found',
      });

      response.code(404);

      return response;
    }

    const result = await request.mongo.db.collection('projects').deleteOne({ _id: ObjectID(id) });

    // Delete its tasks
    if (result.deletedCount === 1) {
      await request.mongo.db.collection('tasks').deleteMany({ projectId: ObjectID(id) });
    }

    response = h.response({
      code: 200,
      status: 'OK',
      message: 'Project has been deleted',
    });

    response.code(200);

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

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};
