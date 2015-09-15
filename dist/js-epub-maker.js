(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global require, module, console, exports, saveAs */
(function() {
    'use strict';
    
    var log = (typeof(console) !== 'undefined' && console.debug) ? 
        function () { console.debug.apply(console, arguments); } : function() {};
    var slugify = require('./js/slugify.js');
    
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
    			log('generating epub for: ' + epubConfig.title);
    			var content = epubZip.generate({ type: "blob", mimeType: "application/epub+zip", compression: "DEFLATE" });
    			return content;
            });
        };
        
        this.downloadEpub = function() {
            self.makeEpub().then(function(epubZipContent) {
    			var filename = epubConfig.slug + '.epub';
    			log('saving "' + filename + '"...');
    			saveAs(epubZipContent, filename);
            });
        };
    };
    
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
/* global module, exports, $, JSZip, JSZipUtils, Handlebars, html_beautify */
(function() {
    'use strict';
    
    var templates = {
        mimetype: 'application/epub+zip',
        container: '<?xml version="1.0" encoding="UTF-8"?>\n<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">\n	<rootfiles>\n		<rootfile full-path="EPUB/{{slug}}.opf" 	\n			media-type="application/oebps-package+xml"/>\n	</rootfiles>\n</container>',
        opf: '<?xml version="1.0" encoding="UTF-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="en-US" prefix="cc: http://creativecommons.org/ns#">\n    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n        <dc:identifier id="uid">{{uuid}}</dc:identifier>\n        <dc:title>{{title}}</dc:title>\n        <dc:creator>{{author}}</dc:creator>\n        <dc:language>{{lang}}</dc:language>\n        <dc:date>{{publicationDate}}</dc:date>\n        <meta property="dcterms:modified">{{modificationDate}}</meta>\n        {{#if rights}}\n            <!-- rights expressions for the work as a whole -->\n            {{#if rights.description}}<dc:rights>{{rights.description}}</dc:rights>{{/if}}\n            {{#if rights.license}}<link rel="cc:license" href="{{rights.license}}"/>{{/if}}\n            {{#if rights.attributionUrl}}<meta property="cc:attributionURL">{{attributionUrl}}</meta>{{/if}}\n        {{/if}}\n        {{#if coverUrl}}{{#if coverRights}}\n            <!-- rights expression for the cover image -->       \n            {{#if coverRights.license}}<link rel="cc:license" refines="#cover" href="{{coverRights.license}}" />{{/if}}\n            {{#if coverRights.attributionUrl}}<link rel="cc:attributionURL" refines="#cover" href="{{coverRights.attributionUrl}}" />{{/if}}\n            <!-- cover meta element included for 2.0 reading system compatibility: -->\n            <meta name="cover" content="cover"/>\n        {{/if}}{{/if}}\n    </metadata>\n    <manifest>\n        <item id="t1" href="{{slug}}-content.xhtml" media-type="application/xhtml+xml" />\n        <item id="nav" href="{{slug}}-nav.xhtml" properties="nav" media-type="application/xhtml+xml" />\n        {{#if coverUrl}}\n        <item id="cover" href="{{slug}}-cover.jpg" media-type="image/jpeg" properties="cover-image" />\n        {{/if}}\n        <item id="css" href="{{slug}}.css" media-type="text/css" />\n        <item id="css-night" href="{{slug}}-night.css" media-type="text/css" />\n        <!-- ncx included for 2.0 reading system compatibility: -->\n        <item id="ncx" href="{{slug}}.ncx" media-type="application/x-dtbncx+xml" />\n    </manifest>\n    <spine toc="ncx">\n        <itemref idref="t1" />        \n    </spine>    \n</package>\n',
        ncx: '<?xml version="1.0" encoding="UTF-8"?>\n<ncx xmlns:ncx="http://www.daisy.org/z3986/2005/ncx/" xmlns="http://www.daisy.org/z3986/2005/ncx/"\n    version="2005-1" xml:lang="en">\n    <head>\n        <meta name="dtb:uid" content="{{uuid}}"/>\n    </head>\n    <docTitle>\n        <text>{{title}}</text>\n    </docTitle>\n    <navMap>\n        <!-- 2.01 NCX: playOrder is optional -->\n		{{#each toc}}\n        <navPoint id="{{id}}">\n            <navLabel>\n                <text>{{content.title}}</text>\n            </navLabel>\n            <content src="{{../slug}}-content.xhtml#{{id}}"/>\n        </navPoint>\n		{{/each}}\n    </navMap>\n</ncx>\n',
        nav: '<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en"\n	xmlns:epub="http://www.idpf.org/2007/ops">\n	<head>\n		<meta charset="utf-8"></meta>		\n		<link rel="stylesheet" type="text/css" href="{{slug}}.css" class="day" title="day"/> \n		<link rel="alternate stylesheet" type="text/css" href="{{slug}}-night.css" class="night" title="night"/>		\n	</head>\n	<body>\n		<nav epub:type="toc" id="toc">\n			<ol>\n				{{#each toc}}\n				<li><a href="{{../slug}}-content.xhtml#{{id}}">{{content.title}}</a></li>\n				{{/each}}\n			</ol>			\n		</nav>\n		<nav epub:type="landmarks">\n			<ol>\n				{{#each landmarks}}\n				<li><a epub:type="{{epubType}}" href="{{../slug}}-content.xhtml#{{id}}">{{content.title}}</a></li>\n				{{/each}}\n			</ol>\n		</nav>\n	</body>\n</html>\n',
        css: '@charset "UTF-8";\n@import "{{slug}}.css";\n\nbody {\n    color: rgb(255,250,205);\n    background-color: rgb(20,20,20);\n}\n\nspan.lnum {\n    color: rgb(175,170,125);\n}\n\na.noteref {\n    color: rgb(120,120,120);\n}\n\nsection#rearnotes a {\n    color: rgb(255,250,205);\n}',
        cssNight: '@charset "UTF-8";\n@import "{{slug}}.css";\n\nbody {\n    color: rgb(255,250,205);\n    background-color: rgb(20,20,20);\n}\n\nspan.lnum {\n    color: rgb(175,170,125);\n}\n\na.noteref {\n    color: rgb(120,120,120);\n}\n\nsection#rearnotes a {\n    color: rgb(255,250,205);\n}',
        content: '<?xml version="1.0" encoding="UTF-8"?>\n<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en" xmlns:epub="http://www.idpf.org/2007/ops">\n	<head>\n		<meta charset="utf-8"></meta>\n		<title>{{title}}</title>\n		<link rel="stylesheet" type="text/css" href="{{slug}}.css" class="day" title="day"/> \n		<link rel="alternate stylesheet" type="text/css" href="{{slug}}-night.css" class="night" title="night"/>\n		<!-- <link rel="stylesheet" type="text/css" href="{{slug}}-night.css" class="night" title="night"/> -->		\n	</head>\n	<body>\n		{{#each sections}}{{> sectionTemplate}}{{/each}}\n	</body>\n</html>\n',
        sectionsTemplate: '<!-- strange if-construction, but this is a workaround for gulp-js-html-inject, whose minifier wreaks havoc otherwise -->\n{{#if epubType}}<section epub:type="{{epubType}}" id="{{id}}">{{else}}<section id="{{id}}">{{/if}}\n\n    {{#if content.title}}<h2>{{content.title}}</h2>{{/if}} \n    {{#if content.content}}{{{content.content}}}{{/if}}\n    \n    {{#each subSections}} {{> sectionTemplate}} {{/each}}\n    \n{{#if epubType}}</section>{{else}}</section>{{/if}}'
    };
    
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
            zip.file('mimetype', templates.mimetype);
        }
        
        function addContainerInfo(zip, epubConfig) {
            zip.folder('META-INF').file('container.xml', compile(templates.container, epubConfig));
        }
        
        function addManifestOpf(zip, epubConfig) {
            zip.folder('EPUB').file(epubConfig.slug + '.opf', compile(templates.opf, epubConfig));
        }
        
        function addCover(zip, epubConfig) {
            var p = $.Deferred();
            
            if (epubConfig.coverUrl) {
                JSZipUtils.getBinaryContent(epubConfig.coverUrl, function (err, data) {
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
            zip.folder('EPUB').file(epubConfig.slug + '.ncx', compile(templates.ncx, epubConfig));
        }
        
        function addEpub3Nav(zip, epubConfig) {
            zip.folder('EPUB').file(epubConfig.slug + '-nav.xhtml', compile(templates.nav, epubConfig));
        }
        
        function addStylesheets(zip, epubConfig) {
            zip.folder('EPUB').file(epubConfig.slug + '.css', compile(templates.css, epubConfig, true));
            zip.folder('EPUB').file(epubConfig.slug + '-night.css', compile(templates.cssNight, epubConfig, true));
        }
        
        function addContent(zip, epubConfig) {
            Handlebars.registerPartial("sectionTemplate", templates.sectionsTemplate);
            zip.folder('EPUB').file(epubConfig.slug + '-content.xhtml', compile(templates.content, epubConfig));
        }
        
        function compile(template, content, skipFormatting) {
            return formatHTML(Handlebars.compile(template)(content));
            
            function formatHTML(htmlstr) {
                return (skipFormatting || typeof html_beautify === 'undefined') ? htmlstr : 
                    html_beautify(htmlstr, {
                        end_with_newline: false,
                        indent_char: "\t",
                        indent_inner_html: true,
                        indent_size: "1",
                        preserve_newlines: false,
                        wrap_line_length: "0",
                        unformatted: [],
                        selector_separator_newline: false,
                        newline_between_rules: true
                    });
            }
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
