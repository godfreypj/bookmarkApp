//Modules
const { ipcRenderer } = require("electron");
const items = require("./items")

//Functions
    //Disable/Enable modal buttons - visual feedback once use enters a URL
    //disables button to prevent duplicate items
    const toggleModalButtons = () => {
        //Check state of button. If true, reset to normal parameters
        if(addItem.disabled === true){
            addItem.disabled = false;
            addItem.style.opacity = 1;
            addItem.innerText = "Add item";
            closeModal.display = "inline";
        //If false, grey out button and show user URL is being added
        } else {
            addItem.disabled = true;
            addItem.style.opacity = 0.5;
            addItem.innerText = "Adding ... ";
            closeModal.display = "none";
        }
    }

/*Functions for the global menu functionality.  The listeners is in "menu.js".  The function is here as both
/ modules have access to the same global window object.
*/
    /*  Open the "showModal" menu when the global menu button "Add Item" is clicked. */
    window.newItem = () => {
        showModal.click();
    }
    /*  Open whatever item is selected when the "Open" button is clicked by calling the "open()" function in the "items.js" module. */
    window.openItem = () => {
        items.open();
    }
    /*  Delete whatever item is selected when the "Delete" button is clicked by calling the "deleteItem" function in the "items.js" module */
    window.deleteItem = () => {
        let selectedItem = items.getSelectedItem();
        items.deleteItem(selectedItem);
    }
    /* Open selected item in typical browser window vice the "reader" window by calling the "openItemNative" function in the "items.js" module*/
    window.openItemNative = () => {
        items.openItemNative();
    }
    /* Focus the search bar */
    window.searchItems = () => {
        search.focus();
    }

// Dom Nodes
let showModal = document.getElementById("show-modal"),
    closeModal = document.getElementById("close-modal"),
    modal = document.getElementById("modal"),
    addItem = document.getElementById("add-item"),
    itemUrl = document.getElementById("URL"),
    search = document.getElementById("search")

//Filter items with search bar
search.addEventListener("keyup", e => {
    //Loop through all items in collection
    //Retrieving items from the class name set in the items module
    //Default type of these items are "HTML collection", so we need "Array.from() to convert to a iterable array"
    Array.from(document.getElementsByClassName("read-item")).forEach(item => {
        //Hide items that do not match the entered text
        //"hasMatch" is a boolean value that is set to true IF the inner text of the item includes what is entered in search
        let hasMatch = item.innerText.toLowerCase().includes(search.value)
        //Check true/false cases, setting display to "flex" if true, "none" if false (essentially hiding it)
        if(hasMatch) {
            item.style.display = "flex"
        } else {
            item.style.display = "none"
        }
    })
})

//Navigate item selected with up/down array keys
document.addEventListener("keydown", e => {
    //If arrow up/down keys are pressed, call the changeSelection() method in the items module
    if(e.key === "ArrowUp" || e.key === "ArrowDown"){
        items.changeSelection(e.key);
    }
})

//Show modal when "+" sign is clicked
showModal.addEventListener("click", e =>{
    modal.style.display = "flex";
    //Focus on text input so no click is necessary to enter URL
    itemUrl.focus();
});

//Close modal when "cancel" is clicked
closeModal.addEventListener("click", e => {
    modal.style.display = "none"
});

//Save URL w/ a click
addItem.addEventListener("click", e => {
    //Check if URL is entered
    if(itemUrl.value){
        //Send URL entered to main process, which will fetch ScrnShot of website entered, and return to renderer
        //First argument is a channel name created to send the 2nd argument to the main process
        ipcRenderer.send("new-item", itemUrl.value);
        //Call disable function to provide visual feedback that an item is being added
        toggleModalButtons();
    }
})
//Save URL w/ "enter" button press
itemUrl.addEventListener("keyup", e => {
    //Specify "enter" key with event argument
    if(e.key === "Enter"){
        //If "enter" key is pressed, element performs a click, which triggers above event listener
        addItem.click();
    }
})

//Using ipcRenderer, listen for main process to send URL and Screenshot back to renderer
ipcRenderer.on("new-item-success", (e, newItem) => {
    
    //Pass the new item to the items module, which will add it to the DOM.
    //Second argument is boolean value that tells the items module that this is a new item and needs to be saved
    items.addItem(newItem, true);

    //Reenable add/cancel buttons once URL has been added
    toggleModalButtons();
    //Hide and clear input (reset app to original state)
    modal.style.display = "none";
    itemUrl.value = "";
})