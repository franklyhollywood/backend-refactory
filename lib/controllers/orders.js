const { Router } = require('express');
const Order = require('../models/Order');
const pool = require('../utils/pool');

module.exports = Router()
  .post('/', async (req, res) => {
    const order = await Order.insert({
      product: req.body.product,
      quantity: req.body.quantity,
    });
    res.send(order);
  })

  .get('/:id', async (req, res) => {
    const { id } = req.params;
    const order = await Order.getById(id);
    res.json(order);
  })

  .get('/', async (req, res) => {
    const orders = await Order.getAll();

    res.json(orders);
  })

  .patch('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await Order.updateById(id, { ...req.body });

      res.json(order);
    } catch (error) {
      next(error);
    }
  })

  .delete('/:id', async (req, res) => {
    const { rows } = await pool.query(
      'DELETE FROM orders WHERE id=$1 RETURNING *;',
      [req.params.id]
    );

    if (!rows[0]) return null;
    const order = new Order(rows[0]);

    res.json(order);
  });
