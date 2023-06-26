const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

const { Client } = require('ssh2');

const conn = new Client();

const { regis, login, datos, sshConfig } = require('./variables.js');


conn.on('ready', () => {
  console.log('Conexión SSH establecida');
    conn.exec('telnet localhost 5000', (err, stream) => {
      if (err) throw err;

      stream.on('data', (data) => {
        const message = data.toString().trim();

        const response = message.toString().substring(5);
        console.log('Datos recibidos:', response);
        

        const parts = response.split('-'); 
      
      
        if (parts[1]===regis) {
          registro(parts[2], parts[3], parts[4], parts[5], (err, results)=> {
              if (err) {
                console.log(err)
              } else {
                  if(results==='agregado'){
                      stream.write(`00014${datos}-agregado-si`);
                  }
                  else if(results==='noagregado'){
                      stream.write(`00016${datos}-agregado-no`);
                  }
              }
          });       
        }
        else if (parts[1]===login) {
          ingreso(parts[2], parts[3], (err, results)=> {
            if (err) {
              console.log(err)
            } else {
                if(results.aux==='correcta'){
                    stream.write(`00016${datos}-logeado-si-${results.usuario}-${results.correo}-${results.contraseña}-${results.rol}`);
                }
                if(results==='incorrecta'){
                      stream.write(`00016${datos}-logeado-mal`);
                  }
                else if(results==='noencontrado'){
                    stream.write(`00016${datos}-logeado-no`);
                }
            }
          });       
      }
      });
      const command = `00010sinit${datos}`;
      stream.write(command);
    }); 

});

conn.connect(sshConfig);

function registro(username, password, correo, rol, callback) {
    // Ejemplo de consulta a la base de datos con los valores de username y password como parámetros
    const query = `SELECT * FROM tabla_usuarios WHERE correo = ?`;
    const query2 = 'INSERT INTO tabla_usuarios (usuario, contraseña, rol, correo) VALUES (?, ?, ?, ?)';

    // Ejecutar la consulta con los valores de username y password como parámetros
    db.all(query, [correo], (err, results) => {
        // Llamar al callback con los resultados o el error
        if (err) {
        callback(err);
        } else {
            if (results.length === 0) {
                
                db.run(query2, [username, password, rol, correo], function(err) {
                    if (err) {
                      console.error(err);
                    } else {
                      console.log(`Usuario ${username} insertado correctamente.`);
                    }
                });
                // No se encontraron usuarios
                callback(null, 'agregado');
              } else {
                console.log(`Usuario ${username} ya existe.`);

                // Usuario encontrado
                callback(null, 'noagregado');

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
                callback(null, 'noencontrado');
                } else {
                    console.log(`Usuario ${correo} encontrado. \n`);
                    db.all(query2, [correo, password], (err, results) => {
                        if (err) {
                        callback(err);
                        } else {
                            if(results.length === 0){
                                console.log("Contraseña incorrecta")
                                callback(null, 'incorrecta');
                            }
                            else{
                              const dusuario = results[0];
                              const { usuario, correo, contraseña, rol } = dusuario;
                              const aux = "correcta"
                              const datosUsuario = {
                                aux,
                                usuario,
                                correo,
                                contraseña,
                                rol
                              };
                              callback(null, datosUsuario);
                            }
                        }
                    });
                }
            }
    });
}