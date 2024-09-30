import { useState } from "react";
import { client } from "../config";

const route = '/nlm/nb/implantation';


export function useMac() {
  const [mac, setMac] = useState('');

  const getBase = async (codigo) => {
    if(codigo === '') return { isValid: null };
    return new Promise((resolve) => {
      setTimeout(async() => {
        try {
          const response = await client.post(`${route}/${codigo}`);
          if (response.status === 200) {
            const getMac = response.data.mac;
            console.log(getMac);
            resolve({ isValid: true, getMac });
            setMac(getMac);
          } else {
            resolve({ isValid: false });
          }
        } catch (error) {
          resolve({ isValid: false });
        }
      }, 1000);
    });
  }

  const salveAssociate = async (serial, iccid) => {
    const data = {
      mac,
      serial,
      iccid,
    };
    const response = await client.post(`${route}/create`, data);
    return response.status;
  }

   return { getBase, salveAssociate, mac };
}
