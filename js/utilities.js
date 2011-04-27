function draw_line(line_x1, line_y1, line_x2, line_y2, color, width) {	
		//checks if line crosses hex
	var	color = color || 'red',
		width = width || 1;
	var canvas = document.getElementById('canvas');
	
	if (canvas.getContext){
	    var ctx = canvas.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(line_x1, line_y1);
		ctx.lineTo(line_x2, line_y2);
		ctx.strokeStyle = color;
		ctx.lineWidth = width;
		ctx.stroke();
		ctx.closePath();
	}
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


    
    function draw_arc(x1,y1,x2,y2,x3,y3) {
        var extended_line1 = get_extended_line_coord(x1,y1,x2,y2),
            extended_line2 = get_extended_line_coord(x1,y1,x3,y3);
        
        x2 = extended_line1.x;
        y2 = extended_line1.y;
        
        x3 = extended_line2.x;
        y3 = extended_line2.y;
        
        draw_triangle(x1,y1,x2,y2,x3,y3);
            
    }
    function draw_triangle(x1,y1,x2,y2,x3,y3) {
        
        var canvas = document.getElementById('canvas');
		if (canvas.getContext){
	        var ctx = canvas.getContext('2d');
	
        ctx.fillStyle = "rgba(200,100,100,0.1)";
        ctx.strokeStyle = "rgba(200,50,50,0.9)";
        ctx.globalAlpha = 1.0;
		ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x1, y1);
		ctx.closePath();
        ctx.stroke();
		ctx.fill();
    
	
    
		}
    }
function get_extended_line_coord(x1,y1,x2,y2) {
    var slope = (y2 - y1) / (x2 - x1),
	    yintercept = y1 - slope * x1,
        xr = (x2 > x1) ? con_width : 0 ,
        yr = slope * xr + yintercept;
        
        return {
            x: xr,
            y: yr
        };
}
function draw_extend_line(x1,y1,x2,y2, color) {
	//extends line to edge of canvas
	//draw_line(x1,y1,x2,y2, 'red', 5);
	var canvas = document.getElementById('canvas');
		if (canvas.getContext){
		    var ctx = canvas.getContext('2d');
	/*	ctx.fillStyle = 'black';
    
		ctx.beginPath();
		ctx.arc(x1,y1,5,0,Math.PI*2,true);
		ctx.closePath();
		ctx.fill();
*/
	
	
	}
		
		var x = x2 - x1,
			y = y2 - y1,
		
		distance = Math.sqrt(x * x + y * y),
		radian = Math.atan2(y, x),
		degree = radian * 180 / Math.PI, //confirmed correct
		slope = (y2 - y1) / (x2 - x1),
		yintercept = y1 - slope * x1,
		
		
		//convert back to cartesian coords
		_x = x1 + distance * Math.cos(radian),
		_y = y1 + distance * Math.sin(radian);		
		
		console.log('slope : '+slope);
		
        var xr;
        if(x2 > x1){
            xr = con_width;   
        }
        else {
            xr = 0;   
        }
        yr = slope * xr + yintercept;
         
        draw_line(x1,y1,xr,yr, color);

		

		
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
    function extend_line2(){
		
		
		// let A = <x_a, y_a> and B = <x_b, y_b> be your two points. The ray pointing from A to B is given by (1-t)A + tB = <(1-t)x_a + tx_b, (1-t)y_a + ty_b>
		// you have four edges to your square, y = y1, y=y2, x=x1 and x=x2. Solve for the value t which reaches your edge -- for example (1-t)x_a + tx_b = x, then t(x_b-x_a) = x - x_a or t = (x - x_a)/(x_b - x_a) -- now you have a formula for t
		// you want to calcuate out four values, t1 = (x1 - x_a)/(x_b-x_a), t2 = (x2-x_a)/(x_b-x_a), t3 = (y1 - y_a)/(y_b-y_a), t4 = (y2-y_a)/(y_b-y_a) -- the t that corresponds to the first time it hits a boundary line is the smallest non-negtive t. It is one of thouse four, once you have that your point is just ( (1-t)x_a + x_b, (1-t)y_a+y_b)

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
