function hex_accessible(x,y) {
    if(mapArray[x] == undefined) return false;
	if(mapArray[x][y] == undefined) return false;
	if(mapArray[x][y] == 'hex_tree') return false;

	return true;
}

function hex_distance(x1,y1,x2,y2) {
	dx = Math.abs(x2-x1);
	dy = Math.abs(y2-y1);
	return Math.round(Math.sqrt((dx*dx) + (dy*dy)));
}

function remove_path() {
	for (x=0; x  < mapsize_x; x++) {
		for (y=0; y < mapsize_y; y++) {
			if(document.getElementById('hex_'+ x +'_' + y).className == 'hex_blue'){
				document.getElementById('hex_'+ x +'_' + y).className='hex_green';
			}
		}
	}			
}

function path(start_x, start_y, end_x, end_y) {
	// Check cases path is impossible from the start.
	var error=0;
	if(start_x == end_x && start_y == end_y) error=1;
	if(!hex_accessible(start_x,start_y)) error=1;
	if(!hex_accessible(end_x,end_y)) error=1;
	if(error==1) {
		alert('Path is impossible to create.');
		return false;
	}

	// Init
	var openlist = new Array(mapsize_x*mapsize_y+2);
	var openlist_x = new Array(mapsize_x);
	var openlist_y = new Array(mapsize_y);
	var statelist = MultiDimensionalArray(mapsize_x+1,mapsize_y+1); // current open or closed state
	var openlist_g = MultiDimensionalArray(mapsize_x+1,mapsize_y+1);
	var openlist_f = MultiDimensionalArray(mapsize_x+1,mapsize_y+1);
	var openlist_h = MultiDimensionalArray(mapsize_x+1,mapsize_y+1);
	var parent_x = MultiDimensionalArray(mapsize_x+1,mapsize_y+1);
	var parent_y = MultiDimensionalArray(mapsize_x+1,mapsize_y+1);
	var path = MultiDimensionalArray(mapsize_x*mapsize_y+2,2);

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
		for (var i in openlist) {
			if(openlist[i] == true){
				select_x = openlist_x[i]; 
				select_y = openlist_y[i]; 
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
		for(i=1;i<7;i++) {
			// Run node update for 6 neighbouring tiles.
			switch(i){
				case 1:
				node_x = x-1;
				node_y = (x%2 == 0)? y : y+1;					
			break;
			case 2:
				node_x = x;
				node_y = y-1;						
			break;
		  	case 3:
				node_x = x+1;
				node_y = (x%2 == 0)? y-1 : y;							
			break;
			case 4:
				node_x = x+1;
				node_y = (x%2 == 0)? y : y+1;					
			break;
			case 5:
				node_x = x;
				node_y = y+1;
			break;
			case 6:
				node_x = x-1;
				node_y = (x%2 == 0)? y-1 : y;
			
			break;
			}
		  if (hex_accessible([node_x],[node_y])) {
			  if(statelist[node_x][node_y] == true) {
			  	if(openlist_g[node_x][node_y] < openlist_g[x][y]) {
			  		parent_x[x][y] = node_x;
					  parent_y[x][y] = node_y;
					  openlist_g[x][y] = openlist_g[node_x][node_y] + 10;
					  openlist_f[x][y] = openlist_g[x][y] + openlist_h[x][y];
				  }
			  } else if (statelist[node_x][node_y] == 2) {
				  // its on closed list do nothing.
			  } else {
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
				}
		  }
		}
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
		document.getElementById('hex_' + path[counter][1] + '_' + path[counter][2]).className = 'hex_blue';
		counter--;
	}
}