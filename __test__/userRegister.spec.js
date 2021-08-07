const request = require('supertest');
const app = require('../app');

it('it returns 200 when signup request is valid', (done) => {
  request(app).post('/api/1.0/users').send({
    username: 'user1',
    email: 'user1@gamil.com',
    password: 'P@assword',
  }).expect(200,done);
});
