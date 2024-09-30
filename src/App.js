import React, { useState } from 'react';
import './styles/App.css';

import chip from './assets/chip.png';
import base from './assets/base.png';
import nouvenn from './assets/nouvenn.png';
import fotoCelula from './assets/fotocelula.png';

import { toast } from 'react-toastify';
import { IMaskInput } from "react-imask";

import { useMac } from './functions/function';
import ToastSettings from './components/toast.settings';

function App() {
  const { getBase, salveAssociate, mac } = useMac();

  const [codigo, setCodigo] = useState('');
  const [serial, setSerial] = useState('');
  const [iccid, setIccid] = useState('');
  const [loading, setLoading] = useState(false);
  const [codigoValido, setCodigoValido] = useState(false);

  const stateMap = {
    1: "Código da base",
    2: "Número de série da cúpula",
    3: "ICCID do chip",
  };

  const handleCodigoChange = async (e) => {
    setCodigo(e.target.value);
    setLoading(true);
    const response = await getBase(e.target.value);
    if(response.isValid) {
      setCodigoValido(true);
      toast.success('Código encontrado!');
    } else if (response.isValid === null) {
      setCodigoValido(false);
    } else {
      toast.error('Código não registrado'); 
      setCodigoValido(false);
    }
    setLoading(false);
  };

  const handleButtonClickWrapper = async () => {
    if (!canSubmit()) return;

    setLoading(true);
    const response = await salveAssociate(codigo, serial, iccid);
    if (response.status === 200) {
      setCodigo('');
      setSerial('');
      setIccid('');
      toast.success('Dispositivo associado com sucesso!');
    } else { 
      toast.error('Erro ao comunicar com o servidor!'); 
    }
    setCodigoValido(false);
    setLoading(false);
  };

  const canSubmit = () => {
    return codigoValido && serial !== '' && iccid !== '';
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="images-logo">
          <img src={nouvenn} alt="Imagem 0" className="logo" />
        </div>
        <div className="images-container">
          <ToastSettings />
          <div className="image-input">
            <div className="image-msgm">
              <img src={base} alt="Imagem 1" className="image" />
              <span className="image-text">{stateMap[1]}</span>
            </div>
            <div className="container">
              <IMaskInput
                mask="0000"
                className="input"
                placeholder="Código..."
                value={codigo}
                onChange={handleCodigoChange}
              />
              {loading && <div className={`loader ${loading ? 'visible' : ''}`} />}
            </div>
          </div>
          <div className="image-input">
            <div className="image-msgm">
              <img src={fotoCelula} alt="Imagem 2" className="image" />
              <span className="image-text">{stateMap[2]}</span>
            </div>
            <IMaskInput
              mask="000000aaa000000"
              className="input"
              placeholder="Número de serial..."
              value={serial}
              onChange={(e) => codigoValido && setSerial(e.target.value)}
              disabled={!codigoValido}
            />
          </div>
          <div className="image-input">
            <div className="image-msgm">
              <img src={chip} alt="Imagem 3" className="image" />
              <span className="image-text">{stateMap[3]}</span>
            </div>
            <IMaskInput
              mask="00000000000000000000"
              className="input"
              placeholder="ICCID..."
              value={iccid}
              onChange={(e) => codigoValido && setIccid(e.target.value)}
              disabled={!codigoValido}
            />
          </div>
        </div>
        <section className="buttons" style={{ marginTop: '5%' }}>
          <div>
            <a 
              className={`btnfos btnfos-1 ${!canSubmit() ? 'disabled' : ''}`} 
              onClick={handleButtonClickWrapper}
              aria-disabled={!canSubmit()}
            >
              <svg>
                <rect x="0" y="0" fill="none" width="100%" height="100%" />
              </svg>
              Salvar
            </a>
          </div>
        </section>
      </header>
    </div>
  );
}

export default App;
