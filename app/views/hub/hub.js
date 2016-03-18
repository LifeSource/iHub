var frames = require("ui/frame");
var page;

exports.pageLoaded = function (args) {
    page = args.object;
    page.bindingContext = page.navigationContext;
};

exports.showPeopleList = function () {

	var userkey = page.navigationContext.userkey;

    var navigateEntry = {
        moduleName: "views/people/people-list",
        context: { "userkey": userkey },
        animated: true
    };

    frames.topmost().navigate(navigateEntry);
};
