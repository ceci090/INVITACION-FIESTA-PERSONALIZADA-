const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Puerto dinámico (IMPORTANTE para Render)
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// 🔗 Conexión a MongoDB Atlas
mongoose.connect('mongodb+srv://zoe:Kcm1524@cluster0.bm26fqs.mongodb.net/?appName=Cluster0')
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ Error Mongo:", err));

// 📦 Modelo
const Invitado = mongoose.model('Invitado', {
  nombre: String,
  asistentes: String,
  asiste: String,
  mensaje: String,
  fecha: Date
});

// 🟢 Ruta de prueba (para verificar que el servidor funciona)
app.get('/', (req, res) => {
  res.send('🚀 Backend de invitación funcionando');
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
    console.log("❌ Error:", error);
    res.status(500).json({ error: "Error al guardar" });
  }
});

// 🚀 Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
