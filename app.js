
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let items = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let today = new Date();

    let day = today.toLocaleDateString("en-US", options);

    res.render("list", {kindOfDay: day, newListItem: items});

});

app.post("/", (req, res) => {
    let item = req.body.newItem;

    items.push(item);

    res.redirect("/");
});





app.listen(3000, () => {
    console.log("Server started on port 3000");
});


