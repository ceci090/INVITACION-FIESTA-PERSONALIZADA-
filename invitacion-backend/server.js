const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://Invitacion:Kcm1524@cluster0.zwlmkh8.mongodb.net/invitacion?retryWrites=true&w=majority')
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error Mongo:", err));

// 📦 Modelo (adaptado a tu formulario)
const Invitado = mongoose.model('Invitado', {
  nombre: String,
  asistentes: String,
  asiste: String,
  mensaje: String,
  fecha: Date
});

// 📌 Endpoint RSVP
app.post('/rsvp', async (req, res) => {
  try {
    const { nombre, asistentes, asiste, mensaje } = req.body;

    // Validación básica
    if (!nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const nuevo = new Invitado({
      nombre,
      asistentes,
      asiste,
      mensaje,
      fecha: new Date()
    });

    await nuevo.save();

    console.log("💾 Guardado:", nuevo);

    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al guardar" });
  }
});

// 🚀 Servidor
app.listen(3000, () => {
  console.log("🚀 Servidor en http://localhost:3000");
});