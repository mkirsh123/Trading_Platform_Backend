require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const { HoldingsModel } = require("./models/HoldingsModel");
const { PositionsModel } = require("./models/PositionsModel");
const { OrdersModel } = require("./models/OrdersModel");

const app = express();
const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;

app.use(cors());
app.use(bodyParser.json());

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.get("/allOrders", async (req, res) => {
  let allOrders = await OrdersModel.find({});
  res.json(allOrders);
});

app.post("/newOrder", async (req, res) => {
  try {
    const orderData = {
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    };

    // create and save single order
    const orderDoc = new OrdersModel(orderData);
    await orderDoc.save();

    // if there is any temp positions logic, ensure temPositions exists
    if (typeof temPositions !== "undefined" && Array.isArray(temPositions)) {
      temPositions.forEach((item) => {
        const newPositions = new PositionsModel({
          product: item.product,
          name: item.name,
          qty: item.qty,
          avg: item.avg,
          price: item.price,
          net: item.net,
          day: item.day,
          isLoss: item.isLoss,
        });
        newPositions.save();
      });
    }

    // respond with the saved order
    res.json(orderDoc);
  } catch (err) {
    console.error("Error creating order", err);
    res.status(500).send("failed");
  }
});

app.listen(PORT, () => {
  console.log(`app started on the port ${PORT}`);
  mongoose.connect(uri);
  console.log("DB Started!");
});
