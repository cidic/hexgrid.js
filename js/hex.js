function hex(args) {
    // args {hexgrid, x, y, corners, blocks_los, color, edge, center_x, center_y, arc_data, distance_data}
    var args = args || {};
    
    
    this.x           = args.x;
    this.y           = args.y;
    this.hexgrid     = args.hexgrid;
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


    this.get_s_hex  = this.hexgrid.hex(this.x, this.y + 1);
    this.get_ne_hex = this.hexgrid.hex(this.x +1, ((this.x&1) === 0)? this.y - 1 : this.y);
    
    this.get_nw_hex = this.hexgrid.hex(this.x - 1,((this.x&1) === 0)? this.y - 1 : this.y);
    this.get_n_hex  = this.hexgrid.hex(this.x, this.y - 1 );
    this.get_se_hex = this.hexgrid.hex(this.x + 1, ((this.x&1) === 0)? this.y : this.y + 1);
    this.get_sw_hex = this.hexgrid.hex(this.x - 1, ((this.x&1) === 0)? this.y : this.y + 1);

    this.get_adjacent = [
         this.get_s_hex
        ,this.get_ne_hex
        ,this.get_nw_hex
        ,this.get_n_hex
        ,this.get_se_hex
        ,this.get_sw_hex
        ].filter(function(val) { return val !== false; });
        
}
hex.prototype.set_hex_arc_data = function() {
    
    // arc data	
	// targetHex.arc_data[x][y] contains arc/radian data of grid.hex[x][y] relative to origin hex(targetHex)
	
	// minRadian (most left (counterclockwise))
	// maxRadian (most right(clockwise))
	// minRadianCorner
	// maxRadianCorner
	for(var i_x = 0, len = this.hexgrid.mapsize_x; i_x < len; i_x++){
		for(var i_y = 0, len2 = this.hexgrid.mapsize_y; i_y < len2; i_y++){
			this.arc_data[i_x][i_y] = this.get_min_max_hex_corners(this, this.hexgrid.hex(i_x,i_y), false);
           
		}	
	}
	
}
hex.prototype.setColor = function(color){
    var color = color || 'blue',
        $target = $('#'+this.x+'-'+this.y+ ' div');            
        
    this.color = color;
	$target.attr('class','hex '+color);
    return this;
}
hex.prototype.get_min_max_hex_corners = function(hex1,hex2, drawLine){
    // returns the min and max radian of the corners of hex2 when hex1 is the origin
	// may want to be able to process a collection of hexes to find min/max; turn hex1 into an array of hex objects and do a foreach loop
	
	var drawLine = typeof(drawLine) != 'undefined' ? drawLine : true,
		radian = [],
		min_radian_index = 0,
		max_radian_index = 0; //index of the lowest value

	for (var i=0;i<6;i++) {
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
hex.prototype.get_hex_loop = function(distance){
    return get_hex_loop(this, distance);
}

function get_hex_loop(hex, distance) {
    	// get array of hexes in loop around 'hex'
        // consider memoizing this

	var	distance = distance || 1,
		origin_x = hex.x,
		origin_y = hex.y,
        _x = origin_x,
        _y = origin_y - distance,
		next = grid.hex(origin_x, origin_y - distance),
        result = [];

    s_hex  = function(x,y){ return {x : x, y : y + 1}};
    ne_hex = function(x,y){ return {x : x +1, y : ((x&1) === 0)? y - 1 : y}};
    nw_hex = function(x,y){ return {x : x - 1, y : ((x&1) === 0)? y - 1 : y}};
    n_hex  = function(x,y){ return {x : x, y :  y - 1 }};
    se_hex = function(x,y){ return {x : x + 1, y : ((x&1) === 0)? y : y + 1}};
    sw_hex = function(x,y){ return {x : x - 1, y : ((x&1) === 0)? y : y + 1}};

    var directions = [
         se_hex
        ,s_hex
        ,sw_hex
        ,nw_hex
        ,n_hex
        ,ne_hex
    ];

    for(var d = 0; d < 6; d++){
        for(var i = 0; i < distance; i++){
            result.push(next);
            var next_coords = directions[d](_x,_y);

            _x = next_coords.x;
            _y = next_coords.y;

            next = grid.hex(_x,_y);
	    }
    }
	return result;
}



function UnitType(args){
    var args = args || {};
    /* example args
    {
        name : 'infantry',
        displayName: 'Infantry',
        movement : {
            'default' : 3,
            'forest' : 3,
            'building' : 3
        }
    }
    */
    _.extend(this, args);
    
    
}

var unitTypes = {
    'infantry' : new UnitType({
        name : 'infantry',
        displayName: 'Infantry',
        movement : {
            'default' : 3,
            'forest' : 3,
            'building' : 3
        }
    }),
    'afv_light' : new UnitType({
        name : 'afv_light',
        displayName: 'Light Armored Fighting Vehicle',
        movement: {
            'default' : 6,
            'forest' : 3,
            'building' : -1
        }
    }),
}
function TerrainType(args) {
    var args = args || {};
    
    this.name           = args.name;
  
}

var terrainTypes ={
    'default' : new TerrainType({
        name : 'default'
    }),
    'forest' : new TerrainType({
        name : 'forest'
    })
};


console.log(unitTypes);


    