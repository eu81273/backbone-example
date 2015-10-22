'use strict';

!function () {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');

    //모델 선언. Backbone의 Model을 확장하는 형태로, 내부적으로는 underscore의 extend를 활용하고 있다.
    var PersonModel = Backbone.Model.extend({
        defaults: {
            name: undefined,
            country: undefined
        }
    });

    //콜렉션 선언
    var PersonCollection = Backbone.Collection.extend({
        model: PersonModel
    });

    //뷰 선언
    var PersonListView = Backbone.View.extend({
        //뷰 인스턴스를 생성할 때 initialize를 실행한다.
        initialize: function (options) {
            //구분을 위해 instance 에 this(새로 생성될 뷰인스턴스)를 할당한다.
            var instance = this;
            //뷰 인스턴스를 생성할 때 옵션으로 넣은 객체의 내용으로 뷰 인스턴스를 확장한다. (여기에서는 el을 추가하게 된다)
            _.extend(instance, options);
            //인스턴스의 콜렉션에 PersonCollection 인스턴스를 주입
            instance.collection = new PersonCollection();
            //인스턴스의 콜렉션에 add 이벤트를 추가
            instance.collection.on('add', function (model) {
                instance.el.append('<li>' + model.get('name') + '</li>');
            });
        }
    });

    //뷰 인스턴스 생성
    var personListView = new PersonListView({
        el: $('#list')
    });

    //뷰 인스턴스에 바인딩된 콜렉션에 모델 추가 -> add 이벤트를 트리거
    personListView.collection.add({
        name: '홍길동',
        country: '한국'
    });
} ();
