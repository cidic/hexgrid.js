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
    
    /*
        // Your Knowns
d = 20          // Distance
w = Math.PI/4 // Angle you want
A.x = 3       // Point A's x-coord
A.y = 4       // Point A's y-coord
B.x = -5      // Point B's x-coord
B.y = 7       // Point B's y-coord
	
// Find the vector AB
AB.x = B.x - A.x // x-component
AB.y = B.y - A.y // y-component

// Find the angle made by vector AB
t = arctan(AB.y/AB.x) // Use Math.atan2(AB.y, AB.x) if coding in Flash
	
// Find point C
C.x = d * cos(w+t) + A.x // x-component
C.y = d * sin(w+t) + A.y // y-component
    */


function math_stuff(){
    var x1 = 75,
    	y1 = 75,
		
		x2 = 120,
		y2 = 180,
	
		x = x2 - x1,
		y = y2 - y1,
		
		distance = Math.sqrt(x * x + y * y),
		radian = Math.atan2(y, x),
		degree = radian * 180 / Math.PI, //confirmed correct
		//slope = (x1 - x2) / (y1 - y2),	
		slope = (y2 - y1) / (x2 - x1),
		yintercept = y1 - slope * x1,
		
		//convert back to cartesian coords
		_x = x1 + distance * Math.cos(radian),
		_y = y1 + distance * Math.sin(radian);



		var counterclockwise = false,
		 	start_angle = 1.5 * Math.PI,
		 	canvas = document.getElementById('canvas');

		if (canvas.getContext){
		    var ctx = canvas.getContext('2d');
		//	ctx.translate(0, canvas.height);
		 //	ctx.scale(1, -1);
		
			// ctx.beginPath();
			// 			ctx.arc(x1, y1, 60, start_angle,start_angle + degree,counterclockwise);
			// 			ctx.lineWidth = 5;
			// 			ctx.strokeStyle = "black";
			// 			ctx.stroke();
			// 			ctx.closePath();	
			// 		
			draw_line(x1, y1, x2, y2, 'black');
			draw_line(x1, y1, _x, _y, 'blue');
			
			var x3 = 300,
				y3 = slope * x3 + yintercept;
				
			draw_line(x1, y1, x3, y3, 'red');
			
		}
				console.log('distance : '+ distance);
				console.log('radian : '+ radian);
				console.log('degree : '+ degree);
				console.log('slope : '+ slope);
				console.log('yintercept : '+ yintercept);

				console.log('_x : '+ _x);
				console.log('_y : '+ _y);

	}
    /*
    $(function() {
    $('#btn_array_space').bind('click', function(e) {
		e.preventDefault();
		var input = $('#array_space').val(),
			input_data = input.split(','),
			x = Number(input_data[0]),
			y = Number(input_data[1]),
			result = array_to_hex([x,y]).join(',');
			
			console.log('result : '+result);
			$('#info').html(result);					
		
	});
	$('#btn_hex_space').bind('click', function(e) {
		e.preventDefault();
		var input = $('#hex_space').val(),
			input_data = input.split(','),
			x = Number(input_data[0]),
			y = Number(input_data[1]),
			
			result = hex_to_array([x,y]).join(',');
			
			console.log('result : '+result);
			$('#info').html(result);					
		
	});
	
	$('.hex-wrap').live('click', function(){
		$(this).children().toggleClass('blue');//.attr('class', 'hex blue');
	});
	
	$('#btn_toggle_canvas').click(function(){
		$('#canvas').toggle();
		return false;
	});

});

*/