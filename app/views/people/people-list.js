var frames = require("ui/frame");
var appSettings = require("application-settings");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var PeopleListViewModel = require("../../shared/peopleList-viewModel");

var page;
var userkey;

var isLoading = true;
var peopleList = new PeopleListViewModel([]);
var filteredPeople = new ObservableArray([]);
var pageData = new Observable({ peopleList: peopleList, isLoading: isLoading });

exports.pageLoaded = function(args) {

    page = args.object;
    userkey = userkey || page.navigationContext.userkey;
    page.bindingContext = pageData;

    var appSettingsPeopleList = appSettings.getString("peopleList");
    if (!appSettingsPeopleList && peopleList.length === 0) {
        peopleList.load(userkey) // fetch data from server
            .then(function(response) {
                pageData.set("isLoading", false);
            });
    } else {
        peopleList = new ObservableArray(JSON.parse(appSettingsPeopleList));
        pageData.set("peopleList", peopleList);
        pageData.set("isLoading", false);
    }

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
            filteredPeople = peopleList.filter(function(person) {
                return person.fullName.trim().toLocaleLowerCase().match(searchText.trim().toLocaleLowerCase());
            });
            pageData.set("peopleList", filteredPeople);
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
    filteredPeople.length = 0;
}

function resetPeopleList() {
    resetFilteredPeopleList();
    pageData.set("peopleList", peopleList);
}
