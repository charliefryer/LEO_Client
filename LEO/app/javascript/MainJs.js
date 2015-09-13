var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();

var videoFormats = new Array("avi", "mkv", "asf", "wmv", "mp4", "3gp", "vro", "mpg", "mpeg", "ts", "tp", "trp", "m2ts", "mts", "webm", "divx");

var watched = new Array();

var shows;
var movies;
var testMode = false;

var currentNav = "top";
var currentSeries;
var currentSeason;
var currentEpisodes;

var currentCatMovies;

var Main =
{

};

Main.onLoad = function()
{

	//Check and see if we have a file for tv shows
	var ourFileInfo = readInfoFile();
	if(ourFileInfo==null){
		$('#info').html("<h2>Updating your Videos...</h2>");
		$('#info').append("<br/>Updating your Tv Shows");
		//If in test mode using the local emulator, get data from local methosd.
		//Otherwise, Get Shows from usb
		if(testMode){
			shows = getTestData();
		}else{
			shows = processUsb();
		}
		//write shows out to file
		writeInfoFile(JSON.stringify(shows));
	}else{
		//Create shows object from contents of file
		//$('#info').append("<br/>Getting Shows from Cache");
		try{
			shows = JSON.parse(ourFileInfo);
		}
		catch(err)
		  {
			shows = null;
		  }
	}
	
	//Check and see if we have a file for movies
	var ourMovieFileInfo = readMovieFile();
	if(ourMovieFileInfo==null){
		$('#info').append("<br/>Updating your Movies");
		if(testMode){
			movies = getTestMovieData();
		}else{
			//Get Shows from usb
			movies = processMovieUsb();
		}
		//write movies out to file
		writeMovieFile(JSON.stringify(movies));
	}else{
		//Create shows object from contents of file
		try{
			movies = JSON.parse(ourMovieFileInfo);
		}
		catch(err)
		  {
			movies = null;
		  }
	}
	
	//Check and see if we have a file for watched
	var watchedInfo = readWatchedFile();
	if(watchedInfo!=null){
		try{
			watched = JSON.parse(watchedInfo);
		}
		catch(err)
		  {
			watched = new Array();
		  }
	}
	
	//Create menu
	var data = new Array();
	data[0] = "Browse Movies";
	data[1] = "Browse Tv Shows";
	data[2] = "Update Your Movies";
	data[3] = "Update Your Tv Shows";
	data[4] = "Help";
	$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
	$('#list').sfList('show');
	
	// Enable key event processing
	this.enableKeys();
	widgetAPI.sendReadyEvent();
};



Main.onUnload = function()
{
	//Write the watched array out to file when leaving the app.
	writeWatchedFile(JSON.stringify(watched));
};

Main.enableKeys = function()
{
	document.getElementById("anchor").focus();
};

Main.infoKeyDown = function()
{
	var KeyCode = event.keyCode;
	switch(KeyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			event.preventDefault();
		case tvKey.KEY_LEFT :
			document.getElementById("anchor").focus();
			$('#info').removeClass('infoBorder');
			break;
		case tvKey.KEY_UP :
			break;
		case tvKey.KEY_DOWN :
			break;
		case tvKey.KEY_PLAY:
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
				if(selectedItem!=$('#list').sfList('getSelectedItem')){
					document.getElementById("anchor").focus();
					$('#info').removeClass('infoBorder');
					navDeeper($('#list').sfList('getSelectedItem'));
					renderInformation($('#list').sfList('getSelectedItem'));
				}
			break;
		case tvKey.KEY_EXIT:
			widgetAPI.sendExitEvent();
		default :
			break;
	}
};

