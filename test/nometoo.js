JsHamcrest.Integration.QUnit();

var track = {
    Artist : "Disturbed",
    Album : "Asylum",
    Name : "Another Way To Die",
    Location : "c:\\test\\04 - Another Way To Die.mp3"
};

var aacTrack = {
    Artist : "Disturbed",
    Album : "Asylum",
    Name : "Asylum",
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
iTunes.BrowserWindow.SelectedPlaylist = { Name: "Playlist", Tracks: collectionFromArray([ track, aacTrack ]), Kind: 2 };

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
	    this.copied.push({
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
    copy(makeReverseTrackSeq(selectedTracksFrom(iTunes)), copyFn);
    assertThat(fileSystem.copied.length, is(1));
    assertThat(fileSystem.copied[0].source, is(track.Location));
    assertThat(fileSystem.copied[0].destination, is("f:\\02 - Disturbed - Another Way To Die.mp3"));
});

test("transcodes aac track from iTunes to destination", function() {
    var fileSystem = makeFileSystem();
    var shell = makeShell();
    var copyFn = makeCopyFn("f:", fileSystem, shell);
    copy(makeReverseTrackSeq(selectedTracksFrom(iTunes)), copyFn);
    assertThat(shell.runcmd, startsWith("ffmpeg -i"));
    assertThat(shell.runcmd, containsString("-map_meta_data \"f:\\01 - Disturbed - Asylum.mp3\":\"c:\\test\\02 - Asylum.m4a\""));
});

test("copies selected playlist from iTunes to destination", function() {
    var fileSystem = makeFileSystem();
    var shell = makeShell();
    var playlist = selectedPlaylistFrom(iTunes);
    var copyFn = makeCopyFn("f:", fileSystem, shell);
    copy(makeTrackSeq(playlist.Tracks), copyFn);
    assertThat(fileSystem.copied.length, is(1));
    assertThat(fileSystem.copied[0].source, is(track.Location));
    assertThat(fileSystem.copied[0].destination, is("f:\\01 - Disturbed - Another Way To Die.mp3"));
});


module("utils");
test("replaces illegal chars in file name", function() {
    assertThat(replaceIllegalFileChars("H*e:l\"l|o: W<o>r?l\\d/"), is("H_e_l_l_o_ W_o_r_l_d_"));
});