// Generated by CoffeeScript 1.8.0
(function() {
  define(['chai', 'backbone', 'backbone-dom-view'], function(_arg, Backbone, DomView) {
    var expect, model;
    expect = _arg.expect;
    model = null;
    beforeEach(function() {
      return model = new Backbone.Model();
    });
    describe('constructor', function() {
      it('should extend parent template:', function() {
        var View, XView, YView, ZView, el1, el2, el3, nTest, view, xView, yView, zView;
        View = DomView.extend({
          template: {
            'root': {
              html: '@name'
            }
          }
        });
        XView = View.extend({
          template: {
            'root': {
              prop: {
                "test": '@name'
              }
            }
          }
        });
        nTest = 1;
        YView = XView.extend({
          ui: {
            'test': 'root',
            '1test': 'root',
            '2test': 'root'
          },
          selectorsSorter: function(tpl) {
            return _.keys(tpl).sort();
          },
          template: {
            'root': {
              attr: {
                "test": '@name'
              }
            },
            'test': {
              prop: {
                '3test': function() {
                  return nTest++;
                }
              }
            },
            '2test': {
              prop: {
                '2test': function() {
                  return nTest++;
                }
              }
            },
            '1test': {
              prop: {
                '1test': function() {
                  return nTest++;
                }
              }
            }
          }
        });
        view = new View({
          model: model
        });
        el1 = view.$el;
        xView = new XView({
          model: model
        });
        el2 = xView.$el;
        yView = new YView({
          model: model
        });
        el3 = yView.$el;
        model.set('name', 'Jack');
        expect(el1).to.have.text('Jack');
        expect(el2).to.have.text('Jack');
        expect(el3).to.have.text('Jack');
        expect(el1).not.to.have.prop('test');
        expect(el2).to.have.prop('test', 'Jack');
        expect(el3).to.have.prop('test', 'Jack');
        expect(el1).not.to.have.attr('test');
        expect(el2).not.to.have.attr('test');
        expect(el3).to.have.attr('test', 'Jack');
        expect(el3).to.have.prop('1test', 1);
        expect(el3).to.have.prop('2test', 2);
        expect(el3).to.have.prop('3test', 3);
        ZView = YView.extend({
          template: {
            '': {
              attr: {
                "test": '@age'
              }
            }
          }
        });
        zView = new ZView({
          model: model
        });
        model.set('age', 20);
        return expect(zView.$el).to.have.attr('test', '20');
      });
      it('should handle null in template values as ignore', function() {
        var View, XView, el, view;
        View = DomView.extend({
          template: {
            'root': {
              text: '@name',
              attr: {
                'test': '@name'
              }
            }
          }
        });
        XView = DomView.extend({
          template: {
            'root': {
              text: null,
              attr: {
                'test': null,
                'test2': '@name'
              }
            }
          }
        });
        model.set('name', 'Jack');
        view = new View({
          model: model
        });
        el = view.$el;
        expect(el).to.have.text('Jack');
        expect(el).to.have.attr('test', 'Jack');
        expect(el).not.to.have.attr('test2');
        view = new XView({
          model: model
        });
        el = view.$el;
        expect(el).to.have.text('');
        expect(el).not.to.have.attr('test');
        return expect(el).to.have.attr('test2', 'Jack');
      });
      it('should extend parent ui:', function() {
        var View, XView, YView, el1, el2, el3, view, xView, yView;
        View = DomView.extend({
          el: '<li><span></span><a href="#"><i></i></a></li>',
          ui: {
            root: ''
          },
          template: {
            root: {
              prop: {
                'test': '@name'
              }
            }
          }
        });
        XView = View.extend({
          ui: function() {
            expect(this).instanceOf(XView);
            return {
              deleteButton: 'a'
            };
          },
          template: {
            deleteButton: {
              html: '@name'
            }
          }
        });
        YView = XView.extend({
          ui: {
            name: 'span',
            test: '{name}, {deleteButton}'
          },
          template: {
            name: {
              html: '@name'
            }
          }
        });
        view = new View({
          model: model
        });
        el1 = view.$el;
        xView = new XView({
          model: model
        });
        el2 = xView.$el;
        yView = new YView({
          model: model
        });
        el3 = yView.$el;
        model.set('name', 'Jack');
        expect(el1).to.have.prop('test', 'Jack');
        expect(view.ui.root).to.have.prop('test', 'Jack');
        expect(el2).to.have.prop('test', 'Jack');
        expect(xView.ui.root).to.have.prop('test', 'Jack');
        expect(el3).to.have.prop('test', 'Jack');
        expect(yView.ui.root).to.have.prop('test', 'Jack');
        expect(el1.find('a')).not.to.have.text('Jack');
        expect(view.ui.deleteButton).to.be.undefined;
        expect(el2.find('a')).to.have.text('Jack');
        expect(xView.ui.deleteButton).to.have.text('Jack');
        expect(el3.find('a')).to.have.text('Jack');
        expect(yView.ui.deleteButton).to.have.text('Jack');
        expect(el1.find('span')).not.to.have.text('Jack');
        expect(view.ui.name).to.be.undefined;
        expect(el2.find('span')).not.to.have.text('Jack');
        expect(xView.ui.name).to.be.undefined;
        expect(el3.find('span')).to.have.text('Jack');
        expect(yView.ui.name).to.have.text('Jack');
        expect(yView.ui.test.get(0)).to.equal(yView.ui.name.get(0));
        return expect(yView.ui.test.get(1)).to.equal(yView.ui.deleteButton.get(0));
      });
      it('should extend parent defaults:', function() {
        var View, View2, View3, view;
        View = DomView.extend({
          defaults: {
            test: 1
          }
        });
        View2 = View.extend({
          defaults: {
            name: 1
          }
        });
        View3 = View2.extend({
          defaults: function() {
            expect(this).to.be.instanceOf(View3);
            return {
              field: 1
            };
          }
        });
        view = new View3;
        expect(view.get('test')).to.equal(1);
        expect(view.get('name')).to.equal(1);
        return expect(view.get('field')).to.equal(1);
      });
      it('should trigger elementEvent on setElement', function() {
        var View, view, x;
        x = 0;
        View = DomView.extend({
          tagName: 'li',
          constructor: function() {
            this.on(DomView.elementEvent, function() {
              x = 1;
              expect(this.$el).instanceOf(jQuery);
              return expect(this.$el).to.match('li');
            });
            return DomView.apply(this, arguments);
          }
        });
        view = new View;
        return expect(x).to.equal(1);
      });
      return it('should create callbacks', function() {
        var test1, test2, view;
        test1 = function() {};
        test2 = function() {};
        view = new DomView({
          test1: test1,
          test2: test2,
          test3: 1
        });
        return expect(view.callbacks).to.deep.equal({
          test1: test1,
          test2: test2
        });
      });
    });
    describe('find()', function() {
      it('should return root node', function() {
        var View, view;
        View = DomView.extend({
          tagName: 'li'
        });
        view = new View;
        return expect(view.find()).to.equal(view.$el);
      });
      it('should return ui element', function() {
        var View, view;
        View = DomView.extend({
          el: '<li><span></span></li>',
          ui: {
            test: 'span'
          }
        });
        view = new View;
        return expect(view.find('test')).to.match('span');
      });
      return it('should replace "{name}" on ui element selector', function() {
        var View, node, view;
        node = $('<div><li><span></span> <i></i></li></div>');
        View = DomView.extend({
          el: node.find('li'),
          ui: {
            test: 'span',
            comb: '{test} + i',
            list: 'root',
            span: '{list} > span'
          }
        });
        view = new View;
        expect(view.find('{test} ~ i')).to.match('i');
        expect(view.find('{comb}')).to.match('i');
        expect(view.find('comb')).to.match('i');
        expect(view.ui.list).to.match('li');
        expect(view.ui.span).to.match('span');
        return expect(view.ui.list).to.equal(view.ui.root);
      });
    });
    describe('bind(), bindTo()', function() {
      it('should bind events to model', function() {
        var View, num, num2, view;
        View = DomView.extend({
          defaults: {
            view_field: 1
          }
        });
        model.set('model_field', 0);
        view = new View({
          model: model
        });
        num = 0;
        view.bind('@model_field', function(v) {
          num++;
          expect(this).to.equal(view);
          return expect(v).to.equal(0);
        });
        view.bind('@view_field', function(v) {
          num++;
          expect(this).to.equal(view);
          return expect(v).to.equal(1);
        });
        view.bind('!@model_field', function(v) {
          num++;
          expect(this).to.equal(view);
          return expect(v).to.equal(true);
        });
        view.bind('!@view_field', function(v) {
          num++;
          expect(this).to.equal(view);
          return expect(v).to.equal(false);
        });
        view.bind('test', function() {
          num++;
          return expect(this).to.equal(view);
        });
        view.bind('#view', function() {
          num++;
          return expect(this).to.equal(view);
        });
        num2 = 0;
        view.bind('@model_field @view_field !@model_field !@view_field test #view', function() {
          num2++;
          return expect(this).to.equal(view);
        });
        model.trigger('test');
        view.trigger('view');
        expect(num).to.equal(6);
        return expect(num2).to.equal(6);
      });
      it('should bind events to external model', function() {
        var View, model2, num, num2, view;
        View = DomView.extend({
          defaults: {
            view_field: 1
          }
        });
        model.set('model_field', 0);
        model2 = new Backbone.Model({
          model_field: 3
        });
        view = new View({
          model: model
        });
        num = 0;
        view.bindTo(model2, '@model_field', function(v) {
          num++;
          expect(this).to.equal(view);
          return expect(v).to.equal(3);
        });
        view.bindTo(model2, '@view_field', function(v) {
          num++;
          expect(this).to.equal(view);
          return expect(v).to.equal(1);
        });
        view.bindTo(model2, '!@model_field', function(v) {
          num++;
          expect(this).to.equal(view);
          return expect(v).to.equal(false);
        });
        view.bindTo(model2, '!@view_field', function(v) {
          num++;
          expect(this).to.equal(view);
          return expect(v).to.equal(false);
        });
        view.bindTo(model2, 'test', function() {
          num++;
          return expect(this).to.equal(view);
        });
        view.bindTo(model2, '#view', function() {
          num++;
          return expect(this).to.equal(view);
        });
        num2 = 0;
        view.bind('@model_field @view_field !@model_field !@view_field test #view', function() {
          num2++;
          return expect(this).to.equal(view);
        });
        model.trigger('test');
        model2.trigger('test');
        view.trigger('view');
        expect(num).to.equal(6);
        return expect(num2).to.equal(6);
      });
      return it('should handle ! event', function() {
        var View, num, view;
        View = DomView.extend({
          defaults: {
            field: false
          }
        });
        view = new View({
          model: model
        });
        num = 0;
        view.bind('test', function(v) {
          num++;
          return expect(v).to.equal(true);
        });
        view.bind('!test', function(v) {
          num++;
          return expect(v).to.equal(false);
        });
        view.bind('#view', function(v) {
          num++;
          return expect(v).to.equal(1);
        });
        view.bind('!#view', function(v) {
          num++;
          return expect(v).to.equal(false);
        });
        view.bind('@field', function(v) {
          num++;
          return expect(v).to.equal(false);
        });
        view.bind('!@field', function(v) {
          num++;
          return expect(v).to.equal(true);
        });
        model.trigger('test', true);
        view.trigger('view', 1);
        return expect(num).to.equal(6);
      });
    });
    return describe('listenElement(), stopListeningElement()', function() {
      it('should listenElement', function() {
        var View, n, view;
        n = 0;
        View = DomView.extend({
          initialize: function() {
            return this.listenElement(this.$el, 'click', function() {
              expect(this).to.be.instanceOf(View);
              return n++;
            });
          }
        });
        view = new View({
          model: model
        });
        view.$el.click();
        expect(n).to.equal(1);
        view.$el.click();
        return expect(n).to.equal(2);
      });
      it('should listenElementOnce', function() {
        var View, n, view;
        n = 0;
        View = DomView.extend({
          initialize: function() {
            return this.listenElementOnce(this.$el, 'click', function() {
              expect(this).to.be.instanceOf(View);
              return n++;
            });
          }
        });
        view = new View({
          model: model
        });
        view.$el.click();
        expect(n).to.equal(1);
        view.$el.click();
        return expect(n).to.equal(1);
      });
      it('should stopListenElement', function() {
        var View, n, view;
        n = 0;
        View = DomView.extend({
          el: '<div></div>',
          template: {
            'root': {
              on: {
                'click': function() {
                  expect(this).to.equal(view);
                  return n++;
                }
              }
            }
          }
        });
        view = new View;
        expect(view._listenElement.length).to.equal(1);
        expect(n).to.equal(0);
        view.$el.click();
        expect(n).to.equal(1);
        view.stopListeningElement();
        expect(view._listenElement).to.be['null'];
        view.$el.click();
        expect(n).to.equal(1);
        view.listenElement(view.$el, 'test-1', function() {
          return n = 'test 1';
        });
        view.listenElement(view.$el, 'test-2', function() {
          return n = 'test 2';
        });
        view.$el.trigger('test-1');
        expect(n).to.equal('test 1');
        n = 1;
        view.stopListeningElement(view.$el, 'test-1');
        view.$el.trigger('test-1');
        expect(n).to.equal(1);
        view.$el.trigger('test-2');
        expect(n).to.equal('test 2');
        view.stopListeningElement(view.$el);
        n = 1;
        view.$el.trigger('test-2');
        return expect(n).to.equal(1);
      });
      return it('should stopListenElement by function', function() {
        var View, f1, f1n, f2, f2n, view;
        View = DomView.extend();
        view = new View({
          model: model
        });
        f1n = 0;
        f1 = function() {
          expect(this).to.be.instanceOf(View);
          return f1n++;
        };
        f2n = 0;
        f2 = function() {
          expect(this).to.be.instanceOf(View);
          return f2n++;
        };
        view.listenElement(view.$el, 'click', f1);
        view.listenElement(view.$el, 'click', f2);
        view.$el.click();
        view.$el.click();
        expect(f1n).to.equal(2);
        expect(f2n).to.equal(2);
        view.stopListeningElement(view.$el, 'click', f1);
        view.$el.click();
        expect(f1n).to.equal(2);
        return expect(f2n).to.equal(3);
      });
    });
  });

}).call(this);
