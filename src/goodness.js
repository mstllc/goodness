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

  // Built-In rules
  var defaultRules = {
    'required': /^(?!\s*$).+/
  };

  // Default options
  var defaults = {
    inputContainerSelector: 'input, textarea, select',
    validationElementSelector: validationElementSelector,
    validateOnChange: false,
    emitEvents: false
  };

  // Plugin constructor
  var Goodness = function(element, options) {

    // Extend defaultRules
    if(options) {
      options.rules = $.extend({}, defaultRules, options.rules);
    } else {
      options = {
        rules: defaultRules
      };
    }

    // Save the jazz
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;

    // These are the form elements to validate.
    this.$formControls = this.$element.find(this.options.validationElementSelector);

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
      this.$formControls.on('change', $.proxy(this._onInputChange, this));
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

    if(good) {
      this.$element.removeClass('error').addClass('good');
    } else {
      this.$element.removeClass('good').addClass('error');
    }

    return good;
  };

  Goodness.prototype.goodOne = function($elm) {
    var self = this;
    var good = false;
    var hadRule = false;
    var hadError = false;

    // Cache container and get classes from it as array
    var $container = $elm.closest(self.options.inputContainerSelector);
    var classes = $container.attr('class');

    // If this element has no classes, how do we know what to validate?
    if(!classes)
      return true;

    // If there are classes, get them in array format
    var classList = $container.attr('class').split(/\s+/);

    // Loop through the classes of the container
    $.each(classList, function(classIdx, className) {
      // If this class is not 'required', and there is
      // a rule with the same name, do the tests.
      if(self.options.rules[className]) {
        var passedRule = -1;

        // See what kind of rule this is
        if(typeof self.options.rules[className] === 'function') {
          passedRule = self.options.rules[className]($elm.val(), $elm, self.$element);
        } else if(self.options.rules[className] instanceof RegExp) {
          passedRule = self.options.rules[className].test($elm.val());
        }

        // If passedRule is anything but 1/true or 0/false, remove both classes, otherwise add/remove based on value.
        if(passedRule === 1 || passedRule === true) {
          $container.addClass(className + '-good').removeClass(className + '-error');
          good = true;
        } else if(passedRule === 0 || passedRule === false) {
          $container.addClass(className + '-error').removeClass(className +'-good');
          good = false;
          hadError = true;
        } else {
          $container.removeClass(className + '-good').removeClass(className + '-error');
        }

        // Flag hadRule as true
        hadRule = true;

      }

    });

    // Add general error class if there were any errors at all or remove it,
    // Add general good class if there were no errors or remove it.
    if(hadError && hadRule) {
      $container.removeClass('good').addClass('error');
    } else if(good && hadRule) {
      $container.removeClass('error').addClass('good');
    } else {
      $container.removeClass('error').removeClass('good');
    }

    return good;

  };

  Goodness.prototype.refresh = function(validate) {
    // Update list of elements to validate in this form
    this.$formControls = this.$element.find(this.options.validationElementSelector);

    // Re-validate if validate is true
    if(validate) {
      return this.isAllGood();
    }

    return true;
  };

  Goodness.prototype.setRule = function(name, rule) {
    // Set or add a rule

  };

  Goodness.prototype.getTheGoodness = function() {
    var self = this;
    var data = {};
    this.$formControls.each(function(idx, elm) {
      var $elm = $(elm);
      var key = $elm.attr('name') || $elm.attr('id') || 'form-control-' + idx;
      var value = ($elm.is('[type=checkbox]')) ? $elm.is(':checked') : $elm.val();
      data[key] = value;
    });

    return data;
  };

  Goodness.prototype.serialize = Goodness.prototype.getTheGoods;

  Goodness.prototype._onFormSubmit = function(e) {
    if(this.isAllGood()) {
      // THIS WOULD LET THIS FORM GO THROUGH
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
      if(this.is('form')) {
        if(!this.data('plugin_' + pluginName)) {
          var goodness = new Goodness(this, options);
          this.data('plugin_' + pluginName, goodness);
          return goodness;
        }
      } else {
        throw new Error('Goodness should only be called on a form element.');
      }
    } else {
      throw new Error('Goodness does not support multiple element selectors. ' +
        'Make sure your selector only returns a single element.');
    }
  };

}(jQuery, window, document));
