$(function() {
    var iTunes = new ActiveXObject("iTunes.Application");
    var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
    var shell = new ActiveXObject("WScript.Shell");

    var observer = {
	onCopy: function(i, count, track) {
	    $("#progress").html("kopiere " + track.Location);
	},
	onFinish: function() {
	    $("#progress").html("kopieren abgeschlossen!");
	}
    };

    var startCopy = function(targetFolder) {
	copy(selectedTracksFrom(iTunes), makeCopyFn(targetFolder, fileSystem, shell), observer);
    };

    $("#copyForm").submit(function(e) {
	e.preventDefault();
	startCopy($("#targetFolder").val());
    });

    $("#browseForFolder").click(function(e) {
	var shellApp = new ActiveXObject("Shell.Application");
	var folder = shellApp.BrowseForFolder(0, "Zielordner wählen", 1);
	if (folder) {
	    $("#targetFolder").val(folder.Self.Path);
	}
    });
});