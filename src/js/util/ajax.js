/* global module, ActiveXObject */
(function() {
    'use strict';
    
    var D = require('d.js');
    var console = require('../../js/util/console')();
    
    module.exports = function ajax(url, data) {
        var deferred = D();
    	try {
    		var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
    		x.open(data ? 'POST' : 'GET', url, 1);
    		x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    		x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    		x.onreadystatechange = function () {
    			x.readyState > 3 && deferred.resolve({ 'data': x.responseText, 'xhr': x });
    		};
    		x.send(data)
    	} catch (e) {
    		console.error(e);
    	    deferred.reject(e);
    	}
    	return deferred.promise;
    };
}());