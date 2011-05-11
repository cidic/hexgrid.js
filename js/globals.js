

// globals
    var  mapsize_x = 10
	    ,mapsize_y = 10
	    ,mapHex = MultiDimensionalArray(mapsize_x,mapsize_y)
        ,hex_height = 26
    	,hex_width = 30
		,hex_corner_offset = 8
		,map_pixel_height = hex_height * mapsize_y
		,map_markup = ''
		,con_width = hex_width * mapsize_y + (hex_height/2)
		,con_height = hex_height * mapsize_y + (hex_height/2) + 2;
        
        
        $('.container #map, .container')
		    .width(con_width)
	    	.height(con_height)
		;
		$('#canvas')
			.attr('width', con_width)
			.attr('height', con_height)
		;