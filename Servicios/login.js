const { Client } = require('ssh2');
const readline = require('readline');

const conn = new Client();
const { login,contarcaracteres, datos, sshConfig } = require('./variables.js');




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
            messagefinal = contarcaracteres(nuevaconsulta);
            console.log(`Mensaje enviado: ${messagefinal}`);
            stream.write(messagefinal);
          }
        }
        else{
          if(parts[2]==="si"){
            let message = `${login}-login-si-${parts[3]}-${parts[4]}-${parts[5]}-${parts[6]}`;
            let messagef = contarcaracteres(message);
            console.log(messagef);
            stream.write(messagef);
          }
          else if(parts[2]==="mal"){
            let message = `00014${login}-login-mal`;
            let messagef = contarcaracteres(message);
            console.log(messagef);
            stream.write(messagef);
          }
          else if(parts[2]==="no"){
            let message = `00014${login}-login-no`;
            let messagef = contarcaracteres(message);
            console.log(messagef);
            stream.write(messagef);
          }
        }
      });
      
  
    });
   

});

conn.connect(sshConfig);