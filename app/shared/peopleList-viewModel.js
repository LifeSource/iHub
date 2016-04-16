var config = require("./config");
var appSettings = require("application-settings");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

var viewModel;

function PeopleListViewModel() {

    viewModel = new ObservableArray();

    viewModel.load = function(userKey) {
        return fetchModule
            .fetch(config.baseUrl + "/api/people/all/" + userKey)
            .then(function(response) {
                return response.json();
            })
            .then(onSuccess, onError);
    };

    viewModel.empty = function() {
        viewModel.length = 0;
    }

    return viewModel;
}

function onSuccess(people) {
    appSettings.setString("peopleList", JSON.stringify(people));
    people.forEach(function(person) {
        viewModel.push(person);
    });
}

function onError(response) {
    if (!response.ok) {
        console.error("Error occurred");
    }
}

module.exports = PeopleListViewModel;
