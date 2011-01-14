var iTunes = WScript.CreateObject("iTunes.Application");
var fileSystem = WScript.CreateObject("Scripting.FileSystemObject");
var shell = WScript.CreateObject("WScript.Shell");
var destDev = shell.RegRead("HKCU\\Software\\nometoo\\Destination");
var playlistDest = shell.RegRead("HKCU\\Software\\nometoo\\PlaylistDestination");
var devAlias = shell.RegRead("HKCU\\Software\\nometoo\\DeviceAlias");


var startCopy = function(form) {
    copy(selectedTracksFrom(iTunes), makeCopyFn(destDev + "\\" + form.trackFolder.value, fileSystem, shell, logger));
};

var logger = function(track) {
    document.getElementById("progress").innerHtml = "kopiere " + track.Location;
};
