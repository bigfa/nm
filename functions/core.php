<?php
global $nmjson;
if(!isset($nmjson)){
    $nmjson = new nmjson();
}

add_shortcode('nm', 'nm_shortcode');
function nm_shortcode( $atts, $content = null ) {
    return netease_music_output();
}

function nm_notice(){
    add_thickbox();
    echo '<div class="updated">
    <p>您的服务器不支持curl，请确认。</p></div>';
}
if ( !is_callable ( 'curl_init' ) ) add_action( 'admin_notices', 'nm_notice' );

add_action('template_redirect', 'netease_music_template', 1 );
function netease_music_template(){
    $page_id = nm_get_setting("pagename");

    if( !$page_id ){
        return ;
    }

    if( !is_page($page_id) ){
        return ;
    }

    include( NM_PATH . '/functions/tpl-nm.php' );
    exit();
}

function netease_music(){

    echo netease_music_output();
}
add_action('wp_ajax_nopriv_get_music', 'netease_music_callback');
add_action( 'wp_ajax_get_music', 'netease_music_callback');
function netease_music_callback(){
    $paged = $_POST["paged"];
    $max = $_POST["max"];
    $content = nm_get_setting('privatelist') ? get_private_list( $paged ) : get_netease_music($paged );
    $nav = ( $max > $paged ) ? $paged + 1 : '';
    $data = array("status"=>200,"data"=>$content,"nav"=>$nav);
    echo json_encode($data);
    die;
}

function netease_music_get_play_count($id){
    $count = get_option('nmpc' . $id ) ? get_option('nmpc' . $id ) : 0;
    return $count;
}

function netease_music_update_play_count($id){
    $count = netease_music_get_play_count($id) + 1;
    update_option( 'nmpc' . $id , $count);
}

function netease_music_output(){
    add_action('wp_footer','nm_player');
    wp_enqueue_script('nm');
    wp_enqueue_script('nmp');
    wp_enqueue_style('nm');
    $max_page = get_netease_max_page();
    $style = '<div id="nm-wrapper" class="nm-wrapper">';
    $output = $style;
    $output .= nm_get_setting('privatelist') ? get_private_list() : get_netease_music();
    $output .= '</div><div class="music-page-navi">';

    if($max_page > 1) $output .= '<a class="nm-loadmore" data-action="get_music" data-paged="2" data-max="'.$max_page.'" href="javascript:;">加载更多音乐</a>';


    $output .='</div><div class="nm-copyright"><i class="fxfont nm-note"></i> <a href="https://fatesinger.com/74369" target="_blank" title="网易云音乐">网易云音乐</a></div>';
    return $output;


}

function get_netease_max_page(){
    global $nmjson;
    if ( nm_get_setting('privatelist') ) {
        $contents = get_option('nm_pr_list');
        if (!$contents ) return;
    } else {
        $userid = nm_get_setting('id') ? nm_get_setting('id') : 30829298;
        $contents = $nmjson->netease_user($userid);
        if (!$contents ) return;
        if(!nm_get_setting('likedsongs')) array_shift($contents);
    }

    $per_page = nm_get_setting('perpage') ? nm_get_setting('perpage') : 16;
    $count  = count($contents);
    $max_page = ceil($count/$per_page);
    return $max_page;
}

function get_private_list($paged = null){
    global $nmjson;
    $index = 0;
    $row = 4;
    $contents = get_option('nm_pr_list');
    if (empty($contents)) return '<div class="nm-error">无数据，请在后台创建自定义歌单。</div>';
    $per_page = nm_get_setting('perpage') ? nm_get_setting('perpage') : 16;
    $count  = count($contents);
    $max_page = ceil($count/$per_page);
    $paged = $paged ? $paged : 1;
    $contents = array_slice( $contents,( ( $paged-1 )* $per_page ), $per_page );
    $css = 'nm-album-list nm-container';
    $output = '<div class="'. $css .'">';
    foreach($contents as $content){
        $index ++;
        $type = $content['type'] ? $content['type'] : 'album';
        $output .= '<div class="nm-list-item" data-type="' . $type . '" data-id="'.$content['id'].'"><div class="nm-list-content"><img class="music-cover" src="'.$content['img'].'"><span class="music-info">'.$content['title'] . '</span></div></div>';

        if( $index%$row==0 && $index < $per_page) $output .= '</div><div class="'. $css .'">';
    }
    $output .='</div>';
    return $output;
};

