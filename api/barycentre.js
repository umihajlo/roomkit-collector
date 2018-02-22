//
// Copyright (c) 2017 Cisco Systems
// Licensed under the MIT License 
//

/** 
 * Collects PeopleCount analystics from a collection of RoomKits
 */

 
// A series is an ordered collection of ticks and values
// tick are formatted as dates

// Computes the weighted average on the period (begin/end)
// for the time-series values (as a map of time / values)
// The algorithm considers the values are substains till next serie is registered
module.exports.computeBarycentre = function (series, from, to) {
    var computed = 0;
    var previousSerie = undefined;
    var begun = false;

    // throws an error if from is before the series begins
    for (var i = 0; i < series.length; i++) {
        var serie = series[i];
        if (serie[0] <= from) {
            // We've not started yet, let's skip to next serie
            previousSerie = serie;
            continue;
        }

        if (!begun) {
            previousSerie = [ from, previousSerie[1]];
            begun = true;
        }

        if (serie[0] >= to) {
            // we are done, compute till to
            computed += previousSerie[1] * (new Date(to).getTime() - new Date(previousSerie[0]).getTime());
            break;
        }

        // let's add the value of the period
        computed += previousSerie[1] * (new Date(serie[0]).getTime() - new Date(previousSerie[0]).getTime());
        previousSerie = serie;
    }

    return computed / (new Date(to).getTime() - new Date(from).getTime());
}