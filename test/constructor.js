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
        var View, XView, YView, ZView, el1, el2, el3, view, xView, yView, zView;
        View = DomView.extend({
          template: {
            '': {
              html: '@name'
            }
          }
        });
        XView = View.extend({
          template: {
            '': {
              prop: {
                "test": '@name'
              }
            }
          }
        });
        YView = XView.extend({
          template: {
            '': {
              attr: {
                "test": '@name'
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
            name: 'span'
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
        return expect(yView.ui.name).to.have.text('Jack');
      });
      return it('should trigger elementEvent on setElement', function() {
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
            comb: '{test} + i'
          }
        });
        view = new View;
        expect(view.find('{test} ~ i')).to.match('i');
        expect(view.find('{comb}')).to.match('i');
        return expect(view.find('comb')).to.match('i');
      });
    });
    return describe('bind(), bindTo()', function() {
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
  });

}).call(this);
