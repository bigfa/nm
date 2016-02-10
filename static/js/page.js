+function($) {
	var mnPlayLrc = $('.nmplayer-lrc'),
		nmPlayTime = $(".nmplayer-time"),
		nmPlayProsess = $(".nmplayer-prosess"),
		nmPlayBar = $('.nmplaybar'),
		nmPlayButton = $("#nmplayer-button"),
		nmPlayTitle = $('.nmplayer-title'),
		nmWrapper = $("#nm-wrapper"),
		nmPlayCover = $('.nmplayer-cover'),
		formatTime = function(b) {
			if (!isFinite(b) || 0 > b) b = "--:--";
			else {
				var d = Math.floor(b / 60);
				b = Math.floor(b) % 60;
				b = (10 > d ? "0" + d : d) + ":" + (10 > b ? "0" + b : b)
			}
			return b
		},
		nmPlaylist = new jPlayerPlaylist({
			jPlayer: "#nm_jplayer",
			cssSelectorAncestor: "#nm_container"
		}, [], {
			playlistOptions: {
				autoPlay: true
			},
			timeupdate: function(c) {
				var b;
				b = c.jPlayer.status.currentTime;
				b = formatTime(b);
				var current = nmPlaylist.current,
					playlist = nmPlaylist.playlist;
				lrc = playlist[current].lrc;
				l = parseInt(c.jPlayer.status.currentTime);
				lrc[l] != undefined && (mnPlayLrc.html(lrc[l]));
				nmPlayTime.text(b);
				//nmPlayProsess.width(c.jPlayer.status.currentPercentAbsolute + "%")
			},
			supplied: "mp3",
			swfPath: nm_ajax_url.swfPath,
			smoothPlayBar: true,
			keyEnabled: true,
			audioFullScreen: true
		});

	$(document).on("click", ".nm-list-item", function() {
		var _self = $(this),
			cover = _self.data('cover'),
			info = _self.data('info'),
			itemId = _self.data("id"),
			nmPlayListContainer = $(".nm-songs"),
			nmPLayListItem = $(".album--nice"),
			nmPlayTwoRowClass = nm_ajax_url.tworow ? ' threerow' : '',
			nmPlayListSongslist = '<div class="nm-songs"><div class="nm-songs-title nm-container">' + info + '</div><div class="nm-songs-list nm-container"><ul class="nm-songlist' + nmPlayTwoRowClass + '"></ul></div></div>';
		nmPlayCover.css("background-image", "url(" + cover + ")");
		nmPlayBar.addClass('appear');
		if (_self.hasClass('is-active')) {
			if (_self.hasClass('paused')) {
				nmPlaylist.play();
			} else {
				nmPlaylist.pause();
			}
		} else {
			nmPlayListContainer.remove();
			_self.parent().after(nmPlayListSongslist);
			nmPLayListItem.removeClass('is-active');
			_self.addClass('is-active');
			$.ajax({
				type: "post",
				dataType: "json",
				url: nm_ajax_url.ajax_url,
				data: {
					action: "nmjson",
					id: itemId
				},
				success: function(b) {
					if (200 == b.msg) {
						var listT = '';
						b = b.song;
						songs = b.songs;
						$.each(songs, function(i, item) {
							listT += '<li class="nm-songlist-item">' + item.title + ' - ' + item.artist + '<span class="song-time">' + formatTime(item.duration) + '</span></li>'
						});
						$('.nm-songlist').html(listT);
						nmPlaylist.setPlaylist(songs);
					}
				}
			});
		}
	});

	$(document).on($.jPlayer.event.play, function() {
		var song = $('.nm-songlist-item'),
			current = song.eq(nmPlaylist.current);
		song.removeClass('nmplaylist-current');
		nmPlayButton.removeClass('paused');
		song.data('status', 'ready');
		current.data('status', 'play');
		current.addClass('nmplaylist-current');
		mnPlayLrc.empty();
		$('.nm-list-item.is-active').removeClass('paused');
		nmPlayTitle.html(nmPlaylist.playlist[nmPlaylist.current].title + ' - ' + nmPlaylist.playlist[nmPlaylist.current].artist)
	});

	$(document).on($.jPlayer.event.pause, function() {
		nmPlayButton.addClass('paused');
		$('.nm-list-item.is-active').addClass('paused')
	});

	$(document).on("click", "#nmplayer-button", function() {
		var _self = $(this);
		if (_self.hasClass('paused')) {
			nmPlaylist.play();
		} else {
			nmPlaylist.pause();
		}
	});

	$(document).on("click", ".nm-songlist-item", function() {
		var _self = $(this),
			index = _self.index(),
			status = _self.data('status');
		if (status == 'play') {
			_self.data('status', 'pause');
			nmPlaylist.pasue()
		} else {
			if (nmPlaylist.current == index) {
				nmPlaylist.play()
			} else {
				nmPlaylist.play(index)
			}
			_self.data('status', 'play')
		}
	});

	$(document).on("click", ".nm-loadmore", function() {
		var _self = $(this),
			data = _self.data();
		$('.music-page-navi').remove();
		$.ajax({
			url: nm_ajax_url.ajax_url,
			type: "POST",
			data: data,
			dataType: "json",
			success: function(response) {
				if (response.status == 200) {
					nmWrapper.append(response.data);
					if (response.nav) {
						nmWrapper.after(response.nav)
					}
				}
			}
		})
	});

}(jQuery);