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
// Asegúrate de crear en Render la variable:
// Name: MONGO_URI
// Value: mongodb+srv://zoe:Kcm1524@cluster0.bm26fqs.mongodb.net/invitacion?retryWrites=true&w=majority
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // Timeout 30s
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error MongoDB:", err));

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
  res.send('🚀 Backend de invitación funcionando');
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
      asiste: asiste === "true" || asiste === true,
      mensaje
    });

    const doc = await nuevoInvitado.save();
    console.log("💾 Invitado guardado:", doc);

    res.json({ ok: true, invitado: doc });
  } catch (error) {
    console.error("❌ Error en /rsvp:", error);
    res.status(500).json({ error: "Error al guardar en MongoDB", detalles: error.message });
  }
});

// 🚀 Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
