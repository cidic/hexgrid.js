function MultiDimensionalArray(iRows,iCols) {
	var i, j, a = new Array(iRows);
	for (i=0; i < iRows; i++) {
		a[i] = new Array(iCols);
		for (j=0; j < iCols; j++) {
			a[i][j] = "";
		}
	}
	return(a);
} 
function get_lowest_positive_index(arr) {
	return arr.reduce(function(prev_value, current_value, index, array) {

		if((current_value > 0) &&
			((arr[prev_value] < 0 && current_value > 0)
			||
			(current_value < arr[prev_value] && arr[prev_value] > 0)
			)){
			return index;
		}
		else{
			return prev_value;
		}
	},0);
}
function get_highest_negative_index(arr) {
	return arr.reduce(function(prev_value, current_value, index, array) {

		if((current_value < 0) &&
			((arr[prev_value] > 0 && current_value < 0)
			||
			(current_value > arr[prev_value] && arr[prev_value] < 0)
			)){
			return index;
		}
		else{
			return prev_value;
		}
	},0);
} 
    