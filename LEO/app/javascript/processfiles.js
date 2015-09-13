function processUsb(){
	var StoragePlugin = sf.core.plugin('storage');
	var nCount = StoragePlugin.GetUSBListSize();

	if (nCount > 0) {
	for (var i = 0; i < nCount; i++) {
     
	var DeviceId = StoragePlugin.GetUSBDeviceID(i);
	var nPartition = StoragePlugin.GetUSBPartitionNum(DeviceId);
	for (var j = 0; j < nPartition; j++)
	{
	
	 var MountPath = StoragePlugin.GetUSBMountPath(DeviceId, j);
     var USBRootPath = '/dtv/usb/' + MountPath;
     var fileSystemObj = new FileSystem();
     var bValid = fileSystemObj.readDir(USBRootPath + '/TVShows');
     if (!bValid) {
    	 USBRootPath = '/mnt/usbr' + MountPath;
    	 bValid = fileSystemObj.readDir(USBRootPath + '/TVShows');
    	 if (!bValid) {
    		 //Can't find usb
    		 $('#info').html("<h3>Error, cannot find tv show folder...</h3>");
    		 continue;
    	 }
     }
     
     var tvShowPath = USBRootPath + '/TVShows';
     
     var shows = processTv(tvShowPath);
     return shows;
     
	}
	}
	}
	return null;
}

function processMovieUsb(){
	var StoragePlugin = sf.core.plugin('storage');
	var nCount = StoragePlugin.GetUSBListSize();

	if (nCount > 0) {
		for (var i = 0; i < nCount; i++) {
		     
			var DeviceId = StoragePlugin.GetUSBDeviceID(i);
			var nPartition = StoragePlugin.GetUSBPartitionNum(DeviceId);
			for (var j = 0; j < nPartition; j++)
			{
			
			 var MountPath = StoragePlugin.GetUSBMountPath(DeviceId, j);
		     var USBRootPath = '/dtv/usb/' + MountPath;
		     var fileSystemObj = new FileSystem();
		     var bValid = fileSystemObj.readDir(USBRootPath + '/movies');
		     if (!bValid) {
		    	 USBRootPath = '/mnt/usbr' + MountPath;
		    	 bValid = fileSystemObj.readDir(USBRootPath + '/movies');
		    	 if (!bValid) {
		    		 //Can't find usb
		    		 $('#info').html("<h3>Error, cannot find movies folder...</h3>");
		    		 continue;
		    	 }
		     }
		     
		     var tvShowPath = USBRootPath + '/movies';

		     var movs = processMovies(tvShowPath);
		     return movs;
		     
			}
			}
	}
	return null;
}

function processTv(USBPath) {
	var fileSystemObj = new FileSystem();
	var data = fileSystemObj.readDir(USBPath);
	var seriesHolder=new Array();

	var count = 0;
	for ( var i = 0; i < data.length; i++) {
		/* As usual ignore current directory and parent directory are listed as . and ..*/
		if (data[i].name != '.' && data[i].name != '..' && (data[i].name.substring(0, 2) != '._')) {
			if (data[i].isDir) {
				seriesHolder[count] = processSeries(USBPath + '/' + data[i].name, data[i].name);
				count = count+1;
			} 
		}
	}

		return new tvShows(seriesHolder);

}

function processMovies(USBPath) {
	var movieHolder = [];   
	var categoryHolder = []; 
	populateMovieHolder(USBPath, movieHolder, categoryHolder);
	//Sort the categories
	categoryHolder.sort(compare);
	return new moviesObj(movieHolder,categoryHolder);
}

function compare(a,b) {
	  if (a.categoryName < b.categoryName)
	     return -1;
	  if (a.categoryName > b.categoryName)
	    return 1;
	  return 0;
}

