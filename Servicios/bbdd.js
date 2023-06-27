const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("mydatabase.db");

const { Client } = require("ssh2");

const conn = new Client();

const {
  regis,
  login,
  datos,
  prueb,
  vprue,
  dprue,
<<<<<<< HEAD
  eprue,
=======
  vusri,
>>>>>>> 21ee356231265461e7552b4ab650684d155b3aec
  sshConfig,
} = require("./variables.js");
const { EMPTY } = require("sqlite3");

conn.on("ready", () => {
  console.log("Conexión SSH establecida");
  conn.exec("telnet localhost 5000", (err, stream) => {
    if (err) throw err;

    stream.on("data", (data) => {
      const message = data.toString().trim();

      const response = message.toString().substring(5);
      console.log("Datos recibidos:", response);

      const parts = response.split("-");

      if (parts[1] === regis) {
        registro(parts[2], parts[3], parts[4], parts[5], (err, results) => {
          if (err) {
            console.log(err);
          } else {
            if (results === "agregado") {
              stream.write(`00017${datos}-agregado-si`);
            } else if (results === "noagregado") {
              stream.write(`00017${datos}-agregado-no`);
            }
          }
        });
      } else if (parts[1] === login) {
        ingreso(parts[2], parts[3], (err, results) => {
          if (err) {
            console.log(err);
          } else {
            if (results.aux === "correcta") {
              const message = `${datos}-logeado-si-${results.usuario}-${results.correo}-${results.contraseña}-${results.rol}`;
              const largo = message.length;
              const largo2 = largo.toString().padStart(5, "0");
              messagefinal = largo2 + message;
              console.log(`Mensaje enviado: ${messagefinal}`);
              stream.write(messagefinal);
            }
            if (results === "incorrecta") {
              const message = `${datos}-logeado-mal`;
              const largo = message.length;
              const largo2 = largo.toString().padStart(5, "0");
              messagefinal = largo2 + message;
              console.log(`Mensaje enviado: ${messagefinal}`);
              stream.write(messagefinal);
            } else if (results === "noencontrado") {
              const message = `${datos}-logeado-no`;
              const largo = message.length;
              const largo2 = largo.toString().padStart(5, "0");
              messagefinal = largo2 + message;
              console.log(`Mensaje enviado: ${messagefinal}`);
              stream.write(messagefinal);
            }
          }
        });
      } else if (parts[1] === prueb) {
        crearprueba(parts[2], parts[3], parts[4], parts[5], (err, results) => {
          if (err) {
            console.log(err);
          } else {
            if (results === "agregado") {
              stream.write(`00017${datos}-agregado-si`);
            } else if (results === "noagregado") {
              stream.write(`00017${datos}-agregado-no`);
            }
          }
        });
      } else if (parts[1] === vprue) {
        console.log(parts[2]);
        verPrueba(parts[2], (err, results) => {
          if (err) {
            console.log(err);
          } else {
            if (results === "noencontrado") {
              service = `${datos}`; 
              const message2 = `${service}-verprueba-no`;
              const largo = message2.length;
              const largo2 = largo.toString().padStart(5, '0');
              messagefinal = largo2 + message2;
              console.log(`Mensaje enviado: ${messagefinal}`);
              stream.write(messagefinal);
            } else {
                const message = results.reduce((acc, prueba) => {
                const { id, nombreprueba, asignatura, correo_creador, num_preguntas, cant_preg } = prueba;
                const resultado = `-[${id},${nombreprueba},${asignatura},${correo_creador},${num_preguntas},${cant_preg}]`;
                return acc + resultado;
              }, '');
              service = `${datos}`; 
              const message2 = `${service}-verprueba-si${message}`;
              const largo = message2.length;
              const largo2 = largo.toString().padStart(5, '0');
              messagefinal = largo2 + message2;
              console.log(`Mensaje enviado: ${messagefinal}`);
              stream.write(messagefinal);          
            }
          }
        });
      } else if (parts[1] === dprue) {
        borrarPrueba(parts[2], parts[3], (err, results) =>{
          if(err){
            console.log(err);
          } else{
            if(results === "borrado"){
              stream.write(`00017${datos}-borrado-si`);
            }
            else if(results === "noborrado"){
              stream.write(`00017${datos}-borrado-no`);
            }
            console.log(results)
          }
        })
      } else if (parts[1] === eprue) {
        editarPrueba(parts[2], parts[3], parts[4], parts[5], parts[6], (err, results) =>{
          if(err){
            console.log(err);
          } else{
            if(results === "editado"){
              stream.write(`00017${datos}-editado-si`);
            }
            else if(results === "noeditado"){
              stream.write(`00017${datos}-editado-no`);
            }
            console.log(results)
          }
        })
      }
    });
    const command = `00010sinit${datos}`;
    console.log(stream.write(command));
    //stream.write(command);
  });
});

conn.connect(sshConfig);

