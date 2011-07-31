function hex_accessible(x,y) {
    
    if(grid.hex(x,y) && grid.hex(x,y).impassible == true) return false;
    
	return true;
}

function hex_distance(x1,y1,x2,y2) {
	dx = Math.abs(x2-x1);
	dy = Math.abs(y2-y1);
	return Math.round(Math.sqrt((dx*dx) + (dy*dy)));
}

function remove_path() {
	for (x=0; x  < grid.mapsize_x; x++) {
		for (y=0; y < grid.mapsize_y; y++) {
            grid.hex(x,y).setColor('green');
		}
	}			
}

function path(start_x, start_y, end_x, end_y) {
    // Check cases path is impossible from the start.
	if(start_x == end_x && start_y == end_y)
        alert('start and end are the same hex');
	if(!hex_accessible(start_x,start_y)) 
        alert('start hex not accessable');
	if(!hex_accessible(end_x,end_y))
        alert('end hex not accessable');
    if(start_x > grid.mapsize_x || start_y > grid.mapsize_y || start_x < 0 || start_y < 0)
        alert('start hex falls outside grid bounds');    
    if(end_x > grid.mapsize_x || end_y > grid.mapsize_y || end_x < 0 || end_y < 0)
        alert('end hex falls outside grid bounds');
        
	

	// Init
	var openlist = new Array(grid.mapsize_x*grid.mapsize_y+2);
	var openlist_x = new Array(grid.mapsize_x);
	var openlist_y = new Array(grid.mapsize_y);
    
	var statelist = MultiDimensionalArray(grid.mapsize_x+1,grid.mapsize_y+1); // current open or closed state
	
    var openlist_g = MultiDimensionalArray(grid.mapsize_x+1,grid.mapsize_y+1); // cost to start
	var openlist_f = MultiDimensionalArray(grid.mapsize_x+1,grid.mapsize_y+1); // total cost
	var openlist_h = MultiDimensionalArray(grid.mapsize_x+1,grid.mapsize_y+1); // cost to end
    
	var parent_x = MultiDimensionalArray(grid.mapsize_x+1,grid.mapsize_y+1);
	var parent_y = MultiDimensionalArray(grid.mapsize_x+1,grid.mapsize_y+1);
	
    var path = MultiDimensionalArray(grid.mapsize_x*grid.mapsize_y+2,2);

	var select_x = 0;
	var select_y = 0;
	var node_x = 0;
	var node_y = 0;
	var counter = 1; // Openlist_ID counter
	var selected_id = 0; // Actual Openlist ID


	// Add start coordinates to openlist.
	openlist[1] = true;
	openlist_x[1] = start_x;
	openlist_y[1] = start_y;
    
	openlist_f[start_x][start_y] = 0;
	openlist_h[start_x][start_y] = 0;
	openlist_g[start_x][start_y] = 0;
	statelist[start_x][start_y] = true; 

	// Try to find the path until the target coordinate is found
	while (statelist[end_x][end_y] != true) {
		set_first = true;
		

// Find lowest F in openlist
        //find lowest total cost
        console.log(openlist);
        console.log(openlist_x);
        console.log(openlist_y);
        return false;
        
		for (var i in openlist) {
            // if 
			if(openlist[i] == true){
				select_x = openlist_x[i];
				select_y = openlist_y[i];
                
                // if this is the very first itteration
				if(set_first == true) {
					lowest_found = openlist_f[select_x][select_y];
					set_first = false;
				}
				if (openlist_f[select_x][select_y] <= lowest_found) {
					lowest_found = openlist_f[select_x][select_y];
					x = openlist_x[i];
					y = openlist_y[i];
					selected_id = i;
				}
			}
		}


		if(set_first==true) {
			// open_list is empty
			alert('No possible route can be found.');
			return false;
		}
        // add it lowest F as closed to the statelist and remove from openlist
		statelist[x][y] = 2;
		openlist[selected_id]= false;
		// Add connected nodes to the openlist
        
        var adjacentHexes = grid.hex(x,y).get_adjacent;
        
        console.log('hexes adjacent to ('+x+','+y+')');
        _.each(adjacentHexes, function(hex){
            node_x = hex.x;
            node_y = hex.y;
            // Add connected nodes to the openlist             
            if (hex_accessible([node_x],[node_y])) {
            
                // if state of node is open
                if(statelist[node_x][node_y] == true) {
                    // if cost to start is less than 
                    console.log('(openlist_g['+node_x+']['+node_y+'] < openlist_g['+x+']['+y+'])');
                    console.log(openlist_g[node_x][node_y] +' < '+ openlist_g[x][y]);
                  
                  	if(openlist_g[node_x][node_y] < openlist_g[x][y]) {
                        parent_x[x][y] = node_x;
                        parent_y[x][y] = node_y;
                        openlist_g[x][y] = openlist_g[x][y] + 10;
                        openlist_f[x][y] = openlist_g[x][y] + openlist_h[x][y];
                    }
                }
                else if (statelist[node_x][node_y] == 2) {
                // its on closed list do nothing.
                } 
                else {
                    counter++;
                    // add to open list
                    openlist[counter] = true;
                    openlist_x[counter] = node_x;
                    openlist_y[counter] = node_y;
                    statelist[node_x][node_y] = true;
                    // Set parent
                    parent_x[node_x][node_y] = x;
                    parent_y[node_x][node_y] = y;
                    // update H , G and F
                    var ydist = end_y - node_y;
                    if ( ydist < 0 ) ydist = ydist*-1;
                    var xdist = end_x - node_x;
                    if ( xdist < 0 ) xdist = xdist*-1;		
                    openlist_h[node_x][node_y] = hex_distance(node_x,node_y,end_x,end_y) * 10;
                    openlist_g[node_x][node_y] = openlist_g[x][y] + 10;
                    openlist_f[node_x][node_y] = openlist_g[node_x][node_y] + openlist_h[node_x][node_y];
                    console.log('-hex('+node_x+','+node_y+')');
                    console.log('--cost to start : '+openlist_g[node_x][node_y]);
                    console.log('--cost to end : '+openlist_h[node_x][node_y]);
                    console.log('--cost total : '+openlist_f[node_x][node_y]);
    
                }
            }
		});
	}


	// Get Path
	temp_x=end_x;
	temp_y=end_y;
	counter = 0;
	while(temp_x != start_x || temp_y != start_y) {
		counter++;
		path[counter][1] = temp_x;
		path[counter][2] = temp_y;
		temp_x = parent_x[path[counter][1]][path[counter][2]];
		temp_y = parent_y[path[counter][1]][path[counter][2]];
	}
	counter++;
	path[counter][1] = start_x;
	path[counter][2] = start_y;




	// Draw path.
	while(counter!=0) {
        var _x = path[counter][1],
            _y = path[counter][2];
            grid.hex(_x,_y).setColor('yellow');
		counter--;
	}
}