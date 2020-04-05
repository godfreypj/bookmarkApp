//Modules
const { ipcRenderer } = require("electron");

//Functions
    //Disable/Enable modal buttons - visual feedback once use enters a URL
    //disables button to prevent duplicate items
    const toggleModalButtons = function(){
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

// Dom Nodes
let showModal = document.getElementById("show-modal"),
    closeModal = document.getElementById("close-modal"),
    modal = document.getElementById("modal"),
    addItem = document.getElementById("add-item"),
    itemURL = document.getElementById("URL")

//Show modal when "+" sign is clicked
showModal.addEventListener("click", function(e){
    modal.style.display = "flex";
    //Focus on text input so no click is necessary to enter URL
    itemURL.focus();
});

//Close modal when "cancel" is clicked
closeModal.addEventListener("click", function(e){
    modal.style.display = "none"
});

//Save URL w/ a click
addItem.addEventListener("click", function(e){
    //Check if URL is entered
    if(itemURL.value){
        //Send URL entered to main process, which will fetch ScrnShot and return to renderer
        //First argument is a channel name created to send the 2nd argument to the main process
        ipcRenderer.send("new-item", itemURL.value);
        //Call disable function to provide visual feedback that an item is being added
        toggleModalButtons();
    }
})
//Save URL w/ "enter" button press
itemURL.addEventListener("keyup", function(e){
    //Specify "enter" key with event argument
    if(e.key === "Enter"){
        //If "enter" key is pressed, element performs a click, which triggers above event listener
        addItem.click();
    }
})

//Using ipcRenderer, listen for main process to send URL and Screenshot back to renderer
ipcRenderer.on("new-item-success", function(e, data){
    console.log(data);
    //Reenable add/cancel buttons once URL has been added
    toggleModalButtons();
    //Hide and clear input (reset app to original state)
    modal.style.display = "none";
    itemURL.value = "";
})