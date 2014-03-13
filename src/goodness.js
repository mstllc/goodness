;(function($, window, document, undefined) {

  // Plugin name
  var pluginName = 'goodness';

  // This is the jQuery selector to get elements in a form to validate.
  // HTML form elements:
  // input - YES
  // input[type=submit] - NO
  // input[type=hidden] - NO
  // input[type=reset] - NO
  // textarea - YES
  // select - YES
  var validationElementSelector = 'input:not([type=submit]):not([type=hidden])' +
    ':not([type=reset]), textarea, select';

  // Default options
  var defaults = {
    inputContainerSelector: '.input-group',
    validationElementSelector: validationElementSelector,
    validateOnChange: true,
    emitEvents: true,
    defaultErrorMessage: 'You gotta fix this.'
  };

  // A few rules built in
  var rules = {
    'required': {
      reggie: /^(?!\s*$).+/,
      message: 'You HAVE to fill this one out.'
    },
    'email': {
      reggie: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Must be a valid MySpace email address.'
    }
  };

  // Plugin constructor
  var Goodness = function(element, options) {
    // Gonna wanna only call this on a form element.
    if(!$(element).is('form')) {
      $.error('goodness method should be called on a <form> element');
      return false;
    }

    // If a rules property was passed, pluck it out
    var newRules;
    if(options && options.rules) {
      newRules = options.rules;
      options.rules = undefined;
    }

    // Save the jazz
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this.rules = rules;
    this._defaults = defaults;
    this._name = pluginName;

    // These are the form elements to validate.
    this.$formControls = this.$element.find(this.options.validationElementSelector);

    // Add the rules property that was passed to the main rules object
    if(typeof newRules === 'object') {
      var self = this;
      $.each(newRules, function(ruleIdx, rule) {
        self.addRule(rule.name, rule);
      });
    }

    // Kick off
    this.init();

    // Event listeners
    this.listen();
  };

  Goodness.prototype.init = function() {

  };

  Goodness.prototype.listen = function() {
    // Listen to submit event for sure
    this.$element.on('submit', $.proxy(this._onFormSubmit, this));

    // Validate on change event if flagged
    if(this.options.validateOnChange) {
      this.$element.find('input').on('change', $.proxy(this._onInputChange, this));
    }
  };

  Goodness.prototype.isAllGood = function() {
    var self = this;
    var good = true;

    // Loop through all the form things we want to validate
    this.$formControls.each(function(elmIdx, elm) {
      var $elm = $(elm);
      // Check each element
      if(!self.goodOne($elm)) {
        good = false;
      }
    });

    return good;
  };

  Goodness.prototype.goodOne = function($elm) {
    var options = this.options;
    var good = true;

    // Cache container and get classes from it as array
    var $container = $elm.closest(options.inputContainerSelector);
    var classList = $container.attr('class').split(/\s+/);
    var err = false;

    // Loop through the classes of the container
    $.each(classList, function(classIdx, className) {
      // If this class is also a rule name, check against rule regex
      if(rules[className]) {
        var rule = rules[className];
        // Add specific rule error class or remove it
        if(!rule.reggie.test($elm.val())) {
          $container.addClass(className + '-error');
          err = true;
          good = false;
        } else {
          $container.removeClass(className + '-error');
        }
      }
    });
    // Add general error class if there were any errors at all or remove it
    if(err) {
      $container.removeClass('good').addClass('error');
    } else {
      $container.removeClass('error').addClass('good');
    }

    return good;

  };

  Goodness.prototype.refresh = function() {
    // Update list of elements to validate in this form
    this.$formControls = this.$element.find(this.options.validationElementSelector);

    // Re-validate
    return this.isAllGood();
  };

  Goodness.prototype.getRules = function() {
    // Get all the rules
    return rules;
  };

  Goodness.prototype.addRule = function(name, rule) {
    // Add a new rule
    if(name && (typeof name === 'string') && rule && (typeof rule === 'object')) {
      if(!rule.message)
        rule.message = defaults.defaultErrorMessage;
      if(!rule.reggie || !(rule.reggie instanceof RegExp)) {
        $.error('Must supply a rule RegEx.');
        return false;
      }
      if(!rules[name]) {
        rules[name] = rule;
      }
      return this;
    }
  };

  Goodness.prototype._onFormSubmit = function(e) {
    $(this).trigger('submit');
    if(this.isAllGood()) {
      return true;
    }
    return false;
  };

  Goodness.prototype._onInputChange = function(e) {
    // Validate the input that triggered the change
    this.goodOne($(e.currentTarget));
  };

  // Add plugin to jQuery chain
  $.fn[pluginName] = function(options) {
    if(this.length === 1) {
      if(!this.data('plugin_' + pluginName)) {
        var goodness = new Goodness(this, options);
        this.data('plugin_' + pluginName, goodness);
        return goodness;
      }
    } else {
      throw new Error('Goodness does not support multiple element selectors. Make sure your selector only returns a single element.');
    }
  };

}(jQuery, window, document));
