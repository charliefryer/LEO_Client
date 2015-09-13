function getTestData(){
	var seriesHolder=new Array();
	
	var seriesKOQ = new series("The King Of Queens");
	var episodeXml = getSeriesContent(seriesKOQ, getEpisodeContent);
	var myEpisode1=new episode("", "", "", "The King Of Queens - S01E01", "path", "");
	var myEpisode2=new episode("", "", "11", "The King Of Queens - S01E02", "path", "");
	addEpisodeDetails(episodeXml, myEpisode1);
	addEpisodeDetails(episodeXml, myEpisode2);
	
	var episodeHolder=new Array();
	episodeHolder[0]=myEpisode1;
	episodeHolder[1]=myEpisode2;
	//var season1 = new season("Season 1", episodeHolder);
	season1 = new season("Season 1", episodeHolder);
	
	var seasonHolder=new Array();
	seasonHolder[0]=season1;
	//var seriesKOQ =  new series("The King Of Queens", "About King of Queens", seasonHolder);
	seriesKOQ.seasons = seasonHolder;
	
	var seriesBB = new series("Breaking Bad");
	var episodeXml = getSeriesContent(seriesBB, getEpisodeContent);

	var myEpisode3=new episode("", "", "", "Breaking Bad - S01E01", "path", "");
	var myEpisode4=new episode("", "", "", "Breaking Bad - S01E02", "path", "");
	addEpisodeDetails(episodeXml, myEpisode3);
	addEpisodeDetails(episodeXml, myEpisode4);
	var episodeHolderBB=new Array();
	episodeHolderBB[0]=myEpisode3;
	episodeHolderBB[1]=myEpisode4;
	var seasonBB = new season("Season 1", episodeHolderBB);
	var seasonHolderBB=new Array();
	seasonHolderBB[0]=seasonBB;
	
	var myEpisode5=new episode("", "", "", "Breaking Bad - S02E01", "", "");
	addEpisodeDetails(episodeXml, myEpisode5);
	var episodeHolderBB2=new Array();
	episodeHolderBB2[0]=myEpisode5;
	var seasonBB2 = new season("Season 2", episodeHolderBB2);
	seasonHolderBB[1]=seasonBB2;
	
	//var seriesBB =  new series("Breaking Bad", "About Breaking Bad", seasonHolderBB);
	seriesBB.seasons = seasonHolderBB;
	
	seriesHolder[0] = seriesKOQ;
	seriesHolder[1] = seriesBB;
	
	return new tvShows(seriesHolder);
	
}

function getTestMovieData(){
	var movieHolderX = []; 
	var categoryHolder = []; 
		var movie1 = new movie("Kingpin", "");
		getMovieContent(movie1,categoryHolder);
		var movie2 = new movie("Black Swan", "");
		getMovieContent(movie2,categoryHolder);
		var movie3 = new movie("What Richard Did", "");
		getMovieContent(movie3,categoryHolder);
		var movie4 = new movie("Full Metal Jacket", "");
		getMovieContent(movie4,categoryHolder);
		var movie5 = new movie("Bridesmaids", "");
		getMovieContent(movie5,categoryHolder);
		var movie6 = new movie("Cool Runnings", "");
		getMovieContent(movie6,categoryHolder);
		var movie7 = new movie("Crazy Stupid Love", "");
		getMovieContent(movie7,categoryHolder);
		var movie8 = new movie("Dumb and Dumber", "");
		getMovieContent(movie8,categoryHolder);
		var movie9 = new movie("Eat Prey Love", "");
		getMovieContent(movie9,categoryHolder);
		var movie10 = new movie("Elf the Movie", "");
		getMovieContent(movie10,categoryHolder);
		var movie11 = new movie("Flight", "");
		getMovieContent(movie11,categoryHolder);
		var movie12 = new movie("Gravity 3D", "");
		getMovieContent(movie12,categoryHolder);
		var movie13 = new movie("Not a movie xx", "");
		getMovieContent(movie13,categoryHolder);
		
		movieHolderX[0] = movie1;
		movieHolderX[1] = movie2;
		movieHolderX[2] = movie3;
		movieHolderX[3] = movie4;
		movieHolderX[4] = movie5;
		movieHolderX[5] = movie6;
		movieHolderX[6] = movie7;
		movieHolderX[7] = movie8;
		movieHolderX[8] = movie9;
		movieHolderX[9] = movie10;
		movieHolderX[10] = movie11;
		movieHolderX[11] = movie12;
		movieHolderX[12] = movie13;
		
		//Printing
		for (var c = 0; c < categoryHolder.length; c++) {
			alert("---New Category---");
			alert(categoryHolder[c].categoryName);
			for (var d = 0; d < categoryHolder[c].movies.length; d++) {
				alert(categoryHolder[c].movies[d]);
			}
		}

	return new moviesObj(movieHolderX, categoryHolder);
}