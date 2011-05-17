var makeCopyFn = function(destination, fileSystem, shell) {
    return function(trackSeq, observer) {
	if (trackSeq) {
	    createFolderIfNotExists(fileSystem, destination);
	    var track = trackSeq.first();
	    var destFile = makeDestFileName(destination, track, trackSeq.index());
	    if (observer) {
		observer.onCopy(track, trackSeq.index(), trackSeq.count());
	    }
	    if (track.Location.toLowerCase().indexOf("mp3") > -1) {
		fileSystem.CopyFile(track.Location, destFile, true);
	    } else {
		shell.Run("ffmpeg -i \"" + track.Location + "\" -y -acodec libmp3lame -ac 2 -ab 256000 \"" + destFile + "\" -map_meta_data \"" + destFile + "\":\"" + track.Location + "\"", 0, true);
	    }
	    var selfFunc = arguments.callee;
	    setTimeout(function () { selfFunc(trackSeq.rest()) }, 25);
	}
    };
};

var createFolderIfNotExists = function(fileSystem, folder) {
    if (!(fileSystem.FolderExists(folder))) {
	var parentFolder = fileSystem.GetParentFolderName(folder);
	if (!(fileSystem.FolderExists(parentFolder))) {
	    createFolderIfNotExists(fileSystem, parentFolder);
	}
	fileSystem.CreateFolder(folder);
    }
};

var makeDestFileName = function(destination, track, i) {
    return destination + "\\" + numToStr(i) + " - " + replaceIllegalFileChars(track.Artist) + " - " + replaceIllegalFileChars(track.Name) + ".mp3";
};

var numToStr = function(i) {
    if (i < 10)  {
	return "0" + i;
    } else {
	return "" + i;
    }
};

var replaceIllegalFileChars = function(fileNamePart) {
    var illegalFileChars = /[<>:"\/\\|\?\*]/g;
    if (illegalFileChars.test(fileNamePart)) {
	return fileNamePart.replace(illegalFileChars, "_");
    }
    return fileNamePart;
};

var copy = function(trackSeq, copyFn, observer) {
    setTimeout(function() { 
	copyFn(trackSeq, observer);
	if (observer) {
	    observer.onFinish();
	}
    }, 25);
};

var makeTrackSeq = function(tracks) {
    var _makeTrackSeq = function(tracks, i) {
	return {
	    rest: function() {
		if (i < tracks.Count) {
		    return _makeTrackSeq(tracks, i+1);
		}
	    },
	    first: function() {
		return tracks.Item(i);
	    },
	    index: function() {
		return i;
	    },
	    count: function() {
		return tracks.Count;
	    }
	};
    };
    return _makeTrackSeq(tracks, 1);
};

var makeReverseTrackSeq = function(tracks) {
    var _makeReverseTrackSeq = function(tracks, i) {
	return {
	    rest: function() {
		if (i > 1) {
		    return _makeReverseTrackSeq(tracks, i-1);
		}
	    },
	    first: function() {
		return tracks.Item(i);
	    },
	    index: function() {
		return tracks.Count - i + 1;
	    },
	    count: function() {
		return tracks.Count;
	    }
	};
    };
    return _makeReverseTrackSeq(tracks, tracks.Count);
};

var selectedTracksFrom = function(musicLibrary) {
    return musicLibrary.SelectedTracks;
};

var selectedPlaylistFrom = function(musicLibrary) {
    var playlist = musicLibrary.BrowserWindow.SelectedPlaylist;
    if (playlist.Kind == 2) {
	return playlist;
    }
};