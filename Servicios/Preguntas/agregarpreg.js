const { Client } = require('ssh2');

const conn = new Client();

const { apreg, datos, sshConfig } = require('../variables.js');


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

        if(parts[0] ===`${apreg}`){
          if (response.trim() !== '' &&parts[2]) {
          
            servicio = `${datos}`;

            nuevaconsulta =`${servicio}-${response}`;
            const largo = nuevaconsulta.length;
            const largo2 = largo.toString().padStart(5, '0');
            messagefinal = largo2 + nuevaconsulta;
            console.log(`Mensaje enviado: ${messagefinal}`);
            stream.write(messagefinal);
          }
        }
        else{
          if(parts[2]==="si"){
            stream.write(`00017${apreg}-preguntas-si`);
          }
          else if(parts[2]==="no"){
            stream.write(`00017${apreg}-preguntas-no`);

          }
          
        }
      });

      const command = `sinit${apreg}`;
      const largo = command.length;
      const largo2 = largo.toString().padStart(5, '0');
      messagefinal = largo2 + command;
      stream.write(messagefinal);
    });  

});

conn.connect(sshConfig);