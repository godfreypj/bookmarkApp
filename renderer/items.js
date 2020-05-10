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

//Set an item clicked on as selected to provide functionality
exports.select = function(e) {
    //Unselect currently selected item; whatever element has both classes is the selected one, remove the selected class
    document.getElementsByClassName("read-item selected")[0].classList.remove("selected");

    //Add "selected" to the currently clicked item using click event object
    e.currentTarget.classList.add("selected");
}

//Move to newly selected items when up/down arrow keys are pressed
exports.changeSelection = function(direction) {
    //Get currently selected item from HTML collection
    let currentItem = document.getElementsByClassName("read-item selected")[0];


    //Handle up/down functionality
    //If the passed argument is a keyup and the currently selected item has one above it
    // remove selected class from current one, and add it to the item before it
    if(direction === "ArrowUp" && currentItem === document.getElementsByClassName("read-item")[0]) {

    }
    else if(direction === "ArrowUp" && currentItem.previousSibling) {
        currentItem.classList.remove("selected");
        currentItem.previousSibling.classList.add("selected");
    //If the passed argument is keydown and the currently selected item has one below it
    // remove selected class from current item, and add it to the item after it
    } else if (direction === "ArrowDown" && currentItem.nextSibling) {
        currentItem.classList.remove("selected");
        currentItem.nextSibling.classList.add("selected");
    }
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

    //Add click handler to new items for "selected" functionality
    //Every time a new item is added, a click listener is also added, if clicked, call the "select" function
    itemNode.addEventListener("click", this.select)

    //Default behaviour for app; pre-select first item on the list, or first added item
    //If the HTML collection holding the items has at least 1 item in it, set that items class to "selected"
    if(document.getElementsByClassName("read-item").length === 1){
        itemNode.classList.add("selected");
    }

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