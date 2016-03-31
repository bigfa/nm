/*
* @Author: bigfa
* @Date:   2016-03-27 15:09:43
* @Last Modified by:   bigfa
* @Last Modified time: 2016-03-27 18:02:36
*/

'use strict';



+function($){
var nmPrivateList = new Vue({
  el: '#nm-private-list',
  data: {
    items: []
  },
  methods: {
    greet: function (event) {
      // 方法内 `this` 指向 vm
      alert('Hello ' + this.name + '!')
      // `event` 是原生 DOM 事件
      alert(event.target.tagName)
    }
  }
});

$.ajax({
      url: nm_ajax_url.ajax_url + '?action=nm_get',
      type: 'GET',
      dataType: 'json',
      success:function(data){
        console.log(data.data);
      nmPrivateList.items = data.data;
      }
    });

  var $form = $('#nm-form');

  $form.on('submit',function(e){
    e.preventDefault();

    var me = new RegExp('#http:\/\/music\.163\.com\/\#\/(\w+)\?id=(\d+)#i');

    return console.log($('#ssfgg').val().match(me));

    if ( !me.match($('#ssfgg').val()) ) return alert('sss');

    var data = $form.serialize() + '&action=nm_add';
    console.log(data);
    $.ajax({
      url: nm_ajax_url.ajax_url,
      type: 'POST',
      dataType: 'json',
      data: data,
      success:function(data){
        console.log("success");
      nmPrivateList.items.push(data);
      }
    });
    
  })

}(jQuery);