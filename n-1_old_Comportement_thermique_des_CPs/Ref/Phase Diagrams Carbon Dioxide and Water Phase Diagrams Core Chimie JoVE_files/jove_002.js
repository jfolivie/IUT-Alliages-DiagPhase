$ = jQuery;
// created unsubscribe_message constant to use it everywhere to display the message to the user if the email is an unsubcribed e-mail.
const unsubscribe_message = 'You are currently unsubscribed from JoVE E-mails. If you would like to resubscribe, please <a href="https://www.jove.com/about/contact/?form=form-support">Contact Support</a>.';
function gotoarticle(articleid){
	document.location = "/t/"+articleid;
}
var ai_working = false;
function prepareSearchValue(q){
	return encodeURIComponent(q.replace(/[\W_]+/g," "));
}

function debounce(wait, func, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};

$('main #header_search #q, #main-header #header_search #q, .mobile-header #header_search #q').keyup(debounce(500,function(e) {
	var search_value = $(this).val();
	var key = e.which;
	var el = $(this);
	var results_el = el.next('.ai-complete');
	if(key == 40 && results_el.find('ul li')){
		//arrow up
		e.preventDefault();
		e.stopPropagation();
		results_el.find('ul li:first-of-type').focus().addClass('current');
		return false;
	}
	if(search_value.length >= 3){
		ai_working = true;
		//I think this api is only used for TypeAhead work that is being worked on still
		//$.ajax(NEW_APPLICATION_URL + '/api/free/search/autocomplete?query=' + encodeURIComponent(search_value)).done(
			//function(datas){
				//var q = datas.content.matched == false ? search_value : datas.content.query; 
				//if(datas.content.matched == false) {
				//	closeSearchMenu(results_el,el,false);
				//} else {
					var q = search_value;
					$.ajax(API_BASE + '/api/free/search/?per_page=6&query=' + prepareSearchValue(q)).done(
						function(datas2){
							if(typeof datas2 !== 'object') {
								closeSearchMenu(results_el,el,false);
								return;
							} else {
								if(datas2.content.result.length == 0){
									closeSearchMenu(results_el,el,false);
									return;
								}
								$(document).off('mousedown');
								results_el.html('<ul class="ai-complete-results">');
								$('body').css('overflow-y','hidden');
								var results_list = results_el.find('.ai-complete-results');
								var appended = 0;
								$.each(datas2.content.result,function(key,value) {
									var reg = new RegExp('(' + search_value + ')','gi');
									if(reg.test(value.title)){
										parts = search_value.replace(/[\W_ ]+/g,' ').split(/ /g);
										//console.log(parts);
										textval = value.title.replace(reg,'<strong>$1</strong>');
										appended++;
										results_list.append('<li class="ai-result" tabindex="1"><span class="ai-result-text" data-href="/search?q=' + encodeURIComponent(value.title.replace(/(<([^>]+)>)/gi, "")) + '">' + textval + '</span></li>');
									}
								});
								if(appended == 0){
									closeSearchMenu(results_el,el,false);
									return;
								}
								results_el.append('</ul>');
								results_list.find('li').on('click',function(){
									$(this).focus().addClass('chosen');
									window.location.href = $(this).find('span').data('href');
								}).keyup(function(ev){
									var li_key = ev.which;
									if(li_key == 40){
										//arrow down
										ev.preventDefault();//prevent page scroll
										ev.stopPropagation();
										$(this).removeClass('current');
										if($(this).next().hasClass('ai-result')){		
											$(this).next().addClass('current').focus();
										}else{
											results_el.find('ul li:first-of-type').addClass('current').focus();
										}
									}else if(li_key == 38){
										//arrow up
										ev.preventDefault();//prevent page scroll
										ev.stopPropagation();	
										$(this).removeClass('current');
										if($(this).prev().hasClass('ai-result')){		
											$(this).prev().addClass('current').focus();
										}else{
											results_el.find('ul li:last-of-type').addClass('current').focus();
										}
									}else if(li_key == 13){
										//enter key
										ev.preventDefault();
										ev.stopPropagation();
										$(this).addClass('chosen');
										window.location.href = $(this).find('span').data('href');
									}
								});
								results_el.show();
								ai_working = false;
								document.addEventListener('mousedown',(mdev) =>{
									tar = mdev.target								
									if(results_el.is(':visible') && tar.attributes.id?.nodeValue != 'nav-dismiss-search' && tar.attributes.id?.nodeValue != 'q' && tar.classList.contains('ai-result-text') === false && tar.classList.contains('ai-result') === false && tar.classList.contains('chosen') === false && tar.classList.contains('search_button') === false && tar.classList.contains('fa-times') === false){
										closeSearchMenu(results_el,el,true);
										$(document).off('mousedown');
									}
								});
							}
						}
					);
				//}
			//}
		//);
	}else{
		if(!ai_working){
			closeSearchMenu(results_el,el,false);
		}else{
            //console.log(ai_working);
        }
	}
})).on('focus',function(){
	$(this).addClass('active');
	$(this).trigger('keyup');
});
function closeSearchMenu(menu_el,search_el,remove_active){
	menu_el.hide('fast',function(){
		menu_el.html('');
	});
	if(remove_active){
		search_el.removeClass('active');
	}
	$('body').css('overflow-y','auto');
	ai_working = false;
}

$('#nav-dismiss-search .fa-times, .header-mobile-search-box i.far.fa-times.mob_d_none').on('click',function(e){
	e.stopPropagation();
	e.preventDefault();
	$('.search_bar.active').val('');

	setTimeout(function(){
		$('.search_bar.active').trigger('keyup').focus();
	},150)
});
/*
$('main #header_search #nav-dismiss-search').on('click',function(){
	$('main #header_search #q').val('').focus();
});
*/
$('i.fa-twitter').on('click',function(){
	$('.container').toggleClass('expanded');
});

