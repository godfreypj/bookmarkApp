//Create a button and functionality to delete an item from the list
let readitClose = document.createElement("div");
readitClose.innerText = "Done";

//Button style
readitClose.style.position = "fixed";
readitClose.style.bottom = "15px";
readitClose.style.right = "15px";
readitClose.style.padding = "5px 10px";
readitClose.style.fontSize = "20px";
readitClose.style.fontWeight = "bold";
readitClose.style.background = "dodgerblue";
readitClose.style.color = "white";
readitClose.style.borderRadius = "5px";
readitClose.style.cursor = "default";
readitClose.style.boxShadow = "2px 2px 2px rbga(0,0,0,0.2";

//Functionality

//Click listener
readitClose.onclick = function(e) {
    //Send data to parent window with HTML5 "window.opener" functionality
    //First argument is the data being sent (as an object).  
    // the first piece of data in the object is a simple message to identify the action needed
    // the second is: {index}, a unique tag that is dynamically switched when the reader window is opened
    //The second arg is the targetOrigin, * indicated no preference
    window.opener.postMessage({
        action: 'delete-reader-item',
        itemIndex: "{index}"
    }, '*')
}

//Append to remote content body element
document.getElementsByTagName("body")[0].appendChild(readitClose);