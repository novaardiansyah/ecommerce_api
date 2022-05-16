const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

const app = express();

// * Routes (Start)
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
// * Routes (End)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.EXPRESS_PORT || 5000, () => {
      console.log('Server is running on port ' + (process.env.EXPRESS_PORT || 5000));
    });
  })
  .catch((err) => {
    console.log(err);
  });

// * Routes (Start)
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
// * Routes (End)