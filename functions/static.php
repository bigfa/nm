<?php

function nm_scripts(){
    wp_register_style( 'nm', NM_URL . '/build/css/page.min.css', array(), NM_VERSION );
    wp_register_style( 'nms', NM_URL . '/build/css/single.min.css', array(), NM_VERSION );
    wp_register_script( 'nm',  NM_URL . '/build/js/base.min.js', array('jquery'), NM_VERSION, true );
    wp_register_script( 'nmp', NM_URL . '/build/js/page.min.js', array(), NM_VERSION, true );
    wp_register_script( 'nms', NM_URL . '/build/js/single.min.js', array(), NM_VERSION, true );
    wp_localize_script( 'nm', 'nm_ajax_url', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'swfurl' => NM_URL . '/build/js/jquery.jplayer.swf',
        'nonce' =>wp_create_nonce('bigfa'),
        'tworow' =>nm_get_setting('tworow'),
        'token' => 'https://fatesinger.com/74369',
        'message' => '文件损坏，请检查插件的完整性。',
    ));
}

function nm_admin_scripts() {
    global $pagenow;

    if ( $pagenow == "admin.php" && $_GET['page'] == 'neteasemusic-list' ) {
        wp_enqueue_style( 'list', NM_URL . '/build/css/setting.min.css', array(), NM_VERSION );
        wp_enqueue_script( 'vuejs', NM_URL . '/build/js/vue.min.js', array(), NM_VERSION, true );
        wp_enqueue_script( 'nm-setting' ,  NM_URL . '/build/js/setting.min.js', array(), NM_VERSION, true);
        wp_localize_script( 'nm-setting', 'nm_ajax_url', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' =>wp_create_nonce('bigfa'),
            'token' => 'https://fatesinger.com/74369',
        ));
    }
}

add_action('wp_enqueue_scripts', 'nm_scripts', 20, 1);
add_action('admin_enqueue_scripts', 'nm_admin_scripts', 20, 1);

function nm_style(){
    if ( nm_get_setting('max-width') || nm_get_setting('css') ) echo  '<style>.nmsingle-container,.nms-list,.nmhotcom{max-width:' . nm_get_setting('max-width') . 'px}' . nm_get_setting('css') . '</style>';
}
add_action('wp_head','nm_style');