$(function() {
	$('.landing-page-search-icon').on('click',function(){
		$('.header-mobile-search-box').addClass('global-search');
		$('.header-mobile-search-box #q').focus();
	});
	
	$('.mobile-header .fixed-position-header-search  i.far.fa-times').on('click',function(e){
		e.preventDefault();
		$('.header-mobile-search-box').removeClass('global-search');
		e.stopPropagation();
	});
	
	$('.mobile-signout').on('click',function(){
		handle_signout();
	});
	$('.section-category-button').on('click',function(){
		activate = $(this).hasClass('research') ? 'research' : 'education';
		openMobileMenu(activate);
	});
	$(".mobile-menubar-section").on('click',function(){
		if(!$(this).find('.mobile-menubar-section-item').is(':visible')){
		   $('.mobile-menubar-section-item').hide();
		   $(this).find('.mobile-menubar-section-item').show();
		}else{
		   $(this).find('.mobile-menubar-section-item').hide();
		}
		
	});
	$('.mobile-header .header-mobile-search-box form i.fa-search').on('click',function(){
		$(".mobile-header .header-mobile-search-box form").trigger('submit');
	});
	
	
	
    if ($('#se_trial_link').length > 0) {
        if($('#top-image-video-wrapper').length || $('#top-image-banner-wrapper').length) {
            if($(window).width() > 740){
                $('#content.site-content').css({'padding-top':'102px'});
            }
        } else if(!$('.page-template-page-journal-video, .page-template-page-scied-video, .page-template-page-search').length){
            if($(window).width() > 740){
                $('#content.site-content').css({'padding-top':'150px'});
            }
        } else {
            if($(window).width() > 740){
                $('#content.site-content').css({'padding-top':'150px'});
                $('.page-template-page-journal-video #content.site-content, .page-template-page-scied-video #content.site-content, .page-template-page-search #content.site-content').css({'padding-top': '0px'})
            }
        }
    } else {
        if($(window).width() < 740) {
            $('#content.site-content').css({'padding-top':'60px'});
        }
    }
	$('.submit_signup').on('click',function(){
		window.location.href='/account';
	});
	$('#trial_code_link,#trial_code_link_m').on('click',function(){
		hide_new_trialbox();
		if($('#site-navigation button.menu-toggle').is(':visible')){
			$('#site-navigation button.menu-toggle').trigger('click');
		}
		show_jovebox({
			'modal': false,
			'href': '/account/ajax?action=show_trial_code',
			'width': '450',
			'height': '380'
		});
	});

	$('.if-your-institution-submit_signup,.if-your-institution-mobile-submit_signup').on('click',function(){
		var articleid = $("#article_id").val();
		show_new_trialbox('videocard_signup');
	});
	$('.continue-with-shibbo').on('click',function(){
		var articleid = $("#article_id").val();
		$.post( "/account/ajax?action=count_article_trials", {'articleid':articleid,'event_action':'open','event':'videocard_shibbo'}).done(function(data) {
			// DO NOTHING
		});
	});
	/*****Start browse filter*****/
	$('#trial-rec-button').on('click',function(){
		show_request_full_access();
	});
	$('#video-trial-rec-button').on('click',function(){
		show_request_full_access();
	});
	$('.filter-list').on('change',function(e){
		e.preventDefault();
		var order = $(this).val();
		$('.order-search').attr('action', '/search?order='+order).submit();
	});
	$('.filter-list-pop').on('change',function(e){
		e.preventDefault();
		var order = $(this).val();
		$('.order-search-pop').attr('action', '/search?order='+order).submit();
	});
	/****end (could be removed once it's done)****/
	$('#corporate-search-button').on('click',function(){
		query = $('#corporate-search-field').val();
		$.post('/search-corporate',{'q':query},function(data){
			rtn_html = "<ul class='corpsearch'>";
			if(data.results.length > 0){
				rtn_html += "<li class='corpsearch'><strong>You are viewing at the top "+data.results.length+" results of <a href= '/industry/search?q1="+query+"'>"+data.total+" potential articles</a></strong></li>";
				for(i = 0; i < data.results.length; i++){
					item = data.results[i];
					rtn_html += "<li class='article-result corpsearch' onclick='gotoarticle("+item.productid+")'>"+item.name+"</li>";
				}
			}else{
				rtn_html += "<li class='article-result corpsearch'>No results found for your search terms.</li>";
			}
			rtn_html += "</ul>";
			$("#corporate-search-results").html(rtn_html);
		},'json');
	});
	$('#corporate-search-field').on('keypress',function(event){

		var keycode = (event.keycode ? event.keycode : event.which);
		if(keycode == '13'){
			$('#corporate-search-button').trigger('click');
		}
	});

	$('body').on('click',function(e){
			if(!$(e.target).hasClass('corpsearch') && $('.corpsearch').length){
			   $('.corpsearch').remove();
			}
	});

	var winWidth = $(window).width();
	//Back To Top
	if($('main').length > 0){//is this a wordpress page
		$(window).on('scroll',function() {
			curpos = Math.round($(window).scrollTop());
			if(curpos >= $(window).height() && !$('#back-to-top').length){
				$('body').append('<div title="Back to Top" id="back-to-top" role="link" tabindex="0" aria-label="Back to top" style="z-index:999;position:fixed;bottom:20px;font-size:32px;font-weight:bold;color:#FFF;cursor:pointer;text-align:center;background-color:#03ca7e;right:10px;padding:11px;border-radius:50%;transform: rotate(270deg);box-shadow: -2px -4px 4px rgba(0,0,0,.2);" onClick="$(\'html,body\').animate({scrollTop: \'0px\'},500);">&#10140;</div>');
			}else if(curpos < $(window).height() && $('#back-to-top').length){
				$('#back-to-top').remove();
			}
		});
	}

	$('.recent-popular-toggle li').on('click',function() {
		$(this).parent().parent().find('.recent-popular-list').hide();
		$(this).parent().find('li').removeClass('selected');
		$(this).addClass('selected');
		$(this).parent().parent().find('.most-'+$(this).html().toLowerCase()).show();
	});

	$('#advanced_search_link').on('click',function(){
		$('#header_advanced_search').slideToggle();
	});
	/*$('.volume-check-x').on('click',function(){
		$('.volume-check').slideUp('fast');
	});*/
	var param_count = $('#header_advanced_search .param').length;
	$('#header_advanced_search #add_parameter').on('click',function(){
		param_count++;
		parameter_html = "<span id='param_"+param_count+"' class='param ajax_content'><select name='filter_type_"+param_count+"'><option value='and'>and</option><option value='not'>not</option></select><input name='filter_val_"+param_count+"' type='text' maxlength='50' class='sidebar_text_box'><span class='remove_parameter' onclick='remHeadParameter("+param_count+");'>-</span></span>";
		$('#header_advanced_filters').append(parameter_html);
		if ($('#header_advanced_filters .param').length >= 5) {
			$(this).fadeOut();
		}
	});


	$('#fixed-position-header-menu-pane-download').html($('#sidebar_box_download').html());
	$('#fixed-position-header-menu-pane-information').html($('#sidebar_box_information').html());

	$('.fixed-position-header-menu').on('mouseenter',function() {
		$(this).children('.fixed-position-header-menu-pane').slideDown('fast');
	});

	$('.fixed-position-header-menu').on('mouseleave',function() {
		$(this).children('.fixed-position-header-menu-pane').slideUp('fast');
	});

	/*$('#choose_translation').on('mouseenter',function() {
		$('#translation_menu:hidden').slideDown();
	});

	$('#translation_menu').on('mouseleave',function() {
		$('#translation_menu:visible').slideUp();
	});

	$('#translation_menu li').on('click',function() {
		window.location.href=$(this).find('a').attr('href');
	});*/

	$('a.contextual_link').on('mouseover',function() {
		var position = $(this).position();
		$('#contextual_link_preview').css('left',position.left-10).css('top',position.top-32).css('display', 'inline').css('position', 'absolute').show().html('<a href="'+$(this).attr('href')+'"><span><div class="science-education-article-small-list"><img src="//cloudfront.jove.com/files/media/science-education/science-education-thumbs/'+$(this).data('showPreview')+'.jpg" width="200" height="167" /><p class="science-education-article-small-list-title">'+$(this).data('title')+'</p></div></span></a>');
	});

	$('a.contextual_link').on('mouseleave',function() {
		$('#contextual_link_preview').hide().html('');
	});
	
	function openMobileMenu(section){
    	$('#nav-mobile-hamburger').trigger('click');
		if(!$('.mobile-menubar-section.' + section + ' .mobile-menubar-section-item').is(':visible')){
			$('.mobile-menubar-section.'+section).trigger('click');
		}
    }

	function handle_browse_over() {
		var whichMenu = $(this).attr('id').replace('browse_section_','');
		$('.most_recent_list_menu:visible').hide();
		$('.most_popular_list_menu:visible').hide();
		$('#most_recent_list_'+whichMenu).fadeIn();
		$('#most_popular_list_'+whichMenu).fadeIn();
		$('.browse_section.section_selected').removeClass('section_selected');
		$('#browse_section_'+whichMenu).addClass('section_selected');
	}

	function handle_browse_click() {
		var section = $(this).attr('id').replace('browse_section_menu_','').replace('browse_section_homepage_','');
		go_to_section(section);
	}

	function go_to_section(section) {
		if (section == 'all') { window.location.href='/search'; }
		else { window.location.href='/'+section; }
	}

	function close_signin() {
		$('#signin_menu').animate({opacity:0, top:300},'fast',function(){
			$('#signin_form').show();
			$('.signin_options').show();
			$('#signin_status').hide();
			$('#reset_password').hide();
		}).hide('fast').removeClass('open');
	}

	function close_signout() {
		$('#signout_menu').animate({opacity:0, top: 200},'fast').hide('fast');
		$('.nav_avatar_wrapper').removeClass('open');
		$('#new_signout_button').removeClass('open');
		// $('.profile_expand_open').hide();
		// $('.profile_expand_close').show();
	}

	//ipad and iphone fix for browse menu sections
	if(isIDevice()) {
		$('#browse_menu .browse_section').on('click',handle_browse_over);
		$('.browse_section').on('dblclick',handle_browse_click);
	}
	// normal behavior for regular browsers
	else {
		$('#browse_menu .browse_section').on('mouseenter',handle_browse_over);
		$('.browse_section').on('click',handle_browse_click);
	}

	$('.browse_section_menu .section_selected').each(function() {
		var whichSection = $(this).attr('id').replace('browse_section_menu_','');
		$('#most_recent_list_menu_'+whichSection).show();
		$('#most_popular_list_menu_'+whichSection).show();
	});

	$('#close_button').on('click',function() {
		$('.hidden_header').slideToggle();
	});

	$('.browse_button').on('mouseenter',function() {
		$('#browse_menu').slideDown('fast').addClass('open');
		$('.browse_button').addClass('open');
	}).on('click',function() {
		if ($('#browse_menu').is(':visible')) {
			$('#browse_menu.open').slideUp('fast',function() {
				$('.browse_button.open').removeClass('open');
			}).removeClass('open');
		} else {
			$('#browse_menu').slideDown('fast').addClass('open');
			$('.browse_button').addClass('open');
		}
	});



	$('#signin_button, #mobile_signin_button').on('click',function() {
		$('.signin_title').html('Log in to JoVE');
		if ($('#signin_menu').is(':visible')) {
			if(window.innerWidth < 740) {
				$("#primary-menu").slideDown('fast');
			}
			close_signin();
		} else {
			if(window.innerWidth < 740) {
				$("#primary-menu").slideUp('fast');
				$('#signin_button').hide();
				$('#create_account').hide();
				$('#signin_container a.trial.notloggedin').hide();
				$('.fixed-position-header-search').css('display','none');

				//fix signin memu overlapping jove logo issue on small screen
				$('.fixed-position-header-right').addClass('small-screen');
			}

			//slide from bottom to top
			$('#signin_menu').show()
			.css({opacity:0, top:300})
			.animate({opacity:1, top:51},'fast',function(){
				$(this).css({top:''});
			}).addClass('open');
			if($(window).height() < 400) {
				$('#signin_menu').addClass('horizontal-device');
			} else {
				$('#signin_menu').removeClass('horizontal-device');
			}
		}
	});
	$('.menu-toggle').on('click',function(){
		close_signin();
		$("#primary-menu").slideDown('fast');
		$('#signin_button').show();
		$('#create_account').show();
		$('.fixed-position-header-search').css('display', 'block');
		$('#signin_container a.trial.notloggedin').show();

		//fix signin memu overlapping jove logo issue on small screen
		$('.fixed-position-header-right').removeClass('small-screen');
	});
	$(window).on('resize',function(){
		if(window.innerWidth > 740){
			$("#primary-menu").slideDown('fast');
			$('#signin_button').show();
			$('#create_account').hide();
			$('.fixed-position-header-search').css('display', 'inline-block');
			$('#signin_container a.trial.notloggedin').hide();

			//fix signin memu overlapping jove logo issue on small screen
			$('.fixed-position-header-right').removeClass('small-screen');
		}else{
			if($('#signin_menu').is(':visible')){
				$("#primary-menu").hide();
				$('#signin_button').hide();
				$('.fixed-position-header-search').css('display','none');
				$('#create_account').hide();

				//fix signin memu overlapping jove logo issue on small screen
				$('.fixed-position-header-right').addClass('small-screen');
			}else{
				$('#create_account').show();
				$('.fixed-position-header-search').css('display','block');
				$('#signin_container a.trial.notloggedin').css('display','inline-block');
			}
			close_signout();
		}
	});

	$('#signout_container').on('mouseenter',function() {
		$('.nav_avatar_wrapper').addClass('hover');
	}).on('click',function() {
		if ($('#signout_menu').is(':visible')) {
			close_signout();
		} else {
			//slide from bottom to top
			$('#signout_menu').show()
			.css({opacity:0, top:200})
			.animate({opacity:1, top:51},'fast',function(){
				$(this).css({top:''});
			});
			$('.nav_avatar_wrapper').addClass('open');
			$('#new_signout_button').addClass('open');
			// $('.profile_expand_close').hide();
			// $('.profile_expand_open').css('display','inline-block');
		}
	}).on('keydown',function(e) {
		if(e.keyCode == 13 || e.keyCode == 32) {
			if ($('#signout_menu').is(':visible')) {
				close_signout();
			} else {
				//slide from bottom to top
				$('#signout_menu').show()
				.css({opacity:0, top:200})
				.animate({opacity:1, top:51},'fast',function(){
					$(this).css({top:''});
				});
				$('.nav_avatar_wrapper').addClass('open');
				$('#new_signout_button').addClass('open');
				// $('.profile_expand_close').hide();
				// $('.profile_expand_open').css('display','inline-block');
			}
		}
	});

	$('#signout_container').on('mouseleave',function() {
		$('.nav_avatar_wrapper').removeClass('hover');
	});

	$('#signin_username').on('focus',function() {
		if ($(this).val() == 'Email') {
			$(this).val('').css('color','black');
		}
	}).on('blur',function() {
		if ($(this).val() == '') {
			$(this).val('Email').css('color','#969696');
		}
	});

	$('#reset_password_email').on('focus',function() {
		if($(this).val() == 'Email Address') {
			$(this).val('').css('color','black');
		}
	}).on('blur',function() {
		if ($(this).val() == ''){
			$(this).val('Email Address').css('color','#969696');
		}
	});

	$('#signin_password_placeholder').on('focus',function() {
		$(this).hide();
		$('#signin_password').show().trigger('focus');
	});

	/*$('#signin_password').blur(function() {
		if ($(this).val() == '') {
			//$(this).hide();
			$('#signin_password_placeholder').show();
		}
	});*/

	$('#reset_password_link').on('click',function(event) {
		event.preventDefault();
		/*$('.signin_options').slideUp('slow');
		$('#signin_status').slideUp('slow');
		$('#reset_password').slideDown('slow');
		$('#signin_status_reset').slideDown('slow');*/
		$('.signin_options').hide();
		$('#signin_status').hide();
		$('#reset_password').show();
		$('#signin_status_reset').show();
		$('#reset_password_email').trigger('focus');
	});
	$('#reset_password_link_fav').on('click',function(event) {
		event.preventDefault();
		$('.signin_options').slideUp('slow');
		$('#signinstatus').slideUp('slow');
		$('.trial-header').slideUp('slow');
		$('#reset_password_fav').slideDown('slow');
		$('#signin_status_reset_fav').slideDown('slow');
		$('#reset_password_email_fav').trigger('focus');
	});

	$('.search_bar').on('focus',function() {
		if ($(this).val() == 'Separate search terms with commas') {
			//$(this).val('').addClass('search_bar_not_default');
		}
	}).on('blur',function() {
		if ($(this).val() === '') {
			//$(this).val('Separate search terms with commas').removeClass('search_bar_not_default');
		}
	});

	$('.archive_year').on('click',function() {
		if($(this).hasClass('closed')){
			$(this).removeClass('closed');
			$(this).next().slideDown();
		}else{
			$(this).addClass('closed');
			$(this).next().slideUp();
		}

	});

	$('.prompt_access_signin').on('click',function(event) {
		event.preventDefault();
		show_jovebox({
			'modal': false,
			'href': '/account/ajax?action=show_signin',
			'width': '450',
			'height': '392'
		});
	});

	$('.replay_video').on('click',function(event) {
		container_id = $(this).data('playerId')+'_container';
		//if (jwplayer(container_id).getRenderingMode() == 'html5') {
		//	window.location.reload();
		//} else {
			jwplayer(container_id).seek(0);
			$('#related_videos_'+container_id).fadeOut();
		//}
	});

	$('.related_videos_close_button').on('click',function(event) {
		container_id = $(this).data('playerId')+'_container';
		$('#related_videos_'+container_id).fadeOut();
	});

	$('#jovebox_close_button').on('click',function(event) {
		hide_jovebox();
	});

	if ($('#banner_ad').length > 0) {
		var ad_src = '//stats.jove.com/ad_server.php';
		$.ajax({
			url: ad_src,
			dataType: 'jsonp',
			jsonp: 'callback'
		});
	}
	// scied page slider
	$('#upper-slider button').hide();
	$('#down-slider button').hide();
	$('#central-slider .slick-next').on('click',function(e) {
		$('.slider ul.slides').slick('slickNext');
	});
	$('#central-slider .slick-prev').on('click',function(e) {
		$('.slider ul.slides').slick('slickPrev');
	})

	// moves navigation to current position if the page loads to a scrolled point
	$(window).trigger('scroll');

	//check to see if the window has focus
	checkWindowInterval = setInterval(checkWindowFocus, 250);

	/* ADVANCED SEARCH FUNCTIONALITY*/
	if($('#header_advanced_search').length){//don't include this on the search page
		$("#header_advanced_search .section_checkbox, #check_all_toggle").on('change',function(e){
			if(e.target.id == 'check_all_toggle'){
				//console.log(e.target.id);
				if(!$("#check_all_toggle").prop("checked")){
					$(".section_checkbox").prop("checked",false);
					$('#check_all_toggle').prop("checked",false);
					$('#toggle_checkbox_label').html('Check All');

				}else{
					$(".section_checkbox").prop("checked",true);
					$('#check_all_toggle').prop("checked",true);
					$('#toggle_checkbox_label').html('Uncheck All');
				}
			}
			// do not allow user to search with no sections selected
			if ($(".section_checkbox").not(":checked").length != $(".section_checkbox").length) {
				set_exclude("sections");
			} else {
				set_exclude("sections");
			}

		});

		$("#header_advanced_search .series_checkbox, #check_all_series_toggle").on('change',function(e){
			if(e.target.id == 'check_all_series_toggle'){
				//console.log(e.target.id);
				if(!$("#check_all_series_toggle").prop("checked")){
					$(".series_checkbox").prop("checked",false);
					$('#check_all_series_toggle').prop("checked",false);
					$('#toggle_series_checkbox_label').html('Check All');
				}else{
					$(".series_checkbox").prop("checked",true);
					$('#check_all_series_toggle').prop("checked",true);
					$('#toggle_series_checkbox_label').html('Uncheck All');
				}
			}
			// do not allow user to search with no sections selected
			if ($(".series_checkbox").not(":checked").length != $(".series_checkbox").length) {
				set_exclude("series");
			} else {
				set_exclude("series");
			}

		});

		$('#content, #main , h1.site-title, nav, span.fixed-position-header-right, footer, div.signup, iframe').on('click',function(){
			if($('#header_advanced_search').is(':visible')){
				$("#header_advanced_search").slideUp();
			}
		});

		$('#header_advanced_search .filter_heading').on('click',function() {
			var whichIndicator = $(this).attr('id').replace('filter_heading_','');
			if ($(this).hasClass('closed')) {
				$(this).removeClass('closed');
			}else{
				$(this).addClass('closed');
			}

			$('#slide_indicator_'+whichIndicator).toggleClass('closed');
			$('#control_'+whichIndicator).slideToggle().toggleClass('closed').css('overflow','visible');

			$(window).trigger('scroll');
		});
		$("#header_advanced_search .month").on('click',function(){
			var month = $(this);
			var name = month.data("name");
			if (name == 'to') {
				// should be the end of the month for the "to" field
				var newdate = month.data("date").split("-");
				newdate = new Date((newdate[0]), (newdate[1]-1), Number(newdate[2]));
				newdate.setMonth(newdate.getMonth()+1)
				newdate.setDate(newdate.getDate()-1);
				var m = newdate.getMonth()+1;
				var d = newdate.getDate();
				if (m < 10) { m='0'+m; }
				if (d < 10) { d='0'+d; }
				newdate = (newdate.getFullYear())+'-'+m+'-'+d;
			} else {
				var newdate = month.data("date");
			}
			$("#header_advanced_search input[name='"+name+"']")
				.val(newdate)
				.trigger('change');
		});

		$("#header_advanced_search .month_input")
		.on('change',function(){
			var search_form = $("#header_advanced_search");
			var from = search_form.find("input[name='from']");
			var to = search_form.find("input[name='to']")
			var from_val = from.val();
			var to_val = to.val();
			if (from_val && to_val && (from_val > to_val)) {
				from.val(to_val);
				to.val(from_val);
			}
			set_month_styles();
			update_date_displays();
			$('.month_grid').hide();
			$(".date_display").removeClass("selected_date_display");
		});

		$("#header_advanced_search .date_display").on('click',function() {
			$(".date_display").removeClass("selected_date_display");
			whichEditor = $(this).attr("id").replace("date_","").replace("_display","");
			if ($(".month_grid_"+whichEditor).is(":visible")) {
				$(".month_grid").hide();
				$(".date_display").removeClass("selected_date_display");
			} else {
				$(".month_grid").hide();
				$(".month_grid_"+whichEditor).show();
				$("#date_"+whichEditor+"_display").addClass("selected_date_display");
			}
		});

		$("#header_advanced_search .month_close_button").on('click',function() {
			$(".month_grid").hide();
			$(".date_display").removeClass("selected_date_display");
		});
	}

	$(".menu-primary-navigation-container #mobile-dropdown").on("click", function() {
		$("#primary-menu").slideToggle('fast');
	});
});

