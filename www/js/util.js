var numbersAsWords = ['','one','two','three','four','five','six','seven','eight','nine','ten'];
function numberInWords(num) {
  return numbersAsWords[num];
}

function arrayToList(array) {
	var str = '';
	for (var i = 0, el; el = array[i]; i++) {
		if(i != (array.length - 1)) {
			str += el + ', ';
		} else {
			str += ' and ' + el;
		}
	}
	return str;
}

function yesterday() {
	return new Date(new Date() - 35*60*60*1000)
}