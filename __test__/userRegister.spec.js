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

  it('it returns 200 when signup request is valid', (done) => {
    postValidUser().then((response) => {
      expect(response.status).toBe(200);
      done();
    });

    // if expect is not passed with done then it get value asynchronously i.e test doesn't wait for response
    // we use expect inside then to handle the promise
  });

  it('returns success message when signup request is valid', (done) => {
    postValidUser().then((response) => {
      expect(response.body.message).toBe('User created');
      done();
    });
  });

  it('saves the user to the database', (done) => {
    postValidUser().then(() => {
      // query user table and then do the assertion based on it
      User.findAll().then((userList) => {
        expect(userList.length).toBe(1);
        done();
      });
    });
  });

  it('saves the username and email to database ', (done) => {
    postValidUser().then(() => {
      User.findAll().then((userList) => {
        const savedUser = userList[0];
        expect(savedUser.username).toBe('user1');
        expect(savedUser.email).toBe('user1@gmail.com');
        done();
      });
    });
  });

  it('hashes the password in the database', (done) => {
    postValidUser().then(() => {
      User.findAll().then((userList) => {
        const savedUser = userList[0];
        expect(savedUser.password).not.toBe('P@ssword');
        done();
      });
    });
  });
});
