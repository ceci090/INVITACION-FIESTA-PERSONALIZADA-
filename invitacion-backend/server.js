const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// ✅ Puerto dinámico para Render
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// 🔗 Conexión a MongoDB Atlas usando variable de entorno
// Antes de esto, en Render crea una Environment Variable:
// Name: MONGO_URI
// Value: mongodb+srv://zoe:Kcm1524@cluster0.bm26fqs.mongodb.net/invitacion?retryWrites=true&w=majority
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // 30 segundos
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error Mongo:", err));

// 📦 Modelo
const Invitado = mongoose.model('Invitado', {
  nombre: { type: String, required: true },
  asistentes: String,
  asiste: String,
  mensaje: String,
  fecha: { type: Date, default: Date.now }
});

// 🟢 Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Backend de invitación funcionando');
});

// 📌 Endpoint RSVP
app.post('/rsvp', async (req, res) => {
  try {
    const { nombre, asistentes, asiste, mensaje } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const nuevo = new Invitado({ nombre, asistentes, asiste, mensaje });
    const doc = await nuevo.save();
    console.log("💾 Guardado:", doc);

    res.json({ ok: true });
  } catch (error) {
    console.error("❌ Error en /rsvp:", error);
    res.status(500).json({ error: "Error al guardar en MongoDB", detalles: error.message });
  }
});

// 🚀 Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
