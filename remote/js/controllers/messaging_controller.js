var MessagingController = (function() {

	var MessagingController = function(options) {
		this.options = options;

		if(this.options.element === undefined)
			throw new Error('Messaging Controller expects element');

		this.element 	= $('#' + this.options.element);
		this.fields		= {
			from: 			this.element.find('#msg-from'),
			source: 		this.element.find('#msg-source'),
			priority: 	this.element.find('#msg-priority'),
			body: 			this.element.find('#msg-text')
		};

		// Add some event listeners
		this.sendButton 	= this.element.find('#msg-send').click(this.onSend.bind(this));
		this.progress 		= this.element.find('#msg-progress');

		this.element.find('form').submit(function(e) {
			e.preventDefault();
		});
		
		// Hide the progress bar by default
		this.progress.hide()
		
	}

	MessagingController.prototype.onSend = function(e) {
		// e.preventDefault();

		Messaging.sendMessage( 
			this.get('from'), 
			this.get('source'), 
			this.get('priority'), 
			this.get('body') );

		// this.resetForm();
		this.progress.show()
		
		setTimeout(function() {
			this.progress.hide();
		}.bind(this), 1000);
	};

	MessagingController.prototype.get = function(name) {
		return this.fields[name].val();
	};

	MessagingController.prototype.resetForm = function() {
		this.fields.from.val('');
		this.fields.source.prop('selectedIndex', 0);
		this.fields.priority.prop('selectedIndex', 0);
		this.fields.body.val('');
	};

	return MessagingController;

})();
