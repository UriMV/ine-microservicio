const express = require('express');
const router = express.Router();
const controller = require('../controllers/ineController');

router.get('/consulta', controller.getByIdOrCurp);
router.post('/insertar', controller.insertAll);
router.delete('/eliminar/:curp', controller.deleteByCurp);

module.exports = router;
