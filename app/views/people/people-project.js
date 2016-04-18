"use strict";
var frames = require("ui/frame");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var config = require("../../shared/config");
var appSettings = require("application-settings");

var page;
var userkey;
var projectId;
var searchBar;
var filteredPeople = new ObservableArray();
var peopleList = new ObservableArray();
var pageData = new Observable({
    peopleList: peopleList,
    isLoading: false
});

var context;

exports.pageLoaded = function(args) {
    console.log("PAGE LOADED");
    page = args.object;
    page.bindingContext = pageData;

    searchBar = page.getViewById("searchBar");

    searchBar.on("clear", function(args) {
        resetPeopleList();
    });

    searchBar.on("propertyChange", function(args) {
        var searchText = args.object.text;
        if (searchText === "") {
            resetPeopleList();
        } else {
            filteredPeople = peopleList.filter(function(person) {
                return person.fullName.trim().toLocaleLowerCase().match(searchText.trim().toLocaleLowerCase());
            });
            pageData.peopleList = filteredPeople;
        }
    });
};

exports.navigatedTo = function (args) {
    var page = args.object;
    var context = page.navigationContext;
    if (peopleList.length === 0) {
        getPeopleByProjectId(context.project.id);
    }
};

exports.navigatingTo = function (args) {
    if (!args.isBackNavigation) {
        peopleList.length = 0;
    }
};

exports.unloaded = function (args) {
    resetPeopleList();
};

exports.showDetail = function(args) {
    var person = args.view.bindingContext;
    var navigateEntry = {
        moduleName: "views/people/people-detail",
        context: {
            project: page.navigationContext.project,
            person: person
        },
        animated: true
    };
    frames.topmost().navigate(navigateEntry);
};

function getPeopleByProjectId(id) {

    pageData.isLoading = true;
    return fetchModule.fetch(config.baseUrl + "/api/people/project/" + id)
        .then(function(response) {
            return response.json();
        })
        .then(onSuccess, onError);
}

function onSuccess(people) {
    people.forEach(function(person) {
        peopleList.push(person);
    });
    pageData.isLoading = false;
}

function onError(error) {
    console.error(error);
}

function resetFilteredPeopleList() {
    filteredPeople.length = 0;
}

function resetPeopleList() {
    resetFilteredPeopleList();
    pageData.peopleList = peopleList;
}
