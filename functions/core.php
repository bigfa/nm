<?php
global $nmjson;
if(!isset($nmjson)){
    $nmjson = new nmjson();
}

add_shortcode('nm', 'nm_shortcode');
function nm_shortcode( $atts, $content = null ) {
    return netease_music_output();
}

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
    $content = get_netease_music($paged );
    if( $max > $paged ) $nav = '<div class="music-page-navi"><a class="nm-loadmore" data-max="' . $max . '" data-paged="'. ($paged + 1) .'" href=
"javascript:;">加载更多音乐</a></div>';
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
    $size = nm_get_setting('coverwidth') ? nm_get_setting('coverwidth') : 180;
    $max_page = get_netease_max_page();
    $style = '<div id="nm-wrapper" class="nm-wrapper">';
    $output = $style;
    $output .= get_netease_music();
    $output .= '</div><div class="music-page-navi">';

    if($max_page > 1) $output .= '<a class="nm-loadmore" data-action="get_music" data-paged="2" data-max="'.$max_page.'" href="javascript:;">加载更多音乐</a>';


    $output .='</div><div class="nm-copyright"><i class="fxfont nm-note"></i> <a href="http://fatesinger.com/74369" target="_blank" title="网易云音乐">网易云音乐</a></div>';
    return $output;


}

function get_netease_max_page(){
    global $nmjson;
    $userid = nm_get_setting('id') ? nm_get_setting('id') : 30829298;
    $contents = $nmjson->netease_user($userid);
    array_shift($contents);
    $per_page = nm_get_setting('perpage') ? nm_get_setting('perpage') : 16;
    $count  = count($contents);
    $max_page = ceil($count/$per_page);
    return $max_page;
}

function get_netease_music($paged = null){
    global $nmjson;
    $index = 0;
    $userid = nm_get_setting('id') ? nm_get_setting('id') : 30829298;
    $row = nm_get_setting('number') ? nm_get_setting('number') : 4;
    $contents = $nmjson->netease_user($userid);
    array_shift($contents);
    $per_page = nm_get_setting('perpage') ? nm_get_setting('perpage') : 16;
    $count  = count($contents);
    $max_page = ceil($count/$per_page);
    $paged = $paged ? $paged : 1;
    $contents = array_slice( $contents,( ( $paged-1 )* $per_page ), $per_page );
    $is_small =  nm_get_setting('small');
    $css = 'nm-album-list nm-container';
    $size = nm_get_setting('coverwidth') ? nm_get_setting('coverwidth') : 180;
    $output = '<div class="'. $css .'">';
    foreach($contents as $content){
        $index ++;
        $output .= '<div class="album--nice nm-list-item" data-cover="'.$content['playlist_coverImgUrl'].'" data-id="'.$content['playlist_id'].'"  data-info="'.$content['playlist_name'].'"><div class="nm-list-content"><img src="'.$content['playlist_coverImgUrl'].'"><span class="music-info">'.$content['playlist_name'] . '</span></div></div>';

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
            <a class="jp-previous" href="javascript:;">
                        <span class="nm-previous fxfont "></span>
                    </a>
                    <a id="nmplayer-button" href="javascript:;">
                        <span class="nm-pause fxfont "></span>
                    </a>
                    <a class="jp-next" href="javascript:;">
                        <span class="nm-next fxfont"></span>
                    </a>
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
    add_options_page('网易云音乐设置', '网易云音乐设置', 'manage_options', basename(__FILE__), 'nm_setting_page');
    add_action( 'admin_init', 'nm_setting_group');
}


add_action( 'wp_ajax_nopriv_nmjson', 'nmjson_callback' );
add_action( 'wp_ajax_nmjson', 'nmjson_callback' );
function nmjson_callback() {
    global $nmjson;

    $id = $_POST['id'];
    $type = $_POST['type'];

    $song = $nmjson->netease_playlist($id);

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

function nm_setting_page(){
    @include 'nm-setting.php';
}

function nm_get_setting($key=NULL){
    $setting = get_option('nm_setting');
    return $key ? $setting[$key] : $setting;
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

require NM_PATH . '/functions/static.php';
