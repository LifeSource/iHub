var frames = require("ui/frame");
var appSettings = require("application-settings");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var PeopleListViewModel = require("../../shared/peopleList-viewModel");

var page;
var userkey;

var isLoading = true;
var peopleList = new PeopleListViewModel([]);
var pageData = new Observable({
	peopleList: peopleList,
	isLoading: isLoading
});
var resultList = new ObservableArray([]);

exports.pageLoaded = function(args) {

	page = args.object;
	userkey = userkey || page.navigationContext.userkey;
	page.bindingContext = pageData;

	var appSettingsPeopleList = appSettings.getString("peopleList");
	if (!appSettingsPeopleList && peopleList.length === 0) {
		peopleList.load(userkey)
			.then(function (response) {
				pageData.set("isLoading", false);	
			}); // fetch the data from server.

	} else {
		peopleList = new ObservableArray(JSON.parse(appSettingsPeopleList));
		pageData.set("peopleList", peopleList);
		pageData.set("isLoading", false);
	}
	console.log("Before pList: ", appSettingsPeopleList);

	var searchBar = page.getViewById("searchBar");
	searchBar.on("clear", function(args) {
		resetPeopleList();
	});

	searchBar.on("propertyChange", function(args) {
		var searchText = args.object.text;
		if (searchText === "") {
			resetPeopleList();
		} else {
			resetFilteredPeopleList();
			resultList = peopleList.filter(function(person) {
				return person.fullName.trim().toLocaleLowerCase().match(searchText.trim().toLocaleLowerCase());
			});
			pageData.set("peopleList", resultList);
		}
	});
};

exports.showDetail = function(args) {
	var person = args.view.bindingContext;
	var navigateEntry = {
		moduleName: "views/people/people-detail",
		context: {
			person: person
		},
		animated: true
	};
	frames.topmost().navigate(navigateEntry);
};

function resetFilteredPeopleList() {
	resultList.length = 0;
}

function resetPeopleList() {
	resetFilteredPeopleList();
	pageData.set("peopleList", peopleList);
}
