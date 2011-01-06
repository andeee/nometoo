JsHamcrest.Integration.QUnit();

var track = {
    Artist : "Disturbed",
    Album : "Asylum",
    Title : "Another Way To Die",
    Location : "c:\\test\\04 - Another Way To Die.mp3"
};

var aacTrack = {
    Artist : "Disturbed",
    Album : "Asylum",
    Title : "Asylum",
    Location : "c:\\test\\02 - Asylum.m4a"
};

var collectionFromArray = function(array) {
    return {
	Item : function(i) {
	    return array[i - 1];
	},
	Count : array.length
    };
};

var iTunes = {};
iTunes.BrowserWindow = {};
iTunes.SelectedTracks = collectionFromArray([ track, aacTrack ]);
iTunes.BrowserWindow.SelectedPlaylist = { Name: "Playlist", Tracks: collectionFromArray([ track, aacTrack ])};

var makeFileSystem = function() {
    return {
	copied : [],
	playlist: {
	    content: "",
	    path: "",
	    closed: false,
	    WriteLine: function(line) {
		this.content += line + "\r\n";
	    },
	    Close: function() {
		this.closed = true;
	    }
	},
	CreateTextFile: function(path) {
	    this.playlist.path = path;
	    return this.playlist;
	},
	CopyFile: function(src, dest) {
	    this.copied.push( {
		source : src,
		destination : dest
	    });
	},
	FolderExists: function(folder) {
	    return true;
	}
    };
};

var makeShell = function() {
    return {
	runcmd: "",
	Run: function(command, windowStyle, waitForReturn) {
	    this.runcmd = command;
	}
    };
};

module("track copying");

test("copies selected tracks from iTunes to destination", function() {
    var fileSystem = makeFileSystem();
    var shell = makeShell();
    var copyFn = makeCopyFn("f:", fileSystem, shell);
    copy(selectedTracksFrom(iTunes), copyFn);
    assertThat(fileSystem.copied.length, is(1));
    assertThat(fileSystem.copied[0].source, is(track.Location));
    assertThat(fileSystem.copied[0].destination, is("f:\\Disturbed\\Asylum\\"));
});

test("transcodes aac track from iTunes to destination", function() {
    var fileSystem = makeFileSystem();
    var shell = makeShell();
    var copyFn = makeCopyFn("f:", fileSystem, shell);
    copy(selectedTracksFrom(iTunes), copyFn);
    assertThat(shell.runcmd, startsWith("ffmpeg -i"));
    assertThat(shell.runcmd, containsString("-map_meta_data \"f:\\Disturbed\\Asylum\\02 - Asylum.mp3\":\"c:\\test\\02 - Asylum.m4a\""));
});


module("playlist writing");

test("creates playlist of selected playlist from iTunes", function() {
    var fileSystem = makeFileSystem();
    var shell = makeShell();
    copyPlaylist(selectedPlaylistFrom(iTunes), "f:", "f:\\Playlists", "e:", fileSystem, shell);
    assertThat(fileSystem.playlist.path, is("f:\\Playlists\\Playlist.m3u"));
});

test("copies playlist tracks of selected playlist from iTunes", function() {
    var fileSystem = makeFileSystem();
    var shell = makeShell();
    copyPlaylist(selectedPlaylistFrom(iTunes), "f:", "f:\\Playlists", "e:", fileSystem, shell);
    assertThat(fileSystem.copied.length, is(1));
    assertThat(fileSystem.copied[0].source, is(track.Location));
    assertThat(fileSystem.copied[0].destination, is("f:\\Disturbed\\Asylum\\"));    
});

test("writes tracks to Playlist", function () {
    var fileSystem = makeFileSystem();
    var shell = makeShell();
    copyPlaylist(selectedPlaylistFrom(iTunes), "f:", "f:\\Playlists", "e:", fileSystem, shell);
    assertThat(fileSystem.playlist.content, is("#EXTM3U\r\ne:\\Disturbed\\Asylum\\04 - Another Way To Die.mp3\r\ne:\\Disturbed\\Asylum\\02 - Asylum.mp3\r\n"));
});

test("closes Playlist after write", function () {
    var fileSystem = makeFileSystem();
    var shell = makeShell();
    copyPlaylist(selectedPlaylistFrom(iTunes), "f:", "f:\\Playlists", "e:", fileSystem, shell);
    assertThat(fileSystem.playlist.closed, is(true));
});