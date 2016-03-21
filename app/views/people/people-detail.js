var email = require('nativescript-email');


exports.pageLoaded = function (args) {
	var page = args.object;
	page.bindingContext = page.navigationContext;

};

exports.htmlLabelLoaded = function (args) {
	args.object.ios.font = UIFont.fontWithNameSize("Helvetica", 12);

}

exports.htmlValueLoaded = function (args) {
	args.object.ios.font = UIFont.fontWithNameSize("Helvetica", 16);

}
