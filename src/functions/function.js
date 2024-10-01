import { useState } from "react";
import { client } from "../config";

const route = '/middleware/nb/implantation';

export function useMac() {
  const [mac, setMac] = useState('');

  const getBase = async (codigo) => {
    if (!codigo) return { isValid: null };

    try {
      const response = await client.get(`${route}/${codigo}`);
      if (response.status === 200 && response.data !== 0) {
        const retrievedMac = response.data.mac;
        setMac(retrievedMac);
        return { isValid: true, getMac: retrievedMac };
      } 
      return { isValid: false };
    } catch {
      return { isValid: false };
    }
  };

  const saveAssociate = async (serialNumber, iccid) => {
    const data = { mac, serialNumber, iccid };
    return await client.post(`${route}/create`, data);
  };

  return { getBase, saveAssociate, mac };
}
