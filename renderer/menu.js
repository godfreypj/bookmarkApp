/*Module for the native menu of the application.
/ Standalone script that runs once when the application is started.
*/

//Main process modules
const {remote, shell} = require("electron");

/*Menu template
/  Items for our native menu.  
/  First is "Items" where functionality for the items in the app are retained.  Here we have all the same functionality that
/  is in the application plus some extended functionality.
/       (1) a "Add New" click listener that calls a function in the "app.js" module.  This "menu.js" module
/       and "app.js" have access to the same global window object, so we can access this function and we do not have to 
/       re-code the add item functionality.
/       (2) a "Open" click listener that does the same, this time calling the "open()" function in the "items.js" module.
/       (3) a "Delete" click listener that follows the same pattern as the others, calling a function in the "items.js" module
/       (4) a "Open in Browser" click listener that will allow user to open the item in a normal browser window vice the
/       "reader" window.  Again following the same pattern above, using a function in the "items.js".
/       (5) a shortcut added so user can navigate to the search menu with a keyboard shortcut
/  Second is "Edit", we use Electron native "editMenu" that will automatically fill the "Edit" menu with OS specific options
/  Third is 
/  Fourth is the Help menu, on macOS it has default behavior for searching the menu and cross platform there is a "learn More" link
/   that is added with the Shell module of electron to open a new browser window to the GitHub repo.
*/
const template = [
    {
        label: "Items",
        submenu: [
            {
                label: "Add New",
                click: window.newItem,
                accelerator: "CmdOrCtrl+o"
            },
            {
                label: "Open",
                click: window.openItem,
                accelerator: "CmdOrCtrl+Enter"
            },
            {
                label: "Delete",
                click: window.deleteItem,
                accelerator: "CmdOrCtrl+Backspace"
            },
            {
                label: "Open In Browser",
                click: window.openItemNative,
                accelerator: "CmdOrCtrl+Shift+o"
            },
            {
                label: "Search",
                click: window.searchItems,
                accelerator: "CmdOrCtrl+S"
            }
        
        ]
    },
    {
        role: "editMenu"
    },
    {
        role: "windowMenu"
    },
    {
        role: "help",
        submenu: [
            {
                label: "Learn More",
                click: () => {
                    shell.openExternal("https://github.com/godfreypj/bookmarkApp")
                }
            }
        ]
    }
];

/* When using macOS, the first menu item is required by the OS to be the name of the application
/  Here we check if the OS is mac (with "darwin"), and use the unshift JS function that adds an element
/  to the beginning of an array and we add in the default macOS menu item for the first item.
*/
if(process.platform === "darwin") {
    template.unshift({
        label: remote.app.getName(),
        submenu: [
               {role: "about"},
               {type: "separator"},
               {role: "services"},
               {type: "separator"},
               {role: "hide"},
               {role: "hideothers"},
               {role: "unhide"},
               {role: "separator"},
               {role: "quit"},
        ]
    })
}

//Build menu
const menu = remote.Menu.buildFromTemplate(template);

//Set as main app menu
remote.Menu.setApplicationMenu(menu);