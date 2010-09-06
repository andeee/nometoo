NO ME TOO
=========

This script copies the selected tracks or playlists from iTunes to an arbitrary folder (e.g. USB Drive, MP3 Player or preferably a Nokia Phone in USB Drive mode) 

When a playlist is selected in iTunes it also tries to recreate the Playlist as a (for now very Nokia specific) M3U file.

What you need:
--------------
1. Windows (with Windows Scripting Host)
2. iTunes
3. an MP3 player which can act as a USB Mass Storage Device

Usage:
------
1. Setup the registry key for the destination folder (see CopySelectedTracks.js)
2. Select the tracks or the playlist you want to copy.
3. Launch the script.
4. Wait until it displays "Habe fertig!"

Restrictions:
-------------
My first try is a little rough around the edges:

*  It reads the destination folder from the registry
*  Only displays a stupid german message when it's finished copying
*  No tests (very bad, one of the first things I will fix)
*  It assumes a Playlists folder relative to the destination folder

The story behind it:
--------------------

Ovi Music on Windows is too bloated and slow for me and since I already use iTunes I didn't want yet another music library manager.
I would appreciate if Nokia would port it's Multimedia Transfer from Mac to Windows, but since that didn't happen yet and I'm very impatient I started this little helper script.
The "NO ME TOO" is a tribute to Nokia Multimedia Transfer... Yes I am very creative!  
