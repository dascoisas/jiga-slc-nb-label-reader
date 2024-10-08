import { useState } from "react";
import { client } from "../config";

const route = '/api/slcnb';
const createRoute = '/middleware/api/devices';

export function useMac() {
  const [identification, setIdentification] = useState('');

  const getBase = async (codigo) => {
    if (!codigo) return { isValid: null };

    try {
      const response = await client.post(`http://localhost:3066/label/code/${codigo}`);
      if (response.status === 200 && response.data !== 0) {
        const getIdentification = response.data;
        setIdentification(getIdentification);
        return { isValid: true, getId: getIdentification };
      } 
      return { isValid: false };
    } catch {
      return { isValid: false };
    }
  };

  const createSettings = async (serialNumber, identification, iccid) => {
    const data = {
      identification,
      serialNumber,
      iccid,
    };
  
    try {
      const response = await client.post(`http://localhost:3066/create/device/settings`, data);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return { status: 409, message: 'Dispositivo já inserido!' };
      } else {
        return { status: error.response?.status || 500, message: 'Erro ao comunicar com o servidor!' };
      }
    }
  };

  const create = async (serialNumber, identification) => {
    const data = {
      identification,
      serialNumber,
      type: 'fotocelula',
      techType: 'nbiot',
      name: serialNumber,
    };
  
    try {
      const response = await client.post(`http://localhost:3066/create/device/new`, data);
      if (response.data.error) return { status: 'ERROR' };
      return response;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return { status: 'ERROR', message: 'Dispositivo já inserido!' };
      } else {
        return { status:'ERROR' || 500, message: 'Erro ao comunicar com o servidor!' };
      }
    }
  };
  
  return { getBase, create, createSettings, identification };
}
