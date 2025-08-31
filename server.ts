import express from "express";

const app = express();
app.use(express.json());

app.post("/echo", (req, res) => {
  console.log("Echo endpoint hit!", req.body);
  res.json(req.body);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});