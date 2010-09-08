module("mocked iTunes");

var iTunes = {};
iTunes.BrowserWindow = {};

var fileSystem = {};

test("no tracks selected", function() {
	ok(!copy(undefined), "don't copy");
});
