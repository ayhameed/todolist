const express = require("express")
// const bodyParser = require("body-parser")

const app = express()

app.set('view engine', 'ejs')

let items = []
app.use(express.json());
app.use(express.urlencoded({extended : true}))

app.use(express.static("public"))

const PORT = process.env.PORT || 3000

app.get("/", (req, res)=>{

    let today = new Date()
    let options = { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long' 
    }
    let toDay  = new Date();
    let day = toDay.toLocaleDateString("en-US", options)
    res.render("list",{kindOfDay: day, item : items})
})

app.post("/", (req, res)=>{
    const newTodoItem = req.body.newItem
    items.push(newTodoItem)
    res.redirect("/")
})

app.listen(PORT, ()=>{
    console.log("sever is listening on Port: " +PORT)
})