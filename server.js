const express = require('express');
const path = require('path');
const cors = require('cors');
const axios = require('axios');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', async (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/label/code/:code', async (req, res) => {
    try {
        const code = req.params.code;
        const response = await axios.get(`https://nlm-api.nouvenn.com/api/slcnb/find/${code}`);

        console.log('NLM api response:', response);
        if (response.data === null) res.status(400).send('ERROR');
        else res.status(200).send(response.data.identification);
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
    try {
        const data = req.body;
        console.log('Device data: ', data);
        const response = await axios.post(`https://nlm-api.nouvenn.com/middleware/api/devices/create`, data);

        console.log('NLM api response:', response);
        if (response.data === null) res.status(400).send('ERROR');
        else res.status(200).send(response.data.identification);
    } catch (error) {
        console.error('Erro ao fazer a requisição ao servidor do NLM:', error);
        res.status(400).send('ERROR');
    }
});

app.listen(process.env.API_REST_PORT, () => {
    console.log(`API disponível em http://localhost:${process.env.API_REST_PORT}`);
});
