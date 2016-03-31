<?php

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
}