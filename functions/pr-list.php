<?php

function nm_get_callback(){
    echo json_encode(array('data'=>get_option('nm_pr_list')));
    exit;
}
add_action('wp_ajax_nm_delete','nm_delete_callback');

function nm_delete_callback(){
    $id = $_POST['id'];
    if ( $data = nm_delete_item($id) ) {
        echo json_encode(array('status'=>200,'data'=>$data));
        exit;
    } else {
        echo json_encode(array('status'=>500,'message'=>'l'));
        exit;
    }
}

add_action('wp_ajax_nm_add','nm_add_callback');

function nm_add_callback(){
    global $nmjson;
    $id = $_POST['id'];
    $type = $_POST['type'];
    //delete_option( 'nm_pr_list');
    if ( nm_is_added($id) ) {
        echo json_encode(array('status'=>500,'message'=>'existed.'));
        exit;
    }

    $lists = get_option('nm_pr_list') ? get_option('nm_pr_list') : array();
    $album = ( $type == 'playlist' ) ? $nmjson->netease_playlist($id) : $nmjson->netease_album($id);

    if ( empty($album) ) {
        echo json_encode(array('status'=>500,'message'=>'album not existed'));
        exit;
    }


    $name = ( $type == 'playlist' ) ? $album['collect_title'] : $album['album_title'];
    $img = ( $type == 'playlist' ) ? $album['collect_cover'] : $album['album_cover'];
    $ab = array('id'=> $id,'title' => $name ,'img' => $img , 'type' => $type );
    $lists[] = $ab;

    update_option( 'nm_pr_list',$lists);
    header('Content-type: application/json');
    echo json_encode(array('status'=>200,'data'=>array('id'=>$album['album_id'],'title'=>$name,'img'=>$img)));
    exit;
}

function nm_is_added($id){
    $lists = get_option('nm_pr_list');

    if ( !is_array( $lists ) || empty( $lists) ) return false;

    foreach ($lists as $key => $list) {
        if ( $list['id'] == $id ) return true;
    }

    return false;

}

function nm_add_item($id){
    if ( nm_is_added($id) ) return false;
    $info = nm_get_album_info($id);
    $lists = get_option('nm_pr_list');
    $lists[] = nm_get_album_info($id);
    update_option('nm_pr_list',$lists);
    return $info;
}

function nm_get_album_info($id){
    global $nmjson;
    if(!id) return;
    $album = $nmjson->netease_album($id);
    $name = $album['album_title'];
    $img = $album['album_cover'];
    return array(
        'id'=>$id,
        'title' => $name,
        'img' => $img,
    );
}

function nm_delete_item($id){
    $lists = get_option('nm_pr_list');

    foreach ($lists as $key => $list) {
        if ( $list['id'] == $id ) {
            $data = nm_get_album_info($id);
            unset($lists[$key]);
            update_option('nm_pr_list',$lists);
            return $data;
        };
    }

    return false;
}