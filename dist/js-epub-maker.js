(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"../src/js/template-builders/idpf-wasteland-builder.js":3,"./js/slugify.js":2}],2:[function(require,module,exports){
/* global s, console */
(function() {
    module.exports = (typeof(s) !== 'undefined' && s.slugify) ? s.slugify : simpleSlugify;
    
    if (module.exports === simpleSlugify) {
        var log = (typeof(console) !== 'undefined' && console.debug) ? console.debug : function() {};
        log.call(console, 'underscore.string not found, falling back on (very) simple slugify..');
    }
    
    function simpleSlugify(str) {
        return str.toLowerCase().replace(/\s/g, '-');
    }
}());
},{}],3:[function(require,module,exports){
/* global module, exports, $, JSZip, JSZipUtils, Handlebars */
(function() {
    'use strict';
    
    var baseUrl = 'dist/epub_templates/from_idpf_epub3/wasteland';
    
    var Builder = function() {
        
        
        this.make = function(epubConfig) {
            console.debug('building epub', epubConfig);
            var zip = new JSZip();
            
            var deferred = $.Deferred();
            $.when(
                addMimetype(zip, epubConfig),
                addContainerInfo(zip, epubConfig),
                addManifestOpf(zip, epubConfig),
                addCover(zip, epubConfig),
                addEpub2Nav(zip, epubConfig),
                addEpub3Nav(zip, epubConfig),
                addStylesheets(zip, epubConfig),
                addContent(zip, epubConfig)
            ).then(function() {
                deferred.resolve(zip);
            });
            
            return deferred.promise();
        };
        
        function addMimetype(zip, epubConfig) {
            return $.get(baseUrl + '/mimetype', function(file) {
               zip.file('mimetype', file);
            }, 'text');
        }
        
        function addContainerInfo(zip, epubConfig) {
            return $.get(baseUrl + '/META-INF/container.xml', function(file) {
               zip.folder('META-INF').file('container.xml', Handlebars.compile(file)(epubConfig));
            }, 'text');
        }
        
        function addManifestOpf(zip, epubConfig) {
            return $.get(baseUrl + '/EPUB/wasteland.opf', function(file) {
               zip.folder('EPUB').file(epubConfig.slug + '.opf', Handlebars.compile(file)(epubConfig));
            }, 'text');
        }
        
        function addCover(zip, epubConfig) {
            var p = $.Deferred();
            
            if (epubConfig.cover) {
                JSZipUtils.getBinaryContent(baseUrl + '/EPUB/wasteland-cover.jpg', function (err, data) {
                    if (!err) {
                        zip.folder('EPUB').file(epubConfig.slug + '-cover.jpg', data, { binary: true });
                        p.resolve('');
                    } else {
                        p.reject(err);
                    }
                });
            } else {
                p.resolve('');
            }
            return p.promise();
        }
        
        function addEpub2Nav(zip, epubConfig) {
            return $.get(baseUrl + '/EPUB/wasteland.ncx', function(file) {
               zip.folder('EPUB').file(epubConfig.slug + '.ncx', Handlebars.compile(file)(epubConfig));
            }, 'text');
        }
        
        function addEpub3Nav(zip, epubConfig) {
            return $.get(baseUrl + '/EPUB/wasteland-nav.xhtml', function(file) {
               zip.folder('EPUB').file(epubConfig.slug + '-nav.xhtml', Handlebars.compile(file)(epubConfig));
            }, 'text');
        }
        
        function addStylesheets(zip, epubConfig) {
            return $.when(
                $.get(baseUrl + '/EPUB/wasteland.css', function(file) {
                   zip.folder('EPUB').file(epubConfig.slug + '.css', Handlebars.compile(file)(epubConfig));
                }, 'text'),
                $.get(baseUrl + '/EPUB/wasteland-night.css', function(file) {
                   zip.folder('EPUB').file(epubConfig.slug + '-night.css', Handlebars.compile(file)(epubConfig));
                }, 'text')
            );
        }
        
        function addContent(zip, epubConfig) {
            return $.get(baseUrl + '/EPUB/wasteland-content.xhtml', function(file) {
               zip.folder('EPUB').file(epubConfig.slug + '-content.xhtml', Handlebars.compile(file)(epubConfig));
            }, 'text');
        }
    };

    // manage dependency exports
    if (typeof module !== 'undefined') {
        module.exports.builder = new Builder();
    }
    else if (typeof exports !== 'undefined') {
        exports.builder = new Builder();
    }
    else if (typeof window === 'undefined') {
        throw new Error('unable to expose module: no module, exports object and no global window detected');
    }

    if (typeof window !== 'undefined') {
        window.epubMaker = new Builder();
    }
}());
},{}]},{},[1]);
