var basicDemo, customRules;

$(function() {

  // Initialize basic-demo form, just check for required text fields
  basicDemo = $('#basic-demo').goodness({
    inputContainerSelector: '.input-group'
  });

  // Initialize custom-rules form a custom rule
  customRules = $('#custom-rules').goodness({
    inputContainerSelector: '.input-group',
    rules: {
      'valid-password': function(val, $elm, $form) {
        return $.trim(val).length > 5;
      },
      'match-password': function(val, $elm, $form) {
        return val === $('input[name=valid-password').val();
      },
      'must-check': function(val, $elm, $form) {
        return $elm.is(':checked');
      }
    }
  });

  console.log(customRules);

});
