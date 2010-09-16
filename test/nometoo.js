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
iTunes.SelectedTracks = collectionFromArray( [ track ]);
var fileSystem = {
	copied : [],
	CopyFile : function(src, dest) {
		this.copied.push( {
			source : src,
			destination : dest
		});
	}
};

module("playlistWriter");

test("copies selected tracks from iTunes to destination", function() {
	copy(selectedTracksFrom(iTunes), "f:", fileSystem);
	assertThat(fileSystem.copied.length, is(1));
	assertThat(fileSystem.copied[0].source, is(track.Location));
	assertThat(fileSystem.copied[0].destination, is("f:\\Disturbed\\Asylum"));
});
