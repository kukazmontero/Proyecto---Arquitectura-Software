const { spawn } = require('child_process');
const path = require('path');

// Archivos de servicio a ejecutar
const servicios = ['bbdd.js', 'registro.js', 'pruebas.js', 'login.js', 'verpruebas.js', 'borrarprueba.js', 'verusuario.js'];

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

