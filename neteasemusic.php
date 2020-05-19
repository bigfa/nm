<?php
/*
Plugin Name: Netease Music
Plugin URI: https://fatesinger.com/74369
Description: WordPress 音乐播放器，支持网易云音乐和虾米音乐。
Version: 3.2.1
Author: bigfa
Author URI: https://fatesinger.com/
*/

define('NM_VERSION', '3.2.1');
define('NM_URL', plugins_url('', __FILE__));
define('NM_PATH', dirname(__FILE__));
define('NM_ADMIN_URL', admin_url());
define('NM_DEBUG', false);

require NM_PATH . '/functions/nmjson.php';

require NM_PATH . '/functions/core.php';

require NM_PATH . '/functions/embed.php';

require NM_PATH . '/functions/static.php';

require NM_PATH . '/functions/pr-list.php';

require NM_PATH . '/functions/shortcode.php';
