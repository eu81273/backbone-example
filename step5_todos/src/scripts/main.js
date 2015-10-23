'use strict';

!function () {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    //모델 선언. Backbone의 Model을 확장하는 형태로, 내부적으로는 underscore의 extend를 활용하고 있다.
    var TodoModel = Backbone.Model.extend({
        defaults: {
            text: '',
            done: false
        },
        validate: function (attrs) {
            if (!attrs.text) {
                return true;
            }
        }
    });

    //콜렉션 선언
    var TodoCollection = Backbone.Collection.extend({
        model: TodoModel
    });

    var TodoView = Backbone.View.extend({
        //뷰 인스턴스를 생성할 때 initialize를 실행한다.
        initialize: function (options) {
            //구분을 위해 instance 에 this(새로 생성될 뷰인스턴스)를 할당한다.
            var instance = this;
            //뷰 인스턴스를 생성할 때 옵션으로 넣은 객체의 내용으로 뷰 인스턴스를 확장한다.
            _.extend(instance, options);
            //모델이 변경되면, render를 실행한다.
            instance.listenTo(instance.model, 'change', instance.render);
        },
        render: function () {
            //모델을 JSON 오브젝트화
            var todo = this.model.toJSON();
            //underscore를 사용해서 템플릿을 컴파일
            var template = _.template($("#todo-template").html());
            //컴파일된 HTML을 el에 주입
            this.$el.html(template({todo: todo}));
            //렌더링된 뷰 반환
            return this;
        },
        //todo item을 클릭하면 toggleTodo 핸들러 실행
        events: {
            'click': 'toggleTodo'
        },
        toggleTodo: function (e) {
            this.model.set('done', !this.model.get('done'));
        }
    });

    //뷰 선언
    var AppView = Backbone.View.extend({
        //뷰 인스턴스를 생성할 때 initialize를 실행한다.
        initialize: function (options) {
            //구분을 위해 instance 에 this(새로 생성될 뷰인스턴스)를 할당한다.
            var instance = this;
            //뷰 인스턴스를 생성할 때 옵션으로 넣은 객체의 내용으로 뷰 인스턴스를 확장한다.
            _.extend(instance, options);
            //인스턴스의 콜렉션에 TodoCollection 인스턴스를 주입
            instance.collection = new TodoCollection();
            //인스턴스의 콜렉션에 add 이벤트를 추가
            instance.collection.on('add', function (model) {
                //추가된 model을 기반으로 TodoView 인스턴스 생성
                var view = new TodoView({model: model});
                //TodoView 인스턴스를 렌더링해서 list에 추가
	            instance.$list.append(view.render().el);
            });
        },
        //키를 타이핑하면 insertTodo 이벤트 핸들러 실행
        events: {
            'keypress #input': 'insertTodo',
        },
        insertTodo: function (e) {
            //키코드가 엔터(13)인 경우에만,
            if (e.which === 13) {
                var text = this.$input.val().trim();

                //뷰 인스턴스에 바인딩된 콜렉션에 모델 추가 -> add 이벤트를 트리거
                //model에 선언된 validate 실행 -> 정상인 경우에만 add
                this.collection.add({
                    text: text
                }, {validate: true});

                //입력 내용 초기화
                this.$input.val('');
            }
        }
    });

    //뷰 인스턴스 생성
    var appView = new AppView({
        el: $('#app'),
        $list: $('#list'),
        $input: $('#input')
    });

} ();
