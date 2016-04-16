var frames = require("ui/frame");
var fetchModule = require("fetch");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;
var config = require("../../shared/config");
var appSettings = require("application-settings");

var page;
var userkey;
var searchBar;
var appSettingsProjectList;
var filteredProjects = new ObservableArray();
var projectList = new ObservableArray();
var pageData = new Observable({
    projectList: projectList,
    isLoading: false
});

exports.pageLoaded = function(args) {
    page = args.object;
    page.bindingContext = pageData;
    userkey = userkey || page.navigationContext.userkey;

    if (!projectDataLoaded()) {
        getProjects();
    } else {
        projectList = new ObservableArray(JSON.parse(appSettingsProjectList));
        pageData.projectList = projectList;
    }

    searchBar = page.getViewById("searchBar");

    searchBar.on("clear", function(args) {
        resetProjectList();
    });

    searchBar.on("propertyChange", function(args) {
        var searchText = args.object.text;

        console.log("filteredProjects: ", filteredProjects);
        if (searchText === "") {
            resetProjectList();
        } else {
            resetFilteredProjectList();
            filteredProjects = projectList.filter(function(project) {
                return project.name.trim().toLocaleLowerCase().match(searchText.trim().toLocaleLowerCase());
            });
            pageData.projectList = filteredProjects;
        }
    });
};

exports.showPeopleByProject = function(args) {
    var project = args.view.bindingContext;
    var navigateEntry = {
        moduleName: "views/people/people-project",
        context: {
            userkey: userkey,
            project: project
        },
        animated: true
    };
    frames.topmost().navigate(navigateEntry);
};

function projectDataLoaded() {
    appSettingsProjectList = appSettings.getString("projectList");
    return appSettingsProjectList;
}

function getProjects() {

    pageData.isLoading = true;
    return fetchModule.fetch(config.baseUrl + "/api/projects/all")
        .then(function(response) {
            return response.json();
        })
        .then(onSuccess, onError);
}

function resetFilteredProjectList() {
    filteredProjects.length = 0;
}

function resetProjectList() {
    resetFilteredProjectList();
    pageData.projectList = projectList;
}

function onSuccess(projects) {
    appSettings.setString("projectList", JSON.stringify(projects));
    projects.forEach(function(project) {
        projectList.push(project);
    });
    pageData.isLoading = false;
}

function onError(error) {
    console.error(error);
}
