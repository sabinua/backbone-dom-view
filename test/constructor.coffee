define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'constructor', ->
        it 'should extend parent template:', ->
            View = DomView.extend
                template:
                    'root':
                        html: '@name'

            XView = View.extend
                template:
                    'root':
                        prop:
                            "test": '@name'

            nTest = 1

            YView = XView.extend
                ui:
                    'test': 'root'
                    '1test': 'root'
                    '2test': 'root'

                selectorsSorter: (tpl) ->
                    return _.keys(tpl).sort()

                template:
                    'root':
                        attr:
                            "test": '@name'
                    'test':
                        prop: '3test': -> nTest++
                    '2test':
                        prop: '2test': -> nTest++
                    '1test':
                        prop: '1test': -> nTest++

            view = new View model: model
            el1 = view.$el
            xView = new XView model: model
            el2 = xView.$el
            yView = new YView model: model
            el3 = yView.$el

            model.set('name', 'Jack')

            expect(el1).to.have.text 'Jack'
            expect(el2).to.have.text 'Jack'
            expect(el3).to.have.text 'Jack'
            expect(el1).not.to.have.prop 'test'
            expect(el2).to.have.prop 'test', 'Jack'
            expect(el3).to.have.prop 'test', 'Jack'
            expect(el1).not.to.have.attr 'test'
            expect(el2).not.to.have.attr 'test'
            expect(el3).to.have.attr 'test', 'Jack'

            expect(el3).to.have.prop '1test', 1
            expect(el3).to.have.prop '2test', 2
            expect(el3).to.have.prop '3test', 3

            ZView = YView.extend
                template: '':
                    attr: "test": '@age'

            zView = new ZView model: model

            model.set('age', 20)

            expect(zView.$el).to.have.attr 'test', '20'

        it 'should extend parent ui:', ->
            View = DomView.extend
                el: '<li><span></span><a href="#"><i></i></a></li>'
                ui:
                    root: ''
                template:
                    root: prop: 'test': '@name'

            XView = View.extend
                ui: ->
                    expect(this).instanceOf XView
                    return {deleteButton: 'a'}

                template:
                    deleteButton: html: '@name'

            YView = XView.extend
                ui:
                    name: 'span'
                    test: '{name}, {deleteButton}'
                template:
                    name: html: '@name'

            view = new View model: model
            el1 = view.$el
            xView = new XView model: model
            el2 = xView.$el
            yView = new YView model: model
            el3 = yView.$el

            model.set('name', 'Jack')

            expect(el1).to.have.prop 'test', 'Jack'
            expect(view.ui.root).to.have.prop 'test', 'Jack'
            expect(el2).to.have.prop 'test', 'Jack'
            expect(xView.ui.root).to.have.prop 'test', 'Jack'
            expect(el3).to.have.prop 'test', 'Jack'
            expect(yView.ui.root).to.have.prop 'test', 'Jack'

            expect(el1.find('a')).not.to.have.text 'Jack'
            expect(view.ui.deleteButton).to.be.undefined
            expect(el2.find('a')).to.have.text 'Jack'
            expect(xView.ui.deleteButton).to.have.text 'Jack'
            expect(el3.find('a')).to.have.text 'Jack'
            expect(yView.ui.deleteButton).to.have.text 'Jack'

            expect(el1.find('span')).not.to.have.text 'Jack'
            expect(view.ui.name).to.be.undefined
            expect(el2.find('span')).not.to.have.text 'Jack'
            expect(xView.ui.name).to.be.undefined
            expect(el3.find('span')).to.have.text 'Jack'
            expect(yView.ui.name).to.have.text 'Jack'

            expect(yView.ui.test.get(0)).to.equal(yView.ui.name.get(0))
            expect(yView.ui.test.get(1)).to.equal(yView.ui.deleteButton.get(0))

        it 'should extend parent defaults:', ->
            View = DomView.extend
                defaults:
                    test: 1

            View2 = View.extend
                defaults:
                    name: 1

            View3 = View2.extend
                defaults: ->
                    expect(this).to.be.instanceOf(View3)

                    return {field: 1}

            view = new View3

            expect(view.get('test')).to.equal 1
            expect(view.get('name')).to.equal 1
            expect(view.get('field')).to.equal 1

        it 'should trigger elementEvent on setElement', ->
            x = 0
            View = DomView.extend
                tagName: 'li'
                constructor: ->
                    this.on DomView.elementEvent, ->
                        x = 1
                        expect(this.$el).instanceOf jQuery
                        expect(this.$el).to.match 'li'

                    DomView.apply(this, arguments)

            view = new View

            expect(x).to.equal 1

    describe 'find()', ->

        it 'should return root node', ->
            View = DomView.extend
                tagName: 'li'

            view = new View

            expect(view.find()).to.equal view.$el

        it 'should return ui element', ->
            View = DomView.extend
                el: '<li><span></span></li>'
                ui:
                    test: 'span'

            view = new View

            expect(view.find('test')).to.match 'span'

        it 'should replace "{name}" on ui element selector', ->
            node = $('<div><li><span></span> <i></i></li></div>')

            View = DomView.extend
                el: node.find('li')
                ui:
                    test: 'span'
                    comb: '{test} + i'

            view = new View

            expect(view.find('{test} ~ i')).to.match 'i'
            expect(view.find('{comb}')).to.match 'i'
            expect(view.find('comb')).to.match 'i'

    describe 'bind(), bindTo()', ->

        it 'should bind events to model', ->
            View = DomView.extend
                defaults:
                    view_field: 1

            model.set 'model_field', 0

            view = new View model: model

            num = 0

            view.bind '@model_field', (v) ->
                num++
                expect(this).to.equal(view)
                expect(v).to.equal(0)

            view.bind '@view_field', (v) ->
                num++
                expect(this).to.equal(view)
                expect(v).to.equal(1)

            view.bind '!@model_field', (v) ->
                num++
                expect(this).to.equal(view)
                expect(v).to.equal(true)

            view.bind '!@view_field', (v) ->
                num++
                expect(this).to.equal(view)
                expect(v).to.equal(false)

            view.bind 'test', ->
                num++
                expect(this).to.equal(view)

            view.bind '#view', ->
                num++
                expect(this).to.equal(view)

            num2 = 0

            view.bind '@model_field @view_field !@model_field !@view_field test #view', ->
                num2++
                expect(this).to.equal(view)

            model.trigger('test')
            view.trigger('view')

            expect(num).to.equal(6)
            expect(num2).to.equal(6)

        it 'should bind events to external model', ->
            View = DomView.extend
                defaults:
                    view_field: 1

            model.set 'model_field', 0

            model2 = new Backbone.Model model_field: 3

            view = new View model: model

            num = 0

            view.bindTo model2, '@model_field', (v) ->
                num++
                expect(this).to.equal(view)
                expect(v).to.equal(3)

            view.bindTo model2, '@view_field', (v) ->
                num++
                expect(this).to.equal(view)
                expect(v).to.equal(1)

            view.bindTo model2, '!@model_field', (v) ->
                num++
                expect(this).to.equal(view)
                expect(v).to.equal(false)

            view.bindTo model2, '!@view_field', (v) ->
                num++
                expect(this).to.equal(view)
                expect(v).to.equal(false)

            view.bindTo model2, 'test', ->
                num++
                expect(this).to.equal(view)

            view.bindTo model2, '#view', ->
                num++
                expect(this).to.equal(view)

            num2 = 0

            view.bind '@model_field @view_field !@model_field !@view_field test #view', ->
                num2++
                expect(this).to.equal(view)

            model.trigger('test')
            model2.trigger('test')
            view.trigger('view')

            expect(num).to.equal(6)
            expect(num2).to.equal(6)

        it 'should handle ! event', ->
            View = DomView.extend
                defaults:
                    field: false

            view = new View model: model

            num = 0

            view.bind 'test', (v) ->
                num++
                expect(v).to.equal(true)

            view.bind '!test', (v) ->
                num++
                expect(v).to.equal(false)

            view.bind '#view', (v) ->
                num++
                expect(v).to.equal(1)

            view.bind '!#view', (v) ->
                num++
                expect(v).to.equal(false)

            view.bind '@field', (v) ->
                num++
                expect(v).to.equal(false)

            view.bind '!@field', (v) ->
                num++
                expect(v).to.equal(true)

            model.trigger('test', true)
            view.trigger('view', 1)

            expect(num).to.equal(6)

