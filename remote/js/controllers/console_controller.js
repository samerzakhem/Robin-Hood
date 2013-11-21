(function($) {
    $.fn.tilda = function(eval, options) {
        if ($('body').data('tilda')) {
            return $('body').data('tilda').terminal;
        }
        this.addClass('tilda');
        options = options || {};
        eval = eval || function(command, term) {
            term.echo("you don't set eval for tilda");
        };
        var settings = {
            prompt: 'tilda> ',
            name: 'tilda',
            height: 100,
            enabled: false,
            greetings: 'HMI Console',
            keypress: function(e) {
                if (e.which == 96) {
                    return false;
                }
            }
        };
        if (options) {
            $.extend(settings, options);
        }
        this.append('<div class="td"></div>');
        var self = this;
        self.terminal = this.find('.td').terminal(eval, settings);
        var focus = false;
        $(document.documentElement).keypress(function(e) {
            if (e.which == 96) {
                self.slideToggle('fast');
                self.terminal.focus(focus = !focus);
                self.terminal.attr({
                    scrollTop: self.terminal.attr("scrollHeight")
                });
            }
        });
        $('body').data('tilda', this);
        this.hide();
        return self;
    };
})(jQuery);

var ConsoleController = (function() {

	var ConsoleController = function(options) {
		this.options 	= options;

		$('#' + this.options.element).tilda( this.onCommand.bind(this), {
            prompt:     '> ',
            height:     200
        } );
	};

	ConsoleController.prototype.onCommand = function(command, terminal) {
        if(/^run/.test(command)) {
            var opts    = command.split(' '),
                run     = opts.shift(),
                method  = opts.shift(),
                parts   = method.split('.');

            // Figure out the namespace for the command
            for (var i = 0, len = parts.length, obj = HMI; i < len; ++i) {
                obj = obj[parts[i]];
            }

            // Convert numbers back to numbers and booleans back to booleans
            opts = $.map(opts, function(val, i) {
                try {
                    return eval(val);
                } catch(SyntaxError) { return val; }
            });

            command = obj.apply(this, opts);
        } 

        HMI.send( command );
	};

	return ConsoleController;

})();