const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

const { Client } = require('ssh2');

const conn = new Client();

const {vpreg, regis, login, datos, prueb, vprue,sshConfig, contarcaracteres } = require('./variables.js');
// Ejecutar la consulta para crear la tabla


/*data = "${servicio}-${service}-${enunciado}-${OpcionA}-${OpcionB}-${OpcionC}-${OpcionD}-${OpcionE}-${OpcionCorrecta}-4"

const message = data.toString().trim();

const response = message.toString().substring(5);
console.log("Datos recibidos:", response);

const parts = response.split("-");
console.log("Valor de parts[2]:", parts[2]);
console.log("Valor de parts[3]:", parts[3]);
console.log("Valor de parts[4]:", parts[4]);
console.log("Valor de parts[5]:", parts[5]);
console.log("Valor de parts[6]:", parts[6]);
console.log("Valor de parts[7]:", parts[7]);
console.log("Valor de parts[8]:", parts[8]);
console.log("Valor de parts[9]:", parts[9]);

crearpregunta(parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9], parts[10], function(err, results) {
  if (err) {
    console.log(err);
  } else {
    if (results === "agregado") {
      //stream.write(`00017${datos}-agregado-si`);
    } else if (results === "noagregado") {
      //stream.write(`00017${datos}-agregado-no`);
    }
  }
});*/

verpreguntas(4, (err, preguntas) => {
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
      //stream.write(messagefinal);
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
        //stream.write(messagefinal);
        data = messagefinal;
        const response = data.toString().substring(5); 
        console.log('\nDatos recibidos:', response);
        const parts = response.split('-');

        if(parts[0] ===`${vpreg}`){
          if (response.trim() !== '' &&parts[1]) {
          
            servicio = `${datos}`;
            console.log(`id_prueba: ${parts[1]}`)
            nuevaconsulta =`${servicio}-${vpreg}-${parts[1]}`;
            messagefinal = contarcaracteres(nuevaconsulta);
            console.log(`Mensaje enviado: ${messagefinal}/n`);
            stream.write(messagefinal);
          }
        }
        else{
            if(parts[2]==="si"){
                let message = `${vpreg}-`+parts.slice(1).join('-');
                let messagef = contarcaracteres(message);
                console.log(`\nMensaje final: ${messagef}`)
                //stream.write(messagef)
              }
              else if(parts[2]==="no"){
                let message = `${vpreg}-`+parts.slice(1).join('-');
                let messagef = contarcaracteres(message);
                console.log(`Mensaje final: ${messagef}`)
                //stream.write(messagef)
              }
        }
        
    }
  }
});



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



