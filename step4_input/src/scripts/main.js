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
        },
        validate: function (attrs) {
            if (!attrs.name || !attrs.country) {
                return true;
            }
        }
    });

    //콜렉션 선언
    var PersonCollection = Backbone.Collection.extend({
        model: PersonModel
    });

    //뷰 선언
    var AppView = Backbone.View.extend({
        //뷰 인스턴스를 생성할 때 initialize를 실행한다.
        initialize: function (options) {
            //구분을 위해 instance 에 this(새로 생성될 뷰인스턴스)를 할당한다.
            var instance = this;
            //뷰 인스턴스를 생성할 때 옵션으로 넣은 객체의 내용으로 뷰 인스턴스를 확장한다.
            _.extend(instance, options);
            //인스턴스의 콜렉션에 PersonCollection 인스턴스를 주입
            instance.collection = new PersonCollection();
            //인스턴스의 콜렉션에 add 이벤트를 추가
            instance.collection.on('add', function (model) {
                //템플릿 렌더링
                instance.render();
            });
        },
        render: function () {
            //콜렉션을 JSON 오브젝트화
            var personList = this.collection.toJSON();
            //underscore를 사용해서 템플릿을 컴파일
            var template = _.template($("#test-template").html());
            //컴파일된 HTML을 el에 주입
            this.$list.html(template({personList: personList}));
        },
        //추가 버튼을 누르면 insertPerson 이벤트 핸들러 실행
        events: {
            'click #insert': 'insertPerson'
        },
        insertPerson: function (e) {
            var name = this.$name.val().trim();
            var country = this.$country.val().trim();

            //뷰 인스턴스에 바인딩된 콜렉션에 모델 추가 -> add 이벤트를 트리거
            //model에 선언된 validate 실행 -> 정상인 경우에만 add
            this.collection.add({
                name: name,
                country: country
            }, {validate: true});
        }
    });

    //뷰 인스턴스 생성
    var appView = new AppView({
        el: $('#app'),
        $list: $('#list'),
        $name: $('#name'),
        $country: $('#country')
    });

} ();
