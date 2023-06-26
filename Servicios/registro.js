const { Client } = require('ssh2');

const conn = new Client();

const { regis, datos, sshConfig } = require('./variables.js');


conn.on('ready', () => {
  console.log('Conexión SSH establecida');
    conn.exec('telnet localhost 5000', (err, stream) => {
      if (err) throw err;

      stream.on('close', () => {
        console.log('Conexión al bus de servicio cerrada');
        conn.end();
      }).on('data', (data) => {
        
        const response = data.toString().substring(5); 
        console.log('Datos recibidos:', response);
        const parts = response.split('-');

        if(parts[0] ===`${regis}`){
          if (response.trim() !== '' &&parts[2]) {
          
          servicio = `${datos}`;
          console.log(`nombre: ${parts[1]}`)
          console.log(`contraseña: ${parts[2]}`)
          console.log(`correo: ${parts[3]}`)
          console.log(`rol: ${parts[4]}`)


          nuevaconsulta =`${servicio}-${regis}-${parts[1]}-${parts[2]}-${parts[3]}-${parts[4]}`;
          const largo = nuevaconsulta.length;
          const largo2 = largo.toString().padStart(5, '0');
          messagefinal = largo2 + nuevaconsulta;
          console.log(`Mensaje enviado: ${messagefinal}`);
          stream.write(messagefinal);
          }
        }
        else{
          const modifiedMessage = response;
          if(parts[2]==="si"){
            stream.write(`00017${regis}-registro-si`);
          }
          else if(parts[2]==="no"){
            stream.write(`00017${regis}-registro-no`);

          }
          
        }
      });

      const command = `00010sinit${regis}`;
      stream.write(command);
    });  

});

conn.connect(sshConfig);