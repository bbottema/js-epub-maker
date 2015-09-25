/* global Handlebars */
(function() {
    'use strict';
    
    var mimetypes = {
        'jpeg': 'image/jpeg',
        'jpg': 'image/jpeg',
        'bmp': 'image/bmp',
        'png': 'image/png',
        'svg': 'image/svg+xml',
        'gif': 'image/gif'
    };

    Handlebars.registerHelper('extension', function(str) {
        return ext(str);
    });
    
    Handlebars.registerHelper('mimetype', function(str) {
        return mimetypes[ext(str)];
    });
    
    function ext(str) {
        return str.substr(str.lastIndexOf('.') + 1);
    }
})();