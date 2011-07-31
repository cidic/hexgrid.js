function node_distance(node1,node2){
    var x1 = node1.center.x,
        y1 = node1.center.y,
        x2 = node2.center.x,
        y2 = node2.center.y,
        dx = Math.abs(x2-x1),
        dy = Math.abs(y2-y1);
        
	return Math.round(Math.sqrt((dx*dx) + (dy*dy)));
}
var currentPathID = 0;
function node_distance(node1,node2){
    var x1 = node1.center.x,
        y1 = node1.center.y,
        x2 = node2.center.x,
        y2 = node2.center.y,
        dx = Math.abs(x2-x1),
        dy = Math.abs(y2-y1);
        
    return Math.round(Math.sqrt((dx*dx) + (dy*dy)));
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
    
    var currentNode = startNode;
    
    while(currentNode != endNode){
        
        
        currentNode.pathID = currentPathID; // Mark this node as being in the closed set.
        
        var adj = currentNode.get_adjacent.filter(function(node) {
             // Retrieve the neighbours of this node which are passable not in the closed set.
            return !node.impassible && (node.pathID != currentPathID);
        });    
        
        _.each(adj, function(adjNode){
            var d = node_distance(currentNode,adjNode);
            console.log(d);
            var adjNode_g = currentNode.g + d;
            
            if (adjNode.pathID == -currentPathID) {
                // adjNode exists in the open set.
                if (adjNode.g < adjNode_g) return; // The new path is not better.
                priorityQueue.remove(adjNode);
            }
            else adjNode.pathID = -currentPathID; // Mark as being in the open set.
            
            adjNode.g = adjNode_g;
            var adjNode_h = node_distance(adjNode, endNode)
            adjNode.f = adjNode_g + adjNode_h;
            adjNode.parent = currentNode;
            priorityQueue.push(adjNode);
        
        });

        // get last node from priority queue
        currentNode = priorityQueue.pop();
        
        /*
        if(priorityQueue.length === 0){
            console.log('priorityQueue.length === 0');
            return false;
        }

        */
        if(typeof currentNode == 'undefined'){
            console.log('typeof currentNode == undefined');
            return false;   
        }
    }
    console.log(priorityQueue);
        // The actual path must be constructed using the parent pointers.
        var path = [currentNode];
        while (currentNode = currentNode.parent) path.unshift(currentNode);        
        
    _.each(path, function(hex) {
       hex.setColor('yellow'); 
    });
    
}