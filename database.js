// database.js
const { Sequelize } = require('sequelize');

// Crie uma nova instância do Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'database.sqlite' // Nome do arquivo do banco de dados
});

module.exports = sequelize;