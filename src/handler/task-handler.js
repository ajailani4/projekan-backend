const addTask = async (request, h) => {
  const { projectId, title } = request.payload;
  const { ObjectID } = request.mongo;
  let response = '';

  try {
    // Check if project exists
    const project = await request.mongo.db.collection('projects').findOne({ _id: ObjectID(projectId) });

    if (!project) {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'Project is not found',
      });

      response.code(404);

      return response;
    }

    await request.mongo.db.collection('tasks')
      .insertOne({
        projectId,
        title,
        status: 'UNDONE',
      });

    response = h.response({
      code: 201,
      status: 'Created',
      message: 'New task has been created',
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

module.exports = { addTask };
