const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("mydatabase.db");

function randomizarCaracter() {
  var caracteres = "abcdefghijklmnopqrstuvwxyz0123456789";
  var indice = Math.floor(Math.random() * caracteres.length);
  var letra = caracteres.charAt(indice);
  return letra;
}

var letra = "p";

const regis = `regs${letra}`;
const login = `logn${letra}`;
const datos = `dats${letra}`;
const prueb = `prub${letra}`;
const vprue = `vpre${letra}`;
const dprue = `dpre${letra}`;
const apreg = `aprg${letra}`;
const vpreg = `vprg${letra}`;
const bpreg = `bprg${letra}`;
const vusri = `vusr${letra}`;
const eprue = `epre${letra}`;
const busri = `busr${letra}`;
const eusri = `eusr${letra}`;
const epreg = `eprx${letra}`;
const gptj = `gptj${letra}`;
const vpunt = `vpun${letra}`;

const sshConfig = {
  host: "200.14.84.16",
  port: 8080,
  username: "lukas.montero",
  password: "lukas12344321",
};

function contarcaracteres(message2) {
  let largo = message2.length;
  let largo2 = largo.toString().padStart(5, "0");
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
  apreg,
  vpreg,
  bpreg,
  vusri,
  eprue,
  busri,
  eusri,
  epreg,
  gptj,
  vpunt,
  contarcaracteres,
  sshConfig,
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

const dropTableQuery = "DROP TABLE IF EXISTS tabla_pruebas";
const createTableQuery2 =
  "CREATE TABLE tabla_pruebas (ROWID INTEGER PRIMARY KEY AUTOINCREMENT, nombreprueba TEXT, asignatura TEXT, correo_creador TEXT, num_preguntas INTEGER, cant_preg INTEGER)";

const dropTableQuery3 = "DROP TABLE IF EXISTS tabla_puntajes";
const createTableQuery3 =
  "CREATE TABLE tabla_puntajes (ROWID INTEGER PRIMARY KEY AUTOINCREMENT, nombreprueba TEXT, correo_usuario TEXT, puntaje INTEGER)";

db.run(
  `
  CREATE TABLE IF NOT EXISTS tabla_puntajes (
    correo_alumno TEXT,
    id_prueba INTEGER,
    puntaje_obtenido INTEGER,
    FOREIGN KEY (correo_alumno) REFERENCES tabla_usuarios(correo),
    FOREIGN KEY (id_prueba) REFERENCES tabla_pruebas(ROWID)
  )
`,
  (error) => {
    if (error) {
      console.error("Error al crear la tabla tabla_puntajes:", error);
    } else {
      console.log("La tabla tabla_puntajes ha sido creada correctamente");
    }

    // Cierra la conexión a la base de datos
    db.close();
  }
);
