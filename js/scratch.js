var range1 = {
    min: 4,
    max: 9
};

var range2 = {
    min: 1,
    max: 5
};

var range3 = {
    min: 11,
    max: 13
}

var arr = [range1, range2, range3];


function mergeRanges(ranges) {
    function overlaps (range1, range2) {
        // returns whether or not two ranges overlap
        return (range1.max >= range2.min) && (range1.min <= range2.max);
    }
    function merge (range1, range2) {
        // merges two ranges into one range
        return {min:Math.min(range1.min, range2.min), max:Math.max(range1.max, range2.max)};
    }
    // make a copy of ranges and sort by min
    ranges = ranges.slice().sort(function (a, b) { return a.min - b.min; });
    
    // fold each range in from the left, merging with the last value if they overlap
    return ranges.reduce(function (list, next) {
        var last = list[list.length - 1];
        if (overlaps(last, next)) list.splice(-1, 1, merge(last, next));
        else list.push(next);
        return list;
    }, ranges.splice(0, 1));
}


var result = mergeRanges(arr);
console.log(result);