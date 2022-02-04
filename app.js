
const express = require("express");
const bodyParser = require("body-parser");
const req = require("express/lib/request");
const date = require(__dirname + "/date.js");
const app = express();

let items = [];
let workItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
    let day = date.getDate();
    res.render("list", {listTitle: day, newListItem: items});
});

app.post("/", (req, res) => {
    let item = req.body.newItem;

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
    items.push(item);
    res.redirect("/");
    }

});

app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work List", newListItem: workItems});
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});


