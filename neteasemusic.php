<?php 
/*
Plugin Name: Netease Music
Plugin URI: https://fatesinger.com/74369
Description: 网易云音乐歌单插件
Version: 2.0.0
Author: Bigfa
Author URI: https://fatesinger.com
*/	

define('NM_VERSION', '2.0.0');
define('NM_URL', plugins_url('', __FILE__));
define('NM_PATH', dirname( __FILE__ ));
define('NM_ADMIN_URL', admin_url());
define('NM_DEBUG',false);

require NM_PATH . '/functions/nmjson.php';

require NM_PATH . '/functions/core.php';

require NM_PATH . '/functions/embed.php';



