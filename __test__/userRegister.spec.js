const request = require('supertest');
const app = require('../app');

it('it returns 200 when signup request is valid', (done) => {
  request(app)
    .post('/api/1.0/users')
    .send({
      username: 'user1',
      email: 'user1@gamil.com',
      password: 'P@assword',
    })
    .then((response) => {
      expect(response.status).toBe(200);
      done();
    });

  // if expect is not passed with done then it get value asynchronously i.e test doesn't wait for response
  // we use expect inside then to handle the promise
});

it('returns success message when signup request is valid', (done) => {
  request(app)
    .post('/api/1.0/users')
    .send({
      username: 'user1',
      email: 'user1@gamil.com',
      password: 'P@assword',
    })
    .then((response) => {
      expect(response.body.message).toBe('User created');
      done();
    });
});
