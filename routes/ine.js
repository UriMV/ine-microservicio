const express = require('express');
const router = express.Router();
const controller = require('../controllers/ineController');

router.get('/consulta', controller.getByIdOrCurp);
router.get('/todos', controller.getAll);
router.post('/insertar', controller.insertAll);
router.delete('/eliminar/:curp', controller.deleteByCurp);
router.put('/actualizar/:curp', controller.updateByCurp);

module.exports = router;
