const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

require("dotenv").config();

const PORT = process.env.PORT;
const MongoDB_CONNECTION_URL = process.env.MONGODB_CONNECTION_URL;

mongoose
    .connect(MongoDB_CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connection to MongoDB successful");
    })
    .catch((error) => {
        console.error("MongoDB Connection error:", error);
    });

const TodoItemSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
});

const TodoItem = mongoose.model("TodoItem", TodoItemSchema);

const dateFunction = () => {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    return today.toLocaleDateString("en-US", options);
};

app.get("/", async (req, res) => {
    const day = dateFunction();
    try {
        const items = await TodoItem.find();
        res.render("list", { kindOfDay: day, items: items });
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/", async (req, res) => {
    const newTodoItem = req.body.newItem;
    const date = dateFunction();

    // Write to Collection
    const todoitem = new TodoItem({
        item: newTodoItem,
        date: date,
    });

    try {
        await todoitem.save();
        res.redirect("/");
    } catch (error) {
        console.error("Error saving item:", error);
        res.redirect("/");
    }
});

app.listen(PORT, () => {
    console.log("Server is listening on Port: " + PORT);
});