function populateMovieHolder(USBPath, movieHolder, categoryHolder){
	var fileSystemObj = new FileSystem();
	var data = fileSystemObj.readDir(USBPath);
	for ( var i = 0; i < data.length; i++) {
		/* As usual ignore current directory and parent directory are listed as . and ..*/
		if (data[i].name != '.' && data[i].name != '..' && (data[i].name.substring(0, 2) != '._')) {
			//We are only interested in video files, 
			if((data[i].name.indexOf(".") > -1) && (!data[i].isDir)){
				movieName = data[i].name.substring(data[i].name.lastIndexOf("."),0);
				ext = data[i].name.substring(data[i].name.lastIndexOf(".")).replace(".", "");
				if($.inArray( ext, videoFormats )>-1){
					var ourMovie = new movie(movieName, USBPath + "/" + data[i].name);
					$('#info').append("<br/>Processing... " + ourMovie.name);
						getMovieContent(ourMovie, categoryHolder);
						movieHolder.push(ourMovie);
				}
			}else if(data[i].isDir){
				//We have a directory.
				//Grab any movies in it
				populateMovieHolder(USBPath + "/" + data[i].name, movieHolder, categoryHolder);
			}
		}
	}
	
}

function processSeries(USBPath, seriesName) {

	var fileSystemObj = new FileSystem();

	var data = fileSystemObj.readDir(USBPath);
	
	var seasonHolder=new Array();
	
	var ourSeries = new series(seriesName);
	
	var episodeXml; 
	
	$('#info').append("<br/>Processing... " + seriesName);
	//Get series information
	episodeXml = getSeriesContent(ourSeries, getEpisodeContent);
	
	var count = 0;
	for ( var i = 0; i < data.length; i++) {

		/* As usual ignore current directory and parent directory are listed as . and ..*/

		if (data[i].name != '.' && data[i].name != '..' && (data[i].name.substring(0, 2) != '._')) {
			if (data[i].isDir) {
				seasonHolder[count] = processSeason(episodeXml, USBPath + '/' + data[i].name, data[i].name);
				count = count+1;
			} 
		}
	}
		ourSeries.seasons = seasonHolder;
		return ourSeries;

}

function processSeason(episodeXml, USBPath, seasonName) {

	var fileSystemObj = new FileSystem();

	var data = fileSystemObj.readDir(USBPath);
	
	var episodeHolder=new Array();
	var count = 0;
	for ( var i = 0; i < data.length; i++) {
		/* As usual ignore current directory and parent directory are listed as . and ..*/
		if (data[i].name != '.' && data[i].name != '..' && (data[i].name.substring(0, 2) != '._')) {
			//We are only interested in video files, 
			if(data[i].name.indexOf(".") > -1){
				if(data[i].isDir){
					continue;
				}
				else{
					//get the file extension
					var ext = data[i].name.split('.').pop();
					//check if the file is a video
					if($.inArray( ext, videoFormats )>-1){
						episodeHolder[count] = processepisode(episodeXml, USBPath, data[i].name);
						count=count+1;
					}
				}
				
			}
		}
	}
		return new season(seasonName, episodeHolder);

}

function processepisode(episodeXml, USBPath, name) {

	//episode(id, seasonNo, episodeNo, name, filePath, details)
	//rest request for episode details
	var myEpisode=new episode("", "", "", name, USBPath, "");
	addEpisodeDetails(episodeXml, myEpisode);
	return myEpisode;
	
}

function addEpisodeDetails(episodeXml, myEpisode){
	//The King Of Queens - S01E01
	try{
		var res = myEpisode.filename.split(" - ");
		//S01E01
		seasonEpisode = res[1];
		var r = /\d+/g;
		parsedValue = seasonEpisode.match(r);
		seasonNumber = parsedValue[0];
		seasonNumber = seasonNumber.replace(/^0+/, '');
		episodeNumber = parsedValue[1];
		episodeNumber = episodeNumber.replace(/^0+/, '');
		
		$(episodeXml).find("Episode").each(function(){
		    if(($(this).find("SeasonNumber").text() == seasonNumber) 
		    		&& ($(this).find("EpisodeNumber").text() == episodeNumber)){
		        myEpisode.name = $(this).find("EpisodeName").text();
		        myEpisode.episodeNo = episodeNumber;
		        myEpisode.details = $(this).find("Overview").text();
		        myEpisode.image = $(this).find("filename").text();
		        myEpisode.height = $(this).find("thumb_height").text();
		        myEpisode.width = $(this).find("thumb_width").text();
		        myEpisode.id = $(this).find("id").text();
		        return;
		    }
		});
		if(!myEpisode.name){
		//Didn't find it, set the file name.
		myEpisode.name = myEpisode.filename;
		}
	}
	catch(err){
		myEpisode.name = myEpisode.filename;
	}
}