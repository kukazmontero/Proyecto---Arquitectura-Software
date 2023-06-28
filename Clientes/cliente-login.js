const { Client } = require('ssh2');
const { busri, regis, vusri, login, sshConfig } = require('../Servicios/variables.js');


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
function clientelogin(password, correo) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Conexión SSH establecida');

      conn.exec('telnet localhost 5000', (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        service = `${login}`;
        const message = `${service}-${correo}-${password}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, '0');
        messagefinal = largo2 + message;
        console.log(`Mensaje enviado: ${messagefinal}`);

        stream.write(messagefinal);

        stream.on('data', (data) => {
          const response = data.toString().substring(5);
          console.log(response);
          const parts = response.split('-');


          if (parts[2] === "si") {
            conn.end();
            const userData = {
              resultado: "si",
              nombre: parts[3],
              correo: parts[4],
              contraseña: parts[5],
              rol: parts[6]
            };
            resolve(userData);
          } else if (parts[2] === "mal") {
            conn.end();
            const userData = {
              resultado: "mal"
            };
            resolve(userData);
          } else if (parts[2] === "no") {
            conn.end();
            const userData = {
              resultado: "no"
            };
            resolve(userData);
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
function clienteverusuario(rol){
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Conexión SSH establecida');

      conn.exec('telnet localhost 5000', (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        service = `${vusri}`; 
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


          if (aux === "verusuario") {
            if (aux2 === "si") {
              const verusuario = prueba.map(prueba => {
                const [usuario, contraseña, rol, correo] = prueba.substring(1, prueba.length - 1).split(',');
                return {
                  usuario,
                  contraseña,
                  rol,
                  correo
                };
              });
              resolve(verusuario);
            } else if (aux2 === "no") {
              const verusuario = [];
              resolve(verusuario);
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
function clienteborrarusuario(correo) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Conexión SSH establecida');

      conn.exec('telnet localhost 5000', (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        service = `${busri}`;
        const message = `${service}-${correo}`;
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


function clienteeditarusuario(user, password, rol, rol_admin) {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    console.log("ENTRO 1", "cliente-editar-usuario")
    conn.on("ready", () => {
      console.log("Conexión SSH establecida");

      conn.exec("telnet localhost 5000", (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        console.log("ENTRO 2")
        service = `${eusri}`;
        const message = `${service}-${user}-${password}-${rol}-${rol_admin}`;
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
  clientelogin,
  clienteregistro,
  clienteverusuario, 
  clienteborrarusuario,
  clienteeditarusuario
};