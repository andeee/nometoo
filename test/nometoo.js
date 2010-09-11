JsHamcrest.Integration.QUnit();
JsMockito.Integration.QUnit();

var iTunes = {};
iTunes.BrowserWindow = {};
var fileSystem = {};

module("playlistWriter");

var file = {
	content : "",
	WriteLine : function(line) {
		this.content += line;
	}
};
var track = {
	Artist : "Disturbed",
	Album : "Asylum",
	Title : "Another Way To Die",
	Location : "c:\\test\\04 - Another Way To Die.mp3"
};

test("write track to playlist", function() {
	var myPlaylistWriter = playlistWriter(file);
	myPlaylistWriter.write(track);
	assertThat(file.content,
			is(equalTo("e:\\Disturbed\\Asylum\\04 - Another Way To Die.mp3")));
});

test("don't write track if no file given", function() {
	var myPlaylistWriter = playlistWriter(undefined);
	myPlaylistWriter.write(track);
});
