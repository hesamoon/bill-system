import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  getBills,
  getBill,
  createBill,
  initializeDatabase,
} from "./database.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors())

function setCorsHeaders(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
}
app.use(setCorsHeaders);

await initializeDatabase();

app.get("/", async (req, res) => {
  const bills = await getBills();
  res.send(bills);
});

app.get("/:id", async (req, res) => {
  const id = req.params.id;
  const bill = await getBill(id);
  res.send(bill);
});

app.post("/", async (req, res) => {
  const {
    exporterName,
    payMethod,
    senderInfo,
    receiverInfo,
    productInfo,
    priceInfo,
  } = req.body;

  const bills = await getBills();

  const bill = await createBill(
    bills.length > 0 ? bills.pop().billNumber + 1 : process.env.BASEBILLNUMBER,
    exporterName,
    payMethod,
    senderInfo,
    receiverInfo,
    productInfo,
    priceInfo
  );
  res.status(201).send(bill);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 8080");
});
