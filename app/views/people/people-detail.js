exports.pageLoaded = function (args) {
	var page = args.object;
	page.bindingContext = page.navigationContext;
};
