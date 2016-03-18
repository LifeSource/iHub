var frames = require("ui/frame");
var dialogsModule = require("ui/dialogs");
var viewModule = require("ui/core/view");
var UserViewModel = require("../../shared/user-viewModel");

var user = new UserViewModel();

function pageLoaded(args) {
    var page = args.object;
	page.bindingContext = user;
}

function login() {
	user.login()
		.catch(function (error) {
			dialogsModule.alert({
				message: "The login credential is incorrect or missing.",
				okButtonText: "OK"
			});
			return Promise.reject();
		})
		.then(function(response) {
            var navigateEntry = {
                moduleName: "views/hub/hub",
                context: { userkey: response.associatedUserKey },
				clearHistory: true,
                animated: true
            };
			 frames.topmost().navigate(navigateEntry);
		})
}

exports.login = login;
exports.pageLoaded = pageLoaded;