Main.keyDown = function()
{

	event.preventDefault();
	var keyCode = event.keyCode;

	switch(keyCode)
	{
		case tvKey.KEY_RETURN:
		case tvKey.KEY_PANEL_RETURN:
			navReturn($('#list').sfList('getSelectedItem'));
			renderInformation($('#list').sfList('getSelectedItem'));
			break;
		case tvKey.KEY_RIGHT:
			if ($('#ib').length) {
				document.getElementById("ib").focus();
				$('#info').addClass('infoBorder');
			}
			break;
		case tvKey.KEY_UP:
			$('#list').sfList('prev');
			renderInformation($('#list').sfList('getSelectedItem'));
			break;
		case tvKey.KEY_DOWN:
			$('#list').sfList('next');
			renderInformation($('#list').sfList('getSelectedItem'));
			break;
		case tvKey.KEY_PLAY:
		case tvKey.KEY_ENTER:
		case tvKey.KEY_PANEL_ENTER:
			var selectedItem = $('#list').sfList('getSelectedItem');
			if(selectedItem=="Update Your Movies"){
				updateMovies();
			}else if(selectedItem=="Update Your Tv Shows"){
				updateTvShows();
			}else if(selectedItem=="Help"){
				renderHelpPage();
			}else{
					navDeeper(selectedItem);
					renderInformation($('#list').sfList('getSelectedItem'));
			}
			break;
		case tvKey.KEY_RED:
			//Page up 10
			var currentFocused = $('#list').sfList('getIndex') + 1;
			var jumpTo = (Math.floor(currentFocused / 10) * 10)-10;
			$('#list').sfList('move', jumpTo);
			renderInformation($('#list').sfList('getSelectedItem'));
			  break;
		case tvKey.KEY_GREEN:
			//Page Down 10.
			var currentFocused = $('#list').sfList('getIndex') + 1;
			var jumpTo = Math.ceil(currentFocused / 10) * 10;
			$('#list').sfList('move', jumpTo);
			renderInformation($('#list').sfList('getSelectedItem'));
			break;
		case tvKey.KEY_BLUE:
			renderHelpPage();
			break;
		case tvKey.KEY_EXIT:
			widgetAPI.sendExitEvent();
		default:
			break;
	}
};

function updateMovies(){
	$('#info').html("<h2>Updating your Movies...</h2>This could take a few minutes.");
	setTimeout(function() {
		//Get Shows from usb
		if(testMode){
			movies = getTestMovieData();
		}else{
			movies = processMovieUsb();
		}
		//write movies out to file
		writeMovieFile(JSON.stringify(movies));
		currentNav = "top";
		var data = new Array();
		data[0] = "Browse Movies";
		data[1] = "Browse Tv Shows";
		data[2] = "Update Your Movies";
		data[3] = "Update Your TvShows";
		data[4] = "Help";
		$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
		$('#list').sfList('show');
		$('#info').append("<h3>Updated your Movies.</h3>");
	},0);
}

function updateTvShows(){
	$('#info').html("<h2>Updating your TV Shows...</h2>This could take a few minutes.");
	setTimeout(function() {
	//Get Shows from usb
	if(testMode){
		shows = getTestData();
	}else{
		shows = processUsb();
	}
	//write shows out to file
	writeInfoFile(JSON.stringify(shows));
	currentNav = "top";
	var data = new Array();
	data[0] = "Browse Movies";
	data[1] = "Browse Tv Shows";
	data[2] = "Update Your Movies";
	data[3] = "Update Your Tv Shows";
	data[4] = "Help";
	$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
	$('#list').sfList('show');
	$('#info').append("<h3>Updated your TV Shows.</h3>");
	},0);
}

function renderHelpPage(){
	$('#info').html('<a id="ib" onkeydown="Main.infoKeyDown();" href="javascript:void(0);"></a><h2>Set Up</h2><br/><p>L.E.O. requires your videos to be stored in a specific way on your USB hard drive. For full information and support, visit www.leosmartapp.com</p><br/><p>Movies: Create a folder named movies in the root directory of your hard drive. Store each movie file in this directory. The filename must be the name of the movie, optionally followed by the year.</p><br/><p>TV Shows: Create a folder named TVShows in the root directory. <br/>Under this, create a folder for each of your tv shows with the name of the tv show.<br/>In each tv show folder, create a folder for each season, named Season 1, Season 2 etc.<br/>In each season folder, store each episode for that season. The episode must be named with the tv show name followed by a dash followed by the season number and the episode number.<br/>For example "Breaking Bad - S01E01", this represents Breaking bad, season one, episode one.</p><br/><p>Connect your USB Hard drive to your television.</p><br/><p>Start up LEO.</p><br/><p>Browse and play your tv shows and movies. You can jump ten items down a menu by pressing the red button. Pressing the green button brings you back 10 items.</p><br/><p>If you add videos in the future, you can update your movies and TV Shows in the top level menu</p>');
}

/*
 * For the value in the menu item,
 * Write relevant information to the page.
 */
function renderInformation(selectValue){
	if(currentNav == "top"){
		$('#info').html('<div style="width:100%;margin-top:10px;"><div><center><img style="margin-top:20px;" src="images/LEO_tv2.png"/></center></div></div></p>');
	}
	else if((currentNav == "Browse Movies") || (currentNav == "categoryLevelThree")){
		for ( var i = 0; i < movies.movs.length; i++) {
			if(movies.movs[i].name == selectValue){
				if(movies.movs[i].id){
					//If we have watched the movie, set the image
					watchedImage="";
					if(watched.indexOf("movie" + movies.movs[i].id)>-1){
						watchedImage="<img src=\"images/green-16.gif\" align=\"left\"/>&nbsp;";
					}
				//Set background
					$('#appBody').css({'background-image' : 'url(' + movies.movs[i].backdrop + ')','background-repeat': 'no-repeat','background-size': '100%'});
					$('#info').html("<a id='ib' onkeydown='Main.infoKeyDown();' href='javascript:void(0);'></a><div style=\"float:left;\">Runtime: " + movies.movs[i].runtime + " minutes<br/>Year: " + movies.movs[i].year + "<br/>Rating: " + movies.movs[i].rating + "<br/>Critics Score: " + movies.movs[i].criticsScore + "<br/>Genre:<br/>" + movies.movs[i].genre + "<br/>Starring:<br/>" + movies.movs[i].cast + "</div><div style=\"float:right;margin-left:10px;width:45%;height:310px;\"><img style=\"width:200px;\" src='" + movies.movs[i].image + "'/></div><div style=\"clear:both;\"></div><div>" + watchedImage + movies.movs[i].synopsis + "</div>");
				}else{
					//Allow movie to be played anyway
					$('#info').html("<a id='ib' onkeydown='Main.infoKeyDown();' href='javascript:void(0);'></a><div><h2>Not Found</h2><p>Movie Information not found</p><p>View the help menu option in the main menu for more information.</p></div>");
				}
			}
		}
	}
	else if(currentNav == "categoryLevelTwo"){
		for ( var i = 0; i < movies.categories.length; i++) {
			if(movies.categories[i].categoryName == selectValue){
				//We have a selected value of comedy for example
				var catMovies = []; 
				//For each movie in the category
				for ( var j = 0; j < movies.categories[i].movies.length; j++) {
					// I want 3 max
					if(j==3){
						break;
					}
					//get the movie object from the movies array
					//Add it to our catMovies aray
					catMovies[j] = getCategoryMovieObject(movies.categories[i].movies[j]);
				}
				
				if(catMovies.length==1){
					$('#appBody').css({'background-image' : 'url(' + catMovies[0].backdrop + ')','background-repeat': 'no-repeat','background-size': '100%'});
					$('#info').html("<center><img style=\"height:400px;\" src='" + catMovies[0].image + "'/></center>");
				}else if(catMovies.length==2){
					$('#appBody').css({'background-image' : 'url(' + catMovies[0].backdrop + ')','background-repeat': 'no-repeat','background-size': '100%'});
					$('#info').html("<img style=\"position:absolute;z-index:2;height:400px;\" src='" + catMovies[0].image + "'/><img style=\"position:absolute;left:60%;z-index:1;height: 400px;\" src='" + catMovies[1].image + "'/>");
				}else if(catMovies.length==3){
					$('#appBody').css({'background-image' : 'url(' + catMovies[0].backdrop + ')','background-repeat': 'no-repeat','background-size': '100%'});
					$('#info').html("<img style=\"position:absolute;z-index:2;height:400px;\" src='" + catMovies[0].image + "'/><img style=\"position:absolute;left:60%;z-index:1;height: 400px;\" src='" + catMovies[1].image + "'/><img style=\"position:absolute;left:70%;z-index:0;height: 400px;\" src='" + catMovies[2].image + "'/>");
				}
			}
		}
	}
	else if(currentNav == "series"){
		for ( var i = 0; i < shows.seri.length; i++) {
			if(shows.seri[i].name == selectValue){
				if(shows.seri[i].seriesId){
					$('#appBody').css({'background-image' : 'url(http://thetvdb.com/banners/' + shows.seri[i].fanart + ')','background-repeat': 'no-repeat','background-size': '100%'});
					//Find series
					$('#info').html("<a id='ib' onkeydown='Main.infoKeyDown();' href='javascript:void(0);'></a><div style=\"float:left;\">Runtime: " + shows.seri[i].Runtime + " minutes<br/>First Aired: " + shows.seri[i].FirstAired + "<br/>Critics Score: " + shows.seri[i].Rating + "<br/>Genre: " + shows.seri[i].Genre + "<br/>Starring: " + shows.seri[i].actors + "</div><div style=\"float:right;margin-left:10px;width:45%;height:310px;\"><img style=\"width:200px;\" src='http://thetvdb.com/banners/" + shows.seri[i].poster + "'/></div><div style=\"clear:both;\"></div><div>" + shows.seri[i].overView + "</div>");
				}else{
					$('#info').html("<a id='ib' onkeydown='Main.infoKeyDown();' href='javascript:void(0);'></a><div><h2>Not Found</h2><p>Series Information not found</p><p>View the help menu option in the main menu for more information.</p></div>");
				}
			}
		}
	}
	else if(currentNav == "season"){
		for ( var i = 0; i < currentSeries.seasons.length; i++) {

			if(currentSeries.seasons[i].name == selectValue){
				//Get the digits out of the folder name
				var r = /\d+/;
				$('#info').html("<a id='ib' onkeydown='Main.infoKeyDown();' href='javascript:void(0);'><center><img style=\"height: 400px;\" src='http://thetvdb.com/banners/seasons/" + currentSeries.seriesId + "-" + selectValue.match(r) + ".jpg'/>");
			}
		}
	}else if(currentNav == "episode"){
		for ( var i = 0; i < currentEpisodes.length; i++) {
			if(currentEpisodes[i].name == selectValue){
				if(currentEpisodes[i].details){
					//If we have watched the episode, set the image
					watchedImage="";
					if(watched.indexOf("tv" + currentEpisodes[i].id)>-1){
						watchedImage="<img src=\"images/green-16.gif\" align=\"left\"/>&nbsp;";
					}
				//Get the digits out of the folder name
				//$('#info').html("<center><img style=\"height: 80%\" src='http://thetvdb.com/banners/seasons/" + currentSeries.seriesId + "-" + selectValue.match(r) + ".jpg'/>");
				//$('#info').html(currentEpisodes[i].details);
					$('#info').html("<a id='ib' onkeydown='Main.infoKeyDown();' href='javascript:void(0);'></a><center><img src='http://thetvdb.com/banners/" + currentEpisodes[i].image + "'/></center>" + watchedImage + currentEpisodes[i].details);
				}else{
					$('#info').html("<a id='ib' onkeydown='Main.infoKeyDown();' href='javascript:void(0);'></a><div><h2>Not Found</h2><p>Episode Information not found</p><p>View the help menu option in the main menu for more information.</p></div>");
				}
			}
		}
	}else{
		$('#info').html('Information about ' + selectValue);
	}
	
}

function getCategoryMovieObject(myMovieName){
	for ( var i = 0; i < movies.movs.length; i++) {
		if(movies.movs[i].name == myMovieName){
			return movies.movs[i];
		}
	}
	return null;
}

function playVideo(ourPath){

	//http://www.samsungdforum.com/Guide/art00021/index.html
	
	sf.service.VideoPlayer.init({
	    onend: function(){
	    	 Main.enableKeys();
	    }
	});
	
	// Sets Player as fullscreen mode
	sf.service.VideoPlayer.setFullScreen(true);

	// Set key handler for RETURN key explicitly to return to the previous view.
	sf.service.VideoPlayer.setKeyHandler(sf.key.RETURN, function () {
	    // If user press RETURN key during the Fullscreen view, stops the playback.
	    // If the setPosition is not defined, this closes the Fullscreen view and returns to previous view.
	    sf.service.VideoPlayer.stop();
	    Main.enableKeys();
	});
	
	// Set key handler for STOP key explicitly to return to the previous view.
	sf.service.VideoPlayer.setKeyHandler(sf.key.STOP, function () {
	    // If user press STOP key during the Fullscreen view, stops the playback.
	    // If the setPosition is not defined, this closes the Fullscreen view and returns to previous view.
	    sf.service.VideoPlayer.stop();
	    Main.enableKeys();
	});

	// starts playback
	sf.service.VideoPlayer.play({
	    url: ourPath,
	    fullScreen: true
	});
	
}


