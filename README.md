# gemini-radiobox
A full-featured radiobox jquery plugin

## ![Date Image](./dist/assets/images/github-gemini.png) Gemini Checkbox

### Features
+ Supports more configurable options.
+ Supports more methods
+ Supports more events
+ Supports fast internationalization
+ Cross-browser support

### Example image
##### Type: radiobox
![RadioBox](./dist/assets/images/gemini-radiobox.png)
##### Type: radiobutton
![RadioButton](./dist/assets/images/gemini-radiobutton.png)

### Getting started
#### Quick start
+ Clone the repository: git clone https://github.com/gregzhang616/gemini-radiobox.git.
+ Install with Npm: npm install gemini-radiobox.
+ Install with Bower: bower install gemini-radiobox.

#### Installation
##### Include files:
Css file
```
<link rel="stylesheet" href="/css/gemini.radiobox.min.css">
```
Javascript file
```
<script src="/assets/js/jquery.min.js"></script>
<script src="/js/gemini.radiobox.min.js"></script>
```
### Attributes
>You may set checkbox options with $().radiobox(options), the options type is Object.

| Name | Type  | Default value | Optional value | Description |
| :--- | :--- | :--- | :--- | :--- |
| type | String | 'radiobox' | radiobox/radiobutton | the type of radio |
| name | String | '' | -- | native attribute for radio |
| radiolist | String/Array | '' | -- | rendered data for radio, type is String or Array, such as 'Agree' or ['JD', 'Alibaba'] or [{label: 'JD', value: 1}, {label: 'Alibaba', value: 2}] |
| disabled | Boolean/Array | null | -- | disabled data for radio, such as true/false or ['JD'] or [1] |
| defaultValue | Boolean/Array | null | -- | default value for radiobox  or radiobutton. |
| size | String | 'small' | small/medium/large | The size for radiobox or radiobutton. |

### Methods
> Common usage

```
$().radiobox(methodName, argument1, argument2, ..., argumentN);
```
##### setValue(value)
Set the current value with a new value, parameter value type is Boolean or Array .
```
$().radiobox('setValue', true);
$().radiobox('setValue', ['JD', 'Alibaba']);
$().radiobox('setValue', [1, 2]);
```

##### getValue()
Get the current checked value.
```
$().radiobox('getValue');
```

##### reset()
reset the radiobox checked status.
```
$().radiobox('reset');
```

##### disable(value)
disable or enable the radiobox or radiobutton.
```
// disable the single radiobox
$().radiobox('disable', true);
// enable the single radiobox
$().radiobox('disable', false);

// disable the radiobox/radiobutton group item
$().radiobox('disable', ['JD', ...]); or $().checkbox('disable', [1, ...]);
// disable the all the radiobox/radiobutton item
$().radiobox('disable'); 
// enable the all the radiobox/radiobutton item
$().radiobox('disable', []);
```

##### destroy()
Destroy the radiobox and remove the instance from target element.
```
$().radiobox('destroy');
```

### Events
> Common usage

```
$().on(eventName, function (e, arguments) {
  // todo
});
```

##### change.radiobox
This event fires when checked value is changed.
* event ( Type: Object )
  * newValue ( Type: Boolean/Array )
  
```
$().on('change.radiobox', function (event) {
  console.log('newValue: ' + event.newValue);
});
```

##### click.radiobox
This event fires when radiobox/radiobutton item is clicked.

```
$().on('click.radiobox', function (event) {
  // todo
});
```

### Callbacks
> Common usage

```
$().datepicker({
    CallbackName: function () {
      // todo
    }
});
```
##### onChange
A shortcut of the "change.radiobox" event, this callback called when checked value is changed.

```
$().radiobox({
    onChange: function (event) {
      console.log('newValue: ' + event.newValue);
    }
});
```

##### onClick
A shortcut of the "click.radiobox" event, this callback called when radiobox/radiobutton item is clicked.

```
$().radiobox({
    onClick: function (event) {
      console.log('newValue: ' + event.newValue);
    }
});
```

### Run example
> Please download the project, and then enter into this directory.(download gulp-sass plugin need to connect vpn)

+ npm install
+ gulp
+ Access "http://localhost:8888/examples/index.html" in browser

### Browser support
* Chrome Most versions
* Firefox Most versions
* Safari Most versions
* Opera Most versions
* Edge Most versions
* Internet Explorer 8+

### Author
Greg Zhang from Asiainfo (gregzhang616@gmail.com).