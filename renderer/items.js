//Module that adds the bookmarks and related info to the display window

//DOM nodes
let items = document.getElementById("items");

//Array to track items in storage.  Using one variable for simplicity purposes.
//This item has to be parsed from a string to an array
exports.storage = JSON.parse(localStorage.getItem("readit-Items")) || [];

//Persist storage, using default/built in storage for browser instance
//First argument is key created for the items stored, the item being passed is an object
//Therefore, it must be "stringified" to a string in order to be stored
exports.save = function(){
    localStorage.setItem("readit-Items", JSON.stringify(this.storage));
}

//Export to main renderer with this function.  First argument is the item retrieved by the readItem module
//Second argument is a boolean value to keep check if the item is a new item or if it's from storage
exports.addItem = function(item, isNew = false) {

    //Create a new DOM element in browserwindow; an itemNode
    let itemNode = document.createElement("div");

    //Assign "read-item" class to the newly created DOM element, itemNode
    itemNode.setAttribute("class", "read-item");

    //Add inner HTML to itemNode, the screenshot & title passed to this function from the main process
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    //Append itemNode to the container w/ the DOM node "items"
    items.appendChild(itemNode);

    //Add item to storage and persist.  Check if item is already in storage before saving
    if(isNew) {
        this.storage.push(item);
        this.save();
    }
}

//Take items from built in browser local storage, loop through and add back into the DOM
//Second argument reset to false
this.storage.forEach( item => {
    this.addItem(item, false)
})