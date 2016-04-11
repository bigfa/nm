/*
* @Author: bigfa
* @Date:   2016-03-27 15:09:43
* @Last Modified by:   bigfa
* @Last Modified time: 2016-04-11 12:43:58
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
      var _dom = $(event.target);
      var id = _dom.data('id');
      console.log(id);
      var data = 'id=' + id + '&action=nm_delete';
    $.ajax({
      url: nm_ajax_url.ajax_url,
      type: 'POST',
      dataType: 'json',
      data: data,
      success:function(data){
        if ( data.status == 500 ) {
          alert(data.message);
        } else {
          for (var i = 0;i< nmPrivateList.items.length; i++) {
            console.log(nmPrivateList.items[i].id);
            if ( nmPrivateList.items[i].id == id){
              return nmPrivateList.items.splice(i, 1);
            }
            
          }
        }
      
      }
    });
    }
  }
});

$.ajax({
      url: nm_ajax_url.ajax_url + '?action=nm_get',
      type: 'GET',
      dataType: 'json',
      success:function(data){
        var arr = [];
       var array = $.map(data.data, function(value, index) {
    arr.push(value);
});
      nmPrivateList.items = arr;
      }
    });

  var $form = $('#nm-form');

  $form.on('submit',function(e){
    e.preventDefault();
    var a = $('#ssfgg').val();
    a = a.match(/album\?id=(\d+)/gi);
    if ( !a.length ) return alert('输出正确的地址');
    var id = a[0].replace(/album\?id=/g, "");
    var data = 'id=' + id + '&action=nm_add';
    $.ajax({
      url: nm_ajax_url.ajax_url,
      type: 'POST',
      dataType: 'json',
      data: data,
      success:function(data){
        if ( data.status == 500 ) {
          alert(data.message);
        } else {
          nmPrivateList.items.push(data.data);
        }
      
      }
    });
  })

}(jQuery);