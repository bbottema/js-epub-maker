/* global module, s, console */
(function() {
    'use strict';
    
    module.exports = (typeof(s) !== 'undefined' && s.slugify) ? s.slugify : simpleSlugify;
    
    if (module.exports === simpleSlugify) {
        var log = (typeof(console) !== 'undefined' && console.debug) ? console.debug : function() {};
        log.call(console, 'underscore.string not found, falling back on (very) simple slugify..');
    }
    
    function simpleSlugify(str) {
        return str.toLowerCase().replace(/\s\W/g, '-');
    }
}());