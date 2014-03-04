var RSSIController = (function() {

    var RSSIController = function(options) {
        this.options = options || {};

        if (this.options.element == undefined)
            throw new Error('RSSIController expects element');

        if (this.options.device == undefined)
            throw new Error('RSSIController expects device');

        // Grab the element we're going to manipulate
        this.element = $('#' + this.options.element);

        // Set some defaults
        this.min = options.min || -90;
        this.threshold = options.threshold || -70;
        this.max = options.max || -25;
        this.current = 0;

        // Initialize the contents of the element
        this._initialize();
    }

    RSSIController.prototype._initialize = function() {
        // Create and append the range slider
        this.slider = $('<div>').addClass('slider');
        this.element.append(this.slider);

        this.slider.slider({
            min: this.min,
            max: this.max,
            values: [this.max, this.threshold, this.min],
            orientation: 'horizontal',
            range: 'max',
            animate: 'true',
            slide: this._updateStops.bind(this)
        });

        // Collect and store references to our readout elements
        this.readouts = {
            min: $('#' + this.options.element + ' .min-range'),
            max: $('#' + this.options.element + ' .max-range'),
            threshold: $('#' + this.options.element + ' .threshold-range'),
            current: $('#' + this.options.element + ' .current-range'),
        };

        // Add an indicator to the slider
        this.indicator = $('<div>').addClass('indicator');
        this.slider.append(this.indicator);

        // Create the listener
        this._initListener();

        // Set the initial values
        this._updateStops();
    };

    RSSIController.prototype._initListener = function() {
        // Create the listener
        this.broadcaster = new DistanceBroadcaster({
            endpoint: constants.SOCKET_URL,
            channel: '/rssi',
            address: this.options.device,
            scope: this
        });

        // Listen for change events on the broadcaster
        this.broadcaster.bind('changed', function(value) {
            this.current = value;
            this._updateReadouts();
        });

        // Create the ranges we care about
        this.arrivedRange = this.broadcaster.addRange({
            min: this.min,
            max: this.threshold,
            entered: function() {
                // Unlock the car
                Vehicle.unlock();

                // Let the HMI know where we are
                HMI.send(HMI.LetProximity('name', 'arrived'));
            }
        });

        this.approachRange = this.broadcaster.addRange({
            min: this.threshold,
            max: this.max,
            entered: function() {
                // Lock the car
                Vehicle.lock();

                // Let the HMI know where we are
                HMI.send(HMI.LetProximity('name', 'close'));
            }
        });

        this.nowhereRange = this.broadcaster.addRange({
            min: this.min,
            max: this.max,
            exited: function() {
                // Let the HMI know where we are
                HMI.send(HMI.LetProximity('name', 'none'));
            }
        });

    };

    RSSIController.prototype._updateStops = function() {
        var values = this.slider.slider('option', 'values'),
            stops = values.sort(function(a, b) {
                return a - b;
            });

        this.min = stops[0];
        this.threshold = stops[1];
        this.max = stops[2];

        this.approachRange.min = this.min;
        this.approachRange.max = this.threshold;

        this.arrivedRange.min = this.threshold;
        this.arrivedRange.max = this.max;
    }

    RSSIController.prototype._updateReadouts = function() {
        this.readouts.current.html(this.current);
        this.readouts.min.html(this.min);
        this.readouts.max.html(this.max);
        this.readouts.threshold.html(this.threshold);

        this.indicator.css('margin-left', this.map(this.current) + '%');
    };

    RSSIController.prototype.map = function(value) {
        return RSSIController.map(value, this.min, this.max, 0, 100);
    };

    RSSIController.map = function(value, fromMin, fromMax, toMin, toMax) {
        // (X-A)/(B-A) * (D-C) + C
        return (value - fromMin) / (fromMax - fromMin) * (toMax - toMin) + toMin
    }

    return RSSIController;

})();