// librerias necesarias :)
const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

// Middleware para manejar JSON en el body
app.use(express.json());

// Ruta principal (GET)
app.get("/", (req, res) => {
  res.send("Hola!!! ¡La API está funcionando correctamente!");
});

// Leer archivo JSON
const leerIntegrantes = () => {
  const data = fs.readFileSync("./integrantes.json", "utf-8");
  return JSON.parse(data);
};

// Escribir archivo JSON
const guardarIntegrantes = (integrantes) => {
  fs.writeFileSync("./integrantes.json", JSON.stringify(integrantes, null, 2));
};

// Ruta para obtener todos los integrantes (GET)
app.get("/integrantes", (req, res) => {
  const integrantes = leerIntegrantes();
  res.json(integrantes);
});

// Ruta para obtener un integrante por DNI (GET)
app.get("/integrantes/:dni", (req, res) => {
  const { dni } = req.params;
  const integrantes = leerIntegrantes();
  const integrante = integrantes.find((i) => i.dni === dni);
  if (integrante) {
    res.json(integrante);
  } else {
    res.status(404).send("Integrante no encontrado.");
  }
});

// Ruta para agregar un nuevo integrante (POST)
app.post("/integrantes/agregar", (req, res) => {
  const { nombre, apellido, dni, mail } = req.body;
  if (!nombre || !apellido || !dni || !mail) {
    return res.status(400).send("Faltan datos para agregar el integrante.");
  }
  const integrantes = leerIntegrantes();
  integrantes.push({ nombre, apellido, dni, mail });
  guardarIntegrantes(integrantes);
  res.json(integrantes);
});

// Ruta para actualizar el apellido por mail (PUT)
app.put("/integrantes/:mail", (req, res) => {
  const { mail } = req.params;
  const { apellido } = req.body;
  const integrantes = leerIntegrantes();
  const integrante = integrantes.find((i) => i.mail === mail);
  if (integrante) {
    integrante.apellido = apellido || integrante.apellido;
    guardarIntegrantes(integrantes);
    res.json(integrante);
  } else {
    res.status(404).send("Integrante no encontrado.");
  }
});

// Ruta para eliminar un integrante por DNI (DELETE)
app.delete("/integrantes/:dni", (req, res) => {
  const { dni } = req.params;
  let integrantes = leerIntegrantes();
  const integranteExistente = integrantes.some((i) => i.dni === dni);
  if (integranteExistente) {
    integrantes = integrantes.filter((i) => i.dni !== dni);
    guardarIntegrantes(integrantes);
    res.json(integrantes);
  } else {
    res.status(404).send("Integrante no encontrado.");
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`);
});