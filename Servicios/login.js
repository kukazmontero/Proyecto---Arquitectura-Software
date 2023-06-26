const { Client } = require('ssh2');
const readline = require('readline');

const conn = new Client();
const { login, datos, sshConfig } = require('./variables.js');




conn.on('ready', () => {
  console.log('Conexión SSH establecida');
  
    conn.exec('telnet localhost 5000', (err, stream) => {
      if (err) throw err;
      const command = `00010sinit${login}`;
      stream.write(command);

      stream.on('close', () => {
        console.log('Conexión al bus de servicio cerrada');
        conn.end(); 
      }).on('data', (data) => {
        const response = data.toString().substring(5); 
        console.log('Datos recibidos:', response);
        const parts = response.split('-');
          
        if(parts[0] ===`${login}`){
          if (parts[2]) {
            nuevaconsulta =`${datos}-${login}-${parts[1]}-${parts[2]}`;
            const largo = nuevaconsulta.length;
            const largo2 = largo.toString().padStart(5, '0');
            messagefinal = largo2 + nuevaconsulta;
            console.log(`Mensaje enviado: ${messagefinal}`);
            stream.write(messagefinal);
          }
        }
        else{
          if(parts[2]==="si"){
            console.log(`00014${login}-login-si-${parts[3]}-${parts[4]}-${parts[5]}-${parts[6]}`);
            stream.write(`00014${login}-login-si-${parts[3]}-${parts[4]}-${parts[5]}-${parts[6]}`);
          }
          else if(parts[2]==="mal"){
            console.log(`00014${login}-login-mal`);
            stream.write(`00014${login}-login-mal`);
          }
          else if(parts[2]==="no"){
            console.log(`00014${login}-login-mal`);
            stream.write(`00014${login}-login-no`);
          }
        }
      });
      
  
    });
   

});

conn.connect(sshConfig);