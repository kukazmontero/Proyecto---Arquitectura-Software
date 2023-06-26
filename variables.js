const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

const regis = 'regxs';
const login = 'logxs';
const datos = 'datxs';
const sshConfig = {
  host: '200.14.84.16',
  port: 8080,
  username: 'lukas.montero',
  password: 'lukas12344321'
};


// Exportar las variables
module.exports = {
  regis,
  login,
  datos, 
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

// Ejecutar la consulta
db.run(createTableQuery, (error) => {
  if (error) {
    console.error('Error al crear la tabla:', error.message);
  } else {
    console.log('Tabla creada exitosamente');
  }

  // Cerrar la conexión a la base de datos
  db.close();
});

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