if($('#header_advanced_search').length){//don't include this on the search page

	function set_exclude(name){
		if(name === 'sections') {
			$("#header_advanced_search input[name='exclude_sections']").val(
				$.map(
					// UI checkboxes are the inverse of the values to be submitted.
					// ie: every box checked = no excluded sections.
					$(".section_checkbox").not(":checked"),
					function(el){
						return $(el).data("section");
					}
				).join(' ')
			);
			$("#header_search").trigger('change');
		} else if (name === 'series') {
			$("#header_advanced_search input[name='exclude_series']").val(
				$.map(
					// UI checkboxes are the inverse of the values to be submitted.
					// ie: every box checked = no excluded sections.
					$(".series_checkbox").not(":checked"),
					function(el){
						return $(el).data("series");
					}
				).join(' ')
			);
			$("#header_search").trigger('change');
		}
	}


	function update_date_displays() {
		var search_form = $("#header_advanced_search");
		var from = search_form.find("input[name='from']");
		var to = search_form.find("input[name='to']")
		var from_val = from.val();
		var to_val = to.val();
		if (from_val == '') {
			$('#date_from_display').html('October, 2006');
		} else {
			$('#date_from_display').html(format_date(from_val));
		}
		if (to_val == '') {
			$('#date_to_display').html('Today');
		} else {
			$('#date_to_display').html(format_date(to_val));
		}
	}

	function format_date(date) {
		var dateArray = date.split('-');
		var month = '';
		switch (dateArray[1]) {
			case '01': month = 'January'; break;
			case '02': month = 'February'; break;
			case '03': month = 'March'; break;
			case '04': month = 'April'; break;
			case '05': month = 'May'; break;
			case '06': month = 'June'; break;
			case '07': month = 'July'; break;
			case '08': month = 'August'; break;
			case '09': month = 'September'; break;
			case '10': month = 'October'; break;
			case '11': month = 'November'; break;
			case '12': month = 'December'; break;
		}
		return month+', '+dateArray[0];
	}

	function set_month_styles() {
		// Iterate over all .months,
		// and set appropriate styles for those that are out of range
		// (if any).
		var from = $(".search_form input[name='from']").val();
		var to = $(".search_form input[name='to']").val();
		$(".month").each(function(){
			var month = $(this);
			var date = month.data("date");
			if ((from && from > date) || (to && date > to)) {
				// TODO define css classes instead.
				month.addClass('unselected');
			} else {
				month.removeClass('unselected');
			}
		});
	}
}


	var checkWindowInterval;

