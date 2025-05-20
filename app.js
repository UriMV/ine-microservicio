const express = require('express');
const bodyParser = require('body-parser');
const ineRoutes = require('./routes/ine');

const app = express();
app.use(bodyParser.json());

app.use('/api', ineRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
