const { spawn } = require('child_process');
const path = require('path');

// Archivos de servicio a ejecutar
const servicios = ['BaseDeDatos/bbdd.js', 'Usuario/registro.js', 'Pruebas/pruebas.js',
 'Usuario/login.js', 'Pruebas/verpruebas.js', 'Pruebas/borrarprueba.js',  
 'Preguntas/agregarpreg.js', 'Preguntas/verpreguntas.js', 'Preguntas/borrarpregunta.js', 
 'Pruebas/editarprueba.js', 'Usuario/verusuario.js', 'Usuario/borrarusuario.js', 'Usuario/editarusuario.js'];
 
servicios.forEach((servicio) => {
  const nombreServicio = path.basename(servicio, '.js'); // Obtener el nombre del servicio sin la extensión

  const proceso = spawn('node', [servicio]);

  proceso.stdout.on('data', (data) => {
    console.log(`[${nombreServicio}] ${data}`);
    // Aquí puedes procesar la respuesta recibida del servicio en tiempo real
    // según tus necesidades
  });

  proceso.stderr.on('data', (data) => {
    console.error(`[${nombreServicio}] Error: ${data}`);
  });
});