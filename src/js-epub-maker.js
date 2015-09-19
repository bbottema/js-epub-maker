/* global require, module, exports, saveAs */
(function() {
    'use strict';
    
    var console = require('./js/util/console')();
    var slugify = require('./js/util/slugify');
    
    var templateManagers = {
        'idpf-wasteland': require("../src/js/template-builders/idpf-wasteland-builder.js").builder
    };
    
    var EpubMaker = function () {
        var self = this;
        var epubConfig = { toc: [], landmarks: [], sections: [] };
        
        this.withUuid = function(uuid) {
            epubConfig.uuid = uuid;
            return self;
        };
        
        this.withTemplate = function(templateName) {
            epubConfig.templateName = templateName;
            return self;
        };
        
        this.withTitle = function(title) {
            epubConfig.title = title;
            epubConfig.slug = slugify(title);
            return self;
        };
        
        this.withLanguage = function(lang) {
            epubConfig.lang = lang;
            return self;
        };
        
        this.withAuthor = function(fullName) {
            epubConfig.author = fullName;
            return self;
        };
        
        this.withModificationDate = function(modificationDate) {
            epubConfig.modificationDate = modificationDate.toISOString();
            return self;
        };
        
        this.withRights = function(rightsConfig) {
            epubConfig.rights = rightsConfig;
            return self;
        };
        
        this.withCover = function(coverUrl, rightsConfig) {
            epubConfig.coverUrl = coverUrl;
            epubConfig.coverRights = rightsConfig;
            return self;
        };
        
        this.withAttributionUrl = function(attributionUrl) {
            epubConfig.attributionUrl = attributionUrl;
            return self;
        };
        
        this.withSection = function(section) {
            epubConfig.sections.push(section);
            Array.prototype.push.apply(epubConfig.toc, section.collectToc());
            Array.prototype.push.apply(epubConfig.landmarks, section.collectLandmarks());
            return self;
        };
        
        this.makeEpub = function() {
            epubConfig.publicationDate = new Date().toISOString();
            return templateManagers[epubConfig.templateName].make(epubConfig).then(function(epubZip) {
    			console.info('generating epub for: ' + epubConfig.title);
    			var content = epubZip.generate({ type: "blob", mimeType: "application/epub+zip", compression: "DEFLATE" });
    			return content;
            });
        };
        
        this.downloadEpub = function() {
            self.makeEpub().then(function(epubZipContent) {
    			var filename = epubConfig.slug + '.epub';
    			console.debug('saving "' + filename + '"...');
    			saveAs(epubZipContent, filename);
            });
        };
    };
    
    // epubtypes and descriptions, useful for vendors implementing a GUI
    EpubMaker.epuptypes = require("../src/js/epub-types.js");
    
    /**
     * @epubType Optional. Allows you to add specific epub type content such as [epub:type="titlepage"]
     * @id Optional, but required if section should be included in toc and / or landmarks
     * @content Optional. Should not be empty if there will be no subsections added to this ection
     */
    EpubMaker.Section = function(epubType, id, content, includeInToc, includeInLandmarks) {
        var self = this;
        this.epubType = epubType;
        this.id = id;
        this.content = content;
        this.includeInToc = includeInToc;
        this.includeInLandmarks = includeInLandmarks;
        this.subSections = [];
        
        this.withSubSection = function(subsection) {
            self.subSections.push(subsection);
            return self;
        };
        
        this.collectToc = function() {
            var toc = self.includeInToc ? [self] : [];
            for (var i = 0; i < self.subSections.length; i++) {
                Array.prototype.push.apply(toc, self.subSections[i].collectToc());
            }
            return toc;
        };
        
        this.collectLandmarks = function() {
            var toc = self.includeInLandmarks ? [self] : [];
            for (var i = 0; i < self.subSections.length; i++) {
                Array.prototype.push.apply(toc, self.subSections[i].collectLandmarks());
            }
            return toc;
        };
    };

    // manage dependency exports
    if (typeof module !== 'undefined') {
        module.exports.EpubMaker = EpubMaker;
    }
    else if (typeof exports !== 'undefined') {
        exports.EpubMaker = EpubMaker;
    }
    else if (typeof window === 'undefined') {
        throw new Error('unable to expose EpubMaker: no module, exports object and no global window detected');
    }

    if (typeof window !== 'undefined') {
        window.EpubMaker = EpubMaker;
    }
}());