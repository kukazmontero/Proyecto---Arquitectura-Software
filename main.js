const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
const path = require('path');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const { clientelogin, clienteverusuario, clienteregistro, clienteborrarusuario  } = require('./Clientes/cliente-login');
const { clienteprueba, clienteverprueba, clienteborrarprueba, clienteeditarprueba } = require('./Clientes/cliente-prueba.js');
const { clientepregunta , clienteverpregunta, clienteborrarpregunta } = require('./Clientes/cliente-pregunta');

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
      res.redirect("home");
    }
  } catch (error) {
    console.error(error);
    res.send("Error en la conexión SSH");
  }
});
app.post('/formpregunta', async (req, res) => {
  const { enunciado, OpcionA, OpcionB, OpcionC, OpcionD, OpcionE, OpcionCorrecta, id_prueba} = req.body;
  try {
    const respuesta = await clientepregunta(enunciado, OpcionA, OpcionB, OpcionC, OpcionD, OpcionE, OpcionCorrecta, id_prueba);
    console.log(respuesta);

    if (respuesta === "si") {
      res.redirect('ver_pruebas');
    } else if (respuesta === "no") {
      res.redirect("home");
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
app.get('/ver_usuarios', async (req, res) => {
  if (req.session.loggedIn) {
  let rol = req.session.rol;
  let correo = req.session.correo;
  try {
    if(parseInt(rol)===1)  {
        const respuesta = await clienteverusuario(rol);
        console.log(respuesta);
        res.render('ver_usuarios', { respuesta: respuesta, rol: rol , correo: correo});
    }
    else{
      res.redirect(home);
    }

  } catch (error) {
    console.error(error);
    res.send("Error en la conexión SSH");
  }
  
    
  } else {
    res.redirect('/');
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
app.post('/borrarusuario', async (req, res) => {
  const correo = req.body.correo;
  const rol = req.session.rol

  if (req.session.loggedIn) {
    if(parseInt(rol)===1){
      try {
        const respuesta = await clienteborrarusuario(correo);
        console.log(respuesta);
        res.redirect('ver_usuarios');

      } catch (error) {
        console.error(error);
        res.send("Error en la conexión SSH");
      }
    }
    else{
      res.redirect('home');
    }
 
      
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
    res.render('ver-pruebas', { respuesta: respuesta, rol: rol });

  } catch (error) {
    console.error(error);
    res.send("Error en la conexión SSH");
  }
  
    
  } else {
    res.redirect('/');
  }
});
app.post("/modificarprueba", async (req, res) => {
  const id_prueba = req.body.id;
  const nombreprueba = req.body.nombreprueba;
  const asignatura = req.body.asignatura;
  const num_preg = req.body.num_preg;

  correo = req.session.correo;
  console.log(id_prueba, nombreprueba, asignatura, correo, num_preg);

  if (req.session.loggedIn) {
    try {
      res.render("editarprueba", { id_prueba: id_prueba });
    } catch (error) {
      console.error(error);
      res.send("Error en la conexión SSH");
    }
  } else {
    res.redirect("/");
  }
});

app.post("/formedit", async (req, res) => {
  const {nombreprueba, asignatura, num_preg } = req.body;
  let correo_creador = req.session.correo;
  const id_prueba = req.body.id_prueba;
  try {
    const respuesta = await clienteeditarprueba(
      id_prueba,
      nombreprueba,
      asignatura,
      correo_creador,
      num_preg
    );
    console.log(respuesta);

      res.redirect("ver_pruebas");
    
  } catch (error) {
    console.error(error);
    res.send("Error en la conexión SSH");
  }
});

app.post('/ver_preguntas', async (req, res) => {
  if (req.session.loggedIn) {
    let rol = req.session.rol;
    const id_prueba = req.body.id;
    
    try {
      const respuesta = await clienteverpregunta(id_prueba);
      console.log(respuesta);
      if(parseInt(rol) === 3){
        res.render('ver-preguntas', { respuesta: respuesta, rol: rol});
      } else {
        res.render('ver-preguntas', { respuesta: respuesta, rol: rol});
      }
        
    } catch (error) {
      console.error(error);
      res.send("Error en la conexión SSH");
    }
  
    
  } else {
    res.redirect('/');
  }
});
app.post('/borrarprueba', async (req, res) => {
  const id_prueba = req.body.id;
  correo = req.session.correo

  if (req.session.loggedIn) {
 
    try {
      const respuesta = await clienteborrarprueba(id_prueba, correo);
      console.log(respuesta);
      res.redirect('ver_pruebas');

    } catch (error) {
      console.error(error);
      res.send("Error en la conexión SSH");
    }
  } else {
    res.redirect('/');
  }
});
app.post('/borrarpregunta', async (req, res) => {
  const id_pregunta = req.body.id;
  const id_prueba = req.body.id_prueba;
  console.log(id_pregunta, '   ',id_prueba )


  if (req.session.loggedIn) {
 
    try {
      const respuesta = await clienteborrarpregunta(id_pregunta, id_prueba);
      console.log(respuesta);
      res.redirect('ver_preguntas');

    } catch (error) {
      console.error(error);
      res.send("Error en la conexión SSH");
    }
  } else {
    res.redirect('/');
  }
});
app.post('/agregarpregunta', async (req, res) => {
  const id_prueba = req.body.id;
  rol = req.session.rol;
  parseInt(rol)

  if (req.session.loggedIn && rol != 3) {
    try {
      res.render('agregarpregunta', { id_prueba });

    } catch (error) {
      console.error(error);
      res.send("Error en la conexión SSH");
    }
  } else {
    res.send("Usuario no Permitido");
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