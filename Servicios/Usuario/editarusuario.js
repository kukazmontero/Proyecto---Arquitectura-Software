const { Client } = require('ssh2');

const conn = new Client();

const { eusri, datos, sshConfig, contarcaracteres } = require('../variables');


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


        if(parts[0] ===`${eusri}`){
          if (response.trim() !== '' && parts[1]) {
            servicio = `${datos}`;
            console.log(`user: ${parts[1]}`, `password: ${parts[2]}`, `rol: ${parts[3]}`, `corrreo: ${parts[4]}`)
            nuevaconsulta =`${servicio}-${eusri}-${parts[1]}-${parts[2]}-${parts[3]}-${parts[4]}`;
            messagefinal = contarcaracteres(nuevaconsulta);
            console.log(`Mensaje enviado: ${messagefinal}`);
            stream.write(messagefinal);
          }
        }
        else{
            if(parts[2]==="si"){
                let message = `${eusri}-`+parts.slice(1).join('-');
                let messagef = contarcaracteres(message);
                console.log(`Mensaje final: ${messagef}`)
                stream.write(messagef)
              }
              else if(parts[2]==="no"){
                let message = `${eusri}-`+parts.slice(1).join('-');
                let messagef = contarcaracteres(message);
                console.log(`Mensaje final: ${messagef}`)
                stream.write(messagef)
              }
        }
      });

      const command = `00010sinit${eusri}`;
      stream.write(command);
    });  

});

conn.connect(sshConfig);