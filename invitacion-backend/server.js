const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Puerto dinámico (Render o local)
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// 🔗 Conexión a MongoDB Atlas
// Nota: En versiones recientes de Mongoose (6+), ya no se usan:
// useNewUrlParser ni useUnifiedTopology. Por eso daba error.
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ ERROR: La variable MONGO_URI no está definida en Render.");
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado exitosamente a MongoDB"))
  .catch(err => console.error("❌ Error de conexión a MongoDB:", err.message));

// 📦 Modelo de Invitado
const Invitado = mongoose.model('Invitado', new mongoose.Schema({
  nombre: { type: String, required: true },
  asistentes: { type: Number, default: 1 },
  asiste: { type: Boolean, default: true },
  mensaje: { type: String, default: "" },
  fecha: { type: Date, default: Date.now }
}));

// 🟢 Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Backend de invitación funcionando y conectado a la base de datos');
});

// 📌 Endpoint RSVP
app.post('/rsvp', async (req, res) => {
  try {
    const { nombre, asistentes, asiste, mensaje } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio" });
    }

    const nuevoInvitado = new Invitado({
      nombre,
      asistentes: Number(asistentes) || 1,
      // Maneja tanto booleanos reales como strings "true"/"false"
      asiste: String(asiste) === "true", 
      mensaje: mensaje || ""
    });

    const doc = await nuevoInvitado.save();
    console.log("💾 Invitado guardado en la nube:", doc);

    res.json({ ok: true, invitado: doc });
  } catch (error) {
    console.error("❌ Error en /rsvp:", error);
    res.status(500).json({ 
      error: "Error al guardar en MongoDB", 
      detalles: error.message 
    });
  }
});

// 🚀 Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
