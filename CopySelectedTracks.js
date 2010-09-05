copy(selectedTracks() || selectedPlaylist());

function copy(playlist) {
	var playlistWriter = new PlaylistWriter(playlist.name);
	playlistWriter.createPlaylist();
	for (var i = 1; i <= playlist.tracks.Count; i++) {
		var track = playlist.tracks.Item(i);
		copyTrack(track);
		playlistWriter.writeTrackToPlaylist(track);
	}
	playlistWriter.closePlaylist();
	WScript.Echo("Habe fertig!");
}

function selectedTracks() {
	var iTunes = WScript.CreateObject("iTunes.Application");
	if (iTunes.SelectedTracks) {
		return { tracks: iTunes.SelectedTracks };
	}
}

function selectedPlaylist() {
	var iTunes = WScript.CreateObject("iTunes.Application");
	var selectedPlaylist = iTunes.BrowserWindow.SelectedPlaylist
	if (selectedPlaylist) {
		return { tracks: selectedPlaylist.Tracks, name: selectedPlaylist.Name };
	}
}

function PlaylistWriter(playlistName) {
	var playlistFile;
	var fileSystem = WScript.CreateObject("Scripting.FileSystemObject");
	this.createPlaylist = function() {
		if (playlistName) {
			playlistFile = fileSystem.CreateTextFile(getDestination() + "Playlists\\" + playlistName + ".m3u", true);
			playlistFile.WriteLine("#EXTM3U");
		}
	};
	this.writeTrackToPlaylist = function(track) {
		if(playlistFile) {
			playlistFile.WriteLine(getTrackDestination("e:\\", track));
		}
	};
	this.closePlaylist = function() {
		if(playlistFile) {
			playlistFile.Close();
		}
	};
};

function copyTrack(track) {
	var fileSystem = WScript.CreateObject("Scripting.FileSystemObject");
	if(!fileSystem.fileExists(getTrackDestination(getDestination(), track))) {
		fileSystem.CopyFile(track.location, createAndBuildTrackPath(getDestination(), track, createTrackFolderIfNotExists), true);
	}
}

function createAndBuildTrackPath(basePath, track, creatorFunction) {
	var fileSystem = WScript.CreateObject("Scripting.FileSystemObject");
	var artistPath = fileSystem.BuildPath(basePath, track.Artist)
	creatorFunction(artistPath);
	var albumPath = fileSystem.BuildPath(artistPath, track.Album)
	creatorFunction(albumPath);
	return albumPath + "\\";
}

function createTrackFolderIfNotExists(path) {
	var fileSystem = WScript.CreateObject("Scripting.FileSystemObject");
	if (!fileSystem.FolderExists(path)) {
		fileSystem.CreateFolder(path);
	}
}

function noOp() {}

function getDestination() {
	var shell = WScript.CreateObject("WScript.Shell");
	return shell.RegRead("HKCU\\Software\\Russel\\Destination");
}

function getTrackDestination(basePath, track) {
	var fileSystem = WScript.CreateObject("Scripting.FileSystemObject");
	var trackFile = fileSystem.GetFilename(track.location);
	return fileSystem.BuildPath(createAndBuildTrackPath(basePath, track, noOp), trackFile);
}
