const express = require("express");
const OrderController = require("../../controller/OrderController");
const AuthMiddleware = require("../../utils/AuthMiddleware");
const router = express.Router();

/**
 * @api {get} /orders Get all orders
 * @apiName GetOrders
 */
router.get(`/`, AuthMiddleware.forciblyRequireAuth, OrderController.getOrders);
/**
 * @api {get} /orders/user Get all orders of current user
 * @apiName GetUserOrders
 */
router.get(
  `/my-order`,
  AuthMiddleware.forciblyRequireAuth,
  OrderController.getUserOrder
);
/**
 * @api {post} /orders Create new order
 * @apiName CreateOrder
 */
router.post(
  `/`,
  AuthMiddleware.forciblyRequireAuth,
  OrderController.createOrder
);

router.delete(
  `/:id`,
  AuthMiddleware.forciblyRequireAuth,
  OrderController.deleteOrder
);

module.exports = router;