const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

let letra = "z"
const regis = `regs${letra}`;
const login = `logn${letra}`;
const datos = `dats${letra}`;
const prueb = `prub${letra}`;
const vprue = `vpre${letra}`;

const sshConfig = {
  host: '200.14.84.16',
  port: 8080,
  username: 'gabriel.gonzalez1',
  password: 'gabriel20781'
};

function contarcaracteres(message2){
  let largo = message2.length;
  let largo2 = largo.toString().padStart(5, '0');
  let messagefinal = largo2 + message2;
  return messagefinal;
}
// Exportar las variables
module.exports = {
  regis,
  login,
  datos, 
  prueb,
  vprue,
  contarcaracteres,
  sshConfig
};
//module.exports = contarcaracteres;

// Consulta para crear la tabla
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tabla_usuarios (
    usuario TEXT,
    contraseña TEXT,
    rol TEXT,
    correo TEXT UNIQUE
  )
`;

const dropTableQuery = 'DROP TABLE IF EXISTS tabla_pruebas';
const createTableQuery2 = 'CREATE TABLE tabla_pruebas (ROWID INTEGER PRIMARY KEY AUTOINCREMENT, nombreprueba TEXT, asignatura TEXT, correo_creador TEXT, num_preguntas INTEGER, cant_preg INTEGER)';
// Primero, eliminamos la tabla si existe
/*db.run(dropTableQuery, function(err) {
  if (err) {
    console.error(err);
    return;
  }

  // Luego, creamos la tabla nuevamente
  db.run(createTableQuery2, function(err) {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Tabla "tabla_pruebas" creada correctamente');
  });
});
// Ejecutar la consulta

db.run(createTableQuery, (error) => {
  if (error) {
    console.error('Error al crear la tabla:', error.message);
  } else {
    console.log('Tabla creada exitosamente');
  }

  // Cerrar la conexión a la base de datos
});
// Ejecutar la consulta
db.run(createTableQuery2, (error) => {
  if (error) {
    console.error('Error al crear la tabla:', error.message);
  } else {
    console.log('Tabla creada exitosamente');
  }

  // Cerrar la conexión a la base de datos
});
*/

/*const dropTableQuery = 'DROP TABLE IF EXISTS tabla-usuarios';

// Ejecutar la consulta
db.run(dropTableQuery, (error) => {
  if (error) {
    console.error('Error al borrar la tabla:', error.message);
  } else {
    console.log('Tabla borrada exitosamente');
  }

  // Cerrar la conexión a la base de datos
  db.close();
});*/