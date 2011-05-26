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
 
function mergeArcRanges(ranges) {
    
    function normalise (range) {
        // adjust an angle range so that max is in (-pi, pi]
        return (range.max > Math.PI) ? {min:range.min, max:range.max - 2*Math.PI} : range;
    }
    function linearise (range) {
        // adjust an angle range so that max >= min
        return (range.max < range.min) ? {min:range.min, max:range.max + 2*Math.PI} : range;
    }
    function merge (range1, range2) {
        // returns the union of two ranges if they overlap, or null if they do not.
        range1 = linearise(range1); range2 = linearise(range2);
        if ((range1.max >= range2.min) && (range1.min <= range2.max)) 
            return normalise({ min:Math.min(range1.min, range2.min),
                               max:Math.max(range1.max, range2.max)});                     
        return null;
    }
    // make a copy of ranges and sort by min
    ranges = ranges.slice().sort(function (a, b) { return a.min - b.min; });
    
    console.log('data after sorting');
        console.log(ranges);
  
    
    var boundarySplittingArcs = ranges.filter(function(el){
        return (el.max <= el.min);
    });
    ranges = boundarySplittingArcs.concat(ranges);
    
    console.log('data after re-adding crossing arcs');
    console.log(ranges);
    
    // what I would do is sort it first, then go through the resulting array and determine all of the ranges which straddle the boundary, then (after that loop is finished) prepend the appropriate values to the ranges array
    // fold each range in from the left, merging with the last value if they overlap
    var merged, last;
    ranges = ranges.reduce(function (list, next) {
        last = list[list.length - 1];
        if ((merged = merge(last, next)) !== null) list.splice(-1, 1, merged)
        else list.push(next);
        return list;
    }, ranges.splice(0, 1));

    // finally, check if the first and last ranges overlap over the boundary
    if ((merged = merge(ranges[0], ranges[ranges.length - 1])) !== null) {
        ranges.shift();
        ranges.splice(-1, 1, merged);
    }
    
    return ranges;
}
 
    function mergeRanges(ranges) {
        var count = ranges.length;
        console.log('---');
        function merge(r1, r2) {
            // returns whether or not two ranges overlap
            // range spans pi if min and max ar on opposite sides of where -PI meets PI
            
            var r1spansPi = (r1.max <= r1.min),
                r2spansPi = (r2.max <= r2.min),
                r1Round = {
                    min: Math.round(r1.min*10)/10,
                    max: Math.round(r1.max*10)/10
                },
                r2Round = {
                    min: Math.round(r2.min*10)/10,
                    max: Math.round(r2.max*10)/10
                },
                result;
                
                //*
                 
                /*
                console.log('r1');
                console.log(r1);
                */
                console.log('----------');
                console.log('r1Round { min: '+r1Round.min+', max: '+r1Round.max+'}');
                console.log('--r1spansPi : '+ r1spansPi);
                /*
                console.log('r2');
                console.log(r2);
                */
                console.log('r2Round { min: '+r2Round.min+', max: '+r2Round.max+'}');
                console.log('--r2spansPi : '+ r2spansPi);
               // */
                
                if(!r1spansPi && !r2spansPi){
                    
                    var basicMerge = {min:Math.min(r1.min, r2.min), max:Math.max(r1.max, r2.max)};
                    
                    if(r1Round.min <= r2Round.min
                    && r2Round.min <= r1Round.max 
                    && r1Round.max <= r2Round.max){
                        console.log(r1Round.min+' <= '+r2Round.min+' <= '+r1Round.max+' <= '+r2Round.max);
                        return basicMerge;
                    }
                    if(r2Round.min <= r1Round.min 
                    && r1Round.min <= r2Round.max
                    && r2Round.max <= r1Round.max){
                        console.log(r2Round.min+' <= '+r1Round.min+' <= '+r2Round.max+' <= '+r1Round.max);
                        return basicMerge;
                    }
                    // if r2 is inside r1
                    if(r1Round.min <= r2Round.min
                    && r2Round.min <= r2Round.max
                    && r2Round.max <= r1Round.max){
                        console.log('r2 is inside r1');
                        return basicMerge;
                    }
                    // if r1 inside r2
                    if(r2Round.min <= r1Round.min
                    && r1Round.min <= r1Round.max
                    && r1Round.max <= r2Round.max){
                        console.log('r1 inside r2');
                        return basicMerge;
                    }
                }
                else if(r1spansPi && r2spansPi){
                    // r1.min and r2.min are both going to be positive, get the lowest
                    // r1.max and r2.max are both going to be negative, get the highest
                    console.log('r1spansPi && r2spansPi');
                    return {min:Math.max(r1.min, r2.min), max:Math.max(r1.max, r2.max)};
                }
              /* 
              else if(r1spansPi || r2spansPi){
                    
                    var rInside = rangesInside(r1,r2);
                    if(rInside) return rInside;   
                    
                }
                */
                if(r1spansPi){
                    // given r2spansPi == false
                    
                    if((Math.PI *-1) <= r2Round.min
                    && r2Round.min <= r1Round.max){
                        console.log('(Math.PI *-1) <= r2Round.min <= r1Round.max');
                        return {min: r1.min, max: Math.max(r2.max, r1.max)};    
                    }
                    else if(r1Round.min <= r2Round.max 
                    && r2Round.max <= Math.PI){
                        console.log('(Math.PI *-1) <= r2Round.min <= r1Round.max');
                        return {min: Math.min(r2.min, r1.min), max: r1.max};
                    }
                }
                
                else if(r2spansPi){
                    // given r1spansPi == false
                    
                    if((Math.PI *-1) <= r1Round.min
                    && r1Round.min <= r2Round.max){
                        console.log('(Math.PI *-1) <= r1Round.min <= r2Round.max');
                        return {min: r2.min, max: Math.max(r1.max, r2.max)};    
                    }
                    else if(r2Round.min <= r1Round.max
                    && r1Round.max <= Math.PI){
                        console.log('r2Round.min <= r1Round.max <= Math.PI');
                        return {min: Math.max(r1.min, r2.min), max: Math.max(r1.max, r2.max)};
                    }
                }
                else {
                    
                    console.log('no merge');
                    
                    
                        return false;   
                    
                }
               
           
        }
       
        // make a copy of ranges and sort by min
        ranges = ranges.slice().sort(function (a, b) {     
            return a.min - b.min; 
        });
        
        var lastArc = ranges[ranges.length -1];
        if((Math.abs(lastArc.max - lastArc.min)) > Math.PI){
            ranges = [lastArc].concat(ranges);
            ranges.pop();
        }
        console.log('ranges before merge');
        console.log(ranges);
        
        //*
        draw_fov(
                     grid.hex(6,6).center.x
                    ,grid.hex(6,6).center.y
                    ,ranges[0].min
                    ,ranges[0].max
                    ,80
                    ,"rgba(250, 50,50, .15)"
                    ,"rgba(250, 50,50, .9)"
                    ,true
                    ,'-1'
                );
       // */
        //ranges.push(ranges[ranges.length -1]);
        
        // fold each range in from the left, merging with the last value if they overlap
        var count = 1;
        var result = ranges.reduce(function (list, next, index) {
            //*
            count++;
            draw_fov(
                     grid.hex(6,6).center.x
                    ,grid.hex(6,6).center.y
                    ,next.min
                    ,next.max
                    ,(10*count) +80
                    ,"rgba(250, 50,50, .15)"
                    ,"rgba(250, 50,50, .9)"
                    ,true
                    ,index
                    );
           // */
            
            var last = list[list.length - 1],
                newMerge = merge(last,next);
                
            if (newMerge){
                console.log('merged into { min: '+newMerge.min+', max: '+newMerge.max+'}');
                
                newMerge = {
                    'min' : Number(newMerge.min),
                    'max' : Number(newMerge.max)
                    }
                
                list.splice(-1, 1, newMerge);
            }
            else {
                list.push(next);
            }
           
            return list;
        }, ranges.splice(0, 1));
        
        var lastMerge = merge(result[0],result[result.length-1]);
        if(lastMerge){
            lastMerge = {
                    'min' : Number(lastMerge.min),
                    'max' : Number(lastMerge.max)
                    }
            result.pop();
            result.shift();
            result.push(lastMerge);
            
               
        }
        
       //*
        console.log('ranges after merge');
        console.log(result);
        //*/
        return result;
    }
    
    
   
    
    
 
    function rangesInside(r1,r2){
        var a1 = Number(r1.min).toFixed(6),
    	    a2 = Number(r1.max).toFixed(6),
	        b1 = Number(r2.min).toFixed(6),
    		b2 = Number(r2.max).toFixed(6),
            testArr = [
                [a1,b1,b2,a2],
                [b1,a1,a2,b2]
            ];
            
        for(var i = 0; i<2; i++){
            var testString = testArr[i].concat(testArr[i]).join(''),
                testString2 = testArr[i].sort(function(a,b){return a - b; }).join('');
                
            if(testString.indexOf(testString2) != -1) {
                return { min : testArr[i][0], max : testArr[i][3] }
            }
        }
        return false;
     
    }

    
    function mergeTest2(arc1,arc2){
        var a1 = Number(arc1.min).toFixed(6),
		    a2 = Number(arc1.max).toFixed(6),
	        b1 = Number(arc2.min).toFixed(6),
    		b2 = Number(arc2.max).toFixed(6),
            // using cyclic permutations to test the order of the arcs
	    	// testArr : this is the order we want to see the radians in for the hex to be inside the arc
            testArr = [
                [a1,b1,a2,b2],
                [b1,a1,b2,a2],
                [a1,b1,b2,a2],
                [b1,a1,a2,b2]
            ];
            
        for(var i = 0; i<testArr.length; i++){
            var testString = testArr[i].concat(testArr[i]).join(''),
                testString2 = testArr[i].sort(function(a,b){return a - b; }).join('');
                
            if(testString.indexOf(testString2) != -1) {
                return { min : testArr[i][0], max : testArr[i][3] }
            }
        }
        return false;
    }
    