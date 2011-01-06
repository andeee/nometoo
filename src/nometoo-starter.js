var iTunes = WScript.CreateObject("iTunes.Application");
var fileSystem = WScript.CreateObject("Scripting.FileSystemObject");
var shell = WScript.CreateObject("WScript.Shell");
var destDev = shell.RegRead("HKCU\\Software\\nometoo\\Destination");
var playlistDest = shell.RegRead("HKCU\\Software\\nometoo\\PlaylistDestination");
var devAlias = shell.RegRead("HKCU\\Software\\nometoo\\DeviceAlias");

if (selectedPlaylistFrom(iTunes)) {
    copyPlaylist(selectedPlaylistFrom(iTunes), destDev, playlistDest, devAlias, fileSystem, shell);
} else {
    copy(selectedTracksFrom(iTunes), makeCopyFn(destDev, fileSystem, shell));
}