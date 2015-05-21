
var indexTemplate;
var globalContext = {};

var webzInit = function(webzFiles) {
	indexTemplate = Handlebars.compile(webzFiles.getFile("/index.html").getFileContentAsString());
	Handlebars.registerPartial("index.hbs", webzFiles.getFile("/app/templates/index.hbs").getFileContentAsString());
	Handlebars.registerPartial("end-of-body.hbs", webzFiles.getFile("/app/templates/end-of-body.hbs").getFileContentAsString());
	indexTemplate({}); // for some reason this does some kind of template initialization (which otherwise happens upon first pageload)

	var globalJson = webzFiles.getFile("global.json").getFileContentAsString();
	if (globalJson != null) {
		globalContext = JSON.parse(globalJson);
	}
};

var webzPreparePageContext = function(webzContext, fullUrl) {

	var currentFile = webzContext.getCurrentFile();
	var pageContext = {};

	var pageJson = webzContext.getFile(currentFile.getPathname()+".json").getFileContentAsString();
	if (pageJson != null) {
		pageContext = JSON.parse(pageJson);
	}

	var resultingContext = $.extend({}, globalContext, pageContext);

	var currentFileContent = currentFile.getFileContentAsString();
	if (currentFileContent != null) {
		resultingContext['WEBZ-MAIN-CONTENT'] = currentFileContent;
	}
	return resultingContext;
};

var webzRenderPage = function(pageContext) {
	var webzMainContent = pageContext['WEBZ-MAIN-CONTENT'];
	if (webzMainContent) {
		pageContext['WEBZ-MAIN-CONTENT'] = marked(webzMainContent);
	}
	return indexTemplate(pageContext);
};
