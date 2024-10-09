const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class NB extends Model {}

NB.init({
    baseCode: {
        type: DataTypes.STRING,
    },
    baseMac: {
        type: DataTypes.STRING,
    },
    serialNumber: {
        type: DataTypes.STRING,
    },
    iccid: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.STRING,
    },
    detail: {
        type: DataTypes.STRING,
    },
    date: {
        type: DataTypes.STRING,
    },
}, {
    sequelize,
    modelName: 'NB',
});

module.exports = NB;