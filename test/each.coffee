define ['chai', 'backbone', 'backbone-dom-view'], ({expect}, Backbone, DomView) ->

    model = null

    beforeEach ->
        model = new Backbone.Model()

    describe 'each helper', ->
        it 'should create view for each item in collection', ->
            View = DomView.extend
                tagName: 'li'
                template: '':
                     html: '@name'

            ListView = DomView.extend
                tagName: 'ul'
                template: '':
                     each:
                         view: View

            list = new Backbone.Collection [{name: 'Jack'}, {name: 'Bob'}]

            listView = new ListView model: list
            el = listView.$el

            expect(el.find('li').length).to.equal 2

            list.add {name: 'Max'}

            expect(el.find('li').length).to.equal 3

            list.at(1).destroy()

            expect(el).to.have.text 'JackMax'

        it 'should run custom view function', ->
            LiView = DomView.extend
                tagName: 'li'

            DivView = DomView.extend
                tagName: 'div'

            ListView = DomView.extend
                tagName: 'ul'
                template: '':
                     each:
                         view: (model)->
                             if model.get('type') is 'li' then LiView else DivView

            list = new Backbone.Collection [{type: 'li'}, {type: 'div'}]

            listView = new ListView model: list
            el = listView.$el

            expect(el.find('li').length).to.be.equal 1
            expect(el.find('div').length).to.be.equal 1

        it 'should run custom insertion/remove function', ->
            View = DomView.extend
                tagName: 'li'
                template: '':
                     html: '@name'

            ListView = DomView.extend
                tagName: 'ul'
                template: '':
                     each:
                         view: View
                         addHandler: 'prepend'
                         delHandler: (ul, view) ->
                             expect(this).to.be.instanceOf ListView
                             expect(view).to.be.instanceOf View

            list = new Backbone.Collection [{name: 'Jack'}, {name: 'Bob'}]

            listView = new ListView model: list
            el = listView.$el

            expect(el).to.have.text 'BobJack'

            list.at(0).destroy()

            expect(el).to.have.text 'BobJack'

        it 'should create view with el:', ->
            View = DomView.extend
                template: '':
                    html: '@name'

            ListView = DomView.extend
                el: $('<ul><li class="test"></li></ul>')
                template: '':
                    each:
                        view: View
                        el: '> *'

            list = new Backbone.Collection()

            listView = new ListView model: list
            el = listView.$el

            expect(el.find('li').length).to.equal 0

            list.set([{name: 'Jack'}, {name: 'Bob'}])

            expect(el.find('li').length).to.equal 2

            expect(el.find('li')).to.have.class 'test'

        it 'should have `parent` field', ->
            views = []

            ListView = DomView.extend
                el: $('<ul></ul>')
                template: '':
                    each:
                        view: (model) ->
                            view = new Backbone.View(model: model)
                            view.parent = true if model.get('parent')
                            views.push(view);
                            return view

            list = new Backbone.Collection([{parent: false}, {parent: true}])

            listView = new ListView model: list

            expect(views[0].parent).to.be.equal listView
            expect(views[1].parent).to.be.equal true