function display_banner_ad(banner) {
	$('#banner_ad').html('<a href="'+banner.link+'" target="_parent"><img src="'+banner.filename+'" width="728" height="90" border="0" /></a>');
}

function remHeadParameter(index){
	if ($('#header_advanced_filters .param').length == 1) {
		$('#header_advanced_filters #param_'+index+' input[type="text"],#header_advanced_filters #param_'+index+' select').val('');
	}else{
		$('#header_advanced_filters #param_'+index).remove();
	}
	if ($('#header_advanced_filters .param').length < 5 && $('#header_advanced_filters #add_parameter').not(":visible")) {
		$('#header_advanced_search #add_parameter').fadeIn();
	}

	//$('#submit_contains_change').trigger('click');//not sure if we want this to happen but maybe
}

function show_jovebox(jovebox_data) {
	$('#jovebox_close_button').hide();
	$('#jovebox_container').show().css('z-index', 10000);
	$('#modal-close').on('click',function() {
		hide_jovebox();
	});


	if (jovebox_data.width) {
		$('#jovebox_content').css('width',jovebox_data.width+'px');
	}
	if (jovebox_data.height) {
		$('#jovebox_content').css('height',jovebox_data.height+'px');
		if (jovebox_data.height/1 > $('#jovebox_mask').css('height').replace('px','')/1-100) {
			$('#jovebox_content').css('margin-top','20px').css('height',($('#jovebox_mask').css('height').replace('px','')/1-40)+'px').css('overflow-y','scroll');
		}
	}
	if (jovebox_data.preventScroll) {
		$('#jovebox_content').css('overflow','hidden');
	}
	if (jovebox_data.preventYScroll) {
		$('#jovebox_content').css('overflow-y','hidden');
		// important, work with css to remove verticle scroll bar
		$('#jovebox_content').addClass('iframe-trial');
	}
	if (!jovebox_data.modal) {
		$('#jovebox_mask').on('click',function() {
			hide_jovebox();
		});
	}
	$('#modal-close').on('click',function() {
		hide_jovebox();
	});
	$('#jovebox_mask').fadeTo('slow',0.6);
	$('#modal-close').fadeTo('slow',0.6);
	$('#jovebox_content').css('margin-left',($('#jovebox_mask').css('width').replace('px','')/2-$('#jovebox_content').css('width').replace('px','')/2)).fadeIn();
	if (jovebox_data.href) {
		$.get(jovebox_data.href,function(data) {
			$('#jovebox_content').html(data);
		});
	}
	if (jovebox_data.iframe) {
		$('#jovebox_content').css('overflow','hidden').html('<iframe style="border:none;'+jovebox_data.css+'" width="'+jovebox_data.width+'" height="'+jovebox_data.height+'" border="0" src="'+jovebox_data.iframe+'"></iframe>');
	}
	if (jovebox_data.html) {
		$('#jovebox_content').css('overflow','hidden').html(jovebox_data.html);
	}
	if (jovebox_data.div) {
		$('#jovebox_content').html($('#'+jovebox_data.div).html());
	}
	if (jovebox_data.show_close_button) {
		$('#jovebox_close_button').css('margin-left',($('#jovebox_content').css('margin-left').replace('px','')/1)+($('#jovebox_content').css('width').replace('px','')/1)-36+'px').css('margin-top',($('#jovebox_content').css('margin-top').replace('px','')/1)+15+'px').fadeIn();
	}
}

