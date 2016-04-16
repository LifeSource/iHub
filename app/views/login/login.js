var appSettings = require("application-settings");
var frame = require("ui/frame");
var dialogsModule = require("ui/dialogs");
var UserViewModel = require("../../shared/user-viewModel");

var page;
var user = new UserViewModel();

function pageLoaded(args) {
    page = args.object;
    page.bindingContext = user;
}

function login() {

    user.isLoading = true;
    user.login()
        .catch(function(error) {
            user.isLoading = false;
            dialogsModule.alert({
                message: "The login credential is incorrect or missing.",
                okButtonText: "OK"
            });
            return Promise.reject();
        })
        .then(function(response) {
            user.isLoading = false;
            appSettings.setString("username", user.username);
            appSettings.setString("password", user.password);
            appSettings.setString("userkey", response.associatedUserKey);

            var navigateEntry = {
                moduleName: "views/hub/hub",
                context: {
                    userkey: response.associatedUserKey
                },
                clearHistory: true,
                animated: true
            };
            frame.topmost().navigate(navigateEntry);
        });
}

exports.login = login;
exports.pageLoaded = pageLoaded;
