# LEO_Client
L.E.O. is a free smart tv media player. The application allows users navigate through and play their movies and tv shows displaying fan art and information.

The client is a samsung tv application.
It is written is html, javascript and css making use of the javascript samsung tv api libraries to access the filesystem and play videos.
When the application starts for the first time, it scans the usb drive connected to the tv for movies and tvshows.
For each movie and tv show, it sends a rest request to the LEO server to get image links and information related to it.
It then writes this information out to local storage on the tv.
The next time the app is started, this information is read in from local storage.

The user can update their movies or tv shows by clicking on the relevant menu item in the first menu.
The app then contacts the server and retrieves the information again.

The leo server parses rest requests sent from the tv app.
This is a java spring web application.
The purpose of the server app is to limit the requests made to rotten tomatoes, themoviedb.org and tvdb.org and to manage the keys associated with each.
When a request comes in, we check if an entry exists in the database for it. If it does, we return the information for this entry.
Otherwise, we get the information from rotten tomatoes, themoviedb.org or tvdb.org, store this information in our database and return it to the TV app.
If an api key to rotten tomatoes, themoviedb.org or tvdb.org is expired or replaced, we can update it on the server.
Therefore it does not require all TV apps to update.