function hide_jovebox() {
	if ($('#trial_identifier').length > 0  && !final_trial && $('#rec_form_submitted').val() == 'true'){
		$.post("/account/ajax", {
				action: 'extend_trial'
		},function(data){
/*			time_remaining = 1800;
			trial = true;
			final_trial = 1;
			showTrial();
			trial_timer = setInterval(function(){ adjust_time_left(); },1000);*/

			$('#jovebox_container').fadeOut('slow', function() {
				$('#jovebox_mask').hide().off('click');
				$('#modal-close').hide().off('click');
				$('#jovebox_content').hide().html('<span id="jovebox_default_content"><img src="/img/search-ajax-loader.gif" /></span>');
			});
			$.post('/?clearaccess=true',function(data){window.location.reload();});
		});
	}else if ($('#trial_identifier').length > 0  && !final_trial) {
		return false;
	}else{
		$('#jovebox_container').fadeOut('slow', function() {
			$('#jovebox_mask').hide().off('click');
			$('#modal-close').hide().off('click');
			$('#jovebox_content').hide().html('<span id="jovebox_default_content"><img src="/img/search-ajax-loader.gif" /></span>');
		});
	}
}

function scrollToTargetElemnt(elem_name) {
	document.getElementById(elem_name.substring(1)).scrollIntoView();
}

function scrollToElement(elem_name){
	/*console.log(elem_name);
	target_elem_loc = Math.round($(elem_name).offset().top);
	location = target_elem_loc - Math.round(target_elem_loc * 0.156088577);
	//target = Math.round($(elem_name).offset().top) - Math.round($(window).scrollTop()) - offset;
	//target = target - (Math.round($("header#masthead").height()) + Math.round($("#player_0").height()));
	//console.log("NEW "+target);
	$("html, body").animate({ scrollTop: location+'px' },500);
	return false;*/
	if($('#summary').length){
		id = 'summary';
	}else{
		id = 'abstract';
	}
	document.getElementById(id).scrollIntoView();
	setTimeout(function() {
		//toppos = $(elem_name).scrollTop;
		toppos = $(elem_name).offset().top;
		var newpos = toppos - 125;
		$('html, body').animate({
			scrollTop: newpos
		  }, 100);
	},100);
}

function handle_signin(username,password,statusDiv,redirect) {
	if (username === '') {
		$('#'+statusDiv+':visible').hide();
		$('#'+statusDiv).html('Please enter a valid username.').slideDown();
	} else if (password === '') {
		$('#'+statusDiv+':visible').hide();
		$('#'+statusDiv).html('Please enter a password.').slideDown();
	} else {
		//$("#signin_menu").slideUp('fast');
		$.post("/account/ajax", {
			beforeSend: function(){
				$('#loginmodalid').css('display', 'block');
			},
			action: 'signin',
			username: username,
			password: password,
		}, function(data) {
			switch(data) {
				case 'verified':

				/*if (window.location.href.indexOf('/tests') > -1){
					window.location.href = window.location.href;
				}else{
					window.location.href='/accountindex';
					//show_account_redirect(null);
				}*/
				if (redirect) {
					window.location.href = redirect;
					if (redirect.substring(0,1) == '#') {
						window.location.reload();
					}
				} else {
					window.location.reload();
				}
				break;
				case 'expired':
					$('#loginmodalid').css('display', 'none');
					$('#'+statusDiv).html('Sorry, your email has expired. Please check your email for a new verification link.').slideDown();
				break;
				case 'unverified':
					$('#loginmodalid').css('display', 'none');
					$('#'+statusDiv+':visible').hide();
					$('#'+statusDiv).html('Sorry, this account hasn\'t been verified. Please check your email for a new verification link.').slideDown();
				break;
				case 'password_expired':
					$('#loginmodalid').css('display', 'none');
					$('#'+statusDiv+':visible').hide();
					$('#'+statusDiv).html('Sorry, your password has expired. Please check your email to reset your password.').slideDown();
				break;
				case 'too_many_attempts':
					$('#loginmodalid').css('display', 'none');
					$('#'+statusDiv+':visible').hide();
					$('#'+statusDiv).html('You have exceeded the maximum number of incorrect login attempts. To protect your secutity, please check your email and follow the instructions.').slideDown();
				break;
				case 'is_unsubscribed':
					$('#loginmodalid').css('display', 'none');
					$('#'+statusDiv+':visible').hide();
					$('#'+statusDiv).html(unsubscribe_message).slideDown();
				break;
				default:
					$('#loginmodalid').css('display', 'none');
					$('#'+statusDiv+':visible').hide();
					$('#'+statusDiv).html('Login failed. Please check your email address and password.').slideDown();
				break;
			}
		});
	}
}

function handle_test_signin(username,password,role,statusDiv,redirect) {
	if (username === '') {
		$('#'+statusDiv+':visible').hide();
		$('#'+statusDiv).html('Please enter a valid username.').slideDown();
	} else if (password === '') {
		$('#'+statusDiv+':visible').hide();
		$('#'+statusDiv).html('Please enter a password.').slideDown();
	} else {
		$.post("/account/ajax", {
			action: 'test_signin',
			username: username,
			password: password,
			role: role,
		}, function(data) {
			switch(data) {
				case 'verified':
				if (redirect) {
					window.location.href = redirect;
					if (redirect.substring(0,1) == '#') {
						window.location.reload();
					}
				} else {
					window.location.reload();
				}
				break;
				case 'expired':
					$('#'+statusDiv).html('Sorry, your email has expired. Please check your email for a new verification link.').slideDown();
				break;
				case 'unverified':
					$('#'+statusDiv+':visible').hide();
					$('#'+statusDiv).html('Sorry, this account hasn\'t been verified. Please check your email for a new verification link.').slideDown();
				break;
				case 'modal':
					show_jovebox({
						'modal': true,
						'href': '/account/ajax?action=fill_professor_application',
						'width': '600',
						'height': '600',
					});
				break;
				default:
					$('#'+statusDiv+':visible').hide();
					$('#'+statusDiv).html('Login failed. Please check your email address and password.').slideDown();
				break;
			}
		});
	}
}

function verify_professor(email,firstname,lastname,institution,department,statusModal,username,password,statusDiv,redirect) {

	if (email === '') {
		$('#'+statusModal+':visible').hide();
		$('#'+statusModal).css('color', 'red').html('Please enter your email.').slideDown();
	} else if (firstname === '') {
		$('#'+statusModal+':visible').hide();
		$('#'+statusModal).css('color', 'red').html('Please enter your firstname.').slideDown();
	} else if (lastname === '') {
		$('#'+statusModal+':visible').hide();
		$('#'+statusModal).css('color', 'red').html('Please enter your lastname.').slideDown();
	} else if (institution === '') {
		$('#'+statusModal+':visible').hide();
		$('#'+statusModal).css('color', 'red').html('Please enter your institution.').slideDown();
	} else if (department === '') {
		$('#'+statusModal+':visible').hide();
		$('#'+statusModal).css('color', 'red').html('Please enter your department.').slideDown();
	} else {
		$.post("/account/ajax", {
			action: 'verify_professor',
			email: email,
			firstname:firstname,
			lastname:lastname,
			institution:institution,
			department:department,
		}, function(data) {
			switch(data) {
				case 'success':
					hide_jovebox();
					handle_signin(username,password,statusDiv,redirect);
				break;
				default:
					hide_jovebox();
				  handle_signin(username,password,statusDiv,redirect);
				break;
			}
		});
	}
}


function show_account_redirect(redirect){
	if(redirect){
		window.location.href = redirect;
		if (redirect.substring(0,1) == '#') {
			window.location.reload();
		}
	}else{
	$('#signin_menu').slideUp('fast',function() {
			$('#signin_button').removeClass('open');
			$('#signin_form').show();
			$('.signin_options').show();
			$('#signin_status').hide();
			$('#reset_password').hide();
		}).removeClass('open');
	show_jovebox({
			'modal': true,
			'href': '/account/ajax?action=account_redirect',
			'width': '450',
			'height': '200',
			'preventScroll':true
		});
	}
}

function handle_signout() {
	$.post("/account/ajax", {
		action: 'signout'
		}, function() {
			//location.reload();
			window.location.href="/";

		});
}

function send_request_to_reset_pass(emailAddress,statusDiv) {
	$('.input_error').removeClass('input_error');
	if (!isValidEmailAddress(emailAddress)) {
		$('#reset_password_email').addClass('input_error');
		$('#'+statusDiv+':visible').hide();
		$('#'+statusDiv).html('Please make sure this is a valid email address.').slideDown().css('color','red');
	} else {
		$.post("/account/ajax", {
			action: 'send_reset_password_email',
			email: emailAddress
		}, function(data) {
			if (data == 'true') {
				$('#'+statusDiv+':visible').hide();
				$('#'+statusDiv).html('You should receive an email with instructions momentarily.').slideDown().css('color','#03ca7e');
			} else if(data == 'You entered an unsubscribe E-mail'){
                $('#'+statusDiv+':visible').hide();
				$('#'+statusDiv).html(unsubscribe_message).slideDown();
			}else {
				$('#'+statusDiv+':visible').hide();
				$('#'+statusDiv).html('We could not find an account with that email address or there was an error sending the email.').slideDown().css('color','red');
			}
		});
	}
}

