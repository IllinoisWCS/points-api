const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

app.use("/", require("./routes/"));

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () => console.log(`Server is listening on port ${port}`))
  )
  .catch((err) => console.error(err.message));
