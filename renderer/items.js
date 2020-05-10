//Module that adds the bookmarks and related info to the display window

//Modules required
const fs = require("fs");
//DOM nodes
let items = document.getElementById("items");

//Unique JS file for reader window functionality.  Using the fs module, toString the contents of
//the reader.js file to the readerJS variable, so we can pass it to the window that opens on double-click.
let readerJS;
fs.readFile(`${__dirname}/reader.js`, function(err, data) {
    readerJS = data.toString();
});

//Array to track items in storage.  Using one variable for simplicity purposes.
//This item has to be parsed from a string to an array
exports.storage = JSON.parse(localStorage.getItem("readit-Items")) || [];

//Listen on channel "item-done" for data sent when the readers button is pressed
window.addEventListener("message", function(e) {
    console.log(e.data);
    
})

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
    return;
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

//Function for opening new items that are "selected"
exports.open = function(){
    //Function only runs when there are items present; if there is are any items to read, proceed
    if(document.getElementsByClassName("read-item")[0]) {
                //Set a variable to the selected item
                let selectedItem = document.getElementsByClassName("read-item selected")[0];

                //Set a variable to the selected items URL
                let contentURL = selectedItem.dataset.url;
                
                //Open contentURL in a new browser window.  First argument is the URL of the clicked item
                //Second argument it title; left blank as the page will default to the title of the URL
                //Third argument is additional feature of the window, set for comfortable reading views
                let readerWin = window.open(contentURL, "", `
                maxWidth = 2000,
                maxHeight = 2000,
                width = 1200,
                height = 800,
                x = 450,
                y = 150,
                backgroundColor = #DEDEDE,
                nodeIntegration = 0,
                contextIsolation = 1
                `);

                //Injecting customized JavaScript for unique window function of pop-up window
                //"readerJS is a separate JS file for unique window features"
                readerWin.eval(readerJS);
    } else {
        return;
    }
}

//Export to main renderer with this function.  First argument is the item retrieved by the readItem module
//Second argument is a boolean value to keep check if the item is a new item or if it's from storage
exports.addItem = function(item, isNew = false) {

    //Create a new DOM element in browserwindow; an itemNode
    let itemNode = document.createElement("div");

    //Assign "read-item" class to the newly created DOM element, itemNode
    itemNode.setAttribute("class", "read-item");

    //Set the URL for the item as a data attribute so we can use it later.
    //First argument is the data-url, it is set to the key/value url of the "item" object
    itemNode.setAttribute("data-url", item.url);

    //Add inner HTML to itemNode, the screenshot & title passed to this function from the main process
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;

    //Append itemNode to the container w/ the DOM node "items"
    items.appendChild(itemNode);

    //Add click handler to new items for "selected" functionality
    //Every time a new item is added, a click listener is also added, if clicked, call the "select" function
    itemNode.addEventListener("click", this.select);

    //Add click handler for opening items.  Double click to trigger the "open" function above.
    itemNode.addEventListener("dblclick", this.open);

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