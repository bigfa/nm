<?php

function nm_scripts(){
    $prefix = NM_DEBUG ? '' : '.min';
    wp_register_style( 'nm', NM_URL . '/static/css/page.min.css', array(), NM_VERSION );
    wp_register_style( 'nms', NM_URL . '/static/css/single.min.css', array(), NM_VERSION );
    wp_register_script( 'nm',  NM_URL . '/static/js/base' . $prefix . '.js', array('jquery'), NM_VERSION, true );
    wp_register_script( 'nmp', NM_URL . '/static/js/page' . $prefix . '.js', array(), NM_VERSION, true );
    wp_register_script( 'nms', NM_URL . '/static/js/single' . $prefix . '.js', array(), NM_VERSION, true );
    wp_localize_script( 'nm', 'nm_ajax_url', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'swfurl' => NM_URL . '/static/js/jquery.jplayer.swf',
        'nonce' =>wp_create_nonce('bigfa'),
        'tworow' =>nm_get_setting('tworow')
    ));
}
add_action('wp_enqueue_scripts', 'nm_scripts', 20, 1);

add_action('admin_enqueue_scripts', 'nm_admin_scripts', 20, 1);


    function nm_admin_scripts() {
        global $pagenow;

        if ( $pagenow == "admin.php" && $_GET['page'] == 'neteasemusic-list' ) {
            wp_enqueue_style( 'list', NM_URL . '/static/css/list.css', array(), NM_VERSION );
                wp_enqueue_script( 'vuejs', NM_URL . '/static/js/vue.min.js', array(), NM_VERSION, true );
                wp_enqueue_script( 'nm-setting' ,  NM_URL . '/static/js/setting' . $prefix . '.js', array(), NM_VERSION, true);
                wp_localize_script( 'nm-setting', 'nm_ajax_url', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' =>wp_create_nonce('bigfa')
    ));
            }
    }