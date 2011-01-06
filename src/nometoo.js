var copyPlaylist = function(playlist, destination, playlistDestination, deviceAlias, fileSystem, shell) {
    var playlistWriter = makePlaylistWriter(playlist, playlistDestination, deviceAlias, fileSystem);
    var copyFn = makeCopyFn(destination, fileSystem, shell);
    copy(playlist.Tracks, copyFn, playlistWriter);
    playlistWriter.close();
};

var makePlaylistWriter = function(playlist, playlistDestination, deviceAlias, fileSystem) {
    var playlistStream = fileSystem.CreateTextFile(playlistDestination + "\\" + playlist.Name + ".m3u");
    playlistStream.WriteLine("#EXTM3U");

    return {
	writeTrack: function(track, destFileBaseName) {
	    playlistStream.WriteLine(buildTrackFolder(deviceAlias, track) + "\\" + destFileBaseName);
	},
	close: function() {
	    playlistStream.Close();
	}
    };
};

var buildTrackFolder = function(destination, track) {
    return destination + "\\" + track.Artist + "\\" + track.Album;
};

var makeCopyFn = function(destination, fileSystem, shell) {
    return function(track) {
	var destFolder = buildTrackFolder(destination, track)
	createFolderIfNotExists(fileSystem, destFolder);
	if (track.Location.toLowerCase().indexOf("m4a") == -1) {
	    fileSystem.CopyFile(track.Location, destFolder, true);
	    return extractBaseName(track.Location);
	} else {
	    var dest = makeMp3Filename(destFolder, track);
	    shell.Run("ffmpeg -i \"" + track.Location + "\" -acodec libmp3lame -ac 2 -ab 256000 \"" + dest + "\" -map_meta_data \"" + dest + "\":\"" + track.Location + "\"", 0, true);
	    return extractBaseName(dest);
	}
    };
};

var createFolderIfNotExists = function(fileSystem, folder) {
    if (!(fileSystem.FolderExists(folder))) {
	var parentFolder = fileSystem.GetParentFolderName(folder);
	if (!(fileSystem.FolderExists(parentFolder))) {
	    createFolderIfNotExists(fileSystem, parentFolder);
	} else {
	    fileSystem.CreateFolder(folder);
	}
    }
}

var extractBaseName = function(location) {
    return location.substring(location.lastIndexOf("\\") + 1, location.length);
};

var makeMp3Filename = function(destFolder, track) {
    var mp3File = destFolder + "\\" + extractBaseName(track.Location);
    return mp3File.substring(0, mp3File.length - 3) + "mp3";
};

var copy = function(tracks, copyFn, playlistWriter) {
    for ( var i = 1; i <= tracks.Count; i++) {
	var track = tracks.Item(i);
	var destFileBaseName = copyFn(track);
	if(playlistWriter) {
	    playlistWriter.writeTrack(track, destFileBaseName);
	}
    }
};

var selectedTracksFrom = function(musicLibrary) {
    return musicLibrary.SelectedTracks;
};

var selectedPlaylistFrom = function(musicLibrary) {
    return musicLibrary.BrowserWindow.SelectedPlaylist;
};