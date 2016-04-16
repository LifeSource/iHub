var application = require("application");
var appSettings = require("application-settings");
var frame = require("ui/frame");

var username = appSettings.getString("username");
var password = appSettings.getString("password");
var userkey = appSettings.getString("userkey");

if (username && password && userkey) {
	application.start({ moduleName: "views/hub/hub" });
}

application.start({ moduleName: "views/login/login" });