String.prototype.toTitleCase = function () {
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function load_deferred_images() {
	// deferred load of browse menu images
	$('.deferred_load_thumbnail').each(function() {
		whichThumbnail = $(this).attr('data-article-id');
		$(this).attr('src','//cloudfront.jove.com/files/thumbs/'+whichThumbnail+'_70.png');
	});
}

function isIDevice() {
	if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
		return true;
	} else {
		return false;
	}
}

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
}

//science education collections
var cats = new Array();
cats = [{name:"BASIC BIOLOGY", div:"secat1", catid:"1"},{name:"ADVANCED BIOLOGY", div:"secat2", catid:"2"},{name:"PSYCHOLOGY", div:"secat3", catid:"3"},{name:"ENVIRONMENTAL SCIENCES", div:"secat4", catid:"4"},{name:"CHEMISTRY", div:"secat5", catid:"5"}];
var soon = new Array();
soon = [{name:"EARTH SCIENCE", div:"soon1", catid:"4", relatedMenu:"catmenu4"}];


function readGetParam(paramName){
	var result = "no param";
	var tmp = new Array;
	var items = location.search.substr(1).split("&");
	for (var index = 0; index < items.length; index++) {
		tmp = items[index].split("=");
		if (tmp[0] === paramName) result = decodeURIComponent(tmp[1]);
	}
	return result;
}


function initCategory(name){
	hideCategory();
	for(var i=0; i < cats.length ;i++){
		if (cats[i].name == name){
			//console.log("catmenu" + (i+1));
			var d = document.getElementById(cats[i].div)
			var m = document.getElementById("catmenu" + (i+1))
			d.style.display = "block";
			m.className = "selected";
			break;
		}
	}
}

function showCategory(name){
	//hideCategory();
	for(var i=0; i < cats.length ;i++){
		if (cats[i].name == name){
			if (readGetParam('category') != cats[i].catid){
				if (readGetParam('language') != "no param"){
					window.location = "/science-education-database?category=" + cats[i].catid + "&language=" + readGetParam('language');
				}else{
					window.location = "/science-education-database?category=" + cats[i].catid;
				}
			}
			break;
		}
	}

}

function hideCategory(){
	for(var i=0; i < cats.length ;i++){
	//console.log(cats[i].div);
		var d = document.getElementById(cats[i].div)
		var m = document.getElementById("catmenu" + (i+1))
		d.style.display = "none";
		m.className = "";
	}
}

function showComingSoon(name){
	hideCategory();
	hideComingSoon(name);
	for(var i=0; i < soon.length ;i++){
		if (soon[i].name == name){
			//console.log("catmenu" + (i+1));
			var d = document.getElementById(soon[i].div)
			d.style.display = "block";
			break;
		}
	}

}

function hideComingSoon(name){
	hideCategory();
	for(var i=0; i < soon.length ;i++){
			var d = document.getElementById(soon[i].div)
			d.style.display = "none";
		if (soon[i].name == name){
			var m = document.getElementById(soon[i].relatedMenu)
			m.className = "selected";

		}
	}

}

//end science education collections

function passArgs(url){
	if (readGetParam('language') != "no param"){
		window.location = url + "?language=" + readGetParam('language');
	}else{
		window.location = url;
	}
}


/**** TRIALS FUNCTIONALITY ***/
var trial_timer = false;
function fix_padding(){
	if($(window).width() > 740){
		padtop = '161px';
        if($('#se_trial_link').length > 0) {
            padtop= '201px';
        }
	}else{
		padtop = '109px';
	}
	if(!$('.page-template-page-journal-video, .page-template-page-scied-video, .page-template-page-search').length){
		$('#content.site-content').animate({'padding-top':padtop});

	}else{


		if($(window).width() > 740){
			padtop = '64px';
		}else{
			padtop = '0px';
		}
		if($('#se_trial_link').length > 0){

		}




		$('.page-template-page-journal-video #content.site-content, .page-template-page-scied-video #content.site-content, .page-template-page-search #content.site-content').animate({'padding-top':padtop});
	}
}


function showTrial(){

	if(time_remaining <= 0){
        if(location.pathname.indexOf('science-education') == -1) {
    		setTimeout(function(){
    			fix_padding();
    			$("#trial-remaining").remove();
    			$('#trial-banner').slideDown('fast');
    			$('#video-trial-subscription-banner').slideDown('fast');
    		},1000);
        }else{
        	setTimeout(function(){
				//fix_padding();
				$("#trial-remaining").remove();
				$('#trial-banner').slideDown('fast');
				$('#video-trial-subscription-banner').slideDown('fast');
			},1000);
        }
	}else{
        if(location.pathname.indexOf('science-education') == -1) {
    		fix_padding();
    		$('#trial-banner').slideDown('fast');
    		$('#video-trial-subscription-banner').slideDown('fast');
        }else{
        	$('#trial-banner').slideDown('fast');
			$('#video-trial-subscription-banner').slideDown('fast');
        }
	}
	//for css changes exclusively on the video page

	/*  don't alter the style for video page, keep the trial-banner identical on all pages
	if($('.page-template-page-journal-video, .page-template-page-scied-video, .lab-report-page:not(.overview-labs), .lesson-container').length){
		$('#trial-banner').addClass('video-page');
	}
	*/

	//OLD TRIAL BOX CODE
	//html = "<div id='trial_box'>Your trial expires in <span id='time_left'></span></div>";
	//$('body').append(html);
}


//time_remaining = 3600;//to test the trial use this

function adjust_time_left(){
	minutes = Math.floor(time_remaining/60);
	seconds = time_remaining % 60;
	second_string = String(seconds);
	if (second_string.length < 2) {
		second_string = '0'+seconds;
	}

	time_string = String(minutes)+" mins "+second_string+" seconds";
	if (minutes <= 0 && seconds <= 0 && trial_timer) {
		clearInterval(trial_timer);
		trial_timer = false;
		$('#trial-remaining').fadeOut();

		// New logic, where all trial banners are identical
		$('#invite-button').html('Contact Us').off('click').on('click',function(){
			document.location = '/about/contact';
		});
		$('#invite-button').removeClass('no-show');
		$('#trial-message').html('<strong>Your free trial has ended.</strong> <span class="no-mobile no-tablet">Still interested in JoVE? <a href="javascript:show_request_full_access();" style="font-weight:bold;text-decoration:underline;color:#FFF;">Request full access</a> to JoVE from your librarian or institutional manager or contact us!</span>');

/*	This is the old logic where trial banners change depending on the page
		if(!$('.page-template-page-journal-video, .page-template-page-scied-video, .lab-report-page:not(.overview-labs), .lesson-container').length){
			$('#invite-button').html('Contact Us').off('click').on('click',function(){
				document.location = '/about/contact';
			});
			$('#invite-button').removeClass('no-show');
			$('#trial-message').html('<strong>Your free trial has ended.</strong> <span class="no-mobile no-tablet">Still interested in JoVE? <a href="javascript:show_request_full_access();" style="font-weight:bold;text-decoration:underline;color:#FFF;">Request full access</a> to JoVE from your librarian or institutional manager or contact us!</span>');

		}else{
			$('#trial-message').html('Your JoVE trial has ended. Still interested in JoVE? Extend your trial and request access by recommending JoVE to your institution!');
		}
*/

		$.post('/?clearaccess=true',function(data){});
		$('#trial-banner').addClass('trial-complete');

		//some of this information will need to be saved to a session or cookie//
	}else{
		if ($('#trial-remaining').not(':visible') && time_remaining > 0) {
            if(location.pathname.indexOf('science-education') == -1) {
    			$('#trial-banner').slideDown();
            }
		}
		time_remaining--;
	}
	$('#trial-remaining').html(time_string);
}

