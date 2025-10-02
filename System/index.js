const express = require("express")
const expressEjsLayout = require("express-ejs-layouts")
const { router, clientRoute, adminRoute } = require("./routers/routes")
const { mongoClient } = require("./utils/database")

const app = express()
const port = 3000

app.set('layout', './layouts/app.ejs')
app.set('view engine', 'ejs')
app.set('views', 'System/views')
app.use(expressEjsLayout)

app.use(clientRoute)
app.use('/admin', adminRoute)

app.get('/', (req, res) => {
    res.redirect('/');
});


mongoClient(() => {
    app.listen(port, () => {
        console.log(`POS System is running at http://localhost:${port}`)
    })
})