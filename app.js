
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const req = require("express/lib/request");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-kris:kris2551@cluster0.qrqx1.mongodb.net/todolistDB");


const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);
const itemOne = new Item({
    name: "Wake Up"
});
const itemTwo = new Item({
    name: "Make Bed"
});
const itemThree = new Item({
    name: "Drink Water"
});
const defaultItems = [itemOne, itemTwo, itemThree];


const listSchema = {
    name: String,
    items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);




app.get("/", (req, res) => {
    // Adds default items to the list if the list is empty 
    Item.find({}, (err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Good to go");
                }
            });
            res.redirect("/");
        }
        else {
            res.render("list", {listTitle: "Today", newListItem: foundItems});
        }
    });    
});

// Creates a new list and a different page where the list can be accessed
app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, (err, foundList) => {
        if(!err) {
            if(!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });

                list.save();
                res.redirect("/" + customListName);
            }
            else {
                res.render("list", {listTitle: foundList.name, newListItem: foundList.items});
            }
        }       
    });
});

// This ensures the items add to the specific list stays with that list only
app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({name: listName}, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
});

// This will remove and item that is checked off
app.post("/delete", (req, res) => {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if (listName === "Today") {
       Item.findByIdAndDelete(checkedItem, (err) => {
        if (!err) {
            console.log("Item deleted");
        }
        res.redirect("/");
    }); 
    }
    else {
        List.findOneAndUpdate({name: listName}, 
            {$pull: {items: {_id: checkedItem}}}, (err, foundList) => {
                res.redirect("/" + listName);
        })
    }
});

// app.get("/about", function(req, res){
//     res.render("about");
//   });

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
//app.listen(port);

app.listen(port, () => {
    console.log("Server started");
});