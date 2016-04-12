var frames = require("ui/frame");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var config = require("../../shared/config");

var page;
var userkey;

var projectList = new ObservableArray();
var pageData = new Observable({ projectList: projectList, isLoading: false });

exports.pageLoaded = function (args) {
    page = args.object;
    if (projectList.length === 0) {
        getProjects();
    }
    userkey = userkey || page.navigationContext.userkey;
    page.bindingContext = pageData;
};

exports.showPeopleByproject = function (args) {
    var project = args.view.bindingContext;
	var navigateEntry = {
		moduleName: "views/people/people-project",
		context: { userkey: userkey, project: project },
		animated: true
	};
	frames.topmost().navigate(navigateEntry);
};

function getProjects() {

    pageData.isLoading = true;
    return fetchModule.fetch(config.baseUrl + "/api/projects/all")
        .then(function(response) {
            return response.json();
        })
        .then(function(projects) {
            projects.forEach(function (project) {
                projectList.push(project);
            });;
            pageData.isLoading = false;
        }, function(error) {
            console.error(error);
        });

}
