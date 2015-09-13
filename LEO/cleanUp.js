var widgetAPI = new Common.API.Widget();
var tvKey = new Common.API.TVKeyValue();

cleanUp.reset = function()
{
	var fileSystemObj = new FileSystem();
	fileSystemObj.deleteCommonFile(curWidget.id +  'leoMovieInfo.data');
	fileSystemObj.deleteCommonFile(curWidget.id +  'leoInfo.data');
};