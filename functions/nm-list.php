<div class="wrap">
    <div id="icon-options-general" class="icon32"><br></div><h2>自定义歌单</h2><br>
    <form id="nm-form" class="nm-form">
        <input id="ssfgg" name="url" type="text" class="nm-form-textInput">
        <input type="submit" value="添加专辑"  class="nm-form-submit">
    </form>
    <div id="nm-private-list" class="nm-p-lists">
          <div v-for="item in items" class="nm-p-item">
          <img src="{{ item.img }}" width=150 height=150>
          <div class="item-title">{{ item.title }}</div>
            <button v-on:click="greet" data-id="{{ item.id }}" class="nm-delete-btn">删除</button>
  </div>
    </div>
</div>