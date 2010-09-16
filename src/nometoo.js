if (!iTunes) {
	var iTunes = WScript.CreateObject("iTunes.Application");
}

if (!fileSystem) {
	var fileSystem = WScript.CreateObject("Scripting.FileSystemObject");
}

var copy = function(tracks, destination, fileSystem) {
	var copyTrack = function(track) {
		fileSystem.CopyFile(track.Location, buildTrackFolder(track), true);
	};

	var buildTrackFolder = function(track) {
		return destination + "\\" + track.Artist + "\\" + track.Album;
	};

	for ( var i = 1; i <= tracks.Count; i++) {
		var track = tracks.Item(i);
		copyTrack(track);
	}
};

var selectedTracksFrom = function(musicLibrary) {
	return musicLibrary.SelectedTracks;
};