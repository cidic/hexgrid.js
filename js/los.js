    function get_min_max_group_hex_corners(hex1,hex_group){
        // returns the min and max radian of the corners of hex_group when hex1 is the origin
        // hex groups should only contain 1 or 2 hexes
        // if there are 2 hexes
        // we know the first ( hex_group[0] )is the left(counterclockwise) most
        // and the second ( hex_group[1] ) is the right(clockwise) most
        // because the arcs are cycled clockwise to form the groups

		var hex_first = hex_group[0],
			// get last hex in group (if there is 1 hex it will be the same as the first)
			hex_last = hex_group[hex_group.length - 1],
            
            hex_first_x_offset = hex_first.x - hex1.x,
            hex_first_y_offset = hex_first.y - hex1.y - (hex1.x & hex_first_x_offset & 1),
            
            
            hex_last_x_offset = hex_last.x - hex1.x,
            hex_last_y_offset = hex_last.y - hex1.y - (hex1.x & hex_last_x_offset & 1);
           
            
            /*
            console.log('hex_first : '+hex_first.x+','+hex_first.y);
            console.log('hex_first_offset : '+hex_first_x_offset+','+hex_first_y_offset);
            
            console.log('hex_last : '+hex_last.x+','+hex_last.y);
            console.log('hex_last_offset : '+hex_last_x_offset+','+hex_last_y_offset);
            */
            var result =    {
							min : grid.arc_data[hex_first_x_offset][hex_first_y_offset].min,
							max : grid.arc_data[hex_last_x_offset][hex_last_y_offset].max
						};
        return result;
	}
    
	function hex_inside_angleSet(originHex, targetHex, angleSet){
        // Returns true if targetHex, is visible from originHex at every angle in angleSet.
        if (targetHex === false) return false;
        var interval = originHex.arc_data[targetHex.x][targetHex.y];
		return angleSet.containsInterval(interval.min.radian, interval.max.radian);
	}

    function get_los_blocking_hex_groups(hexes, validateFunc) {
        // TODO consider filtering out hexes already out of los as per los_arc_groups
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

	function get_los_angleSet(origin_hex, blocking_hex_groups) {
	    if (!blocking_hex_groups.length) return null;
		var result = new angleSet;
        
		for(var i = 0, len = blocking_hex_groups.length; i<len; i++) {
        
			var corners = get_min_max_group_hex_corners(origin_hex, blocking_hex_groups[i]);
			result.addInterval(corners.min, corners.max);

			// draw lines for testing purposes

            /*
            draw_triangle(
                origin_hex.center.x,
                origin_hex.center.y,
                arc_groups.min.x,
                arc_groups.min.y,
                arc_groups.max.x,
                arc_groups.max.y,
                '200,100,100,0.3',
                '250,50,50,0.9'
            );
            */
		}

		return result;
	}

	function los_tester(){

		function blocks_los(hex){
			var blocks = !!hex.blocksLos;
			if(blocks){ hex.setColor('blue'); }
			return blocks;
		}
        
		var origin_hex = grid.hex(10,10),
			max_loop_radius = 100,
			los_angleSet = new angleSet,
            visible_hexes = [];

        origin_hex.setColor('yellow')

		for(var loop_radius = 1; loop_radius <= max_loop_radius; loop_radius++){

		    var loop_hexes = get_hex_loop(origin_hex, loop_radius); // array of all hexes in loop

            // array of los blocking hex groups from latest hex loop
            var blocking_hex_groups = get_los_blocking_hex_groups(loop_hexes, blocks_los);

			// angleSet containing all angles blocked from view at this radius.
            var new_los_angleSet = get_los_angleSet(origin_hex, blocking_hex_groups);

            if (new_los_angleSet) {
                // Draw FOV arcs for each newly encountered segment which is blocked from view.
                new_los_angleSet.eachInterval(function (min, max) {
                    draw_fov2(
                        origin_hex.center.x,
                        origin_hex.center.y,
                        min,
                        max,
                        loop_radius * grid.hex_height,
                        "rgba(50, 50,250, .15)",
                        "rgba(0,0,250, .9)"
                    );
                });

                // Merge newly encountered FOV arcs with master angleSet.
                los_angleSet.addSet(new_los_angleSet);
            }

            if(!los_angleSet.isEmpty()) {
                // filter out hexes that are not within the los_arc_groups color them white
                // TODO exclude them from being processed as blocking hexes?
                for(var i = loop_hexes.length; i--;) {
                    if(hex_inside_angleSet(origin_hex, loop_hexes[i], los_angleSet)){
                        if(loop_hexes[i].blocksLos === false) loop_hexes[i].setColor('white');
                        
                    }
                    // add to visible list
                    else {
                       visible_hexes.push(loop_hexes[i]);
                    }
                }
            }
			hexes = []; // reset hexes

		}
        //console.log(visible_hexes);
	}