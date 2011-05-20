
/*--- draw tools ---*/
function draw_line(x1, y1, x2, y2, color, width) {    
    	//checks if line crosses hex
        
        
        
	var	color = color || 'red',
		width = width || 1;

	    grid.draw(function(){            
    		this.beginPath();
    		this.moveTo(x1, y1);
    		this.lineTo(x2, y2);
    		this.strokeStyle = color;
    		this.lineWidth = width;
    		this.stroke();
    		this.closePath();
	    });

}



function draw_fov(x1, y1, min, max, distance, color1, color2, drawValues,note) {
   // min,max = radian values
    var distance = distance || 50,
        color1 = color1 || "rgba(255, 50,50, .15)",
        color2 = color2 || "rgba(255, 50,50, .8)",
        drawValues = drawValues || false;
     grid.draw(function(){
         
        this.fillStyle = color1;
        this.strokeStyle = color2;
        this.moveTo(x1,y1);
        this.beginPath();
        this.arc(x1,y1, distance ,max + (2*Math.PI), min + (2*Math.PI),true);
        this.lineTo(x1,y1);
        this.closePath();
	    this.fill();
        this.stroke();
        
        if(drawValues){ 
            var lblDistance = distance;
            draw_radian_line(x1,y1,min,lblDistance, "rgba(0,0,0, .5)");
            draw_radian_line(x1,y1,max,lblDistance, "rgba(0,0,0, .4)");
            
            var minX = (lblDistance * Math.cos(min)) + x1,
                minY = (lblDistance * Math.sin(min)) + y1,
                maxX = (lblDistance * Math.cos(max)) + x1,
                maxY = (lblDistance * Math.sin(max)) + y1,
                minLblY = grid.container_height - (14*(Number(note)+2))+2,
                maxLblY =  14+(14*Number(note)+1);
                
                
            this.fillStyle    = '#000';
            this.font         = '8px sans-serif';
            this.textBaseline = 'top';
            this.fillStyle     = '#fff';
            
            var minTextWidth = this.measureText(min.toFixed(1) + ' ['+note+']').width;
            var maxTextWidth = this.measureText(max.toFixed(1) + ' ['+note+']').width;
            
            this.fillRect(minX-2, minLblY -2 , minTextWidth+4, 12);
            draw_line(minX,minY,minX,minLblY, 'rgba(255,255,255,.3)');
            
            
            this.fillRect(maxX-2,maxLblY -2, maxTextWidth+4, 12);
            draw_line(maxX,maxY,maxX,maxLblY, 'rgba(255,255,255,.3)');
            
            this.fillStyle     = '#000';
            
            this.fillText(min.toFixed(1)+' ['+note+']', minX, minLblY);
            this.fillText(max.toFixed(1)+' ['+note+']', maxX,maxLblY);
        }
     });
}
function draw_radian_line(x, y, radian, distance, color, width) {
    
var _x = (distance * Math.cos(radian)) + x,
    _y = (distance * Math.sin(radian)) + y;
    
        draw_line(x,y,_x,_y,color,width);
                    
}
   
    function draw_triangle(x1,y1,x2,y2,x3,y3, color1, color2) {
        
        var colors = ['255,0,0','0,255,0','0,0,255','0,130,130','255,200,0'];
        
        function c() {
                var index = Math.floor(Math.random() * colors.length);
                return colors[index];
        }
        var rCol =  c();
        
        
        var canvas = document.getElementById('canvas');
		if (canvas.getContext){
	        var ctx = canvas.getContext('2d'),
             color1 = color1 || rCol+',0.1',
             color2 = color2 || rCol+',0.9';
	
            grid.draw(function(){
                this.fillStyle = "rgba("+color1+")";
                this.strokeStyle = "rgba("+color2+")";
                this.globalAlpha = 1.0;
                this.beginPath();
                this.moveTo(x1, y1);
                this.lineTo(x2, y2);
                this.lineTo(x3, y3);
                this.lineTo(x1, y1);
                this.closePath();
                this.stroke();
                this.fill();
            });
		}
    }
