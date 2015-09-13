function moviesObj(movs, categories){
	//Array of movie objects 
	this.movs = movs;
	//Array of category objects
	this.categories = categories;
}

function movie(name, filePath){
	this.name=name;
	this.filePath = filePath;
	this.filename;
	this.id;
	this.image;
	this.synopsis;
	this.runtime;
	this.criticsScore;
	this.year;
	this.rating;
	this.cast;
	this.genre;
	this.backdrop;
}

function category(categoryName,movies){
	this.categoryName=categoryName;
	//Array of movie names
	this.movies=movies;
}