
    var width = 20, height = 20;
    
    var grid = new hexgrid({
             mapsize_x : width
            ,mapsize_y : height
            ,hex_width : 30
            ,hex_height : 26
            ,hex_corner_offset : 8
            ,canvasId : 'canvas'
            ,containerId : 'map'
            ,blockingHexes : (function () {
                var array = []
                for (var x = width; x--;) for (var y = height; y--;)
                    if (Math.random() < 0.08) array.push({x:x, y:y});
                return array;
            })()
        });
        





	$(function(){
        grid.eachHex(function(x,y, hex){
                	 
			if(!!hex.blocksLos){ hex.setColor('blue'); }
        });
        
        
        var arr = grid.getRandomHexes();
        console.log('rnd');
        console.log(arr);
        _.each(arr, function(hex){
        
            hex.terrain = 'forest';
            hex.setColor('forest');
        });
        
        
        
        
        //los_tester();

	});



