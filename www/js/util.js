var numbersAsWords = ['','one','two','three','four','five','six','seven','eight','nine','ten'];
function numberInWords(num) {
  return numbersAsWords[num];
}

function humanizeArray(array) {
	var str = '';
	for (var i = 0, el; el = array[i]; i++) {
		if(i != (array.length - 1)) {
			str += el;
			if(i != (array.length - 2)) {
				str += ', ';
			}
		} else {
			str += ' and ' + el;
		}
	}
	return str;
}

function yesterday() {
	return new Date(new Date() - 24*60*60*1000)
}