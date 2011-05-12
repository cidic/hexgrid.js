var range1 = {
    min: 4,
    max: 9
};

var range2 = {
    min: 1,
    max: 5
};

var range3 = {
    min: 11,
    max: 13
}

var arr = [range1, range2, range3];


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


var result = mergeRanges(arr);
console.log(result);

function array_to_hex(hex){ return [(hex[1] - hex[0]), Math.floor((hex[0]+hex[1])/2)]; };
    function hex_to_array(hex){ return [(hex[1] - Math.floor(hex[0]/2)), (hex[1] + Math.ceil(hex[0]/2))]; };

    function highlight_hex_coord(x,y, color) {
		 color = color || 'blue';
		var $target = $('#'+x+'-'+y+' div');
			$target.attr('class', 'hex '+color);
	}
	
    //depricated ?
	function highlight_hex_obj(hex, color){
		var color = color || 'blue';
		var $target = $('#'+hex.x+'-'+hex.y+' div');
			$target.attr('class','hex '+color);
	}
    
    
    
    function get_adjacent(x,y){
        // deprecated, only instance of this code
        var node_x = 0,
    		node_y = 0,
			result = [];
		for(i=0;i<6;i++) {
			// Run node update for 6 neighbouring tiles.
			switch(i){
				case 0: // north
					node_x = x;
					node_y = y+1;
				break;
				case 1: // south east
					node_x = x+1;
					node_y = ((x&1) == 0)? y : y+1;			
				break;
				case 2: //  north east
					node_x = x+1;
					node_y = ((x&1) == 0)? y-1 : y;							
				break;
				case 3: // south
					node_x = x;
					node_y = y-1;						
				break;
				case 4: // north west
					node_x = x-1;
					node_y = ((x&1) == 0)? y-1 : y;
				break;
				case 5: // south west
					node_x = x-1;
					node_y = ((x&1) == 0)? y : y+1;					
				break;
				
			}
			result[i] = [node_x,node_y]
		}
		return result;
	}
