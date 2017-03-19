/**
 * Created by Greg Zhang on 2017/3/18.
 */
(function (factory, jQuery) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }
})(function ($) {
    var NAMESPACE = 'radiobox';
    var EVENT_NAME_CLICK = 'click.' + NAMESPACE;
    var EVENT_NAME_CHANGE = 'change.' + NAMESPACE;
    var CACHE_RDX_DATA_NAME = 'dt-rdx';
    var CLASS_DISABLED = 'is-disabled';
    var CLASS_ACTIVE = 'is-active';
    var CLASS_CHECKED = 'checked';

    var Checkbox = function ($el, options) {
        var radiobox = this;
        var core = {
            defaults: {
                type: 'radiobox', // radiobox, radiobutton
                name: '', // native name property for input element
                radiolist: '', // String or Array [{label:'banana', value: 1}], ['banana', 'apple', 'orange']
                disabled: null, // Boolean or Array
                defaultValue: null, // Boolean or Array
                size: 'small', // small, medium, large
                onClick: null,
                onChange: null
            },
            init: function () {
                // copy property from options
                radiobox = $.extend(true, radiobox, core.defaults, options || {});
                core.created();
            },
            created: function () {
                var type = radiobox.type;
                var radioDOM = type === 'radiobox' ? core.generateRadioBoxDOM() : core.generateRadioButtonDOM();
                radiobox.$element = $(radioDOM).insertAfter($el);
                radiobox.$inputs = radiobox.$element.find('input[type="radio"]');
                $el.hide();
                // cache checkbox item data
                core.cacheRadioItemData();
                // disable checkbox item
                if (radiobox.disabled !== null) core.disableRadioItem();
                // bind change event for target element
                if ($.isFunction(radiobox.onChange)) $el.on(EVENT_NAME_CHANGE, radiobox.onChange);
                // set defaultValue for chk
                if (radiobox.defaultValue !== null) core.setValue(radiobox.defaultValue);
                core.bindEvent();
            },
            bindEvent: function () {
                // bind click event for chk wrapper, then the child elements're clicked can bubble to this element
                radiobox.$element.on(EVENT_NAME_CLICK, function (e) {
                    var type = radiobox.type;
                    var $input = $(e.target).siblings('input[type="radio"]');
                    var labelSelector = type === 'radiobox' ? '.gmi-radio-label' : '.gmi-radio-button';
                    var $label = $(e.target).is(labelSelector) ? $(e.target) : $(e.target).parents(labelSelector).eq(0);
                    var dt = $input.data(CACHE_RDX_DATA_NAME);
                    var value;

                    // if label element has disabled class that stop click action
                    if ($label.hasClass(CLASS_DISABLED)) return false;
                    if (type === 'radiobox' && radiobox.$element.is('.gmi-radio-label')) value = true;

                    if (isString(dt) || isNumber(dt)) {
                        value = dt;
                    } else if ($.isPlainObject(dt)) {
                        value = dt['value'];
                    }
                    core.triggerEvent(EVENT_NAME_CLICK, {newValue: value});
                    core.setValue(value);
                    return false;
                });
            },
            generateRadioBoxDOM: function () {
                var radiolist = radiobox.radiolist;
                var name = radiolist.name;
                var sizeClass = radiobox.size === 'small' ? '' : radiobox.size;
                var dom = '';
                if (isString(radiolist)) {
                    dom += '';
                    dom += '<label class="gmi-radio-label '+ sizeClass +'">' +
                            '<input type="radio" class="gmi-radio-label__chk" name="'+ name +'" value="'+ radiolist +'">' +
                            '<em class="gmi-radio-icon-checked gmi-radio-label__icon"></em>' +
                            '<span class="gmi-radio-label__text">'+ radiolist +'</span>' +
                        '</label>';
                } else if (isArray(radiolist) && radiolist.length > 0) {
                    dom += '<div class="gmi-radio-group '+ sizeClass +'">';
                    for (var i = 0; i < radiolist.length; i++) {
                        if (isString(radiolist[0]) || isNumber(radiolist[0])) {
                            dom += '<label class="gmi-radio-label '+ sizeClass +'">' +
                                    '<input type="radio" class="gmi-radio-label__chk" name="'+ name +'" value="'+ radiolist[i] +'" autocomplete="off">' +
                                    '<em class="gmi-radio-icon-checked gmi-radio-label__icon"></em>' +
                                    '<span class="gmi-radio-label__text">'+ radiolist[i] +'</span>' +
                                '</label>'
                        } else if ($.isPlainObject(radiolist[0])) {
                            dom += '<label class="gmi-radio-label '+ sizeClass +'">' +
                                '<input type="radio" class="gmi-radio-label__chk" name="'+ name +'" value="'+ radiolist[i]['value'] +'" autocomplete="off">' +
                                '<em class="gmi-radio-icon-checked gmi-radio-label__icon"></em>' +
                                '<span class="gmi-radio-label__text">'+ radiolist[i]['label'] +'</span>' +
                                '</label>'
                        }
                    }
                    dom += '</div>';
                }
                return dom;
            },
            generateRadioButtonDOM: function () {
                var radiolist = radiobox.radiolist;
                var name = radiobox.name;
                var sizeClass = radiobox.size === 'small' ? '' : radiobox.size;
                var dom = '';

                if (isArray(radiolist) && radiolist.length > 0) {
                    dom += '<div class="gmi-radio-group '+ sizeClass +'">';
                    for (var i = 0; i < radiolist.length; i++) {
                        if (isString(radiolist[0]) || isNumber(radiolist[0])) {
                            dom += '<label class="gmi-radio-button">' +
                                    '<input type="radio" class="gmi-radio-button__chk" name="'+ name +'" value="'+ radiolist[i] +'" autocomplete="off">' +
                                    '<span class="gmi-radio-icon-checked gmi-radio-button__txt">'+ radiolist[i] +'</span>' +
                                '</label>';
                        } else if ($.isPlainObject(radiolist[0])) {
                            dom += '<label class="gmi-radio-button">' +
                                '<input type="radio" class="gmi-radio-button__chk" name="'+ name +'" value="'+ radiolist[i]['value'] +'" autocomplete="off">' +
                                '<span class="gmi-radio-icon-checked gmi-radio-button__txt">'+ radiolist[i]['label'] +'</span>' +
                                '</label>';
                        }
                    }
                    dom += '</div>';
                } else {
                    return false;
                }
                return dom;
            },
            cacheRadioItemData: function () {
                var dt = radiobox.radiolist;
                if (isString(dt) || isNumber(dt)) {
                    radiobox.$inputs.data(CACHE_RDX_DATA_NAME, dt);
                } else if (isArray(dt)) {
                    for (var i = 0; i < dt.length; i++) {
                        var dtItem = dt[i];
                        radiobox.$inputs.eq(i).data(CACHE_RDX_DATA_NAME, dtItem);
                    }
                }
            },
            disableRadioItem: function () {
                var $inputs = radiobox.$inputs;
                var type = radiobox.type;
                var disabled = arguments[0] === undefined ? radiobox.disabled : arguments[0];
                var targetSelector = type === 'radiobox' ? '.gmi-radio-label' : '.gmi-radio-button';
                // clear disabled class
                radiobox.$element.find(targetSelector).removeClass(CLASS_DISABLED);
                if (isBoolean(disabled)) {
                    if (disabled) radiobox.$element.addClass(CLASS_DISABLED);
                } else if (isArray(disabled) && disabled.length > 0) {
                    for (var i = 0; i < disabled.length; i++) {
                        var disabledDt = disabled[i];
                        $inputs.each(function () {
                            var dt = $(this).data(CACHE_RDX_DATA_NAME);
                            var itemDt;
                            if (isString(dt) || isNumber(dt)) {
                                itemDt = dt;
                            } else if ($.isPlainObject(dt)) {
                                itemDt = dt['value'];
                            }
                            if (disabledDt === itemDt) return $(this).parents(targetSelector).eq(0).addClass(CLASS_DISABLED);
                        });
                    }
                }
            },
            triggerEvent: function (src, data) {
                var evt = $.Event(src, data);
                $el.trigger(evt);
                return evt;
            },
            setValue: function () {
                var $inputs = radiobox.$element.find('input[type="radio"]');
                var $icon;
                var type = radiobox.type;
                var oldValue = radiobox.value;
                var value = arguments[0];
                if (!isString(value) && !isNumber(value) && !isBoolean(value) && value !== null) return false;
                if (type === 'radiobox') { // radiobox
                    $inputs.prop('checked', false).siblings('em.gmi-radio-label__icon')
                        .removeClass('checked');
                    if (value === null) return false;
                    if (isBoolean(value)) {
                        if (value) {
                            $icon = $inputs.prop('checked', value).siblings('em.gmi-radio-label__icon');
                            $icon.addClass(CLASS_CHECKED);
                        }
                    } else {
                        $inputs.each(function () {
                            var dt = $(this).data(CACHE_RDX_DATA_NAME);
                            var itemDt;
                            if (isString(dt) || isNumber(dt)) {
                                itemDt = dt;
                            } else if ($.isPlainObject(dt)) {
                                itemDt = dt['value'];
                            }
                            if (itemDt === value) {
                                $(this).prop('checked', true).siblings('em.gmi-radio-label__icon')
                                    .addClass('checked');
                            }
                        });
                    }
                } else { // radiobutton
                    $inputs.prop('checked', false);
                    $inputs.parents('.gmi-radio-button').removeClass(CLASS_ACTIVE);
                    if (value === null) return false;
                    $inputs.each(function () {
                        var dt = $(this).data(CACHE_RDX_DATA_NAME);
                        var btnDt;
                        if (isString(dt) || isNumber(dt)) {
                            btnDt = dt;
                        } else if ($.isPlainObject(dt)) {
                            btnDt = dt['value'];
                        }
                        if (btnDt === value) {
                            $(this).prop('checked', true).parents('.gmi-radio-button').eq(0)
                                .addClass(CLASS_ACTIVE);
                        }
                    });
                }
                if (oldValue !== value) {
                    core.triggerEvent(EVENT_NAME_CHANGE, {newValue: value, oldValue: oldValue});
                    radiobox.value = value;
                }
            },
            reset: function () {
                if (radiobox.defaultValue !== null) {
                    core.setValue(radiobox.defaultValue);
                } else {
                    core.setValue(radiobox.defaultValue);
                }
            }
        };

        radiobox.getValue = function () {
            return radiobox.value;
        };

        radiobox.setValue = function (value) {
            core.setValue(value);
        };

        radiobox.reset = function () {
            core.reset();
        };

        radiobox.disable = function () {
            var disabled;
            if (radiobox.$element.is('label')) {
                disabled = arguments[0] === undefined ? true : arguments[0];
            } else {
                var args = [];
                for (var i = 0; i < radiobox.radiolist.length; i++) {
                    if (isString(radiobox.radiolist[i]) || isNumber(radiobox.radiolist[i])) {
                        args.push(radiobox.radiolist[i]);
                    } else {
                        args.push(radiobox.radiolist[i]['value']);
                    }
                }
                disabled = arguments[0] === undefined ? args : arguments[0];
            }
            core.disableRadioItem(disabled);
        };

        core.init();
    };

    $.fn.radiobox = function (options) {
        var args = toArray(arguments, 1);
        var options = options || {};
        var $self = this;
        var result;

        $self.each(function () {
            var data = $(this).data('checkbox');
            var fn;
            if (!data) {
                if (/destroy/.test(options)) {
                    return false;
                }
                if (!isString(options)) return $(this).data('checkbox', (data = new Checkbox($(this), options)));
            }
            if (data && isString(options) && $.isFunction(fn = data[options])) {
                result = fn.apply(data, args);
            }
        });
        return typeof result === 'undefined' ? $self : result;
    };

    function toArray (obj, offset) {
        var args = [];
        if (Array.from) {
            return Array.from(obj).slice(offset || 0);
        }
        if (typeof offset === 'number' && !isNaN(offset)) {
            args.push(offset);
        }
        return args.slice.apply(obj, args);
    }

    function isArray (arr) {
        return typeof arr === 'object' && arr instanceof Array;
    }

    function isString (str) {
        return typeof str === 'string';
    }

    function isNumber (num) {
        return typeof num === 'number' && !isNaN(num);
    }

    function isBoolean (bln) {
        return typeof bln === 'boolean';
    }

}, window.jQuery);
