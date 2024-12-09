const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/database')
const blogRoutes = require('./routes/BlogRoutes')

dotenv.config()
connectDB()

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: allowedOrigin
}));
app.use(express.json())

app.use('/blogs', blogRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
