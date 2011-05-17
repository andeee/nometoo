$(function() {
    var iTunes = new ActiveXObject("iTunes.Application");
    var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
    var shell = new ActiveXObject("WScript.Shell");

    var observer = {
	onCopy: function(i, count, track) {
	    $("#progress").html("kopiere " + (i + 1) + " von " + count);
	},
	onFinish: function() {
	    $("#progress").html("kopieren abgeschlossen!");
	}
    };

    var startCopy = function(targetFolder) {
	var playlist = selectedPlaylistFrom(iTunes);
	var selectedTracks = selectedTracksFrom(iTunes);
	var copyFn = makeCopyFn(targetFolder, fileSystem, shell);
	if (selectedTracks) {
	    copy(makeTrackSeq(selectedTracks), copyFn, observer);
	} else {
	    if (playlist) {
		copy(makeTrackSeq(playlist.Tracks), copyFn, observer);
	    } else {
		$("#progress").html("keine Playlist oder Titel ausgewählt!");	    
	    }
	}
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