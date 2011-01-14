var iTunes = new ActiveXObject("iTunes.Application");
var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
var shell = new ActiveXObject("WScript.Shell");
var destDev = shell.RegRead("HKCU\\Software\\nometoo\\Destination");
var playlistDest = shell.RegRead("HKCU\\Software\\nometoo\\PlaylistDestination");
var devAlias = shell.RegRead("HKCU\\Software\\nometoo\\DeviceAlias");

var logger = function(track) {
    document.getElementById("progress").innerHtml = "kopiere " + track.Location;
};

var startCopy = function(form) {
    copy(selectedTracksFrom(iTunes), makeCopyFn(destDev + "\\" + form.trackFolder.value, fileSystem, shell, logger));
};

