var application = require("application");
var appSettings = require("application-settings");
var frame = require("ui/frame");

var username = appSettings.getString("username");
var password = appSettings.getString("password");
var userkey = appSettings.getString("userkey");

console.log("username: ", username);
console.log("password: ", password);
console.log("userkey: ", userkey);

if (username && password && userkey) {
	application.start({ moduleName: "views/hub/hub" });
}
application.start({ moduleName: "views/login/login" });
