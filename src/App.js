import React, { useState } from 'react';
import './styles/App.css';

import chip from './assets/chip.png';
import base from './assets/base.png';
import nouvenn from './assets/nouvenn.png';
import fotoCelula from './assets/fotocelula.png';

import { toast } from 'react-toastify';
import { IMaskInput } from 'react-imask';

import { useMac } from './functions/function';
import ToastSettings from './components/toast.settings';

const STATE_MAP = {
  1: "Código da base",
  2: "Número de série da cúpula",
  3: "ICCID do chip",
};

function App() {
  const { getBase, saveAssociate, mac } = useMac();
  
  const [codigo, setCodigo] = useState('');
  const [serial, setSerial] = useState('');
  const [iccid, setIccid] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCodigoValido, setIsCodigoValido] = useState(false);

  const handleCodigoChange = async (e) => {
    const { value } = e.target;
    setCodigo(value);
    setLoading(true);

    if (value.length === 4) {
      const response = await getBase(value);
      handleCodigoResponse(response);
    }
    setLoading(false);
  };

  const handleCodigoResponse = (response) => {
    if (response.isValid) {
      setIsCodigoValido(true);
      toast.success('Código encontrado!');
    } else if (response.isValid === null) {
      setIsCodigoValido(false);
    } else {
      toast.error('Código não registrado');
      setIsCodigoValido(false);
    }
  };

  const handleButtonClick = async () => {
    if (!canSubmit()) return;

    setLoading(true);
    const response = await saveAssociate(serial, iccid);
    handleResponse(response);
    setLoading(false);
  };

  const handleResponse = (response) => {
    if (response.status === 200 && response.data.status !== 400) {
      resetForm();
      toast.success('Dispositivo associado com sucesso!');
    } else if (response.data.status === 400) {
      resetForm();
      toast.error('Dispositivo já inserido!');
    } else {
      toast.error('Erro ao comunicar com o servidor!');
    }
    setIsCodigoValido(false);
  };

  const resetForm = () => {
    setCodigo('');
    setSerial('');
    setIccid('');
  };

  const canSubmit = () => {
    return isCodigoValido && serial && iccid;
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="images-logo">
          <img src={nouvenn} alt="Logo" className="logo" />
        </div>
        <div className="images-container">
          <ToastSettings />
          <ImageInput 
            imageSrc={base} 
            imageText={STATE_MAP[1]} 
            placeholder="Código..." 
            value={codigo} 
            onChange={handleCodigoChange} 
            loading={loading} 
            mask="0000" 
          />
          <ImageInput 
            imageSrc={fotoCelula} 
            imageText={STATE_MAP[2]} 
            placeholder="Número de serial..." 
            value={serial} 
            onChange={(e) => isCodigoValido && setSerial(e.target.value)} 
            disabled={!isCodigoValido} 
            mask="000000aaa000000" 
          />
          <ImageInput 
            imageSrc={chip} 
            imageText={STATE_MAP[3]} 
            placeholder="ICCID..." 
            value={iccid} 
            onChange={(e) => isCodigoValido && setIccid(e.target.value)} 
            disabled={!isCodigoValido} 
            mask="00000000000000000000" 
          />
        </div>
        <section className="buttons" style={{ marginTop: '5%' }}>
          <button 
            className={`btnfos btnfos-1 ${!canSubmit() ? 'disabled' : ''}`} 
            onClick={handleButtonClick} 
            disabled={!canSubmit()}
          >
            Salvar
          </button>
        </section>
      </header>
    </div>
  );
}

const ImageInput = ({ imageSrc, imageText, placeholder, value, onChange, disabled, mask, loading }) => (
  <div className="image-input">
    <div className="image-msgm">
      <img src={imageSrc} alt={imageText} className="image" />
      <span className="image-text">{imageText}</span>
    </div>
    <div className="container">
      <IMaskInput
        mask={mask}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {loading && <div className={`loader ${loading ? 'visible' : ''}`} />}
    </div>
  </div>
);

export default App;
