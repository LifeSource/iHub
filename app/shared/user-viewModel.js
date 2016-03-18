var config = require("./config");
var http = require("http");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;

function User(info) {

	info = info || {};

	var viewModel = new Observable({
		username: info.username || "Clinton",
		password: info.password || "clinton"
	});

	viewModel.login = function () {

		return fetchModule.fetch(
			config.baseUrl + "/api/account/authenticate?username=" + viewModel.get("username") + "&password=" + viewModel.get("password"), {
			method: "POST",
			body: JSON.stringify({
				username: viewModel.get("username"),
				password: viewModel.get("password")
			}),
			headers: { "Content-Type": "application/json" }
		})
		.then(handleErrors)
		.then(function (response) {
			return response.json();
		});

	};

	return viewModel;
}

function handleErrors(response) {
	if (!response.ok) {
		console.log(JSON.stringify(response));
		throw Error(response.statusText);
	}
	return response;
}
module.exports = User;
