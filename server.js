const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const sequelize = require('./database');
const NB = require('./models/nb');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

function getCurrentDateTime() {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}

app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/label/code/:code', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await axios.get(`https://nlm-api.nouvenn.com/api/slcnb/find/${code}`);

        console.log('NLM api response:', response);
        if (response.data === null) {
            await NB.create({ baseCode: code, baseMac: 'NOT_FOUND', serialNumber: 'N/A', iccid: 'N/A', status: 'ERROR', detail: 'Device MAC not found for this QR Code.', date: getCurrentDateTime() });
            res.status(400).send('ERROR');
        } else {
            res.status(200).send(response.data.identification);
        }
    } catch (error) {
        console.error('Erro ao fazer a requisição ao servidor do NLM:', error);
        res.status(400).send('ERROR');
    }
});

app.post('/create/device/settings', async (req, res) => {
    try {
        const deviceData = req.body;
        console.log('Settings data: ', deviceData);
        const response = await axios.post(`https://nlm-api.nouvenn.com/api/slcnb/settings`, deviceData);

        console.log('NLM api response:', response);
        if (response.data === null) res.status(400).send('ERROR');
        else res.status(200).send(response.data.identification);
    } catch (error) {
        console.error('Erro ao fazer a requisição ao servidor do NLM:', error);
        res.status(400).send('ERROR');
    }
});

app.post('/create/device/new', async (req, res) => {
    let localData = null;
    try {
        const data = req.body;
        localData = data;
        console.log('Device data: ', data);
        const response = await axios.post(`https://nlm-api.nouvenn.com/middleware/api/devices/create`, data);

        console.log('NLM api response:', response);
        if (response.data === null) {
            await NB.create({ baseCode: data.code, baseMac: data.identification, serialNumber: data.serialNumber, iccid: data.iccid, status: 'ERROR', detail: response.data.error, date: getCurrentDateTime() });
            res.status(400).send('ERROR');
        } else {
            await NB.create({ baseCode: data.code, baseMac: data.identification, serialNumber: data.serialNumber, iccid: data.iccid, status: 'SUCCESS', detail: 'N/A', date: getCurrentDateTime() });
            res.status(200).send(response.data.identification);
        }
    } catch (error) {
        console.error('\nErro ao fazer a requisição ao servidor do NLM:', error);
        await NB.create({ baseCode: localData.code, baseMac: localData.identification, serialNumber: localData.serialNumber, iccid: localData.iccid, status: 'ERROR', detail: error.response.data.error, date: getCurrentDateTime() });
        res.status(400).send('ERROR');
    }
});

app.listen(process.env.API_REST_PORT, async () => {
    console.log(`API disponível em http://localhost:${process.env.API_REST_PORT}`);
    await sequelize.sync();
});
