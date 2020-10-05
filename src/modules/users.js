exports.getUserByToken = (token) => {
  if (token) {
    return {
      email: 'test@test.com',
      name: 'John',
      orgaId: 'azerty',
    };
  }
  return null;
};
