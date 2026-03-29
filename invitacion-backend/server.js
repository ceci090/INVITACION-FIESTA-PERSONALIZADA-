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
mongoose.connect('mongodb+srv://zoe:Kcm1524@cluster0.bm26fqs.mongodb.net/invitacion?retryWrites=true&w=majority')
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error Mongo:", err));

// 📦 Modelo
const Invitado = mongoose.model('Invitado', {
  nombre: { type: String, required: true },
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

    // Crear nuevo documento
    const nuevo = new Invitado({
      nombre,
      asistentes,
      asiste,
      mensaje,
      fecha: new Date()
    });

    // Guardar en MongoDB con try/catch interno para capturar errores de Atlas
    await nuevo.save()
      .then(doc => console.log("💾 Guardado:", doc))
      .catch(err => {
        console.error("❌ Error al guardar en Mongo:", err);
        return res.status(500).json({ error: "Error al guardar en MongoDB", detalles: err.message });
      });

    res.json({ ok: true });

  } catch (error) {
    console.error("❌ Error general en /rsvp:", error);
    res.status(500).json({ error: "Error al guardar", detalles: error.message });
  }
});

// 🚀 Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
