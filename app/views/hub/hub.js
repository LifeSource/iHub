var frames = require("ui/frame");
var appSettings = require("application-settings");

var page;

exports.pageLoaded = function (args) {
    page = args.object;
    page.bindingContext = page.navigationContext;
};

exports.showPeopleList = function () {

	var userkey = appSettings.getString("userkey");
	userkey = userkey || page.navigationContext.userkey;

    var navigateEntry = {
        moduleName: "views/people/people-list",
        context: { "userkey": userkey },
        animated: true
    };

    frames.topmost().navigate(navigateEntry);
};

exports.showProjectList = function() {

	var userkey = appSettings.getString("userkey");
	userkey = userkey || page.navigationContext.userkey;

    var navigateEntry = {
        moduleName: "views/project/project-list",
        context: { "userkey": userkey },
        animated: true
    };

    frames.topmost().navigate(navigateEntry);
};
