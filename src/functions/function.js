import { useState } from "react";
import { client } from "../config";

const route = '/api/slcnb';

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

  const saveAssociate = async (serialNumber, iccid) => {
    const data = { identification, serialNumber, iccid };
    return await client.post(`${route}/create`, data);
  };

  return { getBase, saveAssociate, identification };
}
