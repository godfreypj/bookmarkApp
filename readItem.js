//readItem module.
//This module creates an offscreen renderer (opens a browser window the user cannot see)
//Takes the "itemURL" the user entered, loads it into the new browser window
//Then retrieves a screenshot of the webpage the user entered, as well as the title

const {BrowserWindow} = require('electron');

//Offscreen BrowserWindow
let offscreenWindow

//Export readItem function that matches the readItem function in the main application
module.exports = (url, callback) => {
    //Create offscreen window
    offscreenWindow = new BrowserWindow({
        //Our screenshot will be 500x500, thus the size of this window
        width: 500,
        heigh: 500,
        //Do not show the user, hence "offscreen"
        show: false,
        webPreferences : {
            offscreen: true,
            //This window will be accessing remote, insecure content
            //Setting this to false keeps it from accessing the rest of the app
            nodeIntegration: false
        }
    })

    //Load URL from main process
    offscreenWindow.loadURL(url)

    //Wait for browserwindow to load completely before retrieving needed items
    offscreenWindow.webContents.on("did-finish-load", e => {
        //Get page title
        let title = offscreenWindow.getTitle();
        //Get screenshot of fully loaded page
        offscreenWindow.webContents.capturePage(image => {
            //Retrieving image as a dataURL so no need to save/write an image to the application data
            let screenshot = image.toDataURL();

            //Execute callback with new items as an object, return the title, image & URL back to the main process
            callback( { 
                title: title,
                screenshot: screenshot,
                url: url
            })
            //Cleanup/close browser window
            offscreenWindow.close()
            offscreenWindow = null;
        })
    })
}