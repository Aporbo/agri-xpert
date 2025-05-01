const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const govtRoutes = require('./routes/govtOfficialRoutes');
const researcherRoutes = require('./routes/researcherRoutes');

// Load env
dotenv.config();

// Connect DB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
const farmerRoutes = require('./routes/farmerRoutes');


// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/govt', govtRoutes);
app.use('/api/researcher', researcherRoutes);


// Health check
app.get('/', (req, res) => res.send('Agri Expert API Running ✅'));

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
