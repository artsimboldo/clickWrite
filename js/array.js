/*
 * 
 */
Array.prototype.mul = function(value) {
	var newArray = new Array();
	for(var i=0; i<this.length; i++) {
		newArray[i] = this[i] * value;
	}
    return newArray;
}

/*
 * 
 */
Array.prototype.compare = function(testArr) {
    if (this.length != testArr.length) return false;
    for (var i=0; i<testArr.length; i++) {
        if (this[i].compare) { 
            if (!this[i].compare(testArr[i])) return false;
        }
        if (this[i] !== testArr[i]) return false;
    }
    return true;
}
