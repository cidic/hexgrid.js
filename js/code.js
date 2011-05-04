
    function get_adjacent(x,y){
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

	
	
	function highlight_hex_coord(x,y, color) {
		 color = color || 'blue';
		var $target = $('#'+x+'-'+y+' div');
			$target.attr('class', 'hex '+color);
	}
	
	function highlight_hex_obj(hex, color){
		var color = color || 'blue';
		var $target = $('#'+hex.x+'-'+hex.y+' div');
			$target.attr('class','hex '+color);
	}
	
	function s_hex_coord(x,y){ return [x, y - 1]}
	function ne_hex_coord(x,y){ return [x + 1, (x%2 == 0)? y - 1 : y] }
	function nw_hex_coord(x,y){ return [x - 1, (x%2 == 0)? y - 1 : y] }
	function n_hex_coord(x,y){ return [x, y + 1] }		
	function se_hex_coord(x,y){ return [x + 1, (x%2 == 0)? y : y + 1] }
	function sw_hex_coord(x,y){ return [x - 1, (x%2 == 0)? y : y + 1] }
	
	
	function s_hex_obj(hex){ return mapArray[hex.x][ hex.y + 1] }
	function ne_hex_obj(hex){ return mapArray[hex.x + 1][((hex.x&1) == 0)? hex.y - 1 : hex.y] }
	function nw_hex_obj(hex){ return mapArray[hex.x - 1][((hex.x&1) == 0)? hex.y - 1 : hex.y] }
	function n_hex_obj(hex){ return mapArray[hex.x][ hex.y - 1 ] }
	function se_hex_obj(hex){ return mapArray[hex.x + 1][((hex.x&1) == 0)? hex.y : hex.y + 1] }
	function sw_hex_obj(hex){ return mapArray[hex.x - 1][((hex.x&1) == 0)? hex.y : hex.y + 1] }

	function array_to_hex(hex){ return [(hex[1] - hex[0]), Math.floor((hex[0]+hex[1])/2)]; };
	function hex_to_array(hex){ return [(hex[1] - Math.floor(hex[0]/2)), (hex[1] + Math.ceil(hex[0]/2))]; };

	function get_hex_loop(hex, distance, func) {
		// get array of hexes in loop around 'hex' 
		var	distance = distance || 1,
			origin_x = hex.array_space[0],
			origin_y = hex.array_space[1],
			next = mapArray[origin_x][origin_y - distance],
			callback = (func && typeof(func) === "function")? true : false, // north hex
			result = []; 
							
		// each arc passe picks up on the last value of 'next'
		// trace north east arc
		for(var i = 0; i < distance; i++){		
			if(callback)
				func(next);
				result.push(next);
			next = se_hex_obj(next);
		}
		// trace east arc
		for(var i = 0; i < distance ; i++){
			if(callback)
				func(next);
				result.push(next);
			next = s_hex_obj(next);
		}
		// trace south east arc
		for(var i = 0; i < distance; i++){		
			
			if(callback)
				func(next);	
				result.push(next);			
			next = sw_hex_obj(next);
		}
		// trace south west arc
		for(var i = 0; i < distance; i++){	
			if(callback)
				func(next);
				result.push(next);
			next = nw_hex_obj(next);
		}
		// trace west arc
		for(var i = 0; i < distance; i++){
			if(callback)
				func(next);
				result.push(next);
			next = n_hex_obj(next);	
		}
		//trace north west arc
		for(var i = 0; i < distance; i++){	
			if(callback)
				func(next);
				result.push(next);
			next = ne_hex_obj(next);	
		}
		return result;
	}
	


	
	function turns(x0,y0,x1,y1,x2,y2) {
	    cross = (x1-x0)*(y2-y0) - (x2-x0)*(y1-y0);
	    return((cross>0.0) ? 'LEFT' : ((cross==0.0) ? 'STRAIGHT' : 'RIGHT'));
	}
	
	function hex_intersects_line(hex, x0, y0, x1, y1) {
		//hex = mapArray[x][y]
		var side1 =turns(x0,y0,x1,y1,hex.corners[0][0],hex.corners[0][1]);
			
		if (side1=='STRAIGHT') return true;
		for (i=1;i<6;i++) {
			var j = turns(x0, y0, x1, y1, hex.corners[i][0], hex.corners[i][1]);
			
			if (j != side1) return true;
		}
		return false;
	}
	
	function line_to_hex_test(){
		//finds hexes a line crosses
		var hex = mapArray[4][5],
			line_x1 = hex.center_coord[0],
			line_y1 = hex.center_coord[1],
			line_x2 = line_x1 + 150,
			line_y2 = line_y1 + 130;

		draw_line(line_x1,line_y1,line_x2,line_y2);

		for (x=0; x  < mapsize_x; x++) {
			for (y=0; y < mapsize_y; y++) {
				var target_hex =  mapArray[x][y],
					test = hex_intersects_line(target_hex, line_x1, line_y1, line_x2, line_y2);
					
				if(test){
					highlight_hex_obj(target_hex);
				}
				console.log(x+','+y)
				console.log(test);
			}
		}
	}

	function get_min_max_group_hex_corners(hex1,hex_group){
		// returns the min and max radian of the corners of hex_group when hex1 is the origin
		// hex groups should only contain 1 or 2 hexes
		// 	if there are 2 hexes
		// 	we know the first ( hex_group[0] )is the left most
		// 	and the second ( hex_group[1] ) is the right most
		// 	because the arcs are cycled clockwise to form the groups
	
		var hex_first = hex_group[0],
			// get last hex in group (if there is 1 hex it will be the same as the first)	
			hex_last = hex_group[hex_group.length - 1]
		
		var result = 	{
							min : hex1.arc_data[hex_first.x][hex_first.y].min,
							max : hex1.arc_data[hex_last.x][hex_last.y].max
						}
	 	return result;
	}
	function hex_inside_arc_group(hex1, hex2, arc_group){
		// hex1: origin
		// hex2: target hex
		// arc_group
		var arc1 = arc_group.min.radian.toFixed(6),
			arc2 = arc_group.max.radian.toFixed(6),
			hex_arc_min = hex1.arc_data[hex2.x][hex2.y].min.radian.toFixed(6),
			hex_arc_max = hex1.arc_data[hex2.x][hex2.y].max.radian.toFixed(6),
			// using cyclic permutations to test the order of the arcs
			// testArr : this is the order we want to see the radians in for the hex to be inside the arc
			testArr = [arc1, hex_arc_min, hex_arc_max, arc2],
			testString = testArr.concat(testArr).join(''),
			testString2 = testArr.sort(function (a, b) { return a - b; } ).join('');
			
			
			/* draw_line(hex1.center_coord.x,hex1.center_coord.y,arc_group.min.x,arc_group.min.y, 'orange');
			draw_line(hex1.center_coord.x,hex1.center_coord.y,arc_group.max.x,arc_group.max.y, 'orange');
			
			draw_line(hex1.center_coord.x,hex1.center_coord.y,hex1.arc_data[hex2.x][hex2.y].min.x,hex1.arc_data[hex2.x][hex2.y].min.y, 'blue');
			draw_line(hex1.center_coord.x,hex1.center_coord.y,hex1.arc_data[hex2.x][hex2.y].max.x,hex1.arc_data[hex2.x][hex2.y].max.y, 'blue'); */
			
			// if after sorting the radians they are a cyclic permutation of desired order the hex is inside the arc

		 if(testString.indexOf(testString2) != -1) {
				return true;
			}
			else {
				return false;
			}
			
			
	}
	function get_los_blocking_hex_groups(hexes, validateFunc) {

		// creates an array of los blocking arcs from hexes in the loop with properties that block los

	    var prev_item_valid = false,
	        data_groups = [],
			group_start_index,
			first_item_valid = false,
			last_value;
		
	    hexes.reduce(function(previousValue, currentValue, index, array){   
		
	        var item_valid = validateFunc(currentValue);
	
			if(index === 0){
				first_item_valid = item_valid;
			}
			
	        if(item_valid &&  !prev_item_valid) { //start new group
			
				data_groups.push([currentValue]);
				group_start_index = index;
				

	        }
	        else if(!item_valid && prev_item_valid){ //close group)
				if(index - group_start_index > 1) {
					// if this group has more then one hex in it, to prevent the same hex being saved as start and end
					data_groups[data_groups.length - 1].push(previousValue);					
				}
				else {
				}
	        }
	        prev_item_valid = item_valid;
	
			if(index === array.length - 1){
				last_value = currentValue;
				
			}
	        	return array[index];
			
	    }, 0);
	
		if(prev_item_valid){
			
			if(first_item_valid){
				// if the first and last hexes are valid
				var last_group = data_groups[data_groups.length - 1],
					first_group = data_groups[0];
					
				// concat the last hex in the first group and the first hex in the and last group
				// save them to the last group
				data_groups[data_groups.length - 1] = last_group.concat(first_group[first_group.length - 1]);
				
				//delete the first group
				data_groups.splice (0,1);
			}
			else {
				//close any open groups
				data_groups[data_groups.length - 1].push(last_value);
			}
		}
	    return data_groups;
	}
	
	function get_los_arc_groups(origin_hex, blocking_hex_groups) {
		var result = [];
	
		for(var i = 0, len = blocking_hex_groups.length; i<len; i++) {
			var arc_groups = get_min_max_group_hex_corners(origin_hex, blocking_hex_groups[i]);
			
			result.push(arc_groups);
			
			// draw lines for testing purposes
         //   draw_extend_line(origin_hex.center_coord.x,origin_hex.center_coord.y,arc_groups.min.x,arc_groups.min.y, 'darkred');
		//	draw_extend_line(origin_hex.center_coord.x,origin_hex.center_coord.y,arc_groups.max.x,arc_groups.max.y);
        
            draw_arc(
                origin_hex.center_coord.x,
                origin_hex.center_coord.y,
                arc_groups.min.x,
                arc_groups.min.y,
                arc_groups.max.x,
                arc_groups.max.y
                );
 
			//highlight the beging and ending hexes in the groups
			highlight_hex_obj(blocking_hex_groups[i][0], 'blue');
			
			if(blocking_hex_groups[i].length > 1) {
					highlight_hex_obj(blocking_hex_groups[i][1], 'blue');
			}
		}

		return result;
	}
	
	function los_tester(){
		
		function blocks_los(hex){
			var blocks = (hex.blocks_los)? true : false;
			if(blocks){ highlight_hex_obj(hex, 'white'); }
			return blocks;
		}
		var origin_hex = mapArray[4][5],
			loop_radius = 2,
			max_loop_radius = 4,
			los_arc_groups = [],
            old_los_arc_groups = [];
			
		for(var r = loop_radius; r <= max_loop_radius; r++){
		loop_radius = r;
		
		var loop_hexes = get_hex_loop(origin_hex, loop_radius); // array of all hexes in loop
		// if there are already los_arc_groups
		var hidden_hexes = [];
		
		if(los_arc_groups.length > 0) {
			// filter out hexes that are not within the los_arc_groups
            
            
			for(var j = 0,len = los_arc_groups.length; j<len; j++){
				for(var i = 0,len2 = loop_hexes.length; i<len2; i++) {
					
					if(hex_inside_arc_group(origin_hex, loop_hexes[i], los_arc_groups[j])){
						hidden_hexes.push(loop_hexes[i]);
						highlight_hex_obj(loop_hexes[i], 'white');
					}
				}
			}
		}
        console.log('los_arc_groups');
		console.log(los_arc_groups);
		console.log('hidden_hexes');
		console.log(hidden_hexes);
		
		var	blocking_hex_groups = get_los_blocking_hex_groups(loop_hexes, blocks_los); // array of los blocking hex groups, needs full hex loop
			
            // save last loop field of view data
            old_los_arc_groups = los_arc_groups;
            
			// array of field of view arc data
			los_arc_groups = get_los_arc_groups(origin_hex, blocking_hex_groups);
			
            //merge new and old field of view data
           // los_arc_groups = mergeRanges(old_los_arc_groups, los_arc_groups);
            
			hexes = []; // reset hexes
		}		
		
	}
	

	
	function line_test() {
	/*		console.log('top');
	//	extend_line(100,100, 90, 80);
		
		console.log('right');	
		extend_line(100,100, 120, 105);


		console.log('bottom');
		extend_line(100,100, 120, 190);
		
		console.log('left');
		extend_line(100,100, 70, 150);
		*/
		
		console.log('test');
		extend_line(100,100, 110, 110);	
		
	/*	var canvas = document.getElementById('canvas');
		if (canvas.getContext){
			var ctx = canvas.getContext('2d');

			ctx.translate(0, canvas.height);
			ctx.scale(1, -1);

		}	
		*/
	}
	

	
	$(function(){
		
		render_map();
		los_tester();				
	//	line_test();
		//highlight_hex_coord(4,5);
	//	line_to_hex_test();
		//tester(mapArray[4][6],mapArray[2][4]);
//		get_min_max_hex_corners(mapArray[4][6],mapArray[7][4]);
	
		//tester2();
	//	los_test(4,2,1,5);
		//highlight_hex_obj([6,6], 'yellow');
//		highlight_hex_obj([3,8], 'yellow');
		//distance_test([6,6], [3,8]);
//		los_test_2([6,6], [3,8]);
		//highlight_hex_obj(hex_to_array([3,3]), 'yellow');
		//highlight_hex_obj(hex_to_array([6,8]), 'yellow');
	//	get_hex_loop_test(9, 8, 6);
		//get_adjacent(3,3);
		//get_adjacent(8,3);

		//console.log(get_distance(0,0,5,0));	
	
		
	});
	

	
	
