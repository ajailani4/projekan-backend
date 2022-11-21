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
        projectId: ObjectID(projectId),
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

const updateTask = async (request, h) => {
  const { id } = request.params;
  const { ObjectID } = request.mongo;
  const { title, status } = request.payload;
  let response = '';

  try {
    // Check if task exists
    const task = await request.mongo.db.collection('tasks').findOne({ _id: ObjectID(id) });

    if (!task) {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'Task is not found',
      });

      response.code(404);

      return response;
    }

    await request.mongo.db.collection('tasks')
      .updateOne({ _id: ObjectID(id) }, {
        $set: {
          title,
          status,
        },
      });

    response = h.response({
      code: 200,
      status: 'OK',
      message: 'Task has been updated',
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

module.exports = { addTask, updateTask };