function get_netease_music($paged = null){
    global $nmjson;
    $index = 0;
    $userid = nm_get_setting('id') ? nm_get_setting('id') : 30829298;
    $userid = trim($userid);
    $row = nm_get_setting('number') ? nm_get_setting('number') : 4;
    $contents = $nmjson->netease_user($userid);
    if( !$contents ) return '<div class="nm-error">获取歌单失败，请确认用户id是否正确。</div>';
    if(!nm_get_setting('likedsongs')) array_shift($contents);
    $per_page = nm_get_setting('perpage') ? nm_get_setting('perpage') : 16;
    $count  = count($contents);
    $max_page = ceil($count/$per_page);
    $paged = $paged ? $paged : 1;
    $contents = array_slice( $contents,( ( $paged-1 )* $per_page ), $per_page );
    $css = 'nm-album-list nm-container';
    $output = '<div class="'. $css .'">';
    foreach($contents as $content){
        $index ++;
        $output .= '<div class="nm-list-item" data-id="'.$content['playlist_id'].'"><div class="nm-list-content"><img class="music-cover" src="'.$content['playlist_coverImgUrl'].'"><span class="music-info">'.$content['playlist_name'] . '</span></div></div>';

        if( $index%$row==0 && $index < $per_page) $output .= '</div><div class="'. $css .'">';
    }
    $output .='</div>';
    return $output;

}
/* add music play with footer hook */
function nm_player(){

    echo '<div id="nm_container" class="nmplaybar"><div class="jp-progress">
    <div class="nmplayer-prosess jp-seek-bar"><div class="jp-play-bar"></div></div>
    </div>
    <div class="nmplayer-wrap nm-container">
        <div class="nmplayer-cover">
        </div>
        <div class="nmplayer-info">
            <span class="nmplayer-title"></span><span class="nmplayer-time"></span><span class="nmplayer-lrc"></span>
        </div>
        <div class="nmplayer-control">
                        <span class="nm-previous fxfont"></span>
                        <span class="nms-play-btn nm-pause fxfont"></span>
                        <span class="nm-next fxfont"></span>
        </div>
    </div>
    <div id="nm_jplayer" style="display:none">
    </div>
    <div class="jp-playlist" style="display:none">
            <ul class="">
                <li></li>
            </ul>
        </div>
</div>';
}

add_action('admin_menu', 'nm_menu');

function nm_menu() {
    add_menu_page( 'neteasemusic', '网易云音乐', 'manage_options', 'neteasemusic', 'nm_setting_page' );
    add_submenu_page( 'neteasemusic', '设置', '设置', 'manage_options', 'neteasemusic', 'nm_setting_page' );
    add_submenu_page( 'neteasemusic', '自定义歌单', '自定义歌单', 'manage_options', 'neteasemusic-list', 'nm_list_setting' );
    //add_submenu_page( 'neteasemusic', '帮助', '帮助', 'manage_options', 'neteasemusic-help', 'nm_setting_page' );
    add_action( 'admin_init', 'nm_setting_group');
}

add_action('wp_ajax_nm_get','nm_get_callback');

add_action( 'wp_ajax_nopriv_nmjson', 'nmjson_callback' );
add_action( 'wp_ajax_nmjson', 'nmjson_callback' );
function nmjson_callback() {
    global $nmjson;

    $id = $_GET['id'];
    $type = $_GET['type'];

    if ( $type == 'album' ) {
        $song = $nmjson->netease_album($id);
    } elseif ( $type == 'song_url' ) {
        $song = $nmjson->song_url('netease',$id);
    } else {
        $song = $nmjson->netease_playlist($id);
    }

    $result = array(
        'msg' => 200,
        'song' => $song
    );

    header('Content-type: application/json');
    echo json_encode($result);
    exit;
}

function get_pagelink(){
    $slug = nm_get_setting('pagename');
    if($slug){
        $slug = get_permalink( get_page_by_path($slug) );
        $slug = rtrim($slug,'/\\');
        return $slug;
    }
    return false;
}

function nm_setting_group() {
    register_setting( 'nm_setting_group', 'nm_setting' );
}

function nm_list_setting(){
    @include 'nm-list.php';
}

function nm_setting_page(){
    @include 'nm-setting.php';
}

function nm_get_setting($key=NULL){
    $setting = get_option('nm_setting');
    if ( isset($setting[$key]) ) {
        return $setting[$key];
    } else {
        return false;
    }
}

function nm_delete_setting(){
    delete_option('nm_setting');
}

function nm_setting_key($key){
    if( $key ){
        return "nm_setting[$key]";
    }

    return false;
}
function nm_update_setting($setting){
    update_option('nm_setting', $setting);
}

