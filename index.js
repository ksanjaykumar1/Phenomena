const app = require('./src/app');
const sequlize = require('./src/config/database');

//You can use sequelize.sync() to automatically synchronize all models.
//{force:true} deletes the database everytime the app restarts after changes 
sequlize.sync({force:true});
app.listen(3000, () => {
  console.log('The server is listening at 3000....');
});
