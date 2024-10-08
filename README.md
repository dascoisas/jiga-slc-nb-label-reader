# Jiga de Identificação e Rastreabilidade para a produção de dispositivos SLC NB

Este projeto é uma aplicação Node.js que funciona como uma Jiga de Identificação e Rastreabilidade para a produção do dispositivo SLC NB. 
O presente software opera em integração com o software de Testes (https://github.com/dascoisas/jiga-slc-nb), realizando a integração entre base, cúpula e chip da placa.

## Requisitos

Para executar este aplicativo, é necessário ter:

- **Windows**
- **Node.js** (v16.20.2)

## Instruções de Execução

Siga os passos abaixo para rodar o aplicativo:

1. Instale as dependências do projeto:
   ```bash
   npm install
   ```

2. Faça o build do frontend:
   ```bash
   npm run build
   ```

3. Execute a aplicação:
    ```bash
   npm start
   ```
# Obs

A URL do servidor do NLM onde será feita a obtenção dos dados dos dispositivos que passaram pela Jiga de testes e o cadastro dos dispositivos finalizados deve ser configurada no arquivo .env, em REACT_APP_NLM_SERVER_DNS.

## Instruções de Execução em segundo plano (execução como serviço Windows)

Para criar um serviço Windows para sua aplicação Node.Js utilize a aplicação NSSM (Non-Sucking Service Manager).

Para tal:

Extraia o arquivo do NSSM do arquivo compactado nssm-2.24.zip localizado na pasta raíz do projeto;

Abra o prompt de comando como administrador na pasta onde foi extraído o arquivo do nssm (/nssm-2.24/nssm-2.24/win64 ou win32);

Execute o seguinte comando:

   ```bash
   nssm install <nome_do_servico_que_deseja>
   ```
Na janela que se abrir, preencha os campos:

 - Application Path: O caminho para o executável do Node.js (ex: C:\Program Files\nodejs\node.exe);
 - Startup Directory: O diretório onde sua aplicação está localizada;
 - Arguments: O nome do seu arquivo principal (ex: app.js).

Após registrar o serviço você pode usar o seguinte comando para iniciar o serviço:

   ```bash
   nssm start <nome_do_servico>
   nssm stop <nome_do_servico>
   ```
Caso queira que o serviço seja inicializado junto à inicialização do Windows, na pasta onde foi extraído o nssm execute:

  ```bash
  nssm edit <nome_do_servico>
  ```
Vá até a aba "details" em "Startup Type" selecione "Automatic".

Pronto, a aplicação será executada como serviço do Windows.

Caso deseje visualizar os logs da aplicação rodando como serviço do Windows, execute o modo de edição do nssm como citado acima, localize a aba "I/O" e defina aqui o caminho para o arquivo de log no formato txt onde se deseja armazenar os logs. LEMBRE-SE: Caso os logs sejam mantidos ativados em arquivo, o arquivo será escrito até que todo o espaço em disco seja utilizado, sendo assim, recomenda-se a utilização do log apenas para validações pontuais.
