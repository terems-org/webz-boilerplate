
var indexTemplate = null;

var webzInit = function(webzFiles) {
	indexTemplate = Handlebars.compile(webzFiles.getFile("/index.html").getFileDownloader().getContentAsStringAndClose());
	Handlebars.registerPartial("index.hbs", webzFiles.getFile("/app/templates/index.hbs").getFileDownloader().getContentAsStringAndClose());
	indexTemplate({}); // for some reason this does some kind of template initialization (which otherwise happens upon first pageload)
};

var webzPreparePageContext = function(webzContext, fullUrl) {

	var currentFile = webzContext.getCurrentFile();

	var pageContext = webzContext.getFile(currentFile.getPathname()+".json").getFileDownloader();
	if (pageContext != null) {
		pageContext = JSON.parse(pageContext.getContentAsStringAndClose());
	}
	pageContext = pageContext||{};
	var currentDownloader = currentFile.getFileDownloader();
	if (currentDownloader != null) {
		pageContext['WEBZ-MAIN-CONTENT'] = currentDownloader.getContentAsStringAndClose();
	}
	return pageContext;
};

var webzRenderPage = function(pageContext) {
	var webzMainContent = pageContext['WEBZ-MAIN-CONTENT'];
	if (webzMainContent) {		
		pageContext['WEBZ-MAIN-CONTENT'] = marked(webzMainContent);
	}
	return indexTemplate(pageContext);
};