function show_trial_invite(){
	show_jovebox({
		'modal': true,
		'html': '<div id="invite-form"><h4>Tell your colleague about JoVE</h4><p>Extend your trial by 30 minutes with an invitation!</p><input type="text" id="invite-email" autocomplete="off" placeholder="Email"/><div class="add-entry"></div><div class="error" id="invite-error"></div><div id="invite-list"></div><div id="invited-message">0 PEOPLE SELECTED</div><input type="button" id="invite-send" value="Send" /><div class="clear"></div></div>',
		'width': '400',
		'height': '700',
		'preventYScroll':true,
		'show_close_button':true
	});
	$('#invite-email').on('keypress',function(e) {
		if(e.which == 13) {
			add_invite_email();
		}
	});
	$('#invite-form .add-entry').on('click',function(){
		add_invite_email();
	});

	$('#invite-send').on('click',function(){
		send_invites();
	});
}
function add_invite_email(){
	var email = $('#invite-email').val();
	var errored = false;
	$('#invite-error').html('');
	$('.invite-email-pending').each(function(){
		if(email == $(this).html().replace('<span class="close"></span>','')){
			$('#invite-error').html('You have already entered this email address.');
			$('#invite-email').val('');
			errored = true;
			return false;
		}
	});
	if(!errored){
		if(email.match(/[@.](yahoo|gmail|hotmail|msn|mail2web|aol|mailinator|lycos|mail|netaddress|fastmail|walla|postmaster|abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijk|trbvm|zzn|excite|mail2|icqmail|juno|earthlink|indiatimes|prontoemail|fuzzmail|usermail|888mail|ezwebmailer|icedmail|oddmail|tekmail|mauimail|camail|californiamail|stagemail|stagecrew|emailforiphone|hotmac|macbox|thedoghousemail|emailaccount|returnreceipt|zzn|byke|muchomail|rediff|zapak|nz11|bestsearch|zappo|10minutemail|mvrht|live|outlook|naver|foxmail|hanmail|yeah|icloud|comcast|orange|qq|126|163|263|aliyun|alice|live)\.(com|net|co\.uk|ru|fr|it|nl)$/) || !isValidEmailAddress(email)){
			$('#invite-error').html('Please enter a valid institutional email.');
		}else{
			$.post('/account/ajax',{'action':'check_email','email':email},function(data){
				if(data == 'ok'){
					$('#invite-list').append('<div class="invite-email-pending">'+email+'<span class="close"></span></div>');
					number = $('.invite-email-pending').length;
					num_message = number == 1 ? number+' PERSON SELECTED' : number+' PEOPLE SELECTED';
					$('#invite-email').val('');
					$('#invited-message').html(num_message);
					$('.invite-email-pending .close').on('click',function(){
						$(this).parent().remove();
						number = $('.invite-email-pending').length;
						num_message = number == 1 ? number+' PERSON SELECTED' : number+' PEOPLE SELECTED';
						$('#invited-message').html(num_message);
					});
				}else{
					$('#invite-error').html(data);
				}
			});
		}
	}
}

function send_invites(){
	$('#invite-error').html('');
	var emails = [];
	$('.invite-email-pending').each(function(){
		emails.push($(this).html().replace('<span class="close"></span>',''));
	});
	if(!emails.length){
		$('#invite-error').html('Please add at least 1 email before sending.');
		return false;
	}else{
		$.post('/account/ajax',{'action':'send_invites','emails':emails},function(data){
			if(data.status == 'OK'){
				time_remaining = time_remaining + 1800;
			}
			$('#invite-form').html(data.message);

		},'JSON');
	}
}

function show_recommend_box(){
	$('#trial_box').remove();
	clearInterval(trial_timer);

	tr_rec_id = $('#article_id').val();
	if (tr_rec_id === undefined) {
		tr_rec_id = '';
	}

	if (final_trial) {
		show_jovebox({
			'modal': false,
			'href': '/account/ajax?action=end_trial&video=' + tr_rec_id,
			//'iframe': '/recommend-to-librarian-form?case=end_trial',
			'width': '900',
			'height': '700',
			'preventYScroll':true
		});
	}else{
		show_jovebox({
			'modal': false,
			'href': '/account/ajax?action=trial_recommend_jove&trial=true&video='+ tr_rec_id,
			//'iframe':'/recommend-to-librarian-form?case=trial_recommend_jove',
			'width': '900',
			'height': '850',
			'preventYScroll': true
		});
	}
}

function title_blink(text,times,speed){
	times *= 2;
	original_title = $('title').text();
	counter = 0;
	timer = setInterval(function(){
		var title = document.title;
		document.title = (title == text ? original_title : text);
		counter++;
		if (counter >= times) {
			stop_blink(original_title);
		}
	}, speed);
}
function stop_blink(og_title) {
  clearInterval(timer);
  $('#title').text(og_title);

}
function show_trial_form(){

	/*if ($('#trial_registration #form_fields #email').length) {
		show_jovebox({
			'modal': false,
			'href': '/account/ajax?action=show_trial_box',
			'width': '550',
			'height': '260',
			'preventScroll':true
		});
	}else{
		return false;
	}*/
	return false;
}
//trial = true;//testing variable should be bound to original trial variable set in either the header or footer.

$(function(){
	// if (trial) {
	// 	trial_timer = setInterval(function(){ adjust_time_left(); },1000);
	// 	if(time_remaining > 0){
	// 		showTrial();
	// 	}else{
	// 		setTimeout(showTrial(),1000);
	// 	}
	// 	// $(window).on('resize',function(){
	// 	// 	fix_padding();
	// 	// });
	// }
	$('#invite-button').on('click',function(){
		show_trial_invite();
	});
});

//**** END TRIALS ****/

/*focus check :  load chapters when window has focus, thus creating a token as needed and not expiring if in another tab*/
function checkWindowFocus()
{
	//read from data set in player-render-js.php
	tsPath = $('#for_player_0').data('ts');

	if(!document.hasFocus()){
		return;
	}
 	else{
	var url = window.location.href;
 		if(url.indexOf("/embed/player")=== -1){
			$('.jove_player').each(
				function(index,el){
					new jove.Player(el,tsPath);
				}
			);
			window.clearInterval(checkWindowInterval);
		}
	//console.log("Player set, interval cleared");
	}
}

// for the new Editorial Page //
$(function () {
	$('.board_bio').hide();
    $('li.has-image').on('click',function () {
      if($(this).find('.board_bio').is(":visible") )  {
		$('.board_bio').slideUp();
	  }else{
	  	if($(".board_bio").is(":visible")){
		    $('.board_bio').hide();
	  	}
	  	$(this).find('.editorial_bio').css("color", "purple");
	  	$(this).find('.board_bio').slideToggle();
	  }
    });
});

$("#remove_constraint").on('click',function(){
	    $(".board_bio").slideUp();
	});

//show request full trial dialog -> will be bound to button.
function show_request_full_access() {
	show_jovebox({
		'modal': true,
		'href': '/account/ajax?action=request_full_access',
		'width': '820',
		'height': '1000',
		'show_close_button' : 'true'
	});
}
//alert-dialog
$(".fixed-position-header-alert").on('click',function(){
		if (!$('.alert_container_subscribe_mobile').is(':visible') && !$('.alert_container_subscribe').is(':visible')){
			if($(this).attr('id') == 'mobile'){
				$('.alert_container_subscribe_mobile').show()
				.css({opacity:0, top:500})
				.animate({opacity:1, top:51},'fast',function(){
					$(this).css({top:''}).addClass('open');
				})
			}else{
				$('.alert_container_subscribe').show()
				.css({opacity:0, top:500})
				.animate({opacity:1, top:51},'fast',function(){
					$(this).css({top:''})
				})
			}
		}
		$('.fixed-position-header-alert').addClass('open');
});

$(".fixed-position-header-alert .close_alert").on('click',function(event){
	   if($(this).attr('id') == 'mobile'){
			$('.alert_container_subscribe_mobile').animate({opacity:0, top:500},'fast',function(){}).hide('fast').removeClass('open');
			event.stopPropagation();
	   }else{
			$('.alert_container_subscribe').animate({opacity:0, top:500},'fast',function(){}).hide('fast').removeClass('open');
			event.stopPropagation();
	   }
	$('.fixed-position-header-alert').removeClass('open');
	$('.fixed-position-header-alert .red-dot').css('opacity', '0');
});

$('.my-library-newspaper').on('click',function(){      // row is class not id
     $(this).find('img').attr({ "src": "/img/newspaper-white.svg" });
     $(this).find('span').css('color', '#fff');
});

