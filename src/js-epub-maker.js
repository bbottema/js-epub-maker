/* global require, module, console, exports, saveAs */
(function() {
    'use strict';
    
    var log = (typeof(console) !== 'undefined' && console.debug) ? console.debug : function() {};
    var slugify = require('./js/slugify.js');
    
    var templateManagers = {
        'idpf-wasteland': require("../src/js/template-builders/idpf-wasteland-builder.js").builder
    };
    
    var EpubMaker = function () {
        var self = this;
        var epubConfig = {};
        
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
        
        this.withCover = function() {
            epubConfig.cover = true;
            return self;
        };
        
        this.withRights = function(rightsConfig) {
            epubConfig.rights = rightsConfig;
            return self;
        };
        
        this.withCoverRights = function(rightsConfig) {
            epubConfig.coverRights = rightsConfig;
            return self;
        };
        
        this.withAttributionUrl = function(attributionUrl) {
            this.attributionUrl = attributionUrl;
            return self;
        };
        
        this.withFrontmatter = function(frontmatter) {
            this.frontmatter = frontmatter;
            return self;
        };
        
        this.withBodymatter = function(bodymatter) {
            this.bodymatter = bodymatter;
            return self;
        };
        
        this.withBackmatter = function(backmatter) {
            this.backmatter = backmatter;
            return self;
        };
        
        this.makeEpub = function() {
            epubConfig.publicationDate = new Date().toISOString();
            return templateManagers[epubConfig.templateName].make(epubConfig).then(function(epubZip) {
    			log.call(console, 'generating epub for: ' + epubConfig.title);
    			var content = epubZip.generate({ type: "blob", mimeType: "application/epub+zip", compression: "DEFLATE" });
    			return content;
            });
        };
        
        this.downloadEpub = function() {
            self.makeEpub().then(function(epubZipContent) {
    			var filename = epubConfig.slug + '.epub';
    			log.call(console, 'saving "' + filename + '"...');
    			saveAs(epubZipContent, filename);
            });
        };
    };
    
    EpubMaker.Matter = function() {
        var self = this;
        this.sections = [];
        
        this.withSection = function(section) {
            self.sections.push(section);
            return self;
        };
    };
    
    EpubMaker.Section = function(id, content, includeInToc) {
        var self = this;
        this.id = id;
        this.content = content;
        this.includeInToc = includeInToc;
        this.subSections = [];
        
        this.withSubSection = function(subsection) {
            self.subSections.push(subsection);
            return self;
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