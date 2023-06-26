const { Client } = require('ssh2');
const { regis, login, sshConfig } = require('./variables.js');

function clienteregistro(nombre, correo, password, rol) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Conexión SSH establecida');

      conn.exec('telnet localhost 5000', (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        service = `${regis}`; 
        const message = `${service}-${nombre}-${password}-${correo}-${rol}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, '0');
        messagefinal = largo2 + message;
        console.log(`Mensaje enviado: ${messagefinal}`);

        stream.write(messagefinal);

           
        



        stream.on('data', (data) => {
          const response = data.toString().substring(5);
          console.log(response);
          const parts = response.split('-');


          if(parts[1]==="registro"){
            if(parts[2]==="si"){
              console.log("El registro se realizo correctamente")
              resolve("si");
            }
            else if(parts[2]==="no"){
              console.log("El registro no se pudo realizar")
              resolve("no")
            }
          }

        });
      });
    });

    conn.on('error', (err) => {
      reject(err);
    });

    conn.on('end', () => {
      console.log('Conexión SSH cerrada');
    });

    conn.connect(sshConfig);
  });
}
module.exports = clienteregistro;
