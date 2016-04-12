var frames = require("ui/frame");
var appSettings = require("application-settings");
var Observable = require("data/observable").Observable;
var ObservableArray = require("data/observable-array").ObservableArray;

var page;

exports.pageLoaded = function (args) {
    page = args.object;
    getPeopleByProjectId();
};

function getPeopleByProjectId(id) {

}
