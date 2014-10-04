/*
 * Clear a node's children
 */
 
var utils = {};

/* Read a file  using xmlhttprequest 
 
If the HTML file with your javascript app has been saved to disk, 
this is an easy way to read in a data file.  Writing out is 
more complicated and requires either an ActiveX object (IE) 
or XPCOM (Mozilla).
 
fname - relative path to the file
callback - function to call with file text
*/
utils.readFileHttp = function(fname, callback) {
   xmlhttp = utils.getXmlHttp();
   xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState==4) { 
      	callback(xmlhttp.responseText); 
      }
   }
   xmlhttp.open("GET", fname, true);
   xmlhttp.send(null);
}
 
/*
Return a cross-browser xmlhttp request object
*/
utils.getXmlHttp = function() {
   if (window.XMLHttpRequest) {
      xmlhttp=new XMLHttpRequest();
   } else if (window.ActiveXObject) {
      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
   }
   if (xmlhttp == null) {
      alert("Your browser does not support XMLHTTP.");
   }
   return xmlhttp;
}

/*
 * 
 */
utils.removeChildrenFromNode = function(node) {
	if (node) {
		while (node.hasChildNodes()) {
			node.removeChild(node.firstChild);
		}
	}
}

/*
 * 
 */
utils.mulArray = function(array, value) {
	var newArray = new Array();
	for(var key in array) {
		newArray[key] = array[key] * value;
	}
    return newArray;
}

