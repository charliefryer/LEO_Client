/**
 * Read and write data to local storage.
 * @returns
 */

function readWatchedFile(){
	var fileSystemObj = new FileSystem();
	var fileObj = fileSystemObj.openCommonFile(curWidget.id +  'leoWatched.data', 'r');
	if(fileObj==null){
		return null;
	}
	infoIn = fileObj.readAll();
	fileSystemObj.closeCommonFile(fileObj);
	return infoIn;
}

function writeWatchedFile(watchedJson){
	var fileSystemObj = new FileSystem();
	var fileObj = fileSystemObj.openCommonFile(curWidget.id +  'leoWatched.data', 'w');
	fileObj.writeAll(watchedJson);
	fileSystemObj.closeCommonFile(fileObj);
}

function readInfoFile(){
	var fileSystemObj = new FileSystem();
	var fileObj = fileSystemObj.openCommonFile(curWidget.id +  'leoInfo.data', 'r');
	if(fileObj==null){
		return null;
	}
	infoIn = fileObj.readAll();
	fileSystemObj.closeCommonFile(fileObj);
	return infoIn;
}

function writeInfoFile(showsJson){
	var fileSystemObj = new FileSystem();
	var fileObj = fileSystemObj.openCommonFile(curWidget.id +  'leoInfo.data', 'w');
	fileObj.writeAll(showsJson);
	fileSystemObj.closeCommonFile(fileObj);
}

function readMovieFile(){
	var fileSystemObj = new FileSystem();
	var fileObj = fileSystemObj.openCommonFile(curWidget.id +  'leoMovieInfo.data', 'r');
	if(fileObj==null){
		return null;
	}
	infoIn = fileObj.readAll();
	fileSystemObj.closeCommonFile(fileObj);
	return infoIn;
}

function writeMovieFile(movieJson){
	var fileSystemObj = new FileSystem();
	var fileObj = fileSystemObj.openCommonFile(curWidget.id +  'leoMovieInfo.data', 'w');
	fileObj.writeAll(movieJson);
	fileSystemObj.closeCommonFile(fileObj);
}