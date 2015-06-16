[![Build Status](https://travis-ci.org/dicksont/propene.svg?branch=master)](https://travis-ci.org/dicksont/propene) [![npm version](https://badge.fury.io/js/propene.svg)](http://badge.fury.io/js/propene) [![Bower version](https://badge.fury.io/bo/propene.svg)](http://badge.fury.io/bo/propene)

Propene is a front-end JavaScript library that allows developers to create reactive bindings  of HTML element state to Object properties. It auto-magically synchronizes element state with new property values.

## Installation

```shell
npm install propene
```

## Introduction
Propene works by binding an object property to states of elements in the DOM. To use propene, you would have to specify how these property values would be transformed into DOM state. For example, if you want the value of the *showInput* property in the *ui.options* object to reflect whether the toggle switch element has a class *on* in the DOM, you can do something like:


```javascript
propene(ui.options, 'showInput')
  .hasClass('#div_switch', 'on');
```

The *propene* initializer takes in the object and the name of the property. It creates a new object, which contains methods for configuring the binding. In this case, we used the *hasClass* method, which instructs propene to bind the value of the property to whether or not the *on* class is present in the *#div_switch* element.

If the *#div_switch* element's class attribute contains the class on, then *ui.options.showInput* evaluates to true. If otherwise, evaluates to false. In addition, setting *ui.options.showIput* to true, would tell propene to add an *on* class to the *#div_switch* element's class attribute. Setting it to false, would remove the *on* class from the attribute.

This allows us to inspect and manipulate DOM elements on the fly with simple statements like:

```
if (ui.options.showInput) {
  // do this
} else {
  // otherwise, do that
}
```

OR

```
if (evt.keyCode == 13) {
  ui.options.showInput = true;
}
```

## Chaining

We've added chaining, so the same property can be bound to multiple elements. For example, suppose we want *ui.options.showInput* to also reflect the visibility of the input message textarea. Our app will use an off class to control the visibility of this textarea. We have laid out our CSS as follows:

```css
#textarea_message.off {
  display: none;
}
```

Then with propene, we just have to tack on an additional function call at the end. This time, we call the *noClass* function, which is the opposite of *hasClass*:

```javascript
propene(ui.options, 'showInput')
  .hasClass('#div_switch', 'on');
  .noClass('#textarea_message', 'off');
```

Chaining will allow us to neatly construct complex reactive bindings in our propene app.

## Change Callback
Not all cases will fit perfectly into this linear model. We may run into situations where our view state logically depends on multiple conditions. For example, we might want to show the right column only when the its children, the input message or the key, are visible. To do this, we can use the change method to specify a callback to be called when the value of the binding has changed.


```javascript
propene(ui.options, 'showInput')
  .hasClass('#div_switch', 'on')
  .noClass('#textarea_message', 'off')
  .change(updateRightCol);

propene(ui.options, 'showKey')
  .hasClass('#div_showkey', 'on')
  .noClass('#section_key', 'off')
  .change(updateRightCol);

function updateRightCol() {
  ui.state.showRightColumn = ui.options.showInput || ui.options.showKey;
}
```

The function *updateRightCol* will be called, whenever *ui.options.showInput*, *ui.options.showKey*, or their associated view states change. The property *ui.state.showRightColumn* will be set. Changes to the view will be cascaded.


[Design Specs](USECASE.md)
