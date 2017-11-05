// Get jQuery
var script_tag = document.createElement("script");
script_tag.setAttribute("src", chrome.extension.getURL("js/libs/jquery-3.2.1.min.js"));

// Generate roles
try {
    console.log("Generating roles...");
    generateRoles();

    buildAllRoleInfo();
} catch (TypeError) {
    console.log("Threw a Type Error");
}

// Start navigation loop
console.log("Starting navigation loop");
startNav();