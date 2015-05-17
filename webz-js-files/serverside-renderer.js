
var indexTemplate;
var globalContext = {};

var webzInit = function(webzFiles) {
	indexTemplate = Handlebars.compile(webzFiles.getFile("/index.html").getFileDownloader().getContentAsStringAndClose());
	Handlebars.registerPartial("index.hbs", webzFiles.getFile("/app/templates/index.hbs").getFileDownloader().getContentAsStringAndClose());
	Handlebars.registerPartial("end-of-body.hbs", webzFiles.getFile("/app/templates/end-of-body.hbs").getFileDownloader().getContentAsStringAndClose());
	indexTemplate({}); // for some reason this does some kind of template initialization (which otherwise happens upon first pageload)

	var context = webzFiles.getFile("global.json").getFileDownloader();
	if (context != null) {
		globalContext = JSON.parse(context.getContentAsStringAndClose());
	}
};

var webzPreparePageContext = function(webzContext, fullUrl) {

	var currentFile = webzContext.getCurrentFile();
	var pageContext = {};

	var context = webzContext.getFile(currentFile.getPathname()+".json").getFileDownloader();
	if (context != null) {
		pageContext = JSON.parse(context.getContentAsStringAndClose());
	}

	var resultingContext = $.extend({}, globalContext, pageContext);

	var currentDownloader = currentFile.getFileDownloader();
	if (currentDownloader != null) {
		resultingContext['WEBZ-MAIN-CONTENT'] = currentDownloader.getContentAsStringAndClose();
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
