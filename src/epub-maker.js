/* global require, module, exports */
(function() {
    'use strict';

    var EpubMaker = function() {
        var self = this;

        this.newMaker = function(console) {
        };
    };

    // manage dependency exports
    if (typeof module !== 'undefined') {
        module.exports.ConsoleLogger = ConsoleLogger;
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