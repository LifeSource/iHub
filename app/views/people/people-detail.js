var page;

exports.pageLoaded = function (args) {
	page = args.object;
	page.bindingContext = page.navigationContext;
};

exports.htmlLabelLoaded = function (args) {
	args.object.ios.font = UIFont.fontWithNameSize("Helvetica", 12);
};

exports.htmlValueLoaded = function (args) {
	args.object.ios.font = UIFont.fontWithNameSize("Helvetica", 16);
};
