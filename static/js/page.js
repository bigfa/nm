+function($) {
    'use strict';

    var __PUSSY = {
        queue : [],
        current : null,
        bomb : 0,
        debug : true,
    }

    var playlist = [];

    var log = function(message) {
        if ( __PUSSY.debug ) console.log(message);
        return;
    }

    var formatTime = function(b) {
        if (!isFinite(b) || 0 > b) {
            b = "--:--";
        } else {
            var d = Math.floor(b / 60);
            b = Math.floor(b) % 60;
            b = (10 > d ? "0" + d : d) + ":" + (10 > b ? "0" + b : b)
        }
        return b
    };

    var _makePlaylist = function(songs){
        var listT = '';
        $.each(songs, function(i, item) {
                            listT += '<li class="nm-songlist-item"><span class="song-info">' + item.title + ' - ' + item.artist + '</span><span class="song-time">' + formatTime(item.duration) + '</span></li>'
                        });
        $('.nm-songlist').html(listT);
    }

    var fumino = function() {
        var self = this;

        this.options = {
            selector : '#nm_jplayer',
        }

        this.player = this.options.selector;

        self.init();

        $(document).on("click", ".nm-list-item", function() {
            var _self = $(this);
            var info = _self.data('info');
            var id = _self.data('id');
            var blackdick = 'dick' + id;
            var nmPlayListContainer = $(".nm-songs");
            var is3 = nm_ajax_url.tworow ? ' threerow' : '';
            $('.nmplaybar').addClass('appear');
            var nmPlayListSongslist = '<div class="nm-songs"><div class="nm-songs-title nm-container">' + info + '</div><div class="nm-songs-list nm-container"><ul class="nm-songlist' + is3 + '"></ul></div></div>';
            nmPlayListContainer.remove();
            _self.parent().after(nmPlayListSongslist);
            __PUSSY.current = blackdick;
            $('.nmplayer-cover').css('background-image','url(' + _self.data('cover') + ')');
            if ( playlist[blackdick] ) {
                _makePlaylist(playlist[blackdick]);
                self.play(blackdick,0);
            } else {
                $.ajax({
                type: "post",
                dataType: "json",
                url: nm_ajax_url.ajax_url,
                data: {
                    action: "nmjson",
                    id: id
                },
                success: function(b) {
                    if (200 == b.msg) {
                        
                        b = b.song;
                        var songs = b.songs;
                        _makePlaylist(songs);
                        playlist['dick' + id] = songs;
                        self.play(blackdick,0);
                    }
                }
            });
            }      
            log(__PUSSY.current);
        });


        $(self.player).bind($.jPlayer.event.ended, function() {
            if (__PUSSY.bomb < playlist[__PUSSY.current].length ) {
                __PUSSY.bomb = __PUSSY.bomb + 1;
                self.play(__PUSSY.current,__PUSSY.bomb);
                $(self.player).jPlayer('play');
            } else {
                __PUSSY.bomb = 0;
            }           
        });

        $(document).on('click','.nm-songlist-item',function(){
            var _self = $(this);
            var index = _self.index();
            self.play(__PUSSY.current,index);
            log('play ' + index);
        });

        $('.jp-progress').on('click', function(event) {
            event.preventDefault();
            var _self = $(this);
            var s = _self.offset().left;
            var percent = ( event.pageX - s ) / _self.width();
            var song = playlist[__PUSSY.current][__PUSSY.bomb].duration;
            $(self.player).jPlayer('play', song * percent);
        });

        $(document).on('click','.nm-previous',function(){
            var _self = $(this);
            log('previous');
            self.previous();
        });

        $(document).on('click','.nm-next',function(){
            var _self = $(this);
            log('next');
            self.next();
        });

    }

    fumino.prototype = {
        init : function(){
            $(this.player).jPlayer({
                timeupdate:function(c){
                    var b,
                    b = c.jPlayer.status.currentTime,
                    b = formatTime(b),
                    lrc = playlist[__PUSSY.current][__PUSSY.bomb].lrc,
                    l = parseInt(c.jPlayer.status.currentTime);
                    lrc[l] != undefined && ($('.nmplayer-lrc').html(lrc[l]));
                    $('.nmplayer-time').text(b);
                    $('.nmplayer-prosess').css('transform','translateX(' + ( c.jPlayer.status.currentPercentAbsolute - 100 ) + '%)');
                },
                supplied: 'mp3',
                swfPath: nm_ajax_url.swfurl,
                solution: 'html,flash',
                volume: 1,
            });
        },
        getJSON: function(id) {
            $.ajax({
                type: "post",
                dataType: "json",
                url: nm_ajax_url.ajax_url,
                data: {
                    action: "nmjson",
                    id: id
                },
                success: function(b) {
                    if (200 == b.msg) {
                        var listT = '';
                        b = b.song;
                        var songs = b.songs;
                        playlist['dick' + id] = songs;
                        return songs;
                    }
                }
            });
        },
        play: function(queue,index) {
            if( typeof queue != 'undefined' && typeof index != 'undefined' ) this.select(queue,index);
            $(this.player).jPlayer('play');
        },
        select: function(queue,index) {
            __PUSSY.current = queue;
            __PUSSY.bomb = index;
            $(this.player).jPlayer("setMedia",playlist[__PUSSY.current][__PUSSY.bomb]);
        },
        pause: function() {
            $(this.player).jPlayer('pause');
        },
        next: function() {
            var max = playlist[__PUSSY.current].length;
            if ( __PUSSY.bomb == (max - 1) ) return;
            this.play(__PUSSY.current,( __PUSSY.bomb + 1 ));
        },
        previous: function() {
            if ( __PUSSY.bomb < 1 ) return;
            log(__PUSSY.bomb);
            this.play(__PUSSY.current,( __NM.bomb - 1 ));
        },
    }

    var sb = new fumino();

}(jQuery);