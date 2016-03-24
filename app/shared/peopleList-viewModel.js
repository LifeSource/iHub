var config = require("./config");
var appSettings = require("application-settings");
var fetchModule = require("fetch");
var ObservableArray = require("data/observable-array").ObservableArray;

function PeopleListViewModel(people) {
	var viewModel = new ObservableArray(people);

	viewModel.load = function (userKey) {

		return fetchModule.fetch(config.baseUrl + "/api/people/all/" + userKey)
			.then(function (response) {
				return response.json();
			})
			.then(function (data) {
				appSettings.setString("peopleList", JSON.stringify(data));
				data.forEach(function (person) {
					viewModel.push(person);
				});
			}, function (error) {
				console.log("Error: ", error);
			});
	};

	viewModel.empty = function () {
		while (viewModel.length) {
			viewModel.pop();
		}
	};

	return viewModel;
}

function handleErrors(response) {
	if (!response.ok) {
		console.log("Error occurred");
	}
}

module.exports = PeopleListViewModel;
