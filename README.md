# Goodness
---

Light form validation plugin for jQuery.  Goodness only ships with a `required` rule, otherwise you write the validation rules you need.  There is no included feedback markup or error styles.  The plugin validates form fields based on rules you write and set as class names on the input field (or field container) and adds or removes classes based on validation status.  An example `required` rule would test a text field for anything but an empty string.  If validation passes, a `required-good` class would be added to the input field or container for you to use to update styles or markup.  If validation failed, a `required-error` class would be added to the input field or container.  You can apply multiple rules to a single field and more general `good` and `error` classes will be added to the field or container after validating all the rules.

## Usage

### INIT:

Call the `$.fn.goodness()` method on a jQuery selector that returns a form element. ex: `$('#good-form').goodness()`

The init method can be passed all the options you need to customize for your form. Available options and defaults:

```
$('#good-form').goodness({
	
	// This selector string should return the element that you will add rule classes to. Default to the input elements themselves, not a parent container.
	inputContainerSelector: 'input, textarea, select',
	
	// This selector string should return the types of elements you want to be considered for validation.
	validationElementSelector: 'input:not([type=submit]):not([type=hidden]):not([type=reset]), textarea, select',
	
	// Do validation on input element change event
	validateOnChange: false,
	
	// Emit events
	emitEvents: false,
	
	// Object containing the validation rules. Keys are the class name you add the the container element to validate against the rule.
	rules: {
		'required': /^(?!\s*$).+/
	}
	
});
```

The init method returns the Goodness instance. ex: ` var goodForm = $('#good-form').goodness()`

### RULES:

When defining the rules in the `init` method `rules` option, the key should be the class name that you apply to the input container to make it abide by the rule, and the value, or rule itself, can be defined in a few different ways:

#### Regex

Simply using a regex as the value of your rule will test the input elements value against the regex.

```
...
// Create a rule that can only contain numbers.
rules: {
	'only-numbers': /^[0-9]*$/
}
...
```

#### Function

You can define a function that will be run each time the input element is validated.  This function will be passed the value of the input element, a jQuery reference to the input element itself, and a jQuery reference to the entire form element.  This function should return either the number 1 or boolean true if the rule was passed, and the number 0 or boolean false if the rule was failed. ANY other return value will be considered as neither passing or failing and neither of the appropriate class names will be added to the elements container.

```
...
// Create a rule that only passes if the input element has the 'checked' attribute
rules: {
	'must-check': function(value, $element, $form) {
		return $element.is(':checked');
	}
}
...
```
No matter which way you define the rules, class names will be added or removed from your input element or container.  These class names will be prefixed with your rule name, ex: `only-numbers-good` or `must-check-error`.  A more general class will be added if the input element passed all of it's rules or not, `good` or `error`.