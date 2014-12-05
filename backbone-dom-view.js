;(function() {

    if (typeof define === 'function' && define.amd) {
        define('backbone-dom-view', ['backbone'], module);
    } else {
        module(Backbone);
    }

    function module (BB) {

        var View = BB.View;
        $ = BB.$;

        var dividedField = /^(.+)\|(.+)/,
            fieldEvent = /@([\w-]+)/,
            viewEvent = /#([\w\-:\.]+)/,
            argSelector = /\|arg\((\d+)\)/;

        var DOMView = BB.DOMView = View.extend({
            constructor: function(ops) {
                var view = this;

                View.apply(view, arguments);

                if (typeof view.template !== 'object') return;

                var template = view.template = extend(true, {}, parentTemplate(view) || {}, view.template);

                for (var selector in template) {
                    if (!has(template, selector)) continue;

                    var helpersList = template[selector];

                    for (var helper in helpersList) {
                        if (!has(helpersList, helper)) continue;

                        helpers[helper].call(view, selector, helpersList[helper]);
                    }
                }

                view.trigger(DOMView.readyEvent);
            },

            find: function(selector) {
                return selector ? this.$el.find(selector) : this.$el;
            },

            bind: function (events, func) {
                var view = this,
                    model = view.model;

                events = events.split(/\s+/);

                for (var i = 0, len = events.length; i < len; i++) {
                    parseEvent(events[i]);
                }

                function parseEvent (event) {
                    var target = model,
                        argNum = null;

                    event = event.replace(argSelector, function(x, num) {
                        argNum = num;
                        return '';
                    });

                    event = event.replace(fieldEvent, function(x, field) {
                        target = model;
                        argNum = 1;
                        bindApplyFunc(target, model.get(field));
                        return 'change:' + field;
                    });

                    event = event.replace(viewEvent, function(x, event) {
                        target = view;
                        return event;
                    });

                    if (target === model) {
                        view.listenTo(model, event, bindApplyFunc);
                    }
                    else {
                        view.on(event, bindApplyFunc);
                    }

                    function bindApplyFunc () {
                        return func.apply(view, argNum === null ? arguments : [arguments[argNum]]);
                    }
                }
            }
        });

        DOMView.readyEvent = 'template-ready';

        var helpers = DOMView.helpers = {
            'class': classHelper,
            attr: attrHelper,
            prop: propHelper,
            style: styleHelper,
            html: htmlHelper,
            text: textHelper,
            on: onHelper,
            connect: connectHelper,
            each: eachHelper
        };

        function classHelper (selector, options) {
            callJquerySetterMethod({
                view: this,
                node: this.find(selector),
                method: 'toggleClass',
                options: options,
                wrapper: function(v) {
                    return !!v;
                }
            });
        }

        function attrHelper (selector, options) {
            callJquerySetterMethod({
                view: this,
                node: this.find(selector),
                method: 'attr',
                options: options
            });
        }

        function propHelper (selector, options) {
            callJquerySetterMethod({
                view: this,
                node: this.find(selector),
                method: 'prop',
                options: options
            });
        }

        function styleHelper (selector, options) {
            callJquerySetterMethod({
                view: this,
                node: this.find(selector),
                method: 'css',
                options: options
            });
        }

        function htmlHelper (selector, options) {
            callJqueryMethod({
                view: this,
                node: this.find(selector),
                method: 'html',
                options: options
            });
        }

        function textHelper (selector, options) {
            callJqueryMethod({
                view: this,
                node: this.find(selector),
                method: 'text',
                options: options
            });
        }

        function onHelper (selector, options) {
            var view = this,
                node = view.find(selector);

            for (var event in options) {
                if (!has(options, event)) continue;

                onHelperBindEvent(event, options[event]);
            }

            function onHelperBindEvent (event, func) {
                node.on(event, function(e) {
                    e.templateNodes = node;
                    return func.apply(view, arguments);
                });
            }
        }

        function connectHelper (selector, options) {
            var view = this,
                node = view.find(selector);

            for (var prop in options) {
                if (!has(options, prop)) continue;

                connectHelperBind(prop, options[prop]);
            }

            function connectHelperBind (prop, field) {
                var event = 'change',
                    propEvent = prop.match(dividedField);

                if (propEvent) {
                    prop = propEvent[1];
                    event = propEvent[2];
                }

                node.on(event, function() {
                    view.model.set(field, node.prop(prop));
                });

                view.listenTo(view.model, 'change:' + field, function(model, value) {
                    if (value !== node.prop(prop)) {
                        node.prop(prop, value);
                    }
                });

                node.prop(prop, view.model.get(field));
            }
        }

        function callJqueryMethod (ops) {
            var view = ops.view,
                model = view.model,
                options = ops.options;

            ops = extend({
                model: model
            }, ops);

            switch (typeof options) {
                case 'string':
                    bindEvents(options, ops.func);
                    break;

                case 'object':
                    for (var events in options) {
                        if (!has(options, events)) continue;

                        bindEvents(events, options[events]);
                    }
                    break;

                case 'function':
                    ops.value = options.apply(view, arguments);
                    applyJqueryMethod(ops);
                    break;
            }

            function bindEvents(events, func) {
                view.bind(events, function () {
                    ops.value = func ? func.apply(view, arguments) : arguments[0];
                    applyJqueryMethod(ops);
                });
            }
        }

        function applyJqueryMethod (ops) {
            var node = ops.node,
                method = ops.method,
                fieldName = ops.fieldName,
                wrapper = ops.wrapper,
                value = ops.value;

            if (wrapper) {
                value = wrapper(value);
            }

            if (fieldName) {
                node[method](fieldName, value);
            }
            else {
                node[method](value);
            }
        }

        function callJquerySetterMethod (ops) {
            var options = ops.options;

            for (var name in options) {
                if (!has(options, name)) continue;

                ops.fieldName = name;
                ops.options = options[name];
                callJqueryMethod(ops);
            }
        }

        function eachHelper (selector, options) {
            var view = this,
                holder = view.find(selector),
                viewEl = options.el ? holder.find(options.el).detach() : false,
                field = options.field,
                list = field ? view.model.get(field) : view.model;

            var viewList = options.viewList = {};
            var addHandler = options.addHandler || 'append';
            var delHandler = options.delHandler || 'remove';

            if (typeof addHandler === 'string') {
                addHandler = eachHelper.addHandlers[addHandler];
            }

            if (typeof delHandler === 'string') {
                delHandler = eachHelper.delHandlers[delHandler];
            }

            view.listenTo(list, 'add', eachAddListener);
            view.listenTo(list, 'remove', eachRemoveListener);

            list.each(eachAddListener);

            function eachAddListener (model) {
                var View = isClass(options.view) ? options.view : options.view.call(view, model),
                    childView = View;

                if (isClass(View)) {
                    var viewOps = {
                        model: model
                    };

                    if (viewEl) {
                        viewOps.el = viewEl.clone();
                    }

                    childView = new View(viewOps);
                }

                childView.parent = childView.parent || view;
                viewList[model.cid] = childView;
                addHandler.call(view, holder, childView);
            }

            function eachRemoveListener (model) {
                var subView = viewList[model.cid];

                viewList[model.cid] = null;

                if (subView.parent === view) {
                    subView.parent = null;
                }

                delHandler.call(view, holder, subView);
            }
        }

        eachHelper.addHandlers = {
            append: function(ul, view) {
                ul.append(view.$el);
            },
            prepend: function(ul, view) {
                ul.prepend(view.$el);
            },
            fadeIn: function(ul, view) {
                view.$el.hide().appendTo(ul).fadeIn();
            },
            slideDown: function(ul, view) {
                view.$el.hide().appendTo(ul).slideDown();
            }
        };

        eachHelper.delHandlers = {
            remove: function(ul, view) {
                view.$el.remove();
            },
            fadeOut: function(ul, view) {
                view.$el.fadeOut(function() {
                    return view.$el.remove();
                });
            },
            slideUp: function(ul, view) {
                view.$el.slideUp(function() {
                    return view.$el.remove();
                });
            }
        };

        function isClass (func) {
            return func.hasOwnProperty('__super__');
        }

        function parentTemplate (view) {
            var con = view.constructor;
            return isClass(con) ? con.__super__.constructor.prototype.template : null;
        }

        function extend () {
            return $.extend.apply($, arguments);
        }

        function has (obj, field) {
            return obj.hasOwnProperty(field);
        }

        return DOMView;
    }

})();