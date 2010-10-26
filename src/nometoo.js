var copyPlaylist = function(playlist, destination, playlistDestination, deviceAlias, fileSystem) {
    var playlistWriter = makePlaylistWriter(playlist, playlistDestination, deviceAlias, fileSystem);
    copy(playlist.Tracks, destination, fileSystem, playlistWriter);
    playlistWriter.close();
}

var makePlaylistWriter = function(playlist, playlistDestination, deviceAlias, fileSystem) {
    var playlistFile = fileSystem.CreateTextFile(playlistDestination + "\\" + playlist.Name + ".m3u");
    playlistFile.WriteLine("#EXTM3U");

    var extractBaseName = function(location) {
	return location.substring(location.lastIndexOf("\\") + 1, location.length);
    };

    return {
	writeTrack: function(track) {
	    playlistFile.WriteLine(buildTrackFolder(deviceAlias, track) + "\\" + extractBaseName(track.Location));
	},
	close: function() {
	    playlistFile.Close();
	}
    };
}

var buildTrackFolder = function(destination, track) {
    return destination + "\\" + track.Artist + "\\" + track.Album;
};

var copy = function(tracks, destination, fileSystem, playlistFile) {
    var copyTrack = function(track) {
	fileSystem.CopyFile(track.Location, buildTrackFolder(destination, track), true);
    };

    for ( var i = 1; i <= tracks.Count; i++) {
	var track = tracks.Item(i);
	copyTrack(track);
	if(playlistFile) {
	    playlistFile.writeTrack(track);
	}
    }
};

var selectedTracksFrom = function(musicLibrary) {
    return musicLibrary.SelectedTracks;
};

var selectedPlaylistFrom = function(musicLibrary) {
    return musicLibrary.BrowserWindow.SelectedPlaylist;
}