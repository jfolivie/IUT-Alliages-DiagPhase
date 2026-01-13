var addthis_config = {"data_track_addressbar":false};
var _each = [].forEach;

$(function() {
	flowplayer(function (config, root, video) {
		video.on(flowplayer.events.MOUNT, function () {
		  var header = root.ui.header;
		  var controls = root.controls;
		  //controls.append('<div><i title="Theater Mode" id="theater-mode" class="fal fa-rectangle-wide"></i></div>');//This will append a button that says theater to the control bar
		  header && controls && _each.call(header.children, function (child) {
			controls.append(child);
		  });
		 	/* $('#theater-mode').on('click',function(){
				  $(this).toggleClass('fp-color-text');
				  if($('div.main').hasClass('research-video')){
					  $('#video-content').toggleClass('col-lg-8');
					  $('#related').toggleClass('theater').toggleClass('col-lg-4');
				  }else{
					  $('#video-top').toggleClass('theater-mode');
				  }
			  });*/
		});
	});
	
	
	//wraps tables on article in a div with overflow.
	$('.translate').on('click',function(){
    menu = $(this).next('#translation_menu');
		if(menu.is(':visible')){
			menu.hide();
			$(this).find('.fa-chevron-down').css('transform','rotate(0deg)').css('padding-left','10px').css('padding-right','0');
		}else{
      menu.show();
			$(this).find('.fa-chevron-down').css('transform','rotate(180deg)').css('padding-left','0').css('padding-right','10px');
		}
    $(this).parent().toggleClass('active');
	});
	$('.chapter-toggle').on('click',function(){
		if(!$('#chapter0').is(':visible')){
			$(this).css('transform','rotate(0deg)');
		}else{
			$(this).css('transform','rotate(180deg)');
		}
		$('.chapter').toggle();
	});
	$("article section table").wrap("<div class='overflow'></div>");
	$('span#video-text-toggle').on('click',function(){
		$('#video-text').toggle();
		if($('#video-text').is(':visible')){
			$(this).html('Show less');
		}else{
			$(this).html('Show more');
		}
	});
	var category_id = ($('#category_id').val() != undefined) ? $('#category_id').val() : '';
	if(category_id == 10) {
		LOCALIZATION.init(getCookie('LANGUAGE'), ['scienceEducation']);
	} else if (category_id == 12) {
		LOCALIZATION.init(getCookie('CORECHEM_LANGUAGE'), ['scienceEducation']);
	} else if (category_id == 13) {
		LOCALIZATION.init(getCookie('COREMOLBIO_LANGUAGE'), ['scienceEducation']);
	} else if (category_id == 9) {
        LOCALIZATION.init(get_site_language(),['scienceEducation']);
    }
	$('.favorite').off('click').on('click',function(){
		var state = 0;
		uid = $('#user_id').val().trim();
		if(uid === 0 || uid.length === 0){
			//show_jove_modal({modal_name:'favorite-modal'});

			// direct users to the signin page
			window.location.href="/account/signin";

            // $('#favorite-modal').jovebox({
            //     max_width: '400px'
            // });
		}else{
			// if($(this).hasClass('fav_article')){
			// 	if($(this).hasClass('is_favorite')){
			// 		$(this).html('Add to Favorites').removeClass('is_favorite');
			// 		state = 1;
			// 	}else{
			// 		$(this).html('Remove from Favorites').addClass('is_favorite');
			// 	}
			// }else{
			// 	if($(this).hasClass('is_favorite')){
			// 		state = 1;
			// 		$(this).removeClass('is_favorite').removeClass('fas').addClass('far');
			// 	}else{
			// 		$(this).removeClass('far').addClass('fas').addClass('is_favorite');
			// 	}
			// }
			// $.get('../../mvc/model/AddRemoveFav.php',{'aid':$('#video_id').val(),'uid':$('#user_id').val(),'state':state},function(){
			// 	//console.dir(data);
			// });

			if($(this).attr('class').indexOf('article-favorite') != -1){
				if($(this).hasClass('is_favorite')){
					state = 1;
					$('.article-favorite').removeClass('is_favorite');
					$('.article-favorite').attr('title', 'Add to Favorites');
				}else{
					$('.article-favorite').addClass('is_favorite');
					$('.article-favorite').attr('title', 'Remove Favorite');
				}
			}else{
				var category_id = ($('#category_id').val() != undefined) ? $('#category_id').val() : '';
				var remove_text = 'Remove Favorite';
				var add_text = 'Add to Favorites';
				if(category_id == 10 || category_id == 12 || category_id == 13 || category_id == 9) {
					// switch (getCookie('LANGUAGE')) {
					// 	case 'Chinese':
					// 		remove_text = '移出收藏夹';
					// 		add_text = '加入收藏夹';
					// 		break;
					// 	case 'German':
					// 		remove_text = 'FAVORIT ENTFERNEN';
					// 		add_text = 'ZU DEN FAVORITEN HINZUFÜGEN';
					// 		break;
					// 	case 'Russian':
					// 		remove_text = 'Удалить из избранного';
					// 		add_text = 'ДОБАВИТЬ В ИЗБРАННОЕ';
					// 		break;
					// 	case 'Korean':
					// 		remove_text = '즐겨 찾기 제거';
					// 		add_text = '즐겨찾기에 추가';
					// 		break;
					// 	case 'French':
					// 		remove_text = 'Supprimer le favori';
					// 		add_text = 'Ajouter aux Favoris';
					// 		break;
					// 	case 'Dutch':
					// 		remove_text = 'Favoriet verwijderen';
					// 		add_text = 'TOEVOEGEN AAN FAVORIETEN';
					// 		break;
					// 	case 'Spanish':
					// 		remove_text = 'Eliminar favorito';
					// 		add_text = 'AGREGAR A FAVORITOS';
					// 		break;
					// 	default:
					// }
					add_text = LOCALIZATION.get_translation('Add to Favorites');
					remove_text = LOCALIZATION.get_translation('Remove Favorite');
				}
				if($(this).attr('class').indexOf('add_fav') != -1){
					$(this).html(remove_text).removeClass('add_fav').addClass('rem_fav').addClass('active');
				}else{
					state = 1;
					$(this).html(add_text).removeClass('rem_fav').addClass('add_fav').removeClass('active');
				}
			}
			$.post(create_path_country() + '/article/articleajax',{'action':'AddRemoveFav','aid':$('#video_id').val(),'uid':$('#user_id').val(),'state':state},function(data){
				//console.dir(data);
			});
		}

	});

	$('.replay_video').on('click',function(){
		flowplayer('#player_0_container').play();
	});
	/*
	if ($('#video_id').length > 0) {
		$.ajax({
	        url: '//stats.jove.com/api/1/view_count.php?id='+$('#video_id').val(),
	        dataType: 'jsonp',
	        jsonp: 'callback'
	    });
	}*/

	if(window.con_dmarc == 19){
		$('[class=article_text]').each(function(){
			$(this).empty();
		});
		$('[class=article_text]').html('<h2 class="section_heading in_navigation"></h2><p class="jove_content">To View the Full Article, Please Visit <a href="//www.jove.com">www.JoVE.com</a></p>');
	}

	$('.section_heading.in_navigation').each(function() {
		var whichSection = $(this).attr('id').replace('section_heading_','');
		$('#article_navigation').append('<li class="scroll_to" id="article_navigation_'+whichSection+'"><a href="#'+whichSection+'">'+whichSection.replace(/_/g,' ').toTitleCase()+'</a></li>');
	});

	$('.button-holder .recommend, .link_subscribe').on('click',function() {
		show_jovebox({
			'modal': false,
			'href': '/account/ajax?action=recommend_jove&trial=false&video='+$("#article_id").val(),
			'width': '900',
			'height': '695'
		});
		return false;
	});

	$('#view_count_detail').on('click',function() {
		show_jovebox({
			'modal': false,
			'iframe': '/video-statistics/'+$('#video_id').val(),
			'width': '900',
			'height': '430',
			'show_close_button': true
		});
		return false;
	});

	$('.scroll_to').on('click',function() {
		var whichLink = $(this).find('a').attr('href').replace('#','');
		$('html, body').animate({
    	scrollTop: $("a[name='"+whichLink+"']").offset().top/1-$('#fixed-position-header-main').height()/1
		}, 500);
		return false;
	});

    $('#application_notes_signin_link').on('click',function() {
	if ($('#user_id').val() === '') {
		$('.jove_player').hide();
		show_jovebox({
				'modal': true,
				'href': '/account/ajax?action=show_application_notes_signin',
				'width': '600',
				'height': '400'
			});
	}
    });

    $('#application_notes_register_checkbox').on('change',function() {
	if ($('#application_notes_register_checkbox').is(':checked')) {
		if ($('#user_id').val() === '') {
			$('.jove_player').hide();
			show_jovebox({
					'modal': true,
					'href': '/account/ajax?action=show_application_notes_signin',
					'width': '600',
					'height': '400'
				});
		} else {
			$.post('/account/ajax?action=register_application_notes',
				{'article_id':$('#article_id').val()},
				function(data) {
					$('#application_notes_register').html(data);
			});
		}
	}
    });


	$('.access_attribution_text').on('click',function() {
		window.location.href="/access";
	});

    // merge conflict from jove.com
	//video published notification
	$('#video-notify-button').on('click',function(){
		$('#video-notify-message').slideUp();
		$('#video-notify-email').removeClass('error_msg');
		if($('#user_id').val() == ''){
			show_no_video_box();
		}else{
			var articleid = $('#video_id').val();
			var email = $('#video-notify-email').val();
			if (email == '') {
				$('#video-notify-email').addClass('error_msg');
				$('#video-notify-message').text('Please enter your email address');
				$('#video-notify-message').slideDown();
				return false;
			}
			if(!email.match(/.*?@.*\..*/) || email.match(/.*?@.*@/)){
				$('#video-notify-email').addClass('error_msg');
				$('#video-notify-message').text('Please enter a valid email');
				$('#video-notify-message').slideDown();
				return false;
			}
			$.post('/article/articleajax', {'action':'add_video_notify','articleid':articleid,'email':email}, function(data){
				switch (data){
					case 'Added':
						$('#video-notify-form').html('Success! You\'ll receive a notification as soon as the video is available.').addClass('video-notify-success');
					break;
					case 'Already Set':
						$('#video-notify-form').html('You have already requested to be notified of this video\'s publication.').addClass('video-notify-fail');
					break;
					case 'Unsubscribed':
						$('#video-notify-form').html('You have unsubscribed from JoVE. Please contact <a href="mailto:supprt@jove.com">support@jove.com</a>.').addClass('video-notify-fail');
					break;
					case 'Error':
						$('#video-notify-form').html('Something went wrong. Please let us know <a href="mailto:supprt@jove.com">support@jove.com</a>.').addClass('video-notify-fail');
					break;
				}
			});
		}
		return false;
	});
	//call ajax to write to citations
	
	// save to playlist 
	$('.save-to-playlist').on('click',show_playlist_modal);
	$('.add-to-playlist').on('click',show_playlist_modal);
	$('.mobile-add-to-playlist').on('click',show_playlist_modal);
	$('.playlist-add-button').on('click',show_playlist_modal);
	// moves navigation to current position if the page loads to a scrolled point
    $(window).trigger('scroll');

});
function show_playlist_modal() {
	var userid = $('#user_id').val().trim();
	if(userid === 0 || userid.length === 0) {
		window.location.href = create_path_country() + '/account/signin';
	} else {
		$('#playlist-add-modal').jovebox({
			max_width: '375px',
			margin: '20vh auto',
			onOpen: function() {
				var user_id = $('#user_id').val();
				var video_id = $('#article_id').val();
				$.post(create_path_country() + '/playlist/ajax?action=get_user_playlist', {
					user_id: user_id,
					video_id: video_id
				}).done(function(data) {
					if(data === '0') {
						$('.playlist-list').html('Please create a new playlist');
					} else {
						$('.playlist-list').html(data);
					}
				});
			},
			onClose: function() {
				$('.playlist-list').empty();
				$('.create-new-playlist').show();
				$('.playlist-create-form').hide();
			}
		});
	}
}
//this is used on an onClick on the link.  did this to make sure nothing was over ridden. revisit.
function record_citation(userid, articleid) {
	$.post("/article/articleajax",
		{
		userid: userid,
		articleid: articleid,
		action: 'cite'
	}, function(data) {
		console.dir(data);
		//alert('citation saved');
	});

}