function update_pending_alerts_accept(){
	var labid = $('.pending-alerts-accept').data('labid');
	var type = $('.pending-alerts-accept').data('invite');
	$.post("/account/ajax", {
			action: 'update_alerts',
			labid: labid,
			type: type,
		}, function(data) {
			if(data=="success"){
				$('.pending-alerts-'+labid).fadeOut();
				window.location.href = window.location.origin +"/labs/"+labid;
			}
	});
}
function update_pending_alerts_dismiss(){
	var labid = $('.pending-alerts-reject').data('labid');
	var type = $('.pending-alerts-reject').data('invite');
	$.post("/account/ajax", {
			action: 'update_alerts',
			labid: labid,
			type: type,
		}, function(data) {
			if(data=="success"){
				$('.pending-alerts-'+labid).fadeOut();
			}
	});
}
function show_new_trialbox(trial_from, se) {
	var trialformselector = se !== undefined ? '.se-modal-trial-overlay' : '.modal-trial-overlay';
	var title = (se !== undefined  || trial_from == 'SE_Landing_Page') ? 'Sign up for free access' : 'Sign up for your free trial';
	var articleid = $("#article_id").val() ? $("#article_id").val() : 0;
	if(trial_from == 'login_form'){
		//close signin menu
		$('#signin_menu').animate({opacity:0, top:300},'fast',function(){
			$('#signin_form').show();
			$('.signin_options').show();
			$('#signin_status').hide();
			$('#reset_password').hide();
		}).hide('fast').removeClass('open');
		$('.modal-trial-overlay .trial-header').html(title);
		if(window.innerWidth < 740){//close menu on mobile
			$('.menu-toggle').trigger('click');
		}
	}else if(trial_from == 'site_header'){
        if($('#trial_label').val() !== undefined) {
            var trial_label = $('#trial_label').val() != '' ? '<span style="color:#F93F5E;">'+$('#trial_label').val()+'</span> section' : 'section';
            title = "Your institution must be subscribed to JoVE's "+trial_label+" to access this content.";
        }
		$('.modal-trial-overlay .trial-header').html(title);
		if(window.innerWidth < 740){
			$('.menu-toggle').trigger('click');
		}
	}else if(trial_from == 'favorite_modal'){
		hide_new_favoritesbox();
	}else if(trial_from == 'videocard_signup'){
		hide_new_institution_favoritesbox();
	}
	$(trialformselector).attr('aria-hidden', false);
	$('body').addClass('noscroll');
	$.post( "/account/ajax?action=count_article_trials", {'articleid':articleid,'event_action':'open','event':trial_from}).done(function(data) {
		// DO NOTHING
	});
	return false;
}
function hide_new_trialbox(se) {
  var trialformselector = se !== undefined ? '.se-modal-trial-overlay' : '.modal-trial-overlay';
  $(trialformselector).attr('aria-hidden', true);
  $('body').removeClass('noscroll');
  $("#error").hide();
  $('#email').removeClass('green-check-icon');
  $("#confirm_password").removeClass('green-check-icon');
  $("#confirm_password").removeClass('red-cross-icon');
  $('#create-trial-form').find('input[type=text], input[type=password], input[type=email], select').val("");
  var articleid = $("#article_id").val() ? $("#article_id").val() : 0;
  $.post("/account/ajax?action=count_article_trials", {'articleid':articleid,'event_action':'close','event':'trial'}, function(data) {
  	//DO  NOTHING
  });
}
function log_events(category,action,label){
	var userid = $('#user_id').val() ? $('#user_id').val() : 0;
	var pageData = $('#jove_stats').html().split("::");
	var statid = pageData[0];
	if (category === undefined) {
		category = '';
	}
	if (action === undefined) {
		action = '';
	}
	if (label === undefined) {
		label = '';
	}

	if(navigator.sendBeacon) {
		var jsondata = new FormData();
		jsondata.append('userid',userid);
		jsondata.append('statid',statid);
		jsondata.append('category',category);
		jsondata.append('action',action);
		jsondata.append('label',label);
		navigator.sendBeacon('https://stats.jove.com/analyticsprocess.php', jsondata);
	} else {
		var dataText = {'userid':userid,'statid':statid,'category':category,'action':action,'label':label};
		$.ajax({
			url: 'https://stats.jove.com/analyticsprocess.php',
			type: 'POST',
			data: dataText,
			async: false
		});
	}
}
function get_path_country(){
	var from_country = 'us';
	var from_country_match = window.location.pathname.match(/^\/(cn|de|es|kr|it|fr|pt|tr|ja)(?:\/|$)/i);
	if(from_country_match){
		from_country = from_country_match[1];
	}
	return from_country.toLowerCase();
}
function create_path_country(){
	return get_path_country() != 'us' ? '/'+get_path_country() : '';
}
/* 
	TOGGLEABLE AUTHORS INFO PANELS ON CATALOGUE PAGES 
*/

// hide all authors-info panels when user clicks anywhere else
$(document).on('click',function(event) {
	$('.authors-panel').hide();
	//console.log($(this), 'document click');
});
// show/hide panel on click
$('.catalog-page, .search-page, .journal-page').on('click', '.authors-hover', function(event) {
	$('.authors-panel').not($(this).next()).hide();
	$(this).next().toggle();
	event.stopPropagation();
	return false;
});
// hide authors-panel when mouse leaves the area
$('.authors-panel').on('mouseleave',function(event) {
	$(this).hide();
});

/* 
	new header a fix for header not working in wordpress page
*/
// toggle solutions dropdown on click
$('.solutions-button').on('click',function(e){
	$('.solutions-dropdown-content').toggleClass('show');
});

// toggle research dropdown on click
$('.research-button').on('click',function(e){
	$('.research-dropdown-content').toggleClass('show');
});
$('.research-button').on('keydown',function(e){
	if(e.keyCode == 13 || e.keyCode == 32) {
		$('.research-dropdown-content').toggleClass('show');
	}
	if(e.keyCode == 27) {
		$('.research-dropdown-content').removeClass('show');
	}
});
// toggle education dropdown on click
$('.education-button').on('click',function(e){
	$('.education-dropdown-content').toggleClass('show');
});
$('.education-button').on('keydown',function(e){
	if(e.keyCode == 13 || e.keyCode == 32) {
		$('.education-dropdown-content').toggleClass('show');
	}
	if(e.keyCode == 27) {
		$('.education-dropdown-content').removeClass('show');
	}
});
// toggle avatar/signout dropdown on click
$('#avatar-button').on('click',function(e){
	$('#signout-menu').toggleClass('show');
});
// toggle mobile hamburger dropdown on click
$('#nav-mobile-hamburger, .hamburger-dismiss-button').on('click',function(e){
	$('.hamburger-dropdown-content').toggleClass('show');
	if($('.hamburger-dropdown-content').is(':visible')){
		$('body').css('overflow-y','hidden');	
	}else{
		$('body').css('overflow-y','auto');
	}
});
$('.mobile-header #nav-mobile-hamburger').on('click',function(e){
	$('body').css('overflow','hidden');
});
$('.hamburger-dismiss-button').on('click',function(e){
	$('body').css('overflow','auto');
});

$('#nav-mobile-search').on('click',function(e){
	$('#nav-logo').css('display', 'none');
	$('#nav-search').addClass('show');
	$('#nav-mobile-search').css('display', 'none');
});

$('#nav-dismiss-search').on('click',function(e){
	$('#nav-logo').css('display', 'block');
	$('#nav-search').removeClass('show');
	$('#nav-mobile-search').css('display', 'block');
});

$(document).on('mouseup',function(e){

	// hide solutions dropdown when clicked outside
	var solutions_container = $('.solutions-dropdown-content');
	var solutions_button = $('.solutions-button');
	if (!solutions_button.is(e.target) && solutions_button.has(e.target).length === 0 
		&& !solutions_container.is(e.target) && solutions_container.has(e.target).length === 0){
		solutions_container.removeClass('show');
		//console.log('hide', solutions_container);
	}

	// hide research dropdown when clicked outside
	var research_container = $('.research-dropdown-content');
	var research_button = $('.research-button');
	if (!research_button.is(e.target) && research_button.has(e.target).length === 0 
		&& !research_container.is(e.target) && research_container.has(e.target).length === 0){
		research_container.removeClass('show');
		//console.log('hide', solutions_container);
	}

	// hide education dropdown when clicked outside
	var education_container = $('.education-dropdown-content');
	var education_button = $('.education-button');
	if (!education_button.is(e.target) && education_button.has(e.target).length === 0 
		&& !education_container.is(e.target) && education_container.has(e.target).length === 0){
		education_container.removeClass('show');
		//console.log('hide', solutions_container);
	}

	// hide mobile hamburger dropdown when clicked outside
	var hamburger_container = $('.hamburger-dropdown-content');
	var hamburger_button = $('#nav-mobile-hamburger');
	if (!hamburger_button.is(e.target) && hamburger_button.has(e.target).length === 0 
		&& !hamburger_container.is(e.target) && hamburger_container.has(e.target).length === 0){
		hamburger_container.removeClass('show');
		//console.log('hide', solutions_container);
	}

	// hide signout dropdown menu 
	var signout_container = $('#signout_menu');
	var avatar_button = $('#new_signout_button');
	if (!avatar_button.is(e.target) && avatar_button.has(e.target).length === 0 
		&& !signout_container.is(e.target) && signout_container.has(e.target).length === 0){
		//console.log('hide', signout_container);
		signout_container.animate({opacity:0, top: 200},'fast').hide('fast');
		$('.nav_avatar_wrapper').removeClass('open');
		avatar_button.removeClass('open');
	}
});
