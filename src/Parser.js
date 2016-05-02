let self = null;

class Parser {
  constructor(file, cb) {

    this.cb = cb;
    self = this;

    var reader = new FileReader();
    var context = new(window.AudioContext || window.webkitAudioContext)();

    reader.onload = function() {
      context.decodeAudioData(reader.result, function(buffer) {
        self.preparePeaks(buffer);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  preparePeaks(buffer) {
    var offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);
    var source = offlineContext.createBufferSource();
    source.buffer = buffer;
    var filter = offlineContext.createBiquadFilter();
    filter.type = "bandpass";
    source.connect(filter);
    filter.connect(offlineContext.destination);
    source.start(0);
    offlineContext.startRendering();
    offlineContext.oncomplete = function(e) {
      self.process(e);
    };
  }

  process(e) {
    var filteredBuffer = e.renderedBuffer;
    //If you want to analyze both channels, use the other channel later
    var data = filteredBuffer.getChannelData(0);
    var peaks = this.getPeaks(data);

    // output.innerHTML = peaks;
    this.cb(peaks);
  }

  getPeaks(data) {
    var peaksArray = [];
    var length = data.length;
    var reviser = 0;
    var threshold = 0;
    var subdata = [];
    var c_max = 0;
      var c_min = 0;
      var data_start = 0, data_end = 0;
    var interval = 4 * 42100;
    for (var i = 0; i < length;) {
    //revise the local threshold
    	if (i >= reviser){
      	    data_start = Math.min(reviser, length - interval);
  	    data_end   = Math.min(reviser+interval, length);
      	    c_max = this.arrayMax(data, data_start, data_end);
  	    c_min = this.arrayMin(data, data_start, data_end);
      	threshold = c_min + (c_max-c_min) * 0.95;
        reviser += interval/2;
      }

      if (data[i] > threshold) {
        peaksArray.push(Math.round(i/42.1));
        // Skip forward ~ 1/10s to get past this peak.
        i += 4210;
      }
      i++;
    }
    return peaksArray;
  }

  countIntervalsBetweenNearbyPeaks(peaks) {
    var intervalCounts = [];
    peaks.forEach(function(peak, index) {
      for (var i = 0; i < 10; i++) {
        var interval = peaks[index + i] - peak;
        var foundInterval = intervalCounts.some(function(intervalCount) {
          if (intervalCount.interval === interval) return intervalCount.count++;
        });
        //Additional checks to avoid infinite loops in later processing
        if (!isNaN(interval) && interval !== 0 && !foundInterval) {
          intervalCounts.push({
            interval: interval,
            count: 1
          });
        }
      }
    });
    return intervalCounts;
  }

  groupNeighborsByTempo(intervalCounts) {
    var tempoCounts = [];
    intervalCounts.forEach(function(intervalCount) {
      //Convert an interval to tempo
      var theoreticalTempo = 60 / (intervalCount.interval / 44100);
      theoreticalTempo = Math.round(theoreticalTempo);
      if (theoreticalTempo === 0) {
        return;
      }
      // Adjust the tempo to fit within the 90-180 BPM range
      while (theoreticalTempo < 90) theoreticalTempo *= 2;
      while (theoreticalTempo > 180) theoreticalTempo /= 2;

      var foundTempo = tempoCounts.some(function(tempoCount) {
        if (tempoCount.tempo === theoreticalTempo) return tempoCount.count += intervalCount.count;
      });
      if (!foundTempo) {
        tempoCounts.push({
          tempo: theoreticalTempo,
          count: intervalCount.count
        });
      }
    });
    return tempoCounts;
  }

  // http://stackoverflow.com/questions/1669190/javascript-min-max-array-values
  arrayMin(arr, start, end) {
    var min = Infinity;
    while (start < end) {
      if (arr[start] < min) {
  	min = arr[start];
      }
        start++;
    }
    return min;
  }

  arrayMax(arr, start, end) {
    var max = -Infinity;
    while (start < end) {
      if (arr[start] > max) {
        max = arr[start];
      }
        start++;
    }
    return max;
  }

}

export default Parser
