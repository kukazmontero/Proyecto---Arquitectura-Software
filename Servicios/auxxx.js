const { Client } = require('ssh2');
const { vprue,prueb, sshConfig } = require('../Servicios/variables.js');

function clienteprueba(nombreprueba, asignatura, correo_creador, num_preg) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Conexión SSH establecida');

      conn.exec('telnet localhost 5000', (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        service = `${prueb}`; 
        const message = `${service}-${nombreprueba}-${asignatura}-${correo_creador}-${num_preg}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, '0');
        messagefinal = largo2 + message;
        console.log(`Mensaje enviado: ${messagefinal}`);

        stream.write(messagefinal);

           
        



        stream.on('data', (data) => {
          const response = data.toString().substring(5);
          console.log(response);
          const parts = response.split('-');


          if(parts[1]==="pruebas"){
            if(parts[2]==="si"){
              console.log("La prueba se creo correctamente")
              resolve("si");
            }
            else if(parts[2]==="no"){
              console.log("La prueba no se pudo crear")
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
function clienteverprueba(rol) {
  return new Promise((resolve, reject) => {
    const data = "00096vprue-verprueba-si-[PRUEBA 1,Lenguaje,gabriel@correo,3,0]-[PRUEBA 1,Lenguaje,gabriel@correo,3,0]";
    const response = data.toString().substring(5);
    const parts = response.split('-');
    let pruebas = parts.slice(3).join('-');
    const prueba = pruebas.split('-');

    if (parts[1] === "verprueba") {
      if (parts[2] === "si") {
        const pruebaData = prueba.map(prueba => {
          const [nombreprueba, asignatura, correo_creador, num_preguntas, cant_preg] = prueba.substring(1, prueba.length - 1).split(',');
          return {
            nombreprueba,
            asignatura,
            correo_creador,
            num_preguntas,
            cant_preg
          };
        });
        resolve(pruebaData);
      } else if (parts[2] === "no") {
        const pruebaData = [];
        resolve(pruebaData);
      }
    } else {
      reject(new Error("Error en el formato de los datos"));
    }
  });
}

module.exports = {
  clienteverprueba
};
