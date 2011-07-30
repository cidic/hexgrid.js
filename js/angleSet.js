// angleSet.js by Joseph Crowe <joseph.crowe@live.co.uk>
// Requires jQuery.
function angleSet (
/*
    {min:min0, max:max0}, {min:min1, max:max1} ... | arrayOfIntervals |
    edge0, edge1, edge2, ... edgeN | arrayOfEdges
*/
) {
    // A set of angles composed of a finite number of segments which are either full or empty. The
    // angles in full segments are included in the set, and the angles in empty segments are not.
    // The segments are encoded as a series of distinct edges numbered 0 to N-1, where segment X
    // spans from edge X to edge (X+1)%N. When there are no edges, a single segment, -1, spans all
    // angles. When inverted == false, all all even-numbered edges are full and all odd-numbered
    // edges are empty; when inverted == true, the opposite is true. Edges should be given as angles
    // in radians a normalised form such that, for each edge E, -PI < E <= PI.

    // The edges given as arguments to this constructor must be distinct and in ascending order
    // except for the final edge which may be greater than the first edge to indicate that the final
    // segment straddles the angle PI.

    // new angleSet()
    //     is an empty set, containing no angle.

    // new angleSet(E)
    //     is a full set, containing all angles, where E is any valid edge.

    // new angleSet(A, B)
    //     contains all angles between A and B, sweeping in the positive direction.

    // new angleSet(B, A)
    //     is the inverse of new angleSet(A, B).

    // new angleSet({min:A, max:B}, {min:C, max:D}, ... )
    //     is equivalent to new angleSet() followed by addInterval(A, B); addInterval(C, D); ...

    // new angleSet([A, B, C, ... ])
    //     is equivalent to new angleSet(A, B, C, ... ), where A, B, C, ... are edges or intervals.

    var args = (arguments[0] instanceof Array) ? arguments[0] : arguments;
    args = Array.prototype.slice.call(args); // Convert to a new Array.

    this.inverted = false;

    if (typeof args[0] == "object") {
        // Construct from a set of intervals.
        this.edges = [];
        args.forEach($.proxy(function (interval) {
            this.addInterval(interval.min, interval.max);
        }, this));
    } else {
        // Construct from a set of edges.
        this.edges = args;
        if (this.edges[this.edges.length - 1] < this.edges[0]) {
            // If the last edge is less than the first, the subset being selected is the inverse of
            // that where the last edge is moved to the beginning.
            this.edges.unshift(this.edges.pop());
            this.invert();
        }
        if (this.edges.length & 1) {
            // If there is an odd number of edges, the subset being selected is the inverse of that
            // where the first edges is removed.
            this.edges.shift();
            this.invert();
        }
    }
}

angleSet.TOLERANCE = 0.01;
// The maximum distance a given angle can be from the edge of a full interval for that angle to be
// considered a member of the interval.

angleSet.prototype.copy = function () {
    // Return an independent copy of this angleSet.
    var copy = new angleSet(this.edges);
    copy.inverted = this.inverted;
    return copy;
};

angleSet.prototype.invert = function () {
    // Inverts this angleSet such that all angles not included are now included, and vice versa.
    this.inverted = !this.inverted;
};

angleSet.prototype.isFull = function () {
    // Returns true if all angles are included in this set, or false otherwise.
    return (!this.edges.length && this.inverted);
}

angleSet.prototype.isEmpty = function () {
    // Returns true if no angles are included in this set, or false otherwise.
    return !(this.edges.length || this.inverted);
}

angleSet.prototype.makeFull = function () {
    // Modifies this angle set so that every angle is included.
    this.edges = [];
    this.inverted = true;
}

angleSet.prototype.makeEmpty = function () {
    // Modifies this angle set so that no angle is included.
    this.edges = [];
    this.inverted = false;
}

angleSet.prototype.findSegment = function (angle) {
    // Returns the segment number in which the given angle lies, using a binary search.
    for (var start = 0, end = this.edges.length - 1, middle;;) {
        if (end < start) return (this.edges.length - 1); // Angle lies in last segment
        middle = (start + end) >> 1; // floor((start + end) / 2)
        var offset = angle - this.edges[middle];
        if (offset < -angleSet.TOLERANCE) {
            end = middle - 1; // Sought angle lies in a lower segment.
        } else if (offset > angleSet.TOLERANCE) {
            if ((middle == this.edges.length - 1) ||
                (angle < this.edges[middle + 1] - angleSet.TOLERANCE))
               return middle; // Sought angle lies in this segment.
            else start = middle + 1 // Sought angle may lie in a higher segment.
        } else {
            // Sought angle lies on the boundary between two segments; choose the one that is full.
            return this.segmentIsFull(middle) ? middle : ((middle || this.edges.length) - 1)
        }
    }
};

