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
const validUser = {
  username: 'user1',
  email: 'user1@gmail.com',
  password: 'P@assword',
};
const invalidUser = {
  username: null,
  email: 'user1@gmail.com',
  password: 'P@ssword',
};
// function to call post api to users
const postUser = (user = validUser) => {
  return request(app).post('/api/1.0/users').send(user);
};
describe('User registration', () => {
  it('it returns 200 when signup request is valid', async () => {
    const response = await postUser();
    expect(response.status).toBe(200);

    // if expect is not passed with done then it get value asynchronously i.e test doesn't wait for response
    // we use expect inside then to handle the promise
  });

  it('returns success message when signup request is valid', async () => {
    const response = await postUser();
    expect(response.body.message).toBe('User created');
  });

  it('saves the user to the database', async () => {
    await postUser();
    // query user table and then do the assertion based on it
    const userList = await User.findAll();
    expect(userList.length).toBe(1);
  });

  it('saves the username and email to database ', async () => {
    await postUser();
    // query user table and then do the assertion based on it
    const userList = await User.findAll();
    const savedUser = userList[0];
    expect(savedUser.username).toBe('user1');
    expect(savedUser.email).toBe('user1@gmail.com');
  });

  it('hashes the password in the database', async () => {
    await postUser();
    const userList = await User.findAll();
    const SavedUser = userList[0];
    expect(SavedUser.password).not.toBe('P@ssword');
  });

  it('returns 400 when usernme is null', async () => {
    const response = await postUser(invalidUser);
    expect(response.status).toBe(400);
  });

  it('return validationErrors field in response body when validation error occurs ', async () => {
    const response = await postUser(invalidUser);
    expect(response.body.validationErrors).not.toBeUndefined();
  });

  it('return errors for both when username and email is null ', async () => {
    const response = await postUser({
      username: null,
      email: null,
      password: 'P@assword',
    });
    expect(Object.keys(response.body.validationErrors)).toEqual(['username', 'email']);
  });

  //dynamic tests
  it.each([
    ['username', 'Username cannot be null'],
    ['email', 'Email cannot be null'],
    ['password', 'Password cannot be null'],
  ])('when  %s is null %s is received', async (field, expectedMessage) => {
    const user = {
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'P@assword',
    };
    user[field] = null;
    const response = await postUser(user);
    expect(response.body.validationErrors[field]).toBe(expectedMessage);
  });

  it.each`
  field         | expectedMessage
  ${'username'} | ${'Username cannot be null'}
  ${'email'}    | ${'Email cannot be null'}
  ${'password'} | ${'Password cannot be null'}
  `(`returns $expectedMessage when $field is null`,async({field,expectedMessage})=>{
    const user ={
      username:'user1',
      email:'user1@gmail.com',
      password:'P@ssword'
    }
    user[field]=null
    const response = await postUser(user)
    expect(response.body.validationErrors[field]).toBe(expectedMessage)
  })

});
