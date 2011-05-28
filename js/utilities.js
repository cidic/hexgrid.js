
/*--- draw tools ---*/
function draw_line(x1, y1, x2, y2, color, width) {    
        //checks if line crosses hex
        
        
        
    var color = color || 'red',
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

function draw_fov2(x1, y1, min, max, distance, color1, color2) {
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
        
       // this.strokeStyle = "rgba(255, 50,50, .8)";
       // 
        
        //this.strokeStyle = "rgba(255, 0,0, .8)";
        this.moveTo(((distance) * Math.cos(max)) + x1,((distance) * Math.sin(max)) + y1);
        this.arc(x1,y1, distance ,max + (2*Math.PI), min + (2*Math.PI),true);
        this.arc(x1,y1, distance+120, min +(2*Math.PI),max + (2*Math.PI), false );
        //this.lineTo(((distance) * Math.cos(max)) + x1,((distance) * Math.sin(max)) + y1);
       // this.lineTo(((distance+20) * Math.cos(max)) + x1,((distance+20) * Math.sin(max)) + y1);
       // this.lineTo(((distance+20) * Math.cos(min)) + x1,((distance+20) * Math.sin(min)) + y1);
        //this.lineTo(((distance) * Math.cos(min)) + x1,((distance) * Math.sin(min)) + y1);
      //  this.lineTo(x1,y1);
        
       // this.strokeStyle = "rgba(255, 255 ,0, .8)";  
        //this.arc(x1,y1, distance ,max + (2*Math.PI), min + (2*Math.PI),true);
        
       //this.strokeStyle = "rgba(0, 0 ,0, .8)";
      //  this.lineTo((distance * Math.cos(min)) + x1,(distance * Math.sin(min)) + y1);
        
        
        this.closePath();
        this.fill();
        this.stroke();
       
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
            
            var minTextWidth = this.measureText(min.toFixed(1) + ' ['+note+'] min').width;
            var maxTextWidth = this.measureText(max.toFixed(1) + ' ['+note+'] max').width;
            
            this.fillRect(minX-2, minLblY -2 , minTextWidth+4, 12);
            draw_line(minX,minY,minX,minLblY, 'rgba(255,255,255,.3)');
            
            
            this.fillRect(maxX-2,maxLblY -2, maxTextWidth+4, 12);
            draw_line(maxX,maxY,maxX,maxLblY, 'rgba(255,255,255,.3)');
            
            this.fillStyle     = '#000';
            
            this.fillText(min.toFixed(1)+' ['+note+'] min', minX, minLblY);
            this.fillText(max.toFixed(1)+' ['+note+'] max', maxX,maxLblY);
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
