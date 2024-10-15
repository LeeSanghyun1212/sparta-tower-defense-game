const users = [];

export const addUser = (user) => {
  users.push(user);
};

export const removeUser = (userId) => {
  const index = users.findIndex((user) => user.userId === userId);

  if (index != -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUsers = () => {
  return users;
};

export const getUser = (userId) => {
  const user = users.find((user) => user.userId === userId);
  return user;
};


