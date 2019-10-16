<div class="wrap">
    <div id="icon-options-general" class="icon32"><br></div><h2>插件设置</h2>
    <?php
    if (isset($_POST["cleancache"]) && check_admin_referer('nm-cleancache')) {
        if( nm_get_setting("objcache") ){
            wp_cache_flush();
        } else {
            global $wpdb;
            $sql = "DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_/netease%'";
            $sql1 = "DELETE FROM $wpdb->options WHERE option_name LIKE '_transient_timeout_/netease%'";
            $clean = $wpdb -> query( $sql );
            $clean = $wpdb -> query( $sql1 );
        }
        echo "<div class='updated'><p>清除成功.</p></div>";
    }
    ?>
    <form method="post" action="options.php">
        <?php
        settings_fields( 'nm_setting_group' );
        ?>
        <table class="form-table">
            <tbody>
            <tr valign="top">
                <th scope="row"><label>使用方法</label></th>
                <td>
                    <p>请查看<a href="https://fatesinger.com/74369" target="_blank">帮助文章</a></p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label>显示设置</label></th>
                <td>
                    <ul class="nm-color-ul">
                        <?php $color = array(
                            array(
                                'title' => '帐号ID',
                                'key' => 'id',
                                'default' => '30829298'
                            ),
                            array(
                                'title' => '每页显示专辑数量',
                                'key' => 'perpage',
                                'default' => '12'
                            ),
                            array(
                                'title' => '播放器最大宽度',
                                'key' => 'max-width',
                                'default' => ''
                            ),
                            array(
                                'title' => '数据缓存时间',
                                'key' => 'cachetime',
                                'default' => '604800'
                            ),
                        );
                        foreach ($color as $key => $V) {
                            ?>
                            <li class="nm-color-li">
                                <code><?php echo $V['title'];?></code>
                                <?php $color = nm_get_setting($V['key']) ? nm_get_setting($V['key']) : $V['default'];?>
                                <input name="<?php echo nm_setting_key($V['key']);?>" type="text" value="<?php echo $color;?>" id="nm-default-color" class="regular-text nm-color-picker" />
                            </li>
                        <?php }
                        ?>
                    </ul>
                    <p class="description">点击你的个人主页，URL类似为<code>http://music.163.com/#/user/home?id=30829298</code>，<code>30829298</code>就是你的ID</p>
                </td>
            </tr>
            <?php /*
            <tr valign="top">
                <th scope="row"><label for="url">网易Cookie</label></th>
                <td>
                    <textarea name="<?php echo nm_setting_key('cookie');?>" class="nm-textarea"><?php echo nm_get_setting('cookie');?></textarea>
                    <p class="description">由于网易云音乐多次封禁 Meting 所使用的 cookie，因此 Meting 将不再做 cookie 的更新工作，如插件获取失败，请用户、开发者自行采集 cookie。下面给出一点提示，自由发挥</p>
                    <p class="description"><code>os=pc; osver=Microsoft-Windows-10-Professional-build-10586-64bit; appver=2.0.3.131777; channel=netease; __remember_me=true</code></p>
                    <p class="description"><code>MUSIC_U=*****; buildver=1506310743; resolution=1920x1080; mobilename=MI5; osver=7.0.1; channel=coolapk; os=android; appver=4.2.0</code></p>
                    <p class="description"><code>osver=%E7%89%88%E6%9C%AC%2010.13.3%EF%BC%88%E7%89%88%E5%8F%B7%2017D47%EF%BC%89; os=osx; appver=1.5.9; MUSIC_U=*****; channel=netease; </code></p>
                </td>
            </tr>
            */?>
            <tr valign="top">
                <th scope="row"><label for="url">自定义CSS</label></th>
                <td>
                    <textarea name="<?php echo nm_setting_key('css');?>" class="nm-textarea"><?php echo nm_get_setting('css');?></textarea>
                    <p class="description">请输入合法的CSS。</p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="url">音乐页面地址</label></th>
                <td>
                    <select name="<?php echo nm_setting_key('pagename');?>" id="pagename">
                        <?php $config_name = nm_get_setting("pagename");$pages = get_pages(array('post_type' => 'page','post_status' => 'publish'));
                        echo "<option class='level-0' value=''>不选择</option>";
                        foreach($pages as $val){
                            $selected = ($val->ID == $config_name)? 'selected="selected"' : "";
                            $page_title = $val->post_title;
                            $page_name = $val->ID;
                            echo "<option class='level-0' value='{$page_name}' {$selected}>{$page_title}</option>";
                        }
                        ?>
                    </select>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('privatelist');?>">自定义歌单</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('privatelist');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('privatelist');?>" id="privatelist" value="1" <?php if(nm_get_setting("privatelist")) echo 'checked="checked"';?>>
                    </label>
                    <p class="description">显示自定义歌单。</p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('lyric');?>">歌词显示</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('lyric');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('lyric');?>" id="lyric" value="1" <?php if(nm_get_setting("lyric")) echo 'checked="checked"';?>>
                    </label>
                    <p class="description">因为歌词是单独获取的，如果歌单中歌曲过多速度会很慢。</p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('likedsongs');?>">显示喜欢的音乐</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('likedsongs');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('likedsongs');?>" id="likedsongs" value="1" <?php if(nm_get_setting("likedsongs")) echo 'checked="checked"';?>>
                    </label>
                    <p class="description">显示喜欢的音乐，默认隐藏。</p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('comment');?>">歌曲评论</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('comment');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('comment');?>" id="comment" value="1" <?php if(nm_get_setting("comment")) echo 'checked="checked"';?>>
                    </label>
                    <p class="description">显示歌曲热门评论。</p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('listopen');?>">隐藏列表</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('listopen');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('listopen');?>" id="listopen" value="1" <?php if(nm_get_setting("listopen")) echo 'checked="checked"';?>>
                    </label>
                    <p class="description">默认展开歌曲列表。</p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('tworow');?>">歌曲列表三列</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('tworow');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('tworow');?>" id="tworow" value="1" <?php if(nm_get_setting("tworow")) echo 'checked="checked"';?>>
                    </label>
                    <p class="description">歌单列表三列显示。</p>
                </td>
            </tr>
            <tr valign="top">
                <th scope="row"><label for="<?php echo nm_setting_key('objcache');?>">对象缓存</label></th>
                <td>
                    <label for="<?php echo nm_setting_key('objcache');?>">
                        <input type="checkbox" name="<?php echo nm_setting_key('objcache');?>" id="objcache" value="1" <?php if(nm_get_setting("objcache")) echo 'checked="checked"';?>>
                    </label>
                    <p class="description">需服务器开启memcached或者redis。</p>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="nm-submit-form">
            <input type="submit" class="button-primary muhermit_submit_form_btn" name="save" value="<?php _e('Save Changes') ?>"/>
        </div>
    </form>
    <h2>清除缓存</h2>
    <p>将清除所有歌曲缓存</p>
    <form method="post">
        <p><input type='submit' name='cleancache' class="button-primary muhermit_submit_form_btn" value='清除缓存'/></p>
        <?php wp_nonce_field('nm-cleancache'); ?>
    </form>
    <style>
        .nm-color-li{position: relative;padding-left: 120px;}
        .nm-color-li code{position: absolute;left: 0;top: 1px;}
        .nm-textarea {
            width:600px;
            height:120px;
        }
    </style>
</div>