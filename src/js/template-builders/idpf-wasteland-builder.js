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
            var f = function(v) { return v; };
            return $.when(
                $.get(baseUrl + '/EPUB/sections-template.xhtml', f, 'text').then(f),
                $.get(baseUrl + '/EPUB/wasteland-content.xhtml', f, 'text').then(f)
            ).then(function(f1, f2) {
                Handlebars.registerPartial("sectionTemplate", f1);
                zip.folder('EPUB').file(epubConfig.slug + '-content.xhtml', Handlebars.compile(f2)(epubConfig));
            });
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