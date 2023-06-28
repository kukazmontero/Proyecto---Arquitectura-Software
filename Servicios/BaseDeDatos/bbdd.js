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
  sshConfig,
  apreg,
  vpreg,
  bpreg,
  vusri,
  eprue,
  busri,
  eusri,
  contarcaracteres
} = require("../variables.js");
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
      } else if (parts[1] === vusri) {
        console.log("ENTRO");
        verUsuario(parts[2], (err, results) => {
          if (err) {
            console.log(err);
          } else {
            if (results === "noencontrado") {
              service = `${datos}`; 
              const message2 = `${service}-verusuario-no`;
              const largo = message2.length;
              const largo2 = largo.toString().padStart(5, '0');
              messagefinal = largo2 + message2;
              console.log(`Mensaje enviado: ${messagefinal}`);
              stream.write(messagefinal);
            } else {
                const message = results.reduce((acc, user) => {
                const {usuario, contraseña, rol, correo } = user;
                const resultado = `-[${usuario},${contraseña},${rol},${correo}]`;
                return acc + resultado;
              }, '');
              service = `${datos}`; 
              const message2 = `${service}-verusuario-si${message}`;
              const largo = message2.length;
              const largo2 = largo.toString().padStart(5, '0');
              messagefinal = largo2 + message2;
              console.log(`Mensaje enviado: ${messagefinal}`);
              stream.write(messagefinal);          
            }
          }
        });
      } else if (parts[1] === busri) {
        borrarusuario(parts[2], (err, results) =>{
          if(err){
            console.log(err);
          } else{
            if(results === "borrado"){
              stream.write(`00017${datos}-borrado-si`);
            }
            else if(results === "noencontrado"){
              stream.write(`00017${datos}-borrado-no`);
            }
            console.log(results)
          }
        })
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
            else if(results === "noencontrado"){
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
      } else if (parts[1] === apreg) {
        crearpregunta(parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9], function(respuesta) {
          if (respuesta === "agregado") {
            console.log("Se agregó");
            stream.write(`00017${datos}-agregado-si`);
          } else if (respuesta === "noagregado") {
            console.log("No se agregó");
            stream.write(`00017${datos}-agregado-no`);
          }        
        });
      } else if (parts[1] === vpreg) {
        verpreguntas(parts[2], (err, preguntas) => {
          if (err) {
            console.log(err);
          } else {
            if (preguntas === "noencontrado") {
              service = `${datos}`;
              const message2 = `${service}-verpreg-no`;
              const largo = message2.length;
              const largo2 = largo.toString().padStart(5, '0');
              messagefinal = largo2 + message2;
              console.log(`Mensaje enviado: ${messagefinal}`);
              stream.write(messagefinal);
            } else {
                const message = preguntas.reduce((acc, pregunta) => {
                  const { ROWID, enunciado, OpcionA, OpcionB, OpcionC, OpcionD, OpcionE, OpcionCorrecta, id_prueba } = pregunta;
                  const resultado = `-[${ROWID},${enunciado},${OpcionA},${OpcionB},${OpcionC},${OpcionD},${OpcionE},${OpcionCorrecta},${id_prueba}]`;
                  return acc + resultado;
                }, '');
                service = `${datos}`;
                const message2 = `${service}-verpreg-si${message}`;
                const largo = message2.length;
                const largo2 = largo.toString().padStart(5, '0');
                messagefinal = largo2 + message2;
                console.log(`Mensaje enviado: ${messagefinal}`);
                stream.write(messagefinal);
            }
          }
        });
      } else if (parts[1] === bpreg) {
        borrarpregunta(parts[2], parts[3], (err, results) =>{
          if(err){
            console.log(err);
          } else{
            if(results === "eliminada"){
              stream.write(`00017${datos}-borrado-si`);
            }
            else if(results === "noeliminada"){
              stream.write(`00017${datos}-borrado-no`);
            }
            console.log(results)
          }
        })
      } else if (parts[1] === eusri) {
        editarUsuario(parts[2], parts[3], parts[4], parts[5], (err, results) =>{
          if(err){
            console.log(err);
          } else{
            if(results === "editado-usuario"){
              stream.write(`00017${datos}-usuario-si-editado`);
            }
            else if(results === "usuario-noeditado"){
              stream.write(`00017${datos}-usuario-no-editado`);
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
function borrarusuario(correo, callback) {
  const query = "DELETE FROM tabla_usuarios WHERE correo = ?";

  db.run(query, [correo], function (err) {
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
        callback(null, "agregado");
        console.log(`Prueba de ${asignatura} insertada correctamente.`);
      }
    }
  );
  
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
  const query = "DELETE FROM tabla_pruebas WHERE ROWID = ?";
  const deletePreguntasQuery = "DELETE FROM tabla_preguntas WHERE id_prueba = ?";

  // Eliminar todas las preguntas asociadas a la prueba
  db.run(deletePreguntasQuery, [id], function (err) {
    if (err) {
      callback(err);
    } else {
      // Continuar con la eliminación de la prueba
      db.run(query, [id], function (err) {
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
  });
}
function verUsuario( rol, callback) {
  const query = `SELECT * FROM tabla_usuarios`;
  /*console.log(rol)
  console.log(parseInt(rol) === 1)*/

  if (parseInt(rol) === 1 || parseInt(rol) === 2 ) {
    // Rol igual a 1, buscar todas las pruebas
    db.all(query, (err, results) => {
      if (err) {
        callback(err);
      } else {
        if (results.length === 0) {
          console.log("Usuario no encontrada");
          callback(null, "noencontrado");
        } else {
          const users = results.map((user) => {
            const { usuario, contraseña, rol, correo} = user;
            return {
              usuario,
              contraseña,
              rol,
              correo
            };
          });
          callback(null, users);
        }
      }
    });
  } else {
    // Otro rol no compatible
    callback(null, "noencontrado");
  }
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

function editarUsuario(usuario, contraseña, rol, correo, callback) {
  const query = `SELECT * FROM tabla_usuarios WHERE correo = ?`; //tengo que seleccionar el usuario por el correo
  const updateQuery = "UPDATE tabla_usuarios SET usuario = ?, contraseña = ?, rol = ? WHERE correo = ?";

  db.get(query, [correo], function(err, results) {
    if (err) {
      callback(err);
    } else {
      console.log(results)
      if (results) {
        db.run(updateQuery, [usuario, contraseña, rol, correo], function(err) {
          if (err) {
            callback(err);
          } else {
            if (this.changes > 0) {
              callback(null, "editado-usuario");
            } else {
              callback(null, "usuario-noeditado");
            }
          }
        });
      } else {
        callback(null, "usuario-noencontrado");
      }
    }
  });
}


function crearpregunta(enunciado, OpcionA, OpcionB, OpcionC, OpcionD, OpcionE, OpcionCorrecta, id_prueba, callback) {
  const countQuery = "SELECT cant_preg, num_preguntas FROM tabla_pruebas WHERE ROWID = ?";
  db.get(countQuery, [id_prueba], function(err, row) {
    if (err) {
      console.log('Error al obtener la cantidad de preguntas:', err);
      callback('noagregado');
    } else {
      if (row && row.cant_preg !== undefined && row.num_preguntas !== undefined) {

        
        const cantidadPreguntas = row.cant_preg;
        const limitePreguntas = row.num_preguntas;

        if (cantidadPreguntas >= limitePreguntas) {
          console.log('Se ha alcanzado el límite de preguntas para esta prueba.');
          callback('noagregado');
        }else{
          const query = "INSERT INTO tabla_preguntas (enunciado, OpcionA, OpcionB, OpcionC, OpcionD, OpcionE, OpcionCorrecta, id_prueba) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

          // Ejecutar la consulta para insertar los datos en la tabla
          db.run(query, [enunciado, OpcionA, OpcionB, OpcionC, OpcionD, OpcionE, OpcionCorrecta, id_prueba], function(err) {
            if (err) {
              console.log('Error al insertar la pregunta:', err);
              callback('noagregado'); // Pasar 'noagregado' al callback en caso de error
            } else {
              console.log('La pregunta ha sido agregada correctamente.');
                  const countQuery = "SELECT COUNT(*) AS cantidad FROM tabla_preguntas WHERE id_prueba = ?";

                  // Ejecutar la consulta para obtener la cantidad de preguntas
                  db.get(countQuery, [id_prueba], function(err, row) {
                    if (err) {
                      console.log('Error al contar las preguntas:', err);
                    } else {
                      const cantidadPreguntas = row.cantidad;
                      console.log(cantidadPreguntas)

                      // Consulta para actualizar la cantidad de preguntas en la tabla de pruebas
                      const updateQuery = "UPDATE tabla_pruebas SET cant_preg = ? WHERE ROWID = ?";

                      // Ejecutar la consulta de actualización
                      db.run(updateQuery, [cantidadPreguntas, id_prueba], function(err) {
                        if (err) {
                          console.log('Error al actualizar la cantidad de preguntas:', err);
                        } else {
                          console.log('Cantidad de preguntas actualizada correctamente.');
                          callback('agregado'); // Pasar 'agregado' al callback si se agrega correctamente
                        }
                      });
                    }
                  });
              
            }
          });

        }
    
      }
      
    }


  });


}
function borrarpregunta(id_pregunta,id_prueba, callback) {
  const countQuery = "SELECT cant_preg, num_preguntas FROM tabla_pruebas WHERE ROWID = ?";
  db.get(countQuery, [id_prueba], function(err, row) {
    if (err) {
      console.log('Error al obtener la cantidad de preguntas:', err);
      callback('noeliminada');
    } else {
      if (row && row.cant_preg !== undefined && row.num_preguntas !== undefined) {

        
        const cantidadPreguntas = row.cant_preg;
        const limitePreguntas = row.num_preguntas;

          const query = "DELETE FROM tabla_preguntas WHERE ROWID = ?";

          // Ejecutar la consulta para insertar los datos en la tabla
          db.run(query, [id_pregunta], function(err) {
            if (err) {
              console.log('Error al eliminar la pregunta:', err);
              callback('noeliminada'); // Pasar 'noagregado' al callback en caso de error
            } else {
              console.log('La pregunta ha sido eliminada correctamente.');
                  const countQuery = "SELECT COUNT(*) AS cantidad FROM tabla_preguntas WHERE id_prueba = ?";

                  // Ejecutar la consulta para obtener la cantidad de preguntas
                  db.get(countQuery, [id_prueba], function(err, row) {
                    if (err) {
                      console.log('Error al contar las preguntas:', err);
                    } else {
                      const cantidadPreguntas = row.cantidad;
                      console.log(cantidadPreguntas)

                      // Consulta para actualizar la cantidad de preguntas en la tabla de pruebas
                      const updateQuery = "UPDATE tabla_pruebas SET cant_preg = ? WHERE ROWID = ?";

                      // Ejecutar la consulta de actualización
                      db.run(updateQuery, [cantidadPreguntas, id_prueba], function(err) {
                        if (err) {
                          console.log('Error al actualizar la cantidad de preguntas:', err);
                        } else {
                          console.log('Cantidad de preguntas actualizada correctamente.');
                          callback('eliminada'); // Pasar 'agregado' al callback si se agrega correctamente
                        }
                      });
                    }
                  });
              
            }
          });

       
    
      }
      
    }


  });


}
function verpreguntas(id_prueba, callback) {
  const query = "SELECT ROWID, * FROM tabla_preguntas WHERE id_prueba = ?";

  const countQuery = "SELECT cant_preg, num_preguntas FROM tabla_pruebas WHERE ROWID = ?";

  db.get(countQuery, [id_prueba], function(err, row) {
    if (err) {
      callback(err);
    } else {
        db.all(query, [id_prueba], function(err, results) {
          if (err) {
            callback(err);
          } else {
            if (results.length === 0) {
              console.log("Prueba no encontrada");
              callback(null, "noencontrado");
            } else {
              const preguntas = results.map((pregunta) => {
                const { ROWID, enunciado, OpcionA, OpcionB, OpcionC, OpcionD, OpcionE, OpcionCorrecta, id_prueba } = pregunta;
                return {
                  ROWID,
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
              callback(null, preguntas);
            }
          }
        });
       
    }
  });
}


