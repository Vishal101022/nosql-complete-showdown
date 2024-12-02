const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./util/db");
const helmet = require('helmet');
require("dotenv").config();
const port = process.env.PORT || 3000;

// routes
const expenseRouter = require("./routes/expenseRoutes");
const userRouter = require("./routes/userRoutes");
const loginRouter = require("./routes/loginRoutes");
const isPremiumRouter = require("./routes/isPremiumRoutes");
const purchaseRouter = require("./routes/purchaseRoutes");
const lederboardRouter = require("./routes/lederboardRoutes");
const forgotPassRouter = require("./routes/forgotPassRoutes");
const downloadRouter = require("./routes/expenseRoutes")



const corsOptions = {
    origin: [
        "http://localhost:3000",
        "http://127.0.0.1:5500"
    ],
    credentials: true,
    method: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"]
}

const app = express();
app.use(express.static('public'));
app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/', expenseRouter);
app.use('/', userRouter);
app.use('/', loginRouter);
app.use('/', isPremiumRouter);
app.use('/', purchaseRouter);
app.use('/premium', lederboardRouter);
app.use('/password', forgotPassRouter);
app.use('/', downloadRouter);

app.listen(port, async () => {
    await db();
    console.log("Server started on port 3000");
})