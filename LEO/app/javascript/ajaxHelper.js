function getSeriesContent(ourSeries, callback){
	ourUrl = "http://thetvdb.com/api/GetSeries.php?seriesname=" + ourSeries.name;
	var x="";
	var y="";
	alert("Sending getSeriesContent request for " + ourSeries.name);
                        $.ajax({
                            url: ourUrl,
                            type: 'GET',
                            dataType: 'xml',
                            async: false,
                            beforeSend: function() {
                            	$('#info').append("<br/>Processing... " + ourSeries.name);
                            },
                            success: function(data, textStatus, xhr) {
                            	x = $(data).find("seriesid").first().text();
                            	y = $(data).find("Overview").first().text();
                            	$('#info').append("<br/>Processed " + ourSeries.name);
                            	alert("Processed getSeriesContent " + ourSeries.name);
                            },
                            error: function(xhr, textStatus, errorThrown) {
                            	$('#info').append("<br/>An error occurred " + ourSeries.name);
                            }
                        });
                        ourSeries.seriesId = x;
                        ourSeries.overView = y;
                        return callback(ourSeries);
                    }

function getEpisodeContent(ourSeries){
	ourUrl = "http://www.leosmartapp.com/rest/tvShow/" + ourSeries.seriesId;
	var episodeXml="";
                        $.ajax({
                            url: ourUrl,
                            type: 'GET',
                            dataType: 'xml',
                            async: false,
                            beforeSend: function() {
                               
                            },
                            success: function(data, textStatus, xhr) {
                            	episodeXml = data;
                            	ourSeries.poster=$(data).find("poster").first().text();
                            	ourSeries.fanart=$(data).find("fanart").first().text();
                            	ourSeries.FirstAired=$(data).find("FirstAired").first().text();
                            	genre=$(data).find("Genre").first().text().split("|");
                            	x="";
                				for (var i = 0; i < genre.length; i++) {
                					x=x + genre[i] + "<br/>";
                					if(i==3)break;
                				}
                				ourSeries.Genre=x;
                            	
                            	ourSeries.Runtime=$(data).find("Runtime").first().text();
                            	ourSeries.Rating=$(data).find("Rating").first().text();	
                            	starring=$(data).find("Actors").first().text().split("|");
                            	a="";
                				for (var j = 0; j < starring.length; j++) {
                					a=a + starring[j] + "<br/>";
                					if(j==5)break;
                				}
                				ourSeries.actors=a;
                				alert("Processed getEpisodeContent " + ourSeries.name);
                            },
                            error: function(xhr, textStatus, errorThrown) {

                            }
                        });
                        return episodeXml;
                    }
function getMovieContent(ourMovie, categoryHolder){
	ourUrl = "http://www.leosmartapp.com/rest/movie/" + ourMovie.name;
	var a="";
	var b="";
	var c="";
	var d="";
	var e="";
	var f="";
	var g="";
	var h="";
	var k="";
	var l="";
	var movieCategories = [];   
                        $.ajax({
                            url: ourUrl,
                            type: 'GET',
                            dataType: 'json',
                            async: false,
                            beforeSend: function() {
                            },
                            success: function(obj, textStatus, xhr) {
                            	a=obj.movies[0].id;
                            	b=obj.movies[0].posters.original;
                            	c=obj.movies[0].synopsis;
                            	if(!c){
                            		c="Critics Consensus: " + obj.movies[0].critics_consensus;
                            	}
                            	d=obj.movies[0].runtime;
                            	//e=obj.movies[0].ratings.critics_score;
                            	score=parseInt(obj.movies[0].ratings.critics_score);
                            	if(score>59){
                            		//Fresh
                            		e="<img src=\"images/freshh.png\"/> " + score + "%";
                            	}else if(score<60){
                            		e="<img src=\"images/splat.png\"/> " + score + "%";
                            	}else{
                            		e="";
                            	}
                            	f=obj.movies[0].year;
                            	g=obj.movies[0].mpaa_rating;
                            	h="";
                				for (var j = 0; j < obj.movies[0].abridged_cast.length; j++) {
                				    h=h + obj.movies[0].abridged_cast[j].name + "<br/>";
                				    if(j==3)break;
                				}
                				k="";
                				movieCategories = obj.movies[0].genres;
                				for (var p = 0; p < obj.movies[0].genres.length; p++) {
                				    k=k + obj.movies[0].genres[p].name + "<br/>";
                				    if(p==3)break;
                				}
                				l=obj.movies[0].backdrop;
                				$('#info').append("<br/>Processed " + ourMovie.name);
                            },
                            error: function(xhr, textStatus, errorThrown) {
                            	$('#info').append("<br/>An error occurred " + ourMovie.name);
                            }
                        });
                        
                        ourMovie.id = a;
                        ourMovie.image = b;
                        ourMovie.synopsis = c;
                        ourMovie.runtime = d;
                        ourMovie.criticsScore = e;
                        ourMovie.year = f;
                        ourMovie.rating = g;
                        ourMovie.cast = h;
                        ourMovie.genre = k;
                        ourMovie.backdrop = l;

                        alert("movieCategories " + movieCategories);
                        //For each category this movie is in
                        if(movieCategories){
	        				for (var x = 0; x < movieCategories.length; x++) {
	        					//Find the category object in the holder
	        					createNew = true;
	        				    for ( var i = 0; i < categoryHolder.length; i++) {
	        				    	 if(movieCategories[x].name == categoryHolder[i].categoryName){
	        				    		 categoryHolder[i].movies.push(ourMovie.name);
	        				    		 createNew = false;
	        				    	 }
	        					}
	        				    if(createNew){
	        				    	var mname = [ourMovie.name];
	        				    	var ourCategory = new category(movieCategories[x].name,mname);
	        				    	categoryHolder.push(ourCategory);
	        				    }
	        				}
                        }
                    }