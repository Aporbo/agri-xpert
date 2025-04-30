const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const farmerRoutes = require('./routes/farmerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const govtRoutes = require('./routes/govtOfficialRoutes');
const researcherRoutes = require('./routes/researcherRoutes');

// Load environment
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/farmer', farmerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/govt', govtRoutes);
app.use('/api/researcher', researcherRoutes);


// Test Route
app.get('/', (req, res) => {
  res.send('Agri Expert API Running ✅');
});

// Routes Placeholder
// app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/farmer', require('./routes/farmerRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/researcher', require('./routes/researcherRoutes'));
// app.use('/api/govtofficial', require('./routes/govtOfficialRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
