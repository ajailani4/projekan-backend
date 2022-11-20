const validateJwt = async (decoded, request, h) => {
  let isValidated = false;

  const user = await request.mongo.db.collection('users')
    .findOne({ username: decoded.username });

  if (user) {
    isValidated = true;
  }

  return { isValid: isValidated };
};

module.exports = { validateJwt };
