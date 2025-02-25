require('dotenv').config();
const express = require('express');
const weatherRoutes = require('./routes/weather_routes');
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use('/api', weatherRoutes);

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','weather.html'));
})

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
