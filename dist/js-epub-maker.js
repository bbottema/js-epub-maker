(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global require, module, exports, saveAs */
(function() {
    'use strict';
    
    var templateManagers = {
        'idpf-wasteland': require("../src/js/template-builders/idpf-wasteland-builder.js").builder
    };
    
    var EpubMaker = function() {
        var self = this;
        var epubConfig = {};
        
        this.newMaker = function() {
            return new EpubMaker();
        };
        
        this.withTitle = function(title) {
            epubConfig.title = title;
            return self;
        };
        
        this.withTemplate = function(templateName) {
            epubConfig.templateName = templateName;
            return self;
        };
        
        this.makeEpub = function() {
            templateManagers[epubConfig.templateName].make(epubConfig).then(function(epubZip) {
    			var content = epubZip.generate({ type: "blob", mimeType: "application/epub+zip", compression: "DEFLATE" });
    			var filename = epubConfig.title.toLowerCase().replace('\s', '-') + '.epub';
    			saveAs(content, filename);
            });
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
        window.epubMaker = new EpubMaker();
    }
}());
},{"../src/js/template-builders/idpf-wasteland-builder.js":2}],2:[function(require,module,exports){
/* global module, exports, $, JSZip, JSZipUtils */
(function() {
    'use strict';
    
    var baseUrl = 'dist/epub_templates/from_idpf_epub3/wasteland';
    
    var Builder = function() {
        
        
        this.make = function(epubConfig) {
            console.debug('building epub', epubConfig);
            var zip = new JSZip();
            
            var deferred = $.Deferred();
            $.when(
                addMimetype(zip),
                addContainerInfo(zip),
                addManifestOpf(zip),
                addCover(zip),
                addEpub2Nav(zip),
                addEpub3Nav(zip),
                addStylesheets(zip),
                addContent(zip)
            ).then(function() {
                deferred.resolve(zip);
            });
            
			zip.file("Hello.txt", "Hello World\n");
            return deferred.promise();
        };
        
        function addMimetype(zip) {
            return $.get(baseUrl + '/mimetype', function(file) {
               zip.file('mimetype', file);
            }, 'text');
        }
        
        function addContainerInfo(zip) {
            return $.get(baseUrl + '/META-INF/container.xml', function(file) {
               zip.folder('META-INF').file('container.xml', file);
            }, 'text');
        }
        
        function addManifestOpf(zip) {
            return $.get(baseUrl + '/EPUB/wasteland.opf', function(file) {
               zip.folder('EPUB').file('wasteland.opf', file);
            }, 'text');
        }
        
        function addCover(zip) {
            var p = $.Deferred();
            JSZipUtils.getBinaryContent(baseUrl + '/EPUB/wasteland-cover.jpg', function (err, data) {
                if (!err) {
                    zip.folder('EPUB').file('wasteland-cover.jpg', data, { binary: true });
                    p.resolve('');
                } else {
                    p.reject(err);
                }
            });
            return p.promise();
        }
        
        function addEpub2Nav(zip) {
            return $.get(baseUrl + '/EPUB/wasteland.ncx', function(file) {
               zip.folder('EPUB').file('wasteland.ncx', file);
            }, 'text');
        }
        
        function addEpub3Nav(zip) {
            return $.get(baseUrl + '/EPUB/wasteland-nav.xhtml', function(file) {
               zip.folder('EPUB').file('wasteland-nav.xhtml', file);
            }, 'text');
        }
        
        function addStylesheets(zip) {
            return $.when(
                $.get(baseUrl + '/EPUB/wasteland.css', function(file) {
                   zip.folder('EPUB').file('wasteland.css', file);
                }, 'text'),
                $.get(baseUrl + '/EPUB/wasteland-night.css', function(file) {
                   zip.folder('EPUB').file('wasteland-night.css', file);
                }, 'text')
            );
        }
        
        function addContent(zip) {
            return $.get(baseUrl + '/EPUB/wasteland-content.xhtml', function(file) {
               zip.folder('EPUB').file('wasteland-content.xhtml', file);
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
