var playlistWriter = function(playlistFile) {
	var getTrackDestination = function(basePath, track) {
		trackFilenameRegex = /^.*\\(.*)$/;
		trackFilename = trackFilenameRegex.exec(track.Location)[1];
		return basePath + "\\" + track.Artist + "\\" + track.Album + "\\"
				+ trackFilename;
	};
	return {
		write : function(track) {
			if (playlistFile) {
				playlistFile.WriteLine(getTrackDestination("e:", track));
			}
		}
	};
};

var playlist = function(fileSystem, playlistName) {
	return {};
};