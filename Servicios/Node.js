const { spawn } = require('child_process');
const path = require('path');

// Archivos de servicio a ejecutar
const servicios = ['BaseDeDatos/bbdd.js', 'Usuario/registro.js', 'Pruebas/pruebas.js',
 'Usuario/login.js', 'Pruebas/verpruebas.js', 'Pruebas/borrarprueba.js',  
 'Preguntas/agregarpreg.js', 'Preguntas/verpreguntas.js', 'Preguntas/borrarpregunta.js', 
 'Pruebas/editarprueba.js', 'Usuario/verusuario.js', 'Usuario/borrarusuario.js', 
 'Preguntas/editarpregunta.js', 'Puntajes/guardarpuntaje.js', 'Puntajes/verpuntajes.js'];
 
 const procesos = [];

 servicios.forEach((servicio) => {
   const nombreServicio = path.basename(servicio, '.js');
   const proceso = spawn('node', [servicio]);
 
   proceso.stdout.on('data', (data) => {
     console.log(`[${nombreServicio}] ${data}`);
   });
 
   proceso.stderr.on('data', (data) => {
     console.error(`[${nombreServicio}] Error: ${data}`);
   });
 
   procesos.push(proceso);
 });
 
 // Capturar la señal SIGINT
 process.on('SIGINT', () => {
   console.log('Cerrando servicios...');
 
   // Finalizar todos los procesos antes de salir
   procesos.forEach((proceso) => {
     proceso.kill();
   });
 
   // Esperar a que todos los procesos se cierren antes de salir
   Promise.all(procesos.map((proceso) => new Promise((resolve) => proceso.on('close', resolve))))
     .then(() => {
       console.log('Servicios cerrados correctamente.');
       process.exit(0); // Salir del programa
     })
     .catch((error) => {
       console.error('Error al cerrar los servicios:', error);
       process.exit(1); // Salir del programa con código de error
     });
 });