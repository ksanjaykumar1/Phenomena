const app = require('./src/app');
const sequlize = require('./src/config/database');

//You can use sequelize.sync() to automatically synchronize all models.
sequlize.sync();

app.listen(3000, () => {
  console.log('The server is listening at 3000....');
});