function get_extended_line_coord(x1,y1,x2,y2) {
    var slope = (y2 - y1) / (x2 - x1),
	    yintercept = y1 - slope * x1,
        xr = (x2 > x1) ? grid.container_width : 0 ,
        yr = slope * xr + yintercept;
        
        return {
            x: xr,
            y: yr
        };
}

function distance_test(hex_a,hex_b){
    var dist,
		// must be hex space coords
		A_x = hex_a[0],
		A_y = hex_a[1],
		B_x = hex_b[0],
		B_y = hex_b[1];

	// calculate distance using hexcoords as per previous algorithm		
	
	dx = B_x - A_x;
	dy = B_y - A_y;

	if (Math.sin(dx) == Math.sin(dy)) {
		
		dist = Math.max(Math.abs(dx), Math.abs(dy));
	}
	else {
		dist = Math.abs(dx) + Math.abs(dy);
	}
	dist2 = (Math.abs(dx) + Math.abs(dy) + Math.abs(dx-dy)) / 2;			
	console.log('dist_test : '+dist);
	console.log('dist_test2 : '+dist2);
}

function math_stuff(){
    var x1 = 75,
		y1 = 75,
		
		x2 = 120,
		y2 = 180,
	
		x = x2 - x1,
		y = y2 - y1,
		
		distance = Math.sqrt(x * x + y * y),
		radian = Math.atan2(y, x),
		degree = radian * 180 / Math.PI, //confirmed correct
		//slope = (x1 - x2) / (y1 - y2),	
		slope = (y2 - y1) / (x2 - x1),
		yintercept = y1 - slope * x1,
		
		//convert back to cartesian coords
		_x = x1 + distance * Math.cos(radian),
		_y = y1 + distance * Math.sin(radian);



		var counterclockwise = false,
		 	start_angle = 1.5 * Math.PI,
		 	canvas = document.getElementById('canvas');

		if (canvas.getContext){
		    var ctx = canvas.getContext('2d');
		//	ctx.translate(0, canvas.height);
		 //	ctx.scale(1, -1);
		
			// ctx.beginPath();
			// 			ctx.arc(x1, y1, 60, start_angle,start_angle + degree,counterclockwise);
			// 			ctx.lineWidth = 5;
			// 			ctx.strokeStyle = "black";
			// 			ctx.stroke();
			// 			ctx.closePath();	
			// 		
			draw_line(x1, y1, x2, y2, 'black');
			draw_line(x1, y1, _x, _y, 'blue');
			
			var x3 = 300,
				y3 = slope * x3 + yintercept;
				
			draw_line(x1, y1, x3, y3, 'red');
			
		}
				console.log('distance : '+ distance);
				console.log('radian : '+ radian);
				console.log('degree : '+ degree);
				console.log('slope : '+ slope);
				console.log('yintercept : '+ yintercept);

				console.log('_x : '+ _x);
				console.log('_y : '+ _y);

	}
    $(function() {
    $('#btn_array_space').bind('click', function(e) {
		e.preventDefault();
		var input = $('#array_space').val(),
			input_data = input.split(','),
			x = Number(input_data[0]),
			y = Number(input_data[1]),
			result = array_to_hex([x,y]).join(',');
			
			console.log('result : '+result);
			$('#info').html(result);					
		
	});
	$('#btn_hex_space').bind('click', function(e) {
		e.preventDefault();
		var input = $('#hex_space').val(),
			input_data = input.split(','),
			x = Number(input_data[0]),
			y = Number(input_data[1]),
			
			result = hex_to_array([x,y]).join(',');
			
			console.log('result : '+result);
			$('#info').html(result);					
		
	});
	
	$('.hex-wrap').live('click', function(){
		$(this).children().toggleClass('blue');//.attr('class', 'hex blue');
	});
	
	$('#btn_toggle_canvas').click(function(){
		$('#canvas').toggle();
		return false;
	});

});