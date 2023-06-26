const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

const { Client } = require('ssh2');

const conn = new Client();

const { regis, login, datos, prueb, vprue,sshConfig } = require('./variables.js');



        verPrueba(1, (err, results) => {
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
              } else {
                  const message = results.reduce((acc, prueba) => {
                  const {id, nombreprueba, asignatura, correo_creador, num_preguntas, cant_preg } = prueba;
                  const resultado = `-[${id},${nombreprueba},${asignatura},${correo_creador},${num_preguntas},${cant_preg}]`;
                  return acc + resultado;
                }, '');
                service = `${datos}`; 
                const message2 = `${service}-verprueba-si${message}`;
                const largo = message2.length;
                const largo2 = largo.toString().padStart(5, '0');
                messagefinal = largo2 + message2;
                console.log(`Mensaje enviado: ${messagefinal}`);
              }
            }
          });
        


      




function verPrueba( rol, callback) {
  const query = `SELECT * FROM tabla_pruebas`;
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
