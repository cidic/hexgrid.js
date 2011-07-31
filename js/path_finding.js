function hex_distance(x1,y1,x2,y2) {
	dx = Math.abs(x2-x1);
	dy = Math.abs(y2-y1);
	return Math.round(Math.sqrt((dx*dx) + (dy*dy)));
}

function node_distance(node1,node2){
    return hex_distance(node1.x,node1.y,node2.x,node2.y);   
}
var currentPathID = 0;
function path(start_x, start_y, end_x, end_y) {
    
    
    // number to identify a path
    currentPathID++;
    // Check cases path is impossible from the start.
	if(start_x == end_x && start_y == end_y)
        alert('start and end are the same hex');
	if(grid.hex(start_x,start_y).impassible !== false) 
        alert('start hex not accessable');
	if(grid.hex(end_x,end_y).impassible !== false)
        alert('end hex not accessable');
    if(start_x > grid.mapsize_x || start_y > grid.mapsize_y || start_x < 0 || start_y < 0)
        alert('start hex falls outside grid bounds');    
    if(end_x > grid.mapsize_x || end_y > grid.mapsize_y || end_x < 0 || end_y < 0)
        alert('end hex falls outside grid bounds');
    
    var startNode = grid.hex(start_x,start_y),
        endNode = grid.hex(end_x,end_y),
        priorityQueue = new BinaryHeap(function(node){return node.f;});
    
    startNode.f = 0;
    startNode.g = 0;
    
    var currentNode = startNode;;
    
    while(currentNode.x != endNode.x && currentNode.y != endNode.y){
        
        // set pathID
        currentNode.pathID = currentPathID;
        // calculate values
        // currentNode.g should already be set
        currentNode.h = node_distance(currentNode, endNode);
        currentNode.f = currentNode.g + currentNode.h;
        
        var adj = currentNode.get_adjacent.filter(function(node) { return node.impassible !== false; });    
        
        _.each(adj, function(adjNode){
            if(adjNode.pathID != currentPathID){
                var d = node_distance(currentNode,adjNode);
                
                adjNode.g = currentNode.g + d;
                
                priorityQueue.push(adjNode);
            }
        });

        // get last node from priority queue
        currentNode = priorityQueue.pop();

        if(typeof currentNode == 'undefined'){
            return false;   
        }
    }
    console.log(priorityQueue);
    
    _.each(priorityQueue.content, function(hex) {
       hex.setColor('yellow'); 
    });
    
}