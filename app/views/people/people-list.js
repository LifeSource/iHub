var frames = require("ui/frame");
var appSettings = require("application-settings");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var PeopleListViewModel = require("../../shared/peopleList-viewModel");

var page;
var userkey;
var searchBar;
var appSettingsPeopleList;
var peopleList = new PeopleListViewModel();
var filteredPeople = new ObservableArray();
var pageData = new Observable({
    peopleList: peopleList,
    isLoading: false
});

exports.pageLoaded = function(args) {

    page = args.object;
    page.bindingContext = pageData;
    userkey = userkey || page.navigationContext.userkey;

    if (!dataLoaded()) {
        pageData.isLoading = true;
        peopleList.load(userkey)
            .then(function(response) {
                pageData.isLoading = false;
            });
    } else {
        peopleList = new ObservableArray(JSON.parse(appSettingsPeopleList));
        pageData.peopleList = peopleList;
    }

    searchBar = page.getViewById("searchBar");
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
            pageData.peopleList = filteredPeople;
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

function dataLoaded() {
    appSettingsPeopleList = appSettings.getString("peopleList");
    return appSettingsPeopleList;
}

function resetFilteredPeopleList() {
    filteredPeople.length = 0;
}

function resetPeopleList() {
    resetFilteredPeopleList();
    pageData.peopleList = peopleList;
}
