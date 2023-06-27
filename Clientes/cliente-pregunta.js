const { Client } = require("ssh2");
const { bpreg, vpreg, apreg, sshConfig } = require("../Servicios/variables.js");


function clientepregunta(enunciado, OpcionA, OpcionB, OpcionC, OpcionD, OpcionE, OpcionCorrecta, id_prueba) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      console.log("Conexión SSH establecida");

      conn.exec("telnet localhost 5000", (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        service = `${apreg}`;
        const message = `${service}-${enunciado}-${OpcionA}-${OpcionB}-${OpcionC}-${OpcionD}-${OpcionE}-${OpcionCorrecta}-${id_prueba}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, "0");
        messagefinal = largo2 + message;
        console.log(`Mensaje enviado: ${messagefinal}`);

        stream.write(messagefinal);

        stream.on("data", (data) => {
          const response = data.toString().substring(5);
          console.log(response);
          const parts = response.split("-");

          if (parts[1] === "preguntas") {
            if (parts[2] === "si") {
              console.log("La pregunta se creo correctamente");
              resolve("si");
            } else if (parts[2] === "no") {
              console.log("La pregunta no se pudo crear");
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

function clienteverpregunta(id) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Conexión SSH establecida');

      conn.exec('telnet localhost 5000', (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        service = `${vpreg}`; 
        const message = `${service}-${id}`;
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
          const pregunta = pruebas.split('-');


          if (aux === "verpreg") {
            if (aux2 === "si") {
              const preguntaData = pregunta.map(pregunta => {
                const [id_pregunta, enunciado, OpcionA, OpcionB, OpcionC, OpcionD, OpcionE, OpcionCorrecta, id_prueba] = pregunta.substring(1, pregunta.length - 1).split(',');
                return {
                  id_pregunta,
                  enunciado,
                  OpcionA,
                  OpcionB,
                  OpcionC,
                  OpcionD,
                  OpcionE,
                  OpcionCorrecta,
                  id_prueba
                };
              });
              resolve(preguntaData);
            } else if (aux2 === "no") {
              const preguntaData = [];
              resolve(preguntaData);
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

function clienteborrarpregunta(id, id_prueba) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on('ready', () => {
      console.log('Conexión SSH establecida');

      conn.exec('telnet localhost 5000', (err, stream) => {
        if (err) {
          reject(err);
          return;
        }

        service = `${bpreg}`;
        const message = `${service}-${id}-${id_prueba}`;
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
module.exports = {clientepregunta, clienteverpregunta, clienteborrarpregunta};
