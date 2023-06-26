const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const clientelogin = require('./Clientes/cliente-login');
const clienteregistro = require('./Clientes/cliente-registro');
const { clienteprueba, clienteverprueba } = require('./Clientes/cliente-prueba');
//const { clienteverprueba } = require('./Servicios/auxxx');


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: true
}));

// Ruta para el formulario HTML
app.get('/', (req, res) => {
  res.render('login');
});

// Ruta para procesar el formulario enviado por POST
app.post('/formulario', async (req, res) => {
  const { password, correo } = req.body;

  try {
    const respuesta = await clientelogin(password, correo);
    console.log(respuesta);

    if (respuesta.resultado === "si") {
      req.session.loggedIn = true;
      req.session.correo = correo;
      req.session.nombre = respuesta.nombre;
      req.session.contraseña = respuesta.contraseña;
      req.session.rol = respuesta.rol;
  
      // Realizar las acciones correspondientes con los datos del usuario
  
      res.redirect('/home');
    } else if (respuesta.resultado === "mal") {
      res.send("La contraseña es incorrecta");
    } else if (respuesta.resultado === "no") {
      res.send("El usuario no existe");
    }
  } catch (error) {
    console.error(error);
    res.send("Error en la conexión SSH");
  }
});

app.post('/formprueba', async (req, res) => {
  const { nombreprueba, asignatura, num_preg } = req.body;
  let correo_creador = req.session.correo;
  try {
    const respuesta = await clienteprueba(nombreprueba, asignatura, correo_creador, num_preg);
    console.log(respuesta);

    if (respuesta === "si") {
      res.redirect('ver_pruebas');
    } else if (respuesta === "no") {
      res.render("home");
    }
  } catch (error) {
    console.error(error);
    res.send("Error en la conexión SSH");
  }
});
app.post('/verpruebas', async (req, res) => {
  let rol = req.session.rol;
  try {
    const respuesta = await clienteverprueba(rol);
    console.log(respuesta);

    if (respuesta === "si") {
      res.redirect('ver_pruebas');
    } else if (respuesta === "no") {
      res.render("/");
    }
  } catch (error) {
    console.error(error);
    res.send("Error en la conexión SSH");
  }
});

app.post('/registrousuario', async (req, res) => {
  const { nombre, correo, password, rol } = req.body;

  try {
    const respuesta = await clienteregistro(nombre, correo , password, rol);
    console.log(respuesta);

    if (respuesta === "si") {
      res.render('registrar_usuario');
    } else if (respuesta === "no") {
      res.render("home");
    }
  } catch (error) {
    console.error(error);
    res.send("Error en la conexión SSH");
  }
});

// Ruta para las opciones después del inicio de sesión
app.get('/home', (req, res) => {
  if (req.session.loggedIn) {
    const { nombre, correo, contraseña, rol } = req.session;

    res.render('home', { nombre, correo, contraseña, rol });
  } else {
    res.redirect('/');
  }
});
// Rutas para cada opción
app.get('/registrarusuario', (req, res) => {
  if (req.session.loggedIn) {
    res.render('registrar_usuario');
  } else {
    res.redirect('/');
  }
});

app.get('/crearprueba', (req, res) => {
  if (req.session.loggedIn) {
    const { nombre, correo, contraseña, rol } = req.session;

    res.render('crearprueba', { nombre, correo, contraseña, rol });
  } else {
    res.redirect('/');
  }
});

app.get('/ver_pruebas', async (req, res) => {
  if (req.session.loggedIn) {
  let rol = req.session.rol;
  try {
    const respuesta = await clienteverprueba(rol);
    console.log(respuesta);
    res.render('ver-pruebas', { respuesta: respuesta });

  } catch (error) {
    console.error(error);
    res.send("Error en la conexión SSH");
  }
  
    
  } else {
    res.redirect('/');
  }
});

app.get('/cerrar_sesion', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});