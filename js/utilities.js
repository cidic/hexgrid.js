
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



function draw_fov(x1, y1, min, max, distance) {
   // min,max = radian values
    var distance = distance || 50;
     grid.draw(function(){
         
        this.fillStyle = "rgba(255, 50,50, .15)";
        this.strokeStyle = "rgba(255, 50,50, .8)";
        this.moveTo(x1,y1);
        this.beginPath();
        this.arc(x1,y1, distance ,max + (2*Math.PI), min + (2*Math.PI),true);
        this.lineTo(x1,y1);
        this.closePath();
	    this.fill();
        this.stroke();
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