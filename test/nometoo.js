JsHamcrest.Integration.QUnit();
JsMockito.Integration.QUnit();

var track = {
	Artist : "Disturbed",
	Album : "Asylum",
	Title : "Another Way To Die",
	Location : "c:\\test\\04 - Another Way To Die.mp3"
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
iTunes.SelectedTracks = collectionFromArray([ track ]);
iTunes.BrowserWindow.SelectedPlaylist = { Name: "Playlist", Tracks: collectionFromArray([ track ])};

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
	}
    };
};

module("playlistWriter");

test("copies selected tracks from iTunes to destination", function() {
    var fileSystem = makeFileSystem();
    copy(selectedTracksFrom(iTunes), "f:", fileSystem);
    assertThat(fileSystem.copied.length, is(1));
    assertThat(fileSystem.copied[0].source, is(track.Location));
    assertThat(fileSystem.copied[0].destination, is("f:\\Disturbed\\Asylum"));
});

test("creates playlist of selected playlist from iTunes", function() {
    var fileSystem = makeFileSystem();
    copyPlaylist(selectedPlaylistFrom(iTunes), "f:", "f:\\Playlists", "e:", fileSystem);
    assertThat(fileSystem.playlist.path, is("f:\\Playlists\\Playlist.m3u"));
});

test("copies playlist tracks of selected playlist from iTunes", function() {
    var fileSystem = makeFileSystem();
    copyPlaylist(selectedPlaylistFrom(iTunes), "f:", "f:\\Playlists", "e:", fileSystem);
    assertThat(fileSystem.copied.length, is(1));
    assertThat(fileSystem.copied[0].source, is(track.Location));
    assertThat(fileSystem.copied[0].destination, is("f:\\Disturbed\\Asylum"));    
});

test("writes tracks to Playlist", function () {
    var fileSystem = makeFileSystem();
    copyPlaylist(selectedPlaylistFrom(iTunes), "f:", "f:\\Playlists", "e:", fileSystem);
    assertThat(fileSystem.playlist.content, is("#EXTM3U\r\ne:\\Disturbed\\Asylum\\04 - Another Way To Die.mp3\r\n"));
});

test("closes Playlist after write", function () {
    var fileSystem = makeFileSystem();
    copyPlaylist(selectedPlaylistFrom(iTunes), "f:", "f:\\Playlists", "e:", fileSystem);
    assertThat(fileSystem.playlist.closed, is(true));
});