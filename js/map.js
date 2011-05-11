
    
    
    function hexgrid(args){
        
        var args = args || {};
        this.mapsize_x = args.mapsize_x;
        this.mapsize_y = args.mapsize_y;
        this.hexes = MultiDimensionalArray(mapsize_x,mapsize_y);
        
        this.hex_width = args.hex_width;
        this.hex_height = args.hex_height;
		
        this.hex_corner_offset = args.hex_corner_offset;
		this.map_pixel_height = hex_height * mapsize_y;
		this.map_markup = '';
		this.container_width = hex_width * mapsize_y + (hex_height/2)
		this.container_height = hex_height * mapsize_y + (hex_height/2) + 2;
        
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
        }
    }
    hexgrid.prototype.eachHex = function(func){
        for (x=0; x < this.mapsize_x; x++) {
			for (y=0; y < this.mapsize_y; y++) {                
                func(this.hexes[x][y]);                
			}
        }
    }


    hexgrid.prototype.generateHexes = function(){
        this.eachHex(function(){
            var hex_x = (x * (this.hex_width - this.hex_corner_offset)),
			    hex_y = ( (x%2 === 0)? (y * this.hex_height) : (y * this.hex_height) + (this.hex_height/2) );
	 
        });
    }

    var args = {
      hex_width :30
     ,hex_height : 28
     ,hex_corner_offset : 8
    };
    var grid = new hexgrid(args);
    grid.generateHexes();


	function render_map() {
		var	z_index = mapsize_x;
			
	
		for (var x=0; x < mapsize_x; x++) {
			for (var y=0; y < mapsize_y; y++) {
			
				var hex_x = (x * (hex_width - hex_corner_offset)),
					hex_y = ( (x%2 === 0)? (y * hex_height) : (y * hex_height) + (hex_height/2) );
				
                    
                  
                 var hex_args = {
                        
                        // args {x,y,corners,arc_data,blocks_los,color,edge, center_x, center_y}
                         x : x
                        ,y : y
                        ,center_x : (hex_x + (hex_width/2))
						,center_y : (hex_y + (hex_height/2))
								
                        ,hexgrid : grid
                        ,color : 'green'
                        ,corners : [
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
        				]
                        ,arc_data : MultiDimensionalArray(mapsize_x,mapsize_y)
                        ,edge : function(){
                        
                            
                			if((0 < x && x < mapsize_x) && (0 < y && y < mapsize_y)){
            					return null;
            				}
            				else if(x == 0 && y == 0){
            					return 'top_left';
            				}
            				else if(x == 0 && y == mapsize_y){
            					return 'bottom_left';
            				}
            				else if(x == mapsize_x && y == 0){
            					return 'top_right';
            				}
            				else if(x == mapsize_x && y == mapsize_y){
            					return 'bottom_right';
            				}
            				else if(y == 0) {
            					return 'top';
            				}
            				else if(x == mapsize_x){
            					return 'right';
            				}
            				else if(y == mapsize_y) {
            					return 'bottom';
            				}
            				else if(x == 0){
            					return 'left';
            				}
                                    
                        }
                    }
				mapHex[x][y] = new hex(hex_args);
				
				
					
				
				map_markup +='<div id="'+ x + '-' + y +'" class="hex-wrap hex array_space_'+x+'_'+y+'" style="position:absolute;z-index:'+ hex_y +';left:' + hex_x + 'px;top:' + ( hex_y) + 'px;">';
				map_markup +='<div class="hex green">';						
				map_markup +='<span style="position:absolute;left:10px;top:5px;">'+x+','+y+'</span>';
				map_markup +='</div></div>';
			}
			z_index--;
		}
		
		
		document.getElementById('map').innerHTML += map_markup;
		//generate_arc_data();
        
            for (x=0; x < mapsize_x; x++) {
			    for (y=0; y < mapsize_y; y++) {
                    mapHex[x][y].set_hex_data();
                    mapHex[x][y].set_traversal_data();
  
			    }
            }
	}
    
    