angleSet.prototype.segmentIsFull = function (segment) {
    // Returns true if the segment with the given number is full, or false if it is empty.
    return ((segment & 1) == this.inverted) // (segment is odd) XNOR this.inverted
};

angleSet.prototype.getInterval = function (segment) {
    // Returns an interval in the form {min:A, max:B} giving the ranges of angles contained in the
    // segment with the given number, where B <= A implies that the interval straddles the angle PI,
    // and A = B implies a full interval.
    if (segment == -1) return {min:0, max:0};
    return {min:this.edges[segment], max:this.edges[(segment + 1) % this.edges.length]};
};

angleSet.prototype.eachInterval = function (handler) {
    // Execute the given function for each full segment in the set, passing arguments (min, max)
    // giving the interval of angles in that segment (see getInterval). If the given function
    // returns a value that is not undefined, iteration will stop and that value will be returned.
    if (this.isFull()) return handler(0, 0);
    for (var n = this.inverted ? 1 : 0; n < this.edges.length; n += 2) {
        var interval = this.getInterval(n);
        var result = handler(interval.min, interval.max);
        if (result !== void 0) return result;
    }
}

angleSet.prototype.getIntervals = function () {
    // Returns an Array containing all full segments in this set, each in the form {min:A, max:B},
    // as described in getInterval.
    var intervals = [];
    this.eachInterval(function (min, max) { intervals.push({min:min, max:max}); });
    return intervals;
};

angleSet.prototype.containsAngle = function (angle) {
    // Returns true if the given angle is contained in this set, or otherwise returns false.
    return this.segmentIsFull(this.findSegment(angle))
};

angleSet.prototype.containsInterval_internal = function (min, max, segment) {
    // Returns the same value as containsInterval, on the conditions that:
    // - the interval touches the given full segment at both ends; and
    // - this set and the interval are both non-full.
    if (segment == this.edges.length - 1) {
        segment = this.getInterval(segment);
        return ((min >= segment.max) && (max <= segment.min)) == (max < min);
    } else return (max > min);
}

angleSet.prototype.containsInterval = function (min, max) {
    // Returns true if every angle between the given min and max values is included in the set, or
    // otherwise returns false.
    var minSegment = this.findSegment(min);
    return (this.segmentIsFull(minSegment) && (this.findSegment(max) == minSegment))
        && ((minSegment == -1)
            || ((min != max) && this.containsInterval_internal(min, max, minSegment)));
};

angleSet.prototype.containsSet = function (set) {
    // Returns true if every angle included in the given set is also included in this set; otherwise
    // returns false. This function will return true if the two sets are equivalent.
    return !set.eachInterval(function (min, max) {
        if (!this.containsInterval(min, max)) return true;
    });
};

angleSet.prototype.addInterval = function (min, max) {
    // Add the given angle interval to this set such that all angles between min and max are
    // included in this set.
    
    if (this.isFull()) return;
    
    var offset = min - max;
    if ((0 <= offset) && (offset <= angleSet.TOLERANCE)) return this.makeFull(); // Full interval.
    
    // Determine where new section of edges is to be inserted.
    var minSegment = this.findSegment(min), maxSegment = this.findSegment(max);
    if (this.segmentIsFull(minSegment)) {
        if ((minSegment == maxSegment) && !this.containsInterval_internal(min, max, minSegment))
            return this.makeFull(); // A full set is formed.
        min = this.edges[minSegment];
    }
    else minSegment = (min < this.edges[minSegment]) ? 0 : (minSegment + 1);
    if (this.segmentIsFull(maxSegment)) {
        maxSegment = (maxSegment + 1) % this.edges.length
        max = this.edges[maxSegment]
    } else if (max < this.edges[maxSegment]) maxSegment = -1;
    
    // Splice in new section of edges.
    if (max < min) {
        this.edges.splice(minSegment, this.edges.length, min);
        this.edges.splice(0, maxSegment + 1, max);
        this.inverted = true;
    } else this.edges.splice(minSegment, maxSegment - minSegment + 1, min, max);
};

angleSet.prototype.addSet = function (set) {
    // Add the given angleSet to this set such that all angles in that set are included in this set.
    set.eachInterval($.proxy(this.addInterval, this));
};