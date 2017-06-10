/* global module, require, exports, JSZip, JSZipUtils, Handlebars, html_beautify */
(function() {
    'use strict';
    
    var D = require('d.js');
    var console = require('../../js/util/console')();
    var ajax = require('../../js/util/ajax');
    
    var templates = {
        mimetype: '@@import src/epub_templates/lightnovel/mimetype',
        container: '@@import src/epub_templates/lightnovel/META-INF/container.xml',
        opf: '@@import src/epub_templates/lightnovel/EPUB/lightnovel.opf',
        ncx: '@@import src/epub_templates/lightnovel/EPUB/lightnovel.ncx',
        nav: '@@import src/epub_templates/lightnovel/EPUB/nav.xhtml',
        css: '@@import src/epub_templates/lightnovel/EPUB/css/main.css',
        content: '@@import src/epub_templates/lightnovel/EPUB/content.xhtml',
        coverpage: '@@import src/epub_templates/wasteland/EPUB/coverpage.xhtml'
    };
    
    var Builder = function() {
        
        this.make = function(epubConfig) {
            console.debug('building epub', epubConfig);
            var zip = new JSZip();
            
            var deferred = D();
            D.all(
                addMimetype(zip),
                addContainerInfo(zip, epubConfig),
                addManifestOpf(zip, epubConfig),
                addCover(zip, epubConfig),
                addFiles(zip, epubConfig),
                addEpub2Nav(zip, epubConfig),
                addEpub3Nav(zip, epubConfig),
                addStylesheets(zip, epubConfig),
                addContent(zip, epubConfig)
            ).then(function() {
                deferred.resolve(zip);
            });
            
            return deferred.promise;
        };
        
        function addMimetype(zip) {
            zip.file('mimetype', templates.mimetype);
        }
        
        function addContainerInfo(zip, epubConfig) {
            zip.folder('META-INF').file('container.xml', compile(templates.container, epubConfig));
        }
        
        function addManifestOpf(zip, epubConfig) {
            zip.folder('EPUB').file('lightnovel.opf', compile(templates.opf, epubConfig));
        }
        
        function addCover(zip, epubConfig) {
            var deferred = D();
            
            if (epubConfig.cover) {
                JSZipUtils.getBinaryContent(epubConfig.cover.url, function (err, data) {
                    if (!err) {
                        zip.folder('EPUB').folder('images').file(epubConfig.cover.filename, data, { binary: true });
                        deferred.resolve('');
                    } else {
                        deferred.reject(err);
                    }
                });
            } else {
                deferred.resolve(true);
            }
            return deferred.promise;
        }
        
        function addEpub2Nav(zip, epubConfig) {
            zip.folder('EPUB').file('lightnovel.ncx', compile(templates.ncx, epubConfig));
        }
        
        function addEpub3Nav(zip, epubConfig) {
            zip.folder('EPUB').file('nav.xhtml', compile(templates.nav, epubConfig));
        }
        
        function addStylesheets(zip, epubConfig) {
            var deferred = D();
            if (epubConfig.stylesheet.url) {
                return ajax(epubConfig.stylesheet.url).then(function(result) {
                    epubConfig.styles = result.data;
                    compileAndAddCss();
                });
            } else {
                compileAndAddCss();
            }
            return deferred.promise;
            
            function compileAndAddCss() {
                var styles = {
                    original: epubConfig.stylesheet.replaceOriginal ? '' : templates.css,
                    custom: epubConfig.styles
                };
                zip.folder('EPUB').folder('css').file('main.css', compile('{{{original}}}{{{custom}}}', styles, true));
                deferred.resolve(true);
            }
        }

        function addFiles(zip, epubConfig) {
            var deferred_list = [];
            for(var i = 0; epubConfig.additionalFiles && i < epubConfig.additionalFiles.length; i++) {
                var file = epubConfig.additionalFiles[i];
                var deferred = new D();
                JSZipUtils.getBinaryContent(file.url, function (err, data) {
                    if (!err) {
                        zip.folder('EPUB').folder(file.folder).file(file.filename, data, { binary: true });
                        deferred.resolve('');
                    } else {
                        deferred.reject(err);
                    }
                });
                deferred_list.push(deferred.promise);
            }
            return D.all(deferred_list);
        }
        
        function addContent(zip, epubConfig) {
            for(var i = 0; i < epubConfig.vol.length; i++) {
                var vol = epubConfig.vol[i];
                zip.folder('EPUB').file(vol.coverpage + '.xhtml', compile(templates.coverpage, vol));
                for(var j = 0l j < vol.chapter.length; j++) {
                    var chapter = epubConfig.chapter[j];
                    zip.folder('EPUB').file(chapter.name + '.xhtml', compile(tempaltes.content, chapter));
                }
            }
        }
        
        function compile(template, content, skipFormatting) {
            return formatHTML(Handlebars.compile(template)(content));
            
            function formatHTML(htmlstr) {
                /*jslint camelcase:false*/
                return (skipFormatting || typeof html_beautify === 'undefined') ? htmlstr : 
                    html_beautify(htmlstr, {
                        'end_with_newline': false,
                        'indent_char': '\t',
                        'indent_inner_html': true,
                        'indent_size': '1',
                        'preserve_newlines': false,
                        'wrap_line_length': '0',
                        'unformatted': [],
                        'selector_separator_newline': false,
                        'newline_between_rules': true
                    });
                /*jslint camelcase:true*/
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