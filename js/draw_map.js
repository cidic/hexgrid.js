    // function found on developerfusion.com
	function MultiDimensionalArray(iRows,iCols) {
		var i;
		var j;
		var a = new Array(iRows);
		for (i=0; i < iRows; i++) {
			a[i] = new Array(iCols);
			for (j=0; j < iCols; j++) {
				a[i][j] = "";
			}
		}
		return(a);
	} 
 
	// Setup Hexagon Map
	var mapsize_x = 10;
	var mapsize_y = 10	;
	var mapArray = MultiDimensionalArray(mapsize_x,mapsize_y);
	for (x=0; x  < mapsize_x; x++) {
		for (y=0; y < mapsize_y; y++) {
			mapArray[x][y] = {
				'x' : x,
				'y' : y,			
				array_space : [x,y],
				color : 'green',
				center_coord : [],
				corners : [],
				blocks_los : false
			};
		}
	}
	mapArray[4][6].color = 'yellow';
	

	mapArray[2][6].blocks_los = true;
	mapArray[2][7].blocks_los = true;
	mapArray[2][5].blocks_los = true;
 	mapArray[6][5].blocks_los = true;

	/* mapArray[3][4].blocks_los = true;
	mapArray[4][4].blocks_los = true;
	mapArray[5][4].blocks_los = true; */
	
	
	var hex_height = 26,
		hex_width = 30,
		hex_corner_offset = 8,
		map_pixel_height = hex_height * mapsize_y,
		map_markup = '',
		con_width = hex_width * mapsize_y + (hex_height/2),
		con_height = hex_height * mapsize_y + (hex_height/2) + 2;
	

	function render_map() {
		var	z_index = mapsize_x;
			
		$('#map, .container')
			.width(con_width)
			.height(con_height)
		;
		$('#canvas')
			.attr('width', con_width)
			.attr('height', con_height)
		;
		for (x=0; x < mapsize_x; x++) {
			for (y=0; y < mapsize_y; y++) {
			
				var hex_x = (x * (hex_width - hex_corner_offset)),
					hex_y = ( (x%2 === 0)? (y * hex_height) : (y * hex_height) + (hex_height/2) ),
					target_hex = mapArray[x][y];	
				
				target_hex.color = mapArray[x][y].color || 'green';
				target_hex.center_coord = 	{
												x : hex_x + (hex_width/2),
												y : hex_y + (hex_height/2)
											};
				target_hex.corners = [
					{ 	x : hex_x, 
						y : hex_y + (hex_height/2)
					},
					{	x : hex_x + hex_corner_offset,
						y : hex_y
					},
					{
						x : hex_x + hex_width - hex_corner_offset,
						y : hex_y
					},
					{
						x : hex_x + hex_width, 
						y : hex_y + (hex_height/2)
					},
					{
						x : hex_x + hex_width - hex_corner_offset,
						y : hex_y + hex_height
					},
					{
						x : hex_x + hex_corner_offset,
						y : hex_y + hex_height
					}
				];		
				target_hex.arc_data = MultiDimensionalArray(mapsize_x,mapsize_y);
				
				var edge;
				
				if((0 < x < mapsize_x) && (0 < y < mapsize_y)){
					edge = null;
				}
				else if(x == 0 && y == 0){
					edge = 'top_left_corner';
				}
				else if(x == 0 && y == mapsize_y){
					edge = 'bottom_left_corner';
				}
				else if(x == mapsize_x && y == 0){
					edge = 'top_right_corner';
				}
				else if(x == mapsize_x && y == mapsize_y){
					edge = 'bottom_right_corner'
				}
				else if(y == 0) {
					edge = 'top';
				}
				else if(x == mapsize_x){
					edge = 'right';
				}
				else if(y == mapsize_y) {
					edge = 'bottom';	
				}
				else if(x == 0){
					edge = 'left';
				}
				
				target_hex.edge = edge;
				
				
				
					
				
				map_markup +='<div id="'+ x + '-' + y +'" class="hex-wrap hex array_space_'+x+'_'+y+'" style="position:absolute;z-index:'+ hex_y +';left:' + hex_x + 'px;top:' + ( hex_y) + 'px;">';
				map_markup +='<div class="hex ' + target_hex.color + '">';						
				map_markup +='<span style="position:absolute;left:10px;top:5px;">'+x+','+y+'</span>';
				map_markup +='</div></div>';
			}
			z_index--;
		}
		
		
		document.getElementById('map').innerHTML += map_markup;
		generate_arc_data();
	}
	
	function generate_arc_data(){
		
		// target_hex.arc_data[x][y] contains arc/radian data of mapArray[x][y] relative to origin hex(target_hex)
		
		// minRadian (most left/ counterclockwise)
		// maxRadian (most right/clockwise)
		// minRadianCorner
		// maxRadianCorner
		
		for (x=0; x < mapsize_x; x++) {
			for (y=0; y < mapsize_y; y++) {
				
				for(var i_x = 0, len = mapsize_x; i_x < len; i_x++){
					for(var i_y = 0, len = mapsize_y; i_y < len; i_y++){

						mapArray[x][y].arc_data[i_x][i_y] = get_min_max_hex_corners(mapArray[x][y],mapArray[i_x][i_y], false);

					}	
				}
				
			}
		}
	}
	
	
	
	function get_min_max_hex_corners(hex1,hex2, drawLine){
		// returns the min and max radian of the corners of hex2 when hex1 is the origin
		// may want to be able to process a collection of hexes to find min/max; turn hex1 into an array of hex objects and do a foreach loop
		
		var drawLine = typeof(drawLine) != 'undefined' ? drawLine : true,
			radian = [],
			min_radian_index = 0,
			max_radian_index = 0; //index of the lowest value

		var test_hex = ( hex1.x == 4 && hex1.y == 6 && hex2.x == 2 && hex2.y == 6),
			test_hex2 = ( hex1.x == 4 && hex1.y == 6 && hex2.x == 6 && hex2.y == 8);

		for (i=0;i<6;i++) 
		{
			radian[i] = Math.atan2(hex2.corners[i].y - hex1.center_coord.y, hex2.corners[i].x - hex1.center_coord.x); // get radian of each corner point				
				
			if(radian[i] < radian[min_radian_index]) {
				min_radian_index = i;
			}
			
			if(radian[i] > radian[max_radian_index]) {
				max_radian_index = i;
			}
			if(drawLine){
				draw_line(hex1.center_coord.x, hex1.center_coord.y,hex2.corners[i].x,hex2.corners[i].y, 'yellow');
			}
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
		
		var min_rad,
			max_rad;
			
		// if hex is NOT on the wraparound point (left of origin hex)
		// check that the absolute value of the difference of the max and min is > pi.
		// that happens, then it goes the other direction, take the smallest positive value and largest negative value instead of the actual smallest/largest.
		
		if((Math.abs(radian[max_radian_index] - radian[min_radian_index])) > Math.PI){
			min_radian_index = get_lowest_positive_index(radian);			
			max_radian_index = get_highest_negative_index(radian);
		}
		
			min_rad = radian[min_radian_index];
			max_rad = radian[max_radian_index];
		
		var result = 	{
							min : 	{
										x : hex2.corners[min_radian_index].x,
										y : hex2.corners[min_radian_index].y,
										'radian' : min_rad
									},		
							max : 	{
										x : hex2.corners[max_radian_index].x,
										y : hex2.corners[max_radian_index].y,
										'radian' : max_rad
									}
						}		
		
	 	return result;
	}