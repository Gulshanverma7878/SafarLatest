const { Sequelize } = require("sequelize");


const sequelize = new Sequelize('appsafar', 'root', '', {
  host: 'localhost', 
  dialect: 'mysql',
  dialectModule: require("mysql2"),
  port: 3306, 

  pool: {
    max: 10, 
    min: 0, 
    acquire: 30000,
    idle: 10000, 
  },
  logging: false,
  dialectOptions: {
    timezone: "+05:30",
    charset: "utf8mb4",
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