function registro(username, password, correo, rol, callback) {
  // Ejemplo de consulta a la base de datos con los valores de username y password como parámetros
  const query = `SELECT * FROM tabla_usuarios WHERE correo = ?`;
  const query2 =
    "INSERT INTO tabla_usuarios (usuario, contraseña, rol, correo) VALUES (?, ?, ?, ?)";

  // Ejecutar la consulta con los valores de username y password como parámetros
  db.all(query, [correo], (err, results) => {
    // Llamar al callback con los resultados o el error
    if (err) {
      callback(err);
    } else {
      if (results.length === 0) {
        db.run(query2, [username, password, rol, correo], function (err) {
          if (err) {
            console.error(err);
          } else {
            console.log(`Usuario ${username} insertado correctamente.`);
          }
        });
        // No se encontraron usuarios
        callback(null, "agregado");
      } else {
        console.log(`Usuario ${username} ya existe.`);

        // Usuario encontrado
        callback(null, "noagregado");
      }
    }
  });
}
function ingreso(correo, password, callback) {
  const query = `SELECT * FROM tabla_usuarios WHERE correo = ?`;
  const query2 = `SELECT * FROM tabla_usuarios WHERE correo = ? AND contraseña = ?`;

  db.all(query, [correo], (err, results) => {
    if (err) {
      callback(err);
    } else {
      if (results.length === 0) {
        console.log(`Usuario ${correo} no encontrado.`);
        callback(null, "noencontrado");
      } else {
        console.log(`Usuario ${correo} encontrado. \n`);
        db.all(query2, [correo, password], (err, results) => {
          if (err) {
            callback(err);
          } else {
            if (results.length === 0) {
              console.log("Contraseña incorrecta");
              callback(null, "incorrecta");
            } else {
              const dusuario = results[0];
              const { usuario, correo, contraseña, rol } = dusuario;
              const aux = "correcta";
              const datosUsuario = {
                aux,
                usuario,
                correo,
                contraseña,
                rol,
              };
              callback(null, datosUsuario);
            }
          }
        });
      }
    }
  });
}
function crearprueba(
  nombreprueba,
  asignatura,
  correo_creador,
  num_preguntas,
  callback
) {
  // Ejemplo de consulta a la base de datos con los valores de username y password como parámetros
  const query =
    "INSERT INTO tabla_pruebas (nombreprueba, asignatura, correo_creador, num_preguntas, cant_preg) VALUES ( ?, ?, ?, ?, ?)";

  db.run(
    query,
    [nombreprueba, asignatura, correo_creador, num_preguntas, 0],
    function (err) {
      if (err) {
        console.error(err);
        callback(null, "noagregado");
      } else {
        console.log(`Prueba de ${asignatura} insertada correctamente.`);
      }
    }
  );
  callback(null, "agregado");
}
function verPrueba( rol, callback) {
  const query = `SELECT ROWID, * FROM tabla_pruebas`;
  /*console.log(rol)
  console.log(parseInt(rol) === 1)*/

  if (parseInt(rol) === 1 || parseInt(rol) === 2 ) {
    // Rol igual a 1, buscar todas las pruebas
    db.all(query, (err, results) => {
      if (err) {
        callback(err);
      } else {
        if (results.length === 0) {
          console.log("Prueba no encontrada");
          callback(null, "noencontrado");
        } else {
          const pruebas = results.map((prueba) => {
            const { ROWID, nombreprueba, asignatura, correo_creador, num_preguntas, cant_preg } = prueba;
            return {
              id : ROWID,
              nombreprueba,
              asignatura,
              correo_creador,
              num_preguntas,
              cant_preg
            };
          });
          callback(null, pruebas);
        }
      }
    });
  } else if (parseInt(rol) === 3) {
    db.all(query, (err, results) => {
      if (err) {
        callback(err);
      } else {
        if (results.length === 0) {
          console.log("Prueba no encontrada");
          callback(null, "noencontrado");
        } else {
          const pruebas = results.filter((prueba) => prueba.cant_preg === prueba.num_preguntas)
            .map((prueba) => {
              const { nombreprueba, asignatura, correo_creador, num_preguntas, cant_preg } = prueba;
              return {
                nombreprueba,
                asignatura,
                correo_creador,
                num_preguntas,
                cant_preg
              };
            });
            console.log(pruebas.length)
          if(pruebas.length === 0){
            callback(null, "noencontrado");
          }
          else{
            callback(null, pruebas);
          }
          
        }
      }
    });
  } else {
    // Otro rol no compatible
    callback(null, "noencontrado");
  }
}
function borrarPrueba(id, correo_creador, callback) {
  const query =
    "DELETE FROM tabla_pruebas WHERE ROWID = ? AND correo_creador = ?";

  db.run(query, [id, correo_creador], function (err) {
    if (err) {
      callback(err);
    } else {
      if (this.changes > 0) {
        callback(null, "borrado");
      } else {
        callback(null, "noencontrado");
      }
    }
  });
}

function editarPrueba(id, nombreprueba, asignatura, correo_creador, num_preguntas, callback) {
  const query =
  "UPDATE tabla_pruebas SET nombreprueba = ?, asignatura = ?, num_preguntas = ?  WHERE ROWID = ? AND  correo_creador = ?";

  db.run(query, [nombreprueba, asignatura, num_preguntas, id, correo_creador], function (err) {
    if (err) {
      callback(err);
    } else {
      if (this.changes > 0) {
        callback(null, "editado");
      } else {
        callback(null, "noencontrado");
      }
    }
  });
}


module.exports = {
  borrarPrueba
};