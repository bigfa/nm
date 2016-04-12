<div class="wrap">
    <div id="icon-options-general" class="icon32"><br></div><h2>自定义歌单</h2>
    <div class="nm-pr-wrap">
    <div id="nm-private-list" class="nm-p-lists">
          <div v-for="item in items" class="nm-p-item">
          <img src="{{ item.img }}" width=150 height=150>
          <div class="item-title">{{ item.title }}</div>
            <button v-on:click="greet" data-id="{{ item.id }}" class="nm-delete-btn">删除</button>
  </div>
    </div>
        <form id="nm-form" class="nm-form">
          <p class="nm-form-note">请输入网易云音乐专辑链接，如<code>http://music.163.com/#/album?id=3029801</code>，然后点击添加专辑。</p>
        <input name="url" type="text" class="nm-form-textInput">
        <input type="submit" value="添加专辑"  class="nm-form-submit">
        <p class="loading-info hide">数据获取中</p>
    </form>

  </div>
</div>