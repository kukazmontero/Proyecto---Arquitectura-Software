const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('mydatabase.db');

let letra = "b"
const regis = `regs${letra}`;
const login = `logn${letra}`;
const datos = `dats${letra}`;
const prueb = `prub${letra}`;
const vprue = `vpre${letra}`;
const dprue = `dpre${letra}`;
const vusri = `vusr${letra}`;
const eprue = `epre${letra}`

const sshConfig = {
  host: '200.14.84.16',
  port: 8080,
  username: 'lukas.montero',
  password: 'lukas12344321'
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
  dprue,
  vusri,
  eprue,
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