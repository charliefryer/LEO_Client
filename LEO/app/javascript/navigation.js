var menuIndex = 0;
var seriesIndex = 0;
var seasonIndex = 0;

/**
 * When selecting a menu item, we move the the child menu.
 */
function navDeeper(selectValue){
	if(currentNav == "top"){
		if(selectValue=="Browse Tv Shows"){
			var data = new Array();
			for ( var i = 0; i < shows.seri.length; i++) {
				data[i] = shows.seri[i].name;
			}
			currentNav = "series";
			$('#list').sfList('clear');
			$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
	        $('#list').sfList('blur');
		}else{
			var data = new Array();
			data[0] = "Categories";
			for ( var i = 0; i < movies.movs.length; i++) {
				data[i+1] = movies.movs[i].name;
			}
			currentNav = "Browse Movies";
			$('#list').sfList('clear');
			$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
	        $('#list').sfList('blur');
		}
	}
	else if(currentNav == "series"){
		//Draw season menu
		var data = new Array();
		for ( var i = 0; i < shows.seri.length; i++) {
			if(shows.seri[i].name == selectValue){
				//Store Current Series
				currentSeries = shows.seri[i];
				
				//Loop through seasons
				for ( var j = 0; j < shows.seri[i].seasons.length; j++) {
					data[j] = shows.seri[i].seasons[j].name;
				}
				//Store the seasons, save us iterating over the series again
				currentSeason = shows.seri[i].seasons;
				currentNav = "season";
				seriesIndex = i;
				$('#list').sfList('clear');
				$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
		        $('#list').sfList('blur');
			}
		}
		
	}else if(currentNav == "season"){
		//Draw Episode Menu
		var data = new Array();
		for ( var i = 0; i < currentSeason.length; i++) {
			if(currentSeason[i].name == selectValue){
				//Find season
				//Loop through episodes
				for ( var j = 0; j < currentSeason[i].episodes.length; j++) {
					data[j] = currentSeason[i].episodes[j].name;
				}
				//Store the episodes, save us iterating over the seasons again
				currentEpisodes = currentSeason[i].episodes;
				currentNav = "episode";
				seasonIndex = i;
				$('#list').sfList('clear');
				$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
		        $('#list').sfList('blur');
			}
		}
	}else if(currentNav == "episode"){
		for ( var i = 0; i < currentEpisodes.length; i++) {
			if(currentEpisodes[i].name == selectValue){
				//See if it is not contained in watched.
				if(watched.indexOf("tv" + currentEpisodes[i].id)==-1){
					//Add it to watched array
					watched.push("tv" + currentEpisodes[i].id);
				}
				//Play that episode
				playVideo(currentEpisodes[i].filePath + "/" + currentEpisodes[i].filename);
			}
		}
		
	}
	else if(currentNav == "Browse Movies"){
		if("Categories" == selectValue){
			var data = new Array();
			for ( var i = 0; i < movies.categories.length; i++) {
				data[i] = movies.categories[i].categoryName;
			}
			currentNav = "categoryLevelTwo";
			$('#list').sfList('clear');
			$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
	        $('#list').sfList('blur');
			
		}else{
			for ( var i = 0; i < movies.movs.length; i++) {
				if(movies.movs[i].name == selectValue){
					//See if it is not contained in watched.
					if(watched.indexOf("movie" + movies.movs[i].id)==-1){
						//Add it to watched array
						watched.push("movie" + movies.movs[i].id);
					}
					//Play that Movie
					playVideo(movies.movs[i].filePath);
				}
			}
		}
	}else if(currentNav == "categoryLevelTwo"){
		//Draw Category Movies
		var data = new Array();
		for ( var i = 0; i < movies.categories.length; i++) {
			if(movies.categories[i].categoryName == selectValue){
				//Find category
				//Loop through movies
				for ( var j = 0; j < movies.categories[i].movies.length; j++) {
					data[j] = movies.categories[i].movies[j];
				}
				currentCatMovies = movies.categories[i].movies;
				currentNav = "categoryLevelThree";
				//Remember where we are
				menuIndex = i;
				$('#list').sfList('clear');
				$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
		        $('#list').sfList('blur');
			}
		}
	}else if(currentNav == "categoryLevelThree"){
		for ( var i = 0; i < movies.movs.length; i++) {
			if(movies.movs[i].name == selectValue){
				//See if it is not contained in watched.
				if(watched.indexOf("movie" + movies.movs[i].id)==-1){
					//Add it to watched array
					watched.push("movie" + movies.movs[i].id);
				}
				//Play that Movie
				playVideo(movies.movs[i].filePath);
			}
		}
	}
	
}

/**
 * When returning from a menu item, we move to the parent menu
 * @param selectValue
 */
function navReturn(selectValue){
	if(currentNav == "top"){
		widgetAPI.sendReturnEvent();
	}
	else if((currentNav == "series")||(currentNav == "Browse Movies")){
		var data = new Array();
		data[0] = "Browse Movies";
		data[1] = "Browse Tv Shows";
		data[2] = "Update Your Movies";
		data[3] = "Update Your Tv Shows";
		data[4] = "Help";
		currentNav = "top";
		$('#list').sfList('clear');
		$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
		$('#list').sfList('blur');
	}else if(currentNav == "season"){
		//Draw Series Menu
		var data = new Array();
		for ( var i = 0; i < shows.seri.length; i++) {
			data[i] = shows.seri[i].name;
		}
		currentNav = "series";
		$('#list').sfList('clear');
		$('#list').sfList({ data: data, itemsPerPage: 10, index: seriesIndex});
		$('#list').sfList('blur');
	}else if(currentNav == "episode"){
		//Draw Season Menu
		var data = new Array();
		for ( var i = 0; i < currentSeason.length; i++) {
			data[i] = currentSeason[i].name;
		}
		currentNav = "season";
		$('#list').sfList('clear');
		$('#list').sfList({ data: data, itemsPerPage: 10, index: seasonIndex});
		$('#list').sfList('blur');
	}
	else if(currentNav == "categoryLevelThree"){
		var data = new Array();
		for ( var i = 0; i < movies.categories.length; i++) {
			data[i] = movies.categories[i].categoryName;
		}
		currentNav = "categoryLevelTwo";
		$('#list').sfList('clear');
		$('#list').sfList({ data: data, itemsPerPage: 10, index: menuIndex});
        $('#list').sfList('blur');
	}else if(currentNav == "categoryLevelTwo"){
		var data = new Array();
		data[0] = "Categories";
		for ( var i = 0; i < movies.movs.length; i++) {
			data[i+1] = movies.movs[i].name;
		}
		currentNav = "Browse Movies";
		$('#list').sfList('clear');
		$('#list').sfList({ data: data, itemsPerPage: 10, index: 0});
        $('#list').sfList('blur');
	}
	
}