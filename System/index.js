const express = require("express")
const expressEjsLayout = require("express-ejs-layouts")
const { router, clientRoute, adminRoute } = require("./routers/routes")
const { mongoClient } = require("./utils/database")
const connectDB = require("./utils/database")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const Auth = require("./middleware/auth")
require('dotenv').config()

const app = express()
const port = 3000

app.use(express.static("System/public"))
app.set('layout', './layouts/app.ejs')
app.set('view engine', 'ejs')
app.set('views', 'System/views')

app.use(expressEjsLayout)
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser())
app.use(session({
    secret: process.env.SECRET_KEY || "POS",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}))
app.use(Auth.userName)

app.use(clientRoute)
app.use('/admin', adminRoute)



connectDB().then(() => {
    app.listen(port, () => {
        console.log(`POS System is running at http://localhost:${port}`)
    })
})