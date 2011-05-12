// function found on developerfusion.com
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
 
    function mergeRanges(ranges) {
        function overlaps (range1, range2) {
            // returns whether or not two ranges overlap
            return (range1.max >= range2.min) && (range1.min <= range2.max);
        }
        function merge (range1, range2) {
            // merges two ranges into one range
            return {min:Math.min(range1.min, range2.min), max:Math.max(range1.max, range2.max)};
        }
        // make a copy of ranges and sort by min
        ranges = ranges.slice().sort(function (a, b) { return a.min - b.min; });
        
        // fold each range in from the left, merging with the last value if they overlap
        return ranges.reduce(function (list, next) {
            var last = list[list.length - 1];
            if (overlaps(last, next)) list.splice(-1, 1, merge(last, next));
            else list.push(next);
            return list;
        }, ranges.splice(0, 1));
    }