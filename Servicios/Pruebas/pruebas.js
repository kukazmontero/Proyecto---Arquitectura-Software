const { Client } = require('ssh2');

const conn = new Client();

const { prueb, datos, sshConfig } = require('../variables.js');


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

        if(parts[0] ===`${prueb}`){
          if (response.trim() !== '' &&parts[2]) {
          
            servicio = `${datos}`;
            console.log(`nombre-prueba: ${parts[1]}`)
            console.log(`asignatura: ${parts[2]}`)
            console.log(`correo-creador: ${parts[3]}`)
            console.log(`num_preguntas: ${parts[4]}`)



            nuevaconsulta =`${servicio}-${prueb}-${parts[1]}-${parts[2]}-${parts[3]}-${parts[4]}`;
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
            stream.write(`00017${prueb}-pruebas-si`);
          }
          else if(parts[2]==="no"){
            stream.write(`00017${prueb}-pruebas-no`);

          }
          
        }
      });

      const command = `sinit${prueb}`;
      const largo = command.length;
      const largo2 = largo.toString().padStart(5, '0');
      messagefinal = largo2 + command;
      stream.write(messagefinal);
    });  

});

conn.connect(sshConfig);