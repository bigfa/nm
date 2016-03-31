+function($) {
    'use strict';
    var _event = 'ontouchstart' in document ? 'touchstart' : 'click';
    var __NM = {
        queue : [],
        current : null,
        bomb : 0,
        debug : false,
    }

    var log = function(message) {
        if ( __NM.debug ) console.log(message);
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

    var neteasemusic = function() {
        var self = this;

        this.options = {
            selector : '#nm_jplayer',
        }

        this.player = this.options.selector;

        self._init();

        $(self.player).bind($.jPlayer.event.play, function() {
            var song = playlist[__NM.current][__NM.bomb];
            $('.nms-play-btn').removeClass('nm-pause').addClass('nm-play')
            $('.nms-list-item').removeClass('is-active');
            $('#nm-list-' + __NM.current + ' .nms-list-item').data('status','ready');
            $('#nm-player-' + __NM.current + ' .nmplayer-title').html(song.title + ' - ' + song.artist);
            $('#nm-player-' + __NM.current + ' .duration').html('--:--');
            $('#nm-player-' + __NM.current + ' .nms-play-btn').removeClass('nm-play').addClass('nm-pause');
            if( $('#nm-list-' + __NM.current).length > 0 ) {
                $('#nm-list-' + __NM.current + ' .nms-list-item').eq(__NM.bomb).addClass('is-active');
                $('#nm-list-' + __NM.current + ' .nms-list-item').eq(__NM.bomb).data('status','play');
            }
        });

        $(self.player).bind($.jPlayer.event.pause, function() {
            var song = playlist[__NM.current][__NM.bomb];
            $('#nm-player-' + __NM.current + ' .nms-play-btn').removeClass('nm-pause').addClass('nm-play');
            $('#nm-list-' + __NM.current + ' .nms-list-item').eq(__NM.bomb).data('status','pause');
            log(__NM.bomb);
            log('sb');
        });

        $(self.player).bind($.jPlayer.event.ended, function() {
            if (__NM.bomb < playlist[__NM.current].length - 1 ) {
                __NM.bomb = __NM.bomb + 1;
                self.play(__NM.current,__NM.bomb);
                $(self.player).jPlayer('play');
                log('continue');
            } else {
                __NM.bomb = 0;
                log('end success')
            }           
        });

        $(document).on(_event,'.com-close',function(){
            var _self = $(this);
            _self.parent().remove();
        })

        $(document).on(_event,'.nm-mute',function(){
            var _self = $('.nm-mute');
            var status = _self.data('status');

            if ( status == 'mute') {
                $(self.player).jPlayer('unmute');
                _self.data('status','unmute');
                _self.removeClass('muted');
                log('unmute mod');
            } else {
                _self.data('status','mute');
                $(self.player).jPlayer('mute');
                _self.addClass('muted');
                log('mute mod');
            }
            
        });

        $(document).on(_event,'.nm-previous',function(){
            var _self = $(this);
            var queueIndex = _self.parent().data('index');
            log('previous');
            if ( queueIndex != __NM.current ) return;
            if ( playlist[__NM.current] < 2 ) return;
            log('previous');
            self.previous();
        });

        $(document).on(_event,'.nm-next',function(){
            var _self = $(this);
            var queueIndex = _self.parent().data('index');
            log('next');
            if ( queueIndex != __NM.current ) return;
            log('next');
            self.next();
        });

        $(document).on(_event, '.nms-play-btn', function(){
            var _self = $(this);
            var queueIndex = _self.data('index');

            if ( __NM.current == queueIndex ) {
                if ( _self.hasClass('nm-play') ) {
                    log('player continue.');
                    self.play();                   
                } else {
                    log('player pause.');
                    self.pause();
                }
            } else {
                log('player play.');
                __NM.current = queueIndex;
                self.play(__NM.current,0);
            }            
        });

        $('.nmsingle-process').on('click', function(event) {
            event.preventDefault();
            var _self = $(this),
            index = _self.data('index');
            if ( index !== __NM.current ) return;
            var s = _self.offset().left;
            var percent = ( event.pageX - s ) / _self.width();
            var song = playlist[__NM.current][__NM.bomb].duration;
            $(self.player).jPlayer('play', song * percent);
        });

        $(document).on('click', '.nms-list-item', function(){
            var _self = $(this);
            var thisIndex = _self.parent().data('index');
            var thisBomb = _self.index();
            if ( thisIndex == __NM.current && thisBomb == __NM.bomb ) return log('current song selected');
            __NM.current = thisIndex;
            __NM.bomb = thisBomb;
            $("#nm_jplayer").jPlayer("setMedia",playlist[__NM.current][__NM.bomb]);
            $('#nm_jplayer').jPlayer('play');
        });
    }

    neteasemusic.prototype = {
        _init : function() {
            $(this.player).jPlayer({
                timeupdate:function(c){
                    var b,
                    b = c.jPlayer.status.currentTime,
                    b = formatTime(b),
                    lrc = playlist[__NM.current][__NM.bomb].lrc,
                    l = parseInt(c.jPlayer.status.currentTime);
                    lrc[l] != undefined && ($('#nm-player-' + __NM.current + ' .nmsingle-lrc').html(lrc[l]));
                    $('#nm-player-' + __NM.current + ' .current-time').text(b);
                    $('#nm-player-' + __NM.current + ' .duration').text(formatTime(c.jPlayer.status.duration));                   
                    $('#nm-player-' + __NM.current + ' .nmsingle-process-bar').css('transform','translateX(' + ( c.jPlayer.status.currentPercentAbsolute - 100 ) + '%)');
                },
                supplied: 'mp3',
                swfPath: nm_ajax_url.swfurl,
                solution: 'html,flash',
                volume: 1,
            });
        },
        play: function(queue,index) {
            if( typeof queue != 'undefined' && typeof index != 'undefined' ) this.select(queue,index);
            $(this.player).jPlayer('play');
        },
        pause: function() {
            $(this.player).jPlayer('pause');
        },
        next: function() {
            var max = playlist[__NM.current].length;
            if ( __NM.bomb == (max - 1) ) return;
            this.play(__NM.current,( __NM.bomb + 1 ));
        },
        previous: function() {
            if ( __NM.bomb < 1 ) return;
            log(__NM.bomb);
            this.play(__NM.current,( __NM.bomb - 1 ));
        },
        select: function(queue,index) {
            __NM.current = queue;
            __NM.bomb = index;
            $(this.player).jPlayer("setMedia",playlist[__NM.current][__NM.bomb]);
        },

    }
 
    var nm = new neteasemusic();
    
}(jQuery);