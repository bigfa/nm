<?php
class nmjson
{
    public function __construct()
    {
        //if ( !class_exists('Meting') ) require('Meting.php');
    }

    public function netease_oversea_song($music_id)
    {
        $key = "/netease/song/$music_id";
        $cache = $this->get_cache($key);
        if ($cache) return $cache;
        $url = "http://music.163.com/api/song/detail/?id=" . $music_id . "&ids=%5B" . $music_id . "%5D";
        $response = $this->netease_http($url);
        if ($response["code"] == 200 && $response["songs"]) {
            $album_id = $response["songs"][0]["album"]['id'];
            $album = $this->netease_album($album_id);
            $songs = $album['songs'];
            foreach ($songs as $key => $song) {
                if ($song['id'] == $music_id) $result = $song;
            }
            $result['cover'] = $response["songs"][0]["album"]["picUrl"];
            $this->set_cache($key, $result);
            return $result;
        }
        return false;
    }

    public function netease_song($music_id)
    {
        $key = "/netease/song/$music_id";
        $cache = $this->get_cache($key);
        if ($cache) return $cache;
        $url = "http://music.163.com/api/song/detail/?id=" . $music_id . "&ids=%5B" . $music_id . "%5D";
        $response = $this->netease_http($url);
        if ($response["code"] == 200 && $response["songs"]) {
            //print_r($response["songs"][0]["album"]['id']);
            //处理音乐信息
            //$mp3_url = $response["songs"][0]["mp3Url"];
            //$mp3_url = str_replace("http://m", "http://p", $mp3_url);
            $mp3_url = 'https://music.163.com/song/media/outer/url?id=' .  $music_id . '.mp3';
            $music_name = $response["songs"][0]["name"];
            $mp3_cover = $response["songs"][0]["album"]["picUrl"];
            $mp3_cover = str_replace('http://', 'https://', $mp3_cover);
            $song_duration = $response["songs"][0]["duration"];
            $artists = array();
            foreach ($response["songs"][0]["artists"] as $artist) {
                $artists[] = $artist["name"];
            }
            $artists = implode(",", $artists);
            $lrc = nm_get_setting("lyric") ? $this->get_song_lrc($music_id) : "";
            $result = array(
                "id" => $music_id,
                "title" => $music_name,
                "artist" => $artists,
                "mp3" => $mp3_url,
                "cover" => $mp3_cover,
                "duration" => $song_duration / 1000,
                "lrc" => $lrc
            );
            $this->set_cache($key, $result);
            return $result;
        }
        return false;
    }
    public function netease_songs($song_list)
    {
        if (!$song_list) return false;
        $songs_array = explode(",", $song_list);
        $songs_array = array_unique($songs_array);
        if (!empty($songs_array)) {
            $result = array();
            foreach ($songs_array as $song_id) {
                $result['songs'][]  = $this->netease_song($song_id);
            }
            return $result;
        }
        return false;
    }
    public function netease_album($album_id)
    {
        $key = "/netease/album/$album_id";
        $cache = $this->get_cache($key);
        if ($cache) return $cache;
        $url = "http://music.163.com/api/album/" . $album_id;
        $response = $this->netease_http($url);
        if ($response["code"] == 200 && $response["album"]) {
            //处理音乐信息
            $result = $response["album"]["songs"];
            $count = count($result);
            if ($count < 1) return false;
            $album_name = $response["album"]["name"];
            $album_author = $response["album"]["artist"]["name"];
            $album_cover = $response["album"]["blurPicUrl"];
            $album_cover = str_replace('http://', 'https://', $album_cover);
            $album = array(
                "album_id" => $album_id,
                "album_title" => $album_name,
                "album_author" => $album_author,
                "album_type" => "albums",
                "album_cover" => $album_cover,
                "album_count" => $count
            );
            foreach ($result as $k => $value) {
                $mp3_url = 'https://music.163.com/song/media/outer/url?id=' .  $value["id"] . '.mp3';
                $lrc = nm_get_setting("lyric") ? $this->get_song_lrc($value["id"]) : "";
                $album["songs"][] = array(
                    "id" => $value["id"],
                    "title" => $value["name"],
                    "duration" => $value["duration"] / 1000,
                    "mp3" => $mp3_url,
                    "artist" => $album_author,
                    "lrc" => $lrc
                );
            }
            $this->set_cache($key, $album);
            return $album;
        }
        return false;
    }
    public function netease_playlist($playlist_id)
    {
        $key = "/netease/playlist/$playlist_id";
        netease_music_update_play_count($playlist_id);
        $cache = $this->get_cache($key);
        if ($cache) return $cache;
        $url = "http://music.163.com/api/playlist/detail?id=" . $playlist_id;
        $response = $this->netease_http($url);
        if ($response["code"] == 200 && $response["result"]) {
            //处理音乐信息
            $result = $response["result"]["tracks"];
            $count = count($result);
            if ($count < 1) return false;
            $collect_name = $response["result"]["name"];
            $collect_author = $response["result"]["creator"]["nickname"];
            $album_cover = $response["result"]["coverImgUrl"];
            $album_cover = str_replace('http://', 'https://', $album_cover);
            $collect = array(
                "collect_id" => $playlist_id,
                "collect_title" => $collect_name,
                "collect_author" => $collect_author,
                "collect_type" => "collects",
                "collect_count" => $count,
                "collect_cover" => $album_cover
            );
            foreach ($result as $k => $value) {
                $mp3_url = 'https://music.163.com/song/media/outer/url?id=' .  $value["id"] . '.mp3';
                $artists = array();
                foreach ($value["artists"] as $artist) {
                    $artists[] = $artist["name"];
                }
                $artists = implode(",", $artists);
                $lrc = nm_get_setting("lyric") ? $this->get_song_lrc($value["id"]) : "";
                $collect["songs"][] = array(
                    "id" => $value["id"],
                    "title" => $value["name"],
                    "duration" => $value["duration"] / 1000,
                    "mp3" => $mp3_url,
                    "artist" => $artists,
                    "lrc" => $lrc
                );
            }
            $this->set_cache($key, $collect);
            return $collect;
        }
        return false;
    }
    public function netease_user($userid)
    {
        $key = "/netease/userinfo/$userid";
        $cache = $this->get_cache($key);
        if ($cache) return $cache;
        $userplaylist = array();
        $url = "http://music.163.com/api/user/playlist/?offset=0&limit=1001&uid=" . $userid;
        $response = $this->netease_http($url);
        if ($response["code"] == 200 && $response["playlist"]) {
            $playlists = $response["playlist"];
            foreach ($playlists as $playlist) {
                $album_cover = str_replace('http://', 'https://', $playlist["coverImgUrl"]);
                $userplaylist[] = array(
                    "playlist_id" => $playlist["id"],
                    "playlist_name" => $playlist["name"],
                    "playlist_coverImgUrl" => $album_cover
                );
            }
            $this->set_cache($key, $userplaylist);
            return $userplaylist;
        }
    }

    public function netease_radio($id)
    {
        $key = "/netease/radios/$id";

        $cache = $this->get_cache($key);
        if ($cache) return $cache;
        $url = "http://music.163.com/api/dj/program/detail?id=" . $id;
        $response = $this->netease_http($url);

        if ($response["code"] == 200 && $response["program"]) {
            //处理音乐信息
            $result = $response["program"];

            $count  = count($result);
            $mp3_url = str_replace("http://m", "http://p", $result['mainSong']['mp3Url']);
            $results = array(
                "id" => $result['mainSong']['id'],
                "title" => $result['mainSong']['name'],
                "artist" => $result['mainSong']['artists'][0]['name'],
                "mp3" => $mp3_url,
                "cover" => $result['mainSong']['album']['picUrl'],
                "duration" => $result['mainSong']['duration'] / 1000,
                "lrc" => ""
            );


            $this->set_cache($key, $results);
            return $results;
        }

        return false;
    }
    public function comments($id)
    {
        $key = 'R_SO_4_' . $id;
        $cache = $this->get_cache($key);
        if ($cache) return $cache;
        $url = 'http://music.163.com/api/v1/resource/comments/' . $key . '/?rid=' . $key . '&offset=0&total=false&limit=0';
        $host = parse_url($url);
        $site = $host['scheme'] . "://" . $host['host'];
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_REFERER, $site);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)');
        curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-FORWARDED-FOR:1.2.4.8', 'X-FORWARDED-HOST:' . $host['host'], 'X-FORWARDED-SERVER:' . $host['host']));
        $response =  curl_exec($ch);
        curl_close($ch);
        $response = json_decode($response, true);
        if ($response["code"] == 200 && $response["hotComments"]) {

            $content = $response["hotComments"];
            $this->set_cache($key, $content);
            return $content;
        }

        return false;
    }

    public function get_song_lrc($songid)
    {
        $key = "/netease/lrc/$songid";

        $cache = $this->get_cache($key);
        if ($cache) return $cache;

        $url = "http://music.163.com/api/song/media?id=" . $songid;
        $response = $this->netease_http($url);

        if ($response["code"] == 200 && isset($response["lyric"])) {

            $content = $response["lyric"];
            $result = $this->parse_lrc($content);
            $this->set_cache($key, $result);
            return $result;
        }

        return false;
    }

    private function parse_lrc($lrc_content)
    {
        $now_lrc = array();
        $lrc_row = explode("\n", $lrc_content);

        foreach ($lrc_row as $key => $value) {
            $tmp = explode("]", $value);

            foreach ($tmp as $key => $val) {
                $tmp2 = substr($val, 1, 8);
                $tmp2 = explode(":", $tmp2);

                $lrc_sec = intval($tmp2[0] * 60 + (isset($tmp2[1]) ? $tmp2[1] * 1 : 0));

                if (is_numeric($lrc_sec) && $lrc_sec > 0) {
                    $count = count($tmp);
                    $lrc = trim($tmp[$count - 1]);

                    if ($lrc != "") {
                        $now_lrc[$lrc_sec] = $lrc;
                    }
                }
            }
        }

        return $now_lrc;
    }

    private function netease_http($url)
    {
        $refer = "http://music.163.com/";
        $header[] = "Cookie: " . "appver=1.5.0.75771;";
        //$header[] = "X-Real-IP: 118.88.88.8";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $header);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257 Safari/9537.53');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_REFERER, $refer);
        $cexecute = curl_exec($ch);
        curl_close($ch);

        if ($cexecute) {
            $result = json_decode($cexecute, true);
            return $result;
        } else {
            return false;
        }
    }


    public function get_cache($key)
    {
        if (nm_get_setting("objcache")) {
            $cache = wp_cache_get($key, 'neteasemusic');
        } else {
            $cache = get_transient($key);
        }

        return $cache === false ? false : json_decode($cache, true);
    }

    public function set_cache($key, $value, $hour = 0)
    {
        $value  = json_encode($value);
        if ($hour) {
            $cache_time = 60 * 60 * $hour;
        } else {
            $cache_time = nm_get_setting("cachetime") ? nm_get_setting("cachetime") : (60 * 60 * 24 * 7);
        }

        if (nm_get_setting("objcache")) {
            wp_cache_set($key, $value, 'neteasemusic', $cache_time);
        } else {
            set_transient($key, $value, $cache_time);
        }
    }

    public function clear_cache($key)
    {
        if (nm_get_setting("objcache")) {
            wp_cache_delete($key, 'neteasemusic');
        } else {
            delete_transient($key);
        }
    }
}
