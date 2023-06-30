const { Client } = require("ssh2");
const { gptj, vpunt, sshConfig } = require("../Servicios/variables.js");

function clienteguardarpuntaje(correo, respuestas) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      console.log("Conexión SSH establecida");

      conn.exec("telnet localhost 5000", (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        service = `${gptj}`;


        const message = `${service}-${correo}${respuestas}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, "0");
        messagefinal = largo2 + message;
        console.log(`Mensaje enviado: ${messagefinal}`);


        stream.write(messagefinal);

        stream.on("data", (data) => {
          const response = data.toString().substring(5);
          console.log(response);
          const parts = response.split("-");

          if (parts[1] === "puntajes") {
            if (parts[2] === "si") {
              console.log("El puntaje se guardo correctamente");
              resolve("si");
            } else if (parts[2] === "no") {
              console.log("El puntaje no se pudo guardar");
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

function clienteverpuntaje(correo_alumno) {
  return new Promise((resolve, reject) => {
    const conn = new Client();

    conn.on("ready", () => {
      console.log("Conexión SSH establecida");

      conn.exec("telnet localhost 5000", (err, stream) => {
        if (err) {
          reject(err);
          return;
        }
        service = `${vpunt}`;
        const message = `${service}-${correo_alumno}`;
        const largo = message.length;
        const largo2 = largo.toString().padStart(5, "0");
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

module.exports = { clienteguardarpuntaje, clienteverpuntaje };
