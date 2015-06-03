```javascript
elBind(ui.options, 'showInput')
  .hasClass('#div_showinput', 'on')
  .noClass('#section_message', 'off')
  .change(updateRightCol);

elBind(ui.options, 'showKey')
  .hasClass('#div_showkey', 'on')
  .noClass('#section_key', 'off')
  .change(updateRightCol);

elBind(ui.options, 'showFormat')
  .hasClass('#div_showformat', 'on');

elBind(ui.options, 'enableEditing')
  .hasClass('#div_enableediting', 'on');

elBind(ui.options, 'input')
  .unique('#div_input input[type="radio"]', { attr: 'checked', output: 'value' })
  .change(updateAlgorithms);

elBind(ui.options, 'algorithm')
  .unique('#div_menu div.option', { class: 'selected', output: 'text '})
  .change(recompute);

elBind(ui.state, 'showRightColumn')
  .noClass('#div_rightcol', 'off');

elBind(ui.state, 'result')
  .text('#div_result');

elBind(ui.state, 'input')
  .text('#div_message');

elBind(ui.state, 'key')
  .text('#div_key');

function updateAlgorithms() {
  if (ui.options.input == 'text') {
    $('#div_menu div.option').hide();
  } else if (ui.options.input == 'code') {

  }
}

function recompute() {
  if (ui.options.algorithm == 'MD5') {
    ui.state.result = md5(ui.state.input);
  } else if (ui.options.algorithm = 'SHA1') {
    ui.state.result = sha1(ui.state.input);
  }
}

function updateRightCol() {
  ui.state.showRightColumn = ui.options.showInput || ui.options.showKey;
}

```
