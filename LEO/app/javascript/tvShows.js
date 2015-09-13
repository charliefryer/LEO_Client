function tvShows(seri){
	//An array of tv series
	this.seri = seri;
}

function series(name){
	this.name = name;
	this.seasons;
	this.seriesId = "";
	this.overView = "";
	
	this.FirstAired = "";
	this.Genre = "";
	this.Runtime = "";
	this.Rating = "";
	this.actors = "";
	
	this.poster = "";
	this.fanart = "";
}

function season(name, episodes){
	this.name = name;
	this.episodes = episodes;
}

function episode(id, seasonNo, episodeNo, filename, filePath, details)
{
	this.id = id;
	this.seasonNo;
	this.episodeNo;
	this.filename=filename;
	this.name;
	this.filePath=filePath;
	this.details=details;
	this.image = "";
	this.height = "";
	this.width = "";

}