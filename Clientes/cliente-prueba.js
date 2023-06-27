const { Client } = require("ssh2");
const { eprue, dprue, vprue, prueb, sshConfig } = require("../Servicios/variables.js");


function clienteprueba(nombreprueba, asignatura, correo_creador, num_preg) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      console.log("Conexión SSH establecida");

      conn.exec("telnet localhost 5000", (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        service = `${prueb}`;
        const message = `${service}-${nombreprueba}-${asignatura}-${correo_creador}-${num_preg}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, "0");
        messagefinal = largo2 + message;
        console.log(`Mensaje enviado: ${messagefinal}`);

        stream.write(messagefinal);

        stream.on("data", (data) => {
          const response = data.toString().substring(5);
          console.log(response);
          const parts = response.split("-");

          if (parts[1] === "pruebas") {
            if (parts[2] === "si") {
              console.log("La prueba se creo correctamente");
              resolve("si");
            } else if (parts[2] === "no") {
              console.log("La prueba no se pudo crear");
              resolve("no");
            }
          }
        });
      });
    });

    conn.on("error", (err) => {
      reject(err);
    });

    conn.on("end", () => {
      console.log("Conexión SSH cerrada");
    });

    conn.connect(sshConfig);
  });
}

function clienteverprueba(rol) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Conexión SSH establecida');

      conn.exec('telnet localhost 5000', (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        service = `${vprue}`; 
        const message = `${service}-${rol}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, '0');
        messagefinal = largo2 + message;
        console.log(`Mensaje enviado: ${messagefinal}`);

        stream.write(messagefinal);
        
        stream.on('data', (data) => {
          const response = data.toString().substring(5);
          const parts = response.split('-');
          console.log(parts)
          let aux = parts[1];
          let aux2 = parts[2];
          let pruebas = parts.slice(3).join('-');
          const prueba = pruebas.split('-');


          if (aux === "verprueba") {
            if (aux2 === "si") {
              const pruebaData = prueba.map(prueba => {
                const [id,nombreprueba, asignatura, correo_creador, num_preguntas, cant_preg] = prueba.substring(1, prueba.length - 1).split(',');
                return {
                  id,
                  nombreprueba,
                  asignatura,
                  correo_creador,
                  num_preguntas,
                  cant_preg
                };
              });
              resolve(pruebaData);
            } else if (aux2 === "no") {
              const pruebaData = [];
              resolve(pruebaData);
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

function clienteborrarprueba(id_prueba, correo_creador) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Conexión SSH establecida');

      conn.exec('telnet localhost 5000', (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        service = `${dprue}`;
        const message = `${service}-${id_prueba}-${correo_creador}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, "0");  //borro los 5 primeros caracteres 00014
        messagefinal = largo2 + message;
        console.log(`Mensaje enviado: ${messagefinal}`);

        stream.write(messagefinal);

        stream.on("data", (data) => {
          const response = data.toString().substring(5);
          const parts = response.split("-");

          if (parts[2] === "si") {
            resolve("Si")
          }
          else if (parts[2] === "no"){
            resolve("No")
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

function clienteeditarprueba(id_prueba, nombreprueba, asignatura, correo_creador, num_preguntas) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    console.log("ENTRO 1")
    conn.on("ready", () => {
      console.log("Conexión SSH establecida");

      conn.exec("telnet localhost 5000", (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        console.log("ENTRO 2")
        service = `${eprue}`;
        const message = `${service}-${id_prueba}-${nombreprueba}-${asignatura}-${correo_creador}-${num_preguntas}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, "0"); //borro los 5 primeros caracteres 00014
        messagefinal = largo2 + message;
        console.log(`Mensaje enviado: ${messagefinal}`);

        stream.write(messagefinal);

        stream.on("data", (data) => {
          const response = data.toString().substring(5);
          const parts = response.split("-");

          if (parts[2] === "si") {
            resolve("Si");
          } else if (parts[2] === "no") {
            resolve("No");
          }
        });
      });
    });

    conn.on("error", (err) => {
      reject(err);
    });

    conn.on("end", () => {
      console.log("Conexión SSH cerrada");
    });

    conn.connect(sshConfig);
  });
}

module.exports = {
  clienteprueba,
  clienteverprueba,
  clienteborrarprueba,
  clienteeditarprueba
};
