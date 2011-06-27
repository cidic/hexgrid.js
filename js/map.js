function hexgrid(args){
    
    var args = args || {};
    this.mapsize_x = args.mapsize_x;
    this.mapsize_y = args.mapsize_y;
    this.hexes = MultiDimensionalArray(this.mapsize_x,this.mapsize_y);
    
    this.hex_width = args.hex_width;
    this.hex_height = args.hex_height;
    
    this.hex_corner_offset = args.hex_corner_offset;
	this.map_pixel_height = this.hex_height * this.mapsize_y;
	this.container_width = (this.hex_width - this.hex_corner_offset) * this.mapsize_x + this.hex_corner_offset;
	this.container_height = this.hex_height * this.mapsize_y + (this.hex_height/2) + 2;

    this.blockingHexes = args.blockingHexes;
    
    this.generateHexes();
    
    if(this.blockingHexes.length > 0){
        for(var i =0,len = this.blockingHexes.length; i <len; i++){
            var _x = this.blockingHexes[i].x,
                _y = this.blockingHexes[i].y;
                this.hex(_x,_y).blocksLos = true;
        }
    }   
    this.eachHex(function(x,y, hex){
            hex.set_hex_arc_data();
            hex.set_traversal_data();
    });
    
    this.generate_arc_data();
    
    $($.proxy(function(){
        
        this.container = document.getElementById(args.containerId);
        this.canvas = document.getElementById(args.canvasId);
        
        this.container.innerHTML = this.markup;
        
        $(this.canvas).attr('width',this.container_width);
        $(this.canvas).attr('height',this.container_height);
        $(this.container).width(this.container_width);
        $(this.container).height(this.container_height);
    }, this));
    
    
    this.getCtx = function(){                
        return (this.canvas.getContext)? this.canvas.getContext('2d') : null;
    };
    
    this.draw = function(drawFunction){
        if(this.canvas && this.canvas.getContext){
            var ctx = this.canvas.getContext('2d');
            drawFunction.apply(ctx);
        }
    } 

    
    
}
    hexgrid.prototype.hex = function (x,y){
        if(
            this.hexes[x] !== undefined
        &&  this.hexes[x] !== null
        &&  this.hexes[x][y] !== undefined
        &&  this.hexes[x][y] !== null
        )
        {
            return this.hexes[x][y];
        }
        else {
            return false;   
        }
    };
    
    hexgrid.prototype.eachHex = function(func, context){
        // use hexes[x][y] instead of hex(x,y) we can make the assumption that all hexes returned exist, so skipp checking if undefined
                         

        for (var x=0; x < this.mapsize_x; x++) {
			for (var y=0; y < this.mapsize_y; y++) { 
                var thisHex = this.hexes[x][y];
                   var context = context || thisHex;
                     
                func.apply(context,[x,y, thisHex]);  
			}
        }
    };


    hexgrid.prototype.generateHexes = function(){
        var map_markup = '',
            z_index = this.mapsize_y;
        for (var x = 0; x < this.mapsize_x; x++) {
            for (var y = 0; y < this.mapsize_y; y++) {
                
         
         var hexEdge = function(){
                        
                            
                            if((0 < x && x < this.mapsize_x) && (0 < y && y < this.mapsize_y)){
                                return null;
                            }
                            else if(x === 0 && y === 0){
                                return 'top_left';
                            }
                            else if(x === 0 && y == this.mapsize_y){
                                return 'bottom_left';
                            }
                            else if(x == this.mapsize_x && y === 0){
                                return 'top_right';
                            }
                            else if(x == this.mapsize_x && y == this.mapsize_y){
                                return 'bottom_right';
                            }
                            else if(y === 0) {
                                return 'top';
                            }
                            else if(x == this.mapsize_x){
                                return 'right';
                            }
                            else if(y == this.mapsize_y) {
                                return 'bottom';
                            }
                            else if(x === 0){
                                return 'left';
                            }
                                    
                        }
         
         
         
                var hex_x = (x * (this.hex_width - this.hex_corner_offset)),
                    hex_y = ( (x%2 === 0)? (y * this.hex_height) : (y * this.hex_height) + (this.hex_height/2) ),
                    
                    hex_args = {
                                
                        // args {x,y,corners,arc_data,blocks_los,color,edge, center_x, center_y}
                         x : x
                        ,y : y
                        ,center_x : (hex_x + (this.hex_width/2))
        				,center_y : (hex_y + (this.hex_height/2))
        						
                        ,hexgrid : this
                        ,color : 'green'
                        ,corners : [
                            {   x : hex_x, 
                                y : hex_y + (this.hex_height/2)
                            },
                            {	x : hex_x + this.hex_corner_offset,
                                y : hex_y
                            },
                            {
                                x : hex_x + this.hex_width - this.hex_corner_offset,
                                y : hex_y
                            },
                            {
                                x : hex_x + this.hex_width, 
                                y : hex_y + (this.hex_height/2)
                            },
                            {
                                x : hex_x + this.hex_width - this.hex_corner_offset,
                                y : hex_y + this.hex_height
                            },
                            {
                                x : hex_x + this.hex_corner_offset,
                                y : hex_y + this.hex_height
                            }
                        ]
                        ,arc_data : MultiDimensionalArray(this.mapsize_x,this.mapsize_y)
                        ,edge : hexEdge()
                    }
               this.hexes[x][y] = new hex(hex_args);


                map_markup +='<div id="'+ x + '-' + y +'" class="hex-wrap hex array_space_'+x+'_'+y+'" style="position:absolute;z-index:'+ hex_y +';left:' + hex_x + 'px;top:' +  hex_y + 'px;">';
                map_markup +='<div class="hex green">';						
                map_markup +='<span style="position:absolute;left:10px;top:5px;">'+x+','+y+'</span>';
                map_markup +='</div></div>';

                z_index--;
		    }
        }
        this.markup = map_markup;
        
     
     
    }
     hexgrid.prototype.exportData = function() {
        return JSON.stringify(grid.hexes,function(k,v){return((k==='get_adjacent' || k==='hexgrid' || k==='get_n_hex' || k==='get_ne_hex' || k==='get_nw_hex' || k==='get_s_hex' || k ==='get_se_hex' || k==='get_se_hex' || k==='get_sw_hex')?undefined:v);});
    }
    hexgrid.prototype.importData = function(data) {
        this.hexes = data;
          this.eachHex(function(x,y){
            this.hex(x,y).set_traversal_data();
        });
    }
    hexgrid.prototype.randomBlocking = function(hexesToBlock){
            for(var i = 0; i<hexesToBlock; i++){
                var rX = Math.floor(Math.random() * grid.mapsize_x), 
                    rY = Math.floor(Math.random() * grid.mapsize_y);
                grid.hex(rX,rY).blocksLos = true;
            }
        }
 
 
 hexgrid.prototype.generate_arc_data = function(){
    // returns the min and max radian of the corners of hex2 when hex1 is the origin
    // may want to be able to process a collection of hexes to find min/max; turn hex1 into an array of hex objects and do a foreach loop
	
	var hex1 = this.hex(0,0),
        arc_data = {};
    
	arc_data[0] = {};
	
    this.eachHex(function(x,y){
		
        if(!(x === 0 && y === 0)){
            var thisHex = this.hex(x,y);
            if (!(x in arc_data))
            	arc_data[x] = {};
            arc_data[x][y] = get_arc_data(thisHex);
        }
    }, this);	
	
	// generate other quadrant arc_data    
	
	for (var x in arc_data) { 
		// skip x = 0
		if(x != 0){
		
			arc_data[-x] = {};
			
			for (var y in arc_data[x]) { 
				// skip y = 0
			//	if(y != 0){
					var min = arc_data[x][y].min,
						max = arc_data[x][y].max;
				    
					//generate top right
					arc_data[x][-y] = {
											min : min * -1,
											max : max * -1
										};				
					//generate top left
					arc_data[-x][-y] = {
											min : (min > 0)? min - Math.PI : min + Math.PI,
											max : (max > 0)? max - Math.PI : max + Math.PI
										};
					//generate bottom left
					arc_data[-x][y] = {
											min : arc_data[-x][-y] * -1,
											max : arc_data[-x][-y] * -1
										};			
			//	}
			}
		}
	}
	
	console.log(arc_data);
    /*
    for( var i in arc_data){
        
       
        for( var j in arc_data[i]){  
             
            console.log(i+','+j);
        }
    }
    */
    
    this.arc_data = arc_data;

    function get_arc_data(hex2){
        var radian = [],
            min_radian_index = 0,
            max_radian_index = 0; //index of the lowest value
            
        for(var i=0;i<6;i++) {
            radian[i] = Math.atan2(hex2.corners[i].y - hex1.center.y, hex2.corners[i].x - hex1.center.x); // get radian of each corner point				
			
            if(radian[i] < radian[min_radian_index]) {
                min_radian_index = i;
            }
            
            if(radian[i] > radian[max_radian_index]) {
                max_radian_index = i;
            }
            
        }	
		
        // if hex is NOT on the wraparound point (left of origin hex where PI becomes -PI)
        // check that the absolute value of the difference of the max and min is > pi.
        // that happens, then it goes the other direction, take the smallest positive value and largest negative value instead of the actual smallest/largest.
	
	    if((Math.abs(radian[max_radian_index] - radian[min_radian_index])) > Math.PI){
		    min_radian_index = get_lowest_positive_index(radian);			
		    max_radian_index = get_highest_negative_index(radian);
	    }
        return  {
                    min : radian[min_radian_index],
                    max : radian[max_radian_index]			
		        };
    }
    
    
 }
   