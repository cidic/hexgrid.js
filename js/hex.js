    // args {hexgrid, x, y, corners, blocks_los, color, edge, center_x, center_y, arc_data, distance_data}
    function hex(args) {
        
        var args = args || {};
        
        this.hexgrid     = args.hexgrid;
        this.x           = args.x;
        this.y           = args.y;
        this.center = {
            x : args.center_x,
            y : args.center_y
            
        };
        this.corners     = args.corners;
        
        this.arc_data    = args.arc_data;
        //this.domObj
        
        this.blocksLos   = args.blocks_los || false;
        this.color       = args.color || 'green';
        this.edge        = args.edge || false;
        this.distanceTo  = args.distanceData || {};
            
        
    }
    hex.prototype.set_traversal_data = function() {
    // traversal data
        this.get_s_hex  = this.hexgrid.hex(this.x, this.y + 1);
        this.get_ne_hex = this.hexgrid.hex(this.x +1, ((this.x&1) == 0)? this.y - 1 : this.y);
        
        this.get_nw_hex = this.hexgrid.hex(this.x - 1,((this.x&1) == 0)? this.y - 1 : this.y);
        this.get_n_hex  = this.hexgrid.hex(this.x, this.y - 1 );
        this.get_se_hex = this.hexgrid.hex(this.x + 1, ((this.x&1) == 0)? this.y : this.y + 1);
        this.get_sw_hex = this.hexgrid.hex(this.x - 1, ((this.x&1) == 0)? this.y : this.y + 1);
	
        this.get_adjacent = [
             this.get_s_hex
            ,this.get_ne_hex
            ,this.get_nw_hex
            ,this.get_n_hex
            ,this.get_se_hex
            ,this.get_sw_hex
            ];
      
    }
    var testCount = 0;
    hex.prototype.set_hex_data = function() {
        
        
        // arc data	
		// targetHex.arc_data[x][y] contains arc/radian data of mapHex[x][y] relative to origin hex(targetHex)
		
		// minRadian (most left (counterclockwise))
		// maxRadian (most right(clockwise))
		// minRadianCorner
		// maxRadianCorner
		for(var i_x = 0, len = mapsize_x; i_x < len; i_x++){
			for(var i_y = 0, len = mapsize_y; i_y < len; i_y++){
				this.arc_data[i_x][i_y] = get_min_max_hex_corners(this, this.hexgrid.hex(i_x,i_y), false);
                testCount++;
			}	
		}
		
	}
    
     
    hex.prototype.set_color = function(color){
    	var color = color || 'blue',
		    $target = $('#'+hex.x+'-'+hex.y+' div');
        this.color = color;
		$target.attr('class','hex '+color);
	}
    
    
    function get_min_max_hex_corners(hex1,hex2, drawLine){
        // returns the min and max radian of the corners of hex2 when hex1 is the origin
		// may want to be able to process a collection of hexes to find min/max; turn hex1 into an array of hex objects and do a foreach loop
		
		var drawLine = typeof(drawLine) != 'undefined' ? drawLine : true,
			radian = [],
			min_radian_index = 0,
			max_radian_index = 0; //index of the lowest value

		/*
        var test_hex = ( hex1.x == 4 && hex1.y == 6 && hex2.x == 2 && hex2.y == 6),
			test_hex2 = ( hex1.x == 4 && hex1.y == 6 && hex2.x == 6 && hex2.y == 8);
        */
		for (var i=0;i<6;i++) 
		{
			radian[i] = Math.atan2(hex2.corners[i].y - hex1.center.y, hex2.corners[i].x - hex1.center.x); // get radian of each corner point				
				
			if(radian[i] < radian[min_radian_index]) {
				min_radian_index = i;
			}
			
			if(radian[i] > radian[max_radian_index]) {
				max_radian_index = i;
			}
			if(drawLine){
				draw_line(hex1.center.x, hex1.center.y,hex2.corners[i].x,hex2.corners[i].y, 'yellow');
			}
		}	
		
		
		
		var min_rad,
			max_rad;
			
		// if hex is NOT on the wraparound point (left of origin hex where PI becomes -PI)
		// check that the absolute value of the difference of the max and min is > pi.
		// that happens, then it goes the other direction, take the smallest positive value and largest negative value instead of the actual smallest/largest.
		
		if((Math.abs(radian[max_radian_index] - radian[min_radian_index])) > Math.PI){
			min_radian_index = get_lowest_positive_index(radian);			
			max_radian_index = get_highest_negative_index(radian);
		}
		
			min_rad = radian[min_radian_index];
			max_rad = radian[max_radian_index];
		
		var result =    {
							min :   {
										x : hex2.corners[min_radian_index].x,
										y : hex2.corners[min_radian_index].y,
										'radian' : min_rad
									},		
							max :   {
										x : hex2.corners[max_radian_index].x,
										y : hex2.corners[max_radian_index].y,
										'radian' : max_rad
									}
						};
		
        return result;
    }
    
    
    