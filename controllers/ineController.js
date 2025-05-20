const db = require('../db');

// Obtener por ID o CURP
exports.getByIdOrCurp = (req, res) => {
  const { id, curp } = req.query;

  let sql = `
    SELECT * FROM personas p
    LEFT JOIN direcciones d ON p.curp = d.curp
    LEFT JOIN datos_ine i ON p.curp = i.curp
  `;
  let params = [];

  if (id) {
    sql += ' WHERE p.id = ?';
    params.push(id);
  } else if (curp) {
    sql += ' WHERE p.curp = ?';
    params.push(curp);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Obtener todos los registros
exports.getAll = (req, res) => {
  const sql = `
    SELECT * FROM personas p
    LEFT JOIN direcciones d ON p.curp = d.curp
    LEFT JOIN datos_ine i ON p.curp = i.curp
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

// Insertar en las 3 tablas
exports.insertAll = (req, res) => {
  const { persona, direccion, datosIne } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err });

    const insertPersona = `INSERT INTO personas SET ?`;
    db.query(insertPersona, persona, (err) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err }));

      const insertDireccion = `INSERT INTO direcciones SET ?`;
      db.query(insertDireccion, direccion, (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err }));

        const insertDatosIne = `INSERT INTO datos_ine SET ?`;
        db.query(insertDatosIne, datosIne, (err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err }));

          db.commit((err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: err }));
            res.json({ message: 'Datos insertados correctamente' });
          });
        });
      });
    });
  });
};

// Eliminar por CURP
exports.deleteByCurp = (req, res) => {
  const { curp } = req.params;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err });

    const deleteDatosIne = `DELETE FROM datos_ine WHERE curp = ?`;
    db.query(deleteDatosIne, [curp], (err) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err }));

      const deleteDirecciones = `DELETE FROM direcciones WHERE curp = ?`;
      db.query(deleteDirecciones, [curp], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err }));

        const deletePersona = `DELETE FROM personas WHERE curp = ?`;
        db.query(deletePersona, [curp], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err }));

          db.commit((err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: err }));
            res.json({ message: 'Datos eliminados correctamente' });
          });
        });
      });
    });
  });
};

// Actualizar por CURP
exports.updateByCurp = (req, res) => {
  const { curp } = req.params;
  const { persona, direccion, datosIne } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err });

    db.query('UPDATE personas SET ? WHERE curp = ?', [persona, curp], (err) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err }));

      db.query('UPDATE direcciones SET ? WHERE curp = ?', [direccion, curp], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err }));

        db.query('UPDATE datos_ine SET ? WHERE curp = ?', [datosIne, curp], (err) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err }));

          db.commit((err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: err }));
            res.json({ message: 'Datos actualizados correctamente' });
          });
        });
      });
    });
  });
};
