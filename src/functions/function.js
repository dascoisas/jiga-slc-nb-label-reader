import { useState } from "react";
import { client } from "../config";

const route = '/api/slcnb';
const createRoute = '/middleware/api/devices';

export function useMac() {
  const [identification, setIdentification] = useState('');

  const getBase = async (codigo) => {
    if (!codigo) return { isValid: null };

    try {
      const response = await client.get(`${route}/find/${codigo}`);
      if (response.status === 200 && response.data !== 0) {
        const getIdentification = response.data.identification;
        setIdentification(getIdentification);
        return { isValid: true, getId: getIdentification };
      } 
      return { isValid: false };
    } catch {
      return { isValid: false };
    }
  };

  const create = async (serialNumber, iccid) => {
    const data = {
      identification,
      serialNumber,
      iccid,
      type: 'fotocelula',
      techType: 'gridsafe',
      name: serialNumber,
    };
  
    try {
      const response = await client.post(`${createRoute}/create`, data);
      return response;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        return { status: 409, message: 'Dispositivo já inserido!' };
      } else {
        return { status: error.response?.status || 500, message: 'Erro ao comunicar com o servidor!' };
      }
    }
  };
  

  return { getBase, create, identification };
}
