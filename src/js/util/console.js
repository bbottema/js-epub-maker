/* global module, console */
(function() {
    'use strict';
    
    module.exports = function() { 
        return (typeof(console) !== 'undefined') ? console : 
            { log: f, info: f, debug: f, warn: f, error: f };
    };
    function f() {} 
}());