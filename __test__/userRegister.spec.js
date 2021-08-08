const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const User = require('../src/model/User');

beforeAll(() => {
  // run before each test suit
  return sequelize.sync();
});
beforeEach(() => {
  // cleaning the user table before each test
  return User.destroy({ truncate: true });
});

describe('User registration', () => {
  // function to call post api to users
  const postValidUser = () => {
    return request(app).post('/api/1.0/users').send({
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'P@assword',
    });
  };

  it('it returns 200 when signup request is valid', async () => {
    const response = await postValidUser();
    expect(response.status).toBe(200);

    // if expect is not passed with done then it get value asynchronously i.e test doesn't wait for response
    // we use expect inside then to handle the promise
  });

  it('returns success message when signup request is valid', async() => {
    const response = await postValidUser();
    expect(response.body.message).toBe('User created');
  });

  it('saves the user to the database', async() => {
    await postValidUser();
    // query user table and then do the assertion based on it
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it('saves the username and email to database ', async() => {
    await postValidUser();
    // query user table and then do the assertion based on it
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe('user1');
    expect(savedUser.email).toBe('user1@gmail.com');
  });

  it('hashes the password in the database', async() => {
    await postValidUser();
    const userList = await User.findAll()
    const SavedUser = userList[0]
    expect(SavedUser.password).not.toBe('P@ssword')
  })
});
