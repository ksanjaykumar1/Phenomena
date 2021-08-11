const request = require('supertest');
const app = require('../src/app');
const sequelize = require('../src/config/database');
const User = require('../src/model/User');
const nodemailerStub = require('nodemailer-stub');
const Email = require('../src/controller/email');
// const jest = require('jest')
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
  password: 'P4@assword',
};
const invalidUser = {
  username: null,
  email: 'user1@gmail.com',
  password: 'P4@ssword',
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
    expect(SavedUser.password).not.toBe('P4ssword');
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
      password: 'P4@assword',
    });
    expect(Object.keys(response.body.validationErrors)).toEqual(['username', 'email']);
  });

  //dynamic tests

  it.each`
    field         | value             | expectedMessage
    ${'username'} | ${null}           | ${'Username cannot be null'}
    ${'username'} | ${'use'}          | ${'Must have min 4 and max 37 characters'}
    ${'username'} | ${'a'.repeat(37)} | ${'Must have min 4 and max 37 characters'}
    ${'email'}    | ${null}           | ${'Email cannot be null'}
    ${'email'}    | ${'mail.com'}     | ${'E-mail is is not vaild'}
    ${'email'}    | ${'user'}         | ${'E-mail is is not vaild'}
    ${'email'}    | ${'user@gmail'}   | ${'E-mail is is not vaild'}
    ${'email'}    | ${'user.com.com'} | ${'E-mail is is not vaild'}
    ${'password'} | ${null}           | ${'Password cannot be null'}
    ${'password'} | ${'p4ss'}         | ${'Password must be at least 6 characters'}
    ${'password'} | ${'alllowercase'} | ${'Password must have at least 1 uppercare 1 lowercase 1 number 1 special character'}
    ${'password'} | ${'ALLUPERCASE'}  | ${'Password must have at least 1 uppercare 1 lowercase 1 number 1 special character'}
    ${'password'} | ${'4444444444'}   | ${'Password must have at least 1 uppercare 1 lowercase 1 number 1 special character'}
  `(`returns $expectedMessage when $field is null`, async ({ field, expectedMessage, value }) => {
    const user = {
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'P@ssword',
    };
    user[field] = value;
    const response = await postUser(user);
    expect(response.body.validationErrors[field]).toBe(expectedMessage);
  });

  it('returns E-mail in use when same email is already in use', async () => {
    // maunally add
    await User.create({ ...validUser });
    const response = await postUser(validUser);
    expect(response.body.validationErrors.email).toBe('E-mail in use');
  });

  it('returns error for both usernme is null and email in use', async () => {
    // maunally add
    await User.create({ ...validUser });
    const response = await postUser({
      username: null,
      email: 'user1@gmail.com',
      password: 'P4@ssword',
    });
    expect(Object.keys(response.body.validationErrors)).toEqual(['username', 'email']);
  });

  it('creates a user in a inactive mode', async () => {
    await postUser();
    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.inactive).toBe(true);
  });

  it('creates a user in inactive mode even when the request body contains inactive as false', async () => {
    const newUser = {
      username: 'user1',
      email: 'user1@gmail.com',
      password: 'P4@ssword',
      inactive: false,
    };
    await postUser(newUser);
    const users = await User.findAll();
    const savedUser = users[0];
    expect(savedUser.inactive).toBe(true);
  });

  it('creates a activation token for user', async () => {
    await postUser(validUser);
    const users = await User.findAll();
    const savedUser = users[0];
    //to check if activation token has value in it
    expect(savedUser.activationToken).toBeTruthy();
  });

  it('sends an Account activation email with activationToken', async () => {
    await postUser({
      username: 'user1',
      email: 'ksanjayk@protonmail.com',
      password: 'P4@assword',
    });
    const lastMail = nodemailerStub.interactsWithMail.lastMail();
    expect(lastMail.to[0]).toContain('ksanjayk@protonmail.com');
    const users = await User.findAll();
    const savedUser = users[0];
    expect(lastMail.content).toContain(savedUser.activationToken);
  });

  it('return 502 Bad Gateway when sending email fails', async () => {
    const mockSendAccountActivation= jest
      .spyOn(Email, 'sendAccountActivation')
      .mockRejectedValue({ msg: 'failed to deliever email' });
    const response = await postUser();
    expect(response.status).toBe(502);
    mockSendAccountActivation.mockRestore()
  });
  it('return 502 Bad Gateway when sending email fails', async () => {
    const mockSendAccountActivation= jest
      .spyOn(Email, 'sendAccountActivation')
      .mockRejectedValue({ msg: 'failed to deliever email' });
    const response = await postUser();
    expect(response.status).toBe(502);
    mockSendAccountActivation.mockRestore()
  });
  it('return E-mail Failure when sending email fails', async () => {
    const mockSendAccountActivation= jest
      .spyOn(Email, 'sendAccountActivation')
      .mockRejectedValue({ msg: 'failed to deliever email' });
    const response = await postUser();
    expect(response.body.message).toBe('E-mail Failure');
    mockSendAccountActivation.mockRestore()
  });

  it('does not save user to database if activation email fails', async () => {
    const mockSendAccountActivation= jest
      .spyOn(Email, 'sendAccountActivation')
      .mockRejectedValue({ msg: 'failed to deliever email' });
    await postUser();
    const userList = await User.findAll()
    expect(userList.length).toBe(0)
    mockSendAccountActivation.mockRestore()
  });
});
