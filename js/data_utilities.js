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
 
 function mergeAngleRanges (ranges) {
    const TWO_PI = 2 * Math.PI;
    const DELTA = Math.PI / 100 // maximum tolerance in radians of gap between overlapping edges.
    
    function normAngle (angle) {
        // returns an equivalent angle in (-pi, pi]
        while (angle <= -Math.PI) angle += TWO_PI;
        while (angle > Math.PI) angle -= TWO_PI;
        return angle;
    }
    
    function normMin (range) {
        // returns an equivalent range such that min is in (-pi, pi] and 0 < (max - min) <= 2pi
        range = {min:normAngle(range.min), max:range.max};
        while (range.max <= range.min) range.max += TWO_PI;
        while ((range.max - range.min) > TWO_PI) range.max -= TWO_PI;
        return range;
    }
    
    function normMax (range) {
        // returns an equivalent range such that max is in (-pi, pi] and 0 < (max - min) <= 2pi
        range = {min:range.min, max:normAngle(range.max)};
        while (range.max <= range.min) range.min -= TWO_PI;
        while ((range.max - range.min) > TWO_PI) range.min += TWO_PI;
        return range;
    }
    
    function normRange (range) {
        // returns an equivalent range with both angles in (-pi, pi]
        return {min:normAngle(range.min), max:normAngle(range.max)};
    }
    
    function merge (range1, range2) {
        // returns the union of two ranges if they overlap, or null if they do not.
        return ((range1.max >= (range2.min - DELTA)) && (range1.min <= (range2.max + DELTA)))
            ? {min:Math.min(range1.min, range2.min), max:Math.max(range1.max, range2.max)} : null;
    }
    
    // make a copy of ranges and sort by min
    ranges = ranges.slice().sort(function (a, b) { return a.min - b.min; }); 
   
    // for each range with straddles pi, split into two ranges: one adjusted using normMin (left in
    // place) and one adjusted using normMax (prepended to the list, preserving sortedness), so that
    // ranges straddling pi can merge with other ranges from sides of the boundary.
    var prepend = [];
    ranges = prepend.concat(ranges.map(function (range) {
        if (range.max <= range.min) {
            prepend.push(normMax(range));
            return normMin(range);
        } else return range;
    }));
    
    // fold each range in from the left, merging with the last value if they overlap
    var merged, last;
    ranges = ranges.reduce(function (list, next) {
        last = list[list.length - 1];
        if ((merged = merge(last, next)) !== null) list.splice(-1, 1, merged)
        else list.push(next);
        return list;
    }, ranges.splice(0, 1));
    
    var first = ranges[0], last = ranges.slice(-1)[0];
    
    // check if the result is a full circle
    if ((first === last) && ((first.max - first.min) >= (TWO_PI - DELTA))) return [{min:0, max:0}];
    
    if ((merged = merge(normMin(first), normMin(last))) !== null) {
        // the first and last ranges overlap; merge them
        ranges.shift();
        ranges.splice(-1, 1, normRange(merged));
    } else {
        // the first and last ranges do not overlap; just normalise them
        ranges[0] = normRange(first);
        ranges.splice(-1, 1, normRange(last));
    }
    
    return ranges;
}
 
    