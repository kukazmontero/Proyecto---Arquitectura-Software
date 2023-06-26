const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

const regis = 'reges';
const login = 'logen';
const datos = 'dates';
const prueb = 'prueb';
const sshConfig = {
  host: '200.14.84.16',
  port: 8080,
  username: 'gabriel.gonzalez1',
  password: 'gabriel20781'
};


// Exportar las variables
module.exports = {
  regis,
  login,
  datos, 
  prueb,
  sshConfig
};

// Consulta para crear la tabla
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS tabla_usuarios (
    usuario TEXT,
    contraseña TEXT,
    rol TEXT,
    correo TEXT UNIQUE
  )
`;
const createTableQuery2 = `
  CREATE TABLE IF NOT EXISTS tabla_pruebas (
    nombreprueba TEXT,
    asignatura TEXT,
    correo_creador TEXT,
    num_preguntas INTEGER, 
    cant_preg INTEGER
  )
`;
// Ejecutar la consulta
/*
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