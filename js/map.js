
    
    
    function hexgrid(args){
        
        var args = args || {};
        this.mapsize_x = args.mapsize_x;
        this.mapsize_y = args.mapsize_y;
        this.hexes = MultiDimensionalArray(this.mapsize_x,this.mapsize_y);
        
        this.hex_width = args.hex_width;
        this.hex_height = args.hex_height;
		
        this.hex_corner_offset = args.hex_corner_offset;
		this.map_pixel_height = this.hex_height * this.mapsize_y;
		this.container_width = this.hex_width * this.mapsize_y + (this.hex_height/2);
		this.container_height = this.hex_height * this.mapsize_y + (this.hex_height/2) + 2;

        this.markup = '';
        this.hex = function (x,y){
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
                return null;   
            }
        };
    }
    hexgrid.prototype.eachHex = function(func){
        for (var x=0; x < this.mapsize_x; x++) {
			for (var y=0; y < this.mapsize_y; y++) { 
                func.apply(this.hexes[x][y],[x,y]);          
			}
        }
    }


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
        						
                        ,hexgrid : grid
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


                map_markup +='<div id="'+ x + '-' + y +'" class="hex-wrap hex array_space_'+x+'_'+y+'" style="position:absolute;z-index:'+ hex_y +';left:' + hex_x + 'px;top:' + ( hex_y) + 'px;">';
                map_markup +='<div class="hex green">';						
                map_markup +='<span style="position:absolute;left:10px;top:5px;">'+x+','+y+'</span>';
                map_markup +='</div></div>';

                z_index--;
		    }
        }
        
    
        this.eachHex(function(x,y){
            this.set_hex_arc_data();
            this.set_traversal_data();
        });
        
       
        this.markup = map_markup;
        
    }

    var grid = new hexgrid({
         mapsize_x : 50
        ,mapsize_y : 50
        ,hex_width : 30
        ,hex_height : 26
        ,hex_corner_offset : 8
  
    });
    grid.generateHexes();
    grid.hex(3,6).blocksLos = true;
     grid.hex(1,6).blocksLos = true;
     grid.hex(2,6).blocksLos = true;
     grid.hex(2,4).blocksLos = true;
    
    $(function(){
        $('#map').html(grid.markup);
        console.log(grid);
        $('.container #map, .container')
            .width(grid.container_width)
            .height(grid.container_height)
		;
		$('#canvas')
			.attr('width', grid.container_width)
			.attr('height', grid.container_height)
		;
    });