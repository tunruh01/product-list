const express = require("express");
const router = express.Router();
const Product = require("../models/product");

const RESULTS_PER_PAGE = 10;

router.get("/", (req, res, next) => {
  // return the first page by default
  const page = req.query.page || 1;
  let perPage = RESULTS_PER_PAGE;
  if (page <= 0) {
    res.status(400);
    res.send("Page Must Be Greater Than 0 or Excluded");
  } else {
    Product.find({})
      .select("-__v")
      .populate("reviews", "-__v")
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec((err, products) => {
        if (err) {
          res.status(500);
          res.send(err);
        } else {
          Product.count().exec((err, count) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.send({ productCount: count, page, perPage, products });
            }
          });
        }
      });
  }
});

router.get("/:product", (req, res, next) => {
  Product.findById(req.params.product)
    .select("-__v")
    .populate("reviews", "-product -__v")
    .exec((err, product) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(product);
      }
    });
});

module.exports = router;
