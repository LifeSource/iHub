var config = require("../../shared/config");
var fetchModule = require("fetch");
var http = require("http");
var frames = require("ui/frame");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var PeopleListViewModel = require("../../shared/peopleList-viewModel");
//var LoadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;

var page;
var userkey;
/*
var loader = new LoadingIndicator();
var options = {

	message: "Loading data, please wait...",
	ios: {
		square: false,
		margin: 10,
		dimBackground: true,
		color: "#4B0Ec6",
		mode: "MBProgressHUDModeDeterminate"
	}
}; */

var peopleList = new PeopleListViewModel([]);
var pageData = new Observable({ peopleList: peopleList });
var resultList = new ObservableArray([]);

exports.pageLoaded = function(args) {

	page = args.object;
	userkey = userkey || page.navigationContext.userkey;
	page.bindingContext = pageData;

	if (peopleList.length === 0) {
//		loader.show(options);
		peopleList.load(userkey); // fetch the data from server.
	//	loader.hide();
	}
	pageData.set("peopleList", peopleList);

	var searchBar = page.getViewById("searchBar");
	searchBar.on("clear", function (args) {
		resetFilteredPeopleList();
		pageData.set("peopleList", peopleList);
	});

	searchBar.on("propertyChange", function(args) {

		var searchText = args.object.text;
		if (searchText === "") {
			resetFilteredPeopleList();
			pageData.set("peopleList", peopleList);
		}

		resetFilteredPeopleList();

		resultList = peopleList.filter(function (person) {
			return person.fullName.toLocaleLowerCase().match(searchText.toLocaleLowerCase());
		});

		pageData.set("peopleList", resultList);
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
	while (resultList.length > 0) {
		resultList.pop();
	}
}
