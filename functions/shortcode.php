<?php
global $nmjson;
if(!isset($nmjson)){
    $nmjson = new nmjson();
}

add_shortcode('nms', 'nms_shortcode');

function nms_shortcode( $atts, $content = null ){
    global $instance;
    global $nmjson;
    $instance = $instance ? $instance : 0;
    global $nminstance;

    $nminstance = $nminstance ? $nminstance : 0;
    $html = '';
    if( $instance === 0) $html ='<script>var playlist = []</script><div id="nm_jplayer" style="display:none"></div>';
    extract( shortcode_atts( array(
        'url' => '',
    ),$atts ) );
    wp_enqueue_style('nms');
    wp_enqueue_script('nm');
    wp_enqueue_script('nms');
    if(preg_match('#http:\/\/music\.163\.com\/\#\/(\w+)\?id=(\d+)#i', $url ,$matches)){
        $type = $matches[1];
        $id = $matches[2];
        $html .= nm_generate_player('netease',$type,$id);
    } elseif (preg_match('#http:\/\/www\.xiami\.com\/(\w+)\/(\d+)#i', $url ,$matches)){
        $type = $matches[1];
        $id = $matches[2];
        $html .= nm_generate_player('xiami',$type,$id);
    }
    return $html;
}