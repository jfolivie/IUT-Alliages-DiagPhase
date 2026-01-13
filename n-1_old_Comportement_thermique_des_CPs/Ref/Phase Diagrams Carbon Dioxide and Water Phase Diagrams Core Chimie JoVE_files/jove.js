//try{Typekit.load({ async: true });}catch(e){}
jQuery(document).ready(function($) {
	$('section.articles .filter-list').change(function(data){
		var section = $(this).val();
		var type = $(this).attr('id');
		$(this).blur();
		$.ajax({
			type: "POST",
			url: '/ArticleFilterAjax',
			data: {filter:type, section:section, num:8},
			dataType: 'json',
			success:function(data){

					if (Array.isArray(data)){
							var innerhtml = "";
							for (i = 0; i < data.length; i++) {
									d = data[i];
									var dotClass = 'journal';
									if(d['StreamID'] == 5){
											dotClass = 'scied';
									}
									//console.dir(d);
									innerhtml += '<li class="video-card" title="'+d['Name']+'"><div class="article-image" style="background-image:url(' + d["thumb_url"] + ');"><a href="' + d["canonical"] + '"><h3 class="' + dotClass + '">' + d["section_name"] + '</h3><span class="play_button"><span class="ellipse"></span></span><img class="article_thumb" id="article_' + d["ProductID"] + '_thumb" width="104px" border="0" src="' + d["thumb_url"] + '" alt="' + d["Name"] + '"></a></div><div class="article-title"><a href="' + d["canonical"] + '">' + d["short_title"] + '</a></div>';
							}
							$('#'+type).parent().parent().next().fadeOut().slick('unslick').html(innerhtml).slick({
									slidesToShow: 4,
									slidesToScroll: 4,
									centerMode: false,
									swipeToSlide: true,
									infinite: false,
									responsive: [
										{
										  breakpoint: 1024,
										  settings: {
											slidesToShow: 3,
											slidesToScroll: 3
										  }
										},
										{
										  breakpoint: 800,
										  settings: {
											slidesToShow: 2,
											slidesToScroll: 2
										  }
										},
										{
										  breakpoint: 480,
										  settings: {
											slidesToShow: 1,
											slidesToScroll: 1
										  }
										}
									]
							}).fadeIn();
					}
			}
		});
	});

	$('a[href*=\\#]:not([href=\\#])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
		  var target = $(this.hash);
		  target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
		  if (target.length) {
		    $('html,body').animate({
		      scrollTop: target.offset().top - 260
		    }, 500);
		    return false;
		  }
		}
	});

	var winWidth = $(window).width();
	if(($('body').hasClass('page-template-page-journal-video') || $('div.page-template').hasClass('page-template-page-journal-video')) && winWidth > 767){
		$('#content #main article section').appear();
		/*$(document.body).on('appear', '#content #main article section', function(e, $affected) {
			var rel = $(this).attr('id');
			$('#content ul.article-nav li a.'+rel).addClass('active');
		});

		$(document.body).on('disappear', '#content #main article section', function(e, $affected) {
			var rel = $(this).attr('id');
			$('#content ul.article-nav li a.'+rel).removeClass('active');
		});
		*/
		$('.meta-video-header').appear();
		$('.related.video-slide-panel').appear();
		/*
		$(document.body).on('appear', '.meta-video-header', function(e, $affected) {
			$('.article-nav').removeClass('visible');
		});

		$(document.body).on('disappear', '.meta-video-header', function(e, $affected) {
			$('.article-nav').addClass('visible');
		});*/

		$(document.body).on('appear', '.related.video-slide-panel', function(e, $affected) {
			$('.video-player').addClass('bot');
			var vidBot = Math.round($('.article-sidebar .fixed').height())+ 44;
			$('.video_container').css('bottom',vidBot+'px');
			$('.article-sidebar .fixed').addClass('bot');
		});

		$(document.body).on('appear', '#comments', function(e, $affected) {
			if($('.video-player').hasClass('bot')){
				$('.video-player').removeClass('bot');
				$('.video_container').css('bottom','');
				$('.article-sidebar .fixed').removeClass('bot');
			}
		});

		//var padTod = Math.round($(window).width()*.17);
		var vidHeight = Math.round($('#player_0').height()); // the intial height of the video container, since it will be removed while the video is fixed right
		if(vidHeight < 50){vidHeight = Math.round($('#player_0').attr('data-height')); }
		var startTop = Math.round($('.article-sidebar .fixed').offset().top)+300;
		//var difference = Math.round($(window).height() - $('.article-sidebar .fixed').height());
		//var startBot = (Math.round($(window).height() - $('article').offset().top - $('article').height())*-1)+(difference-84)-padTod;

		$(window).scroll(function() {
			var elTop = startTop;
			var winTop = Math.round($(window).scrollTop());
			var winWidth = $(window).width();
			if (winTop >= elTop && winTop >= startTop && !$('.article-sidebar .fixed').hasClass('fix') && winWidth > 767) {
				$('.video-player').css('height',vidHeight+'px');
				$('.article-sidebar .fixed, #main .article_container article, .article-sidebar').addClass('fix');
				$('.video-player').addClass('fixed');
				//$('.article-nav').addClass('visible');
			} else if($('.article-sidebar .fixed').hasClass('fix') && winTop <= elTop && winTop <= startTop) {
				$('.article-sidebar .fixed, #main .article_container article, .article-sidebar').removeClass('fix');
				$('.video-player').removeClass('fixed');
				$('.video-player').css('height','');
				//$('.article-nav').removeClass('visible');
			}
		});

		$(window).resize(function(){
			var winWidth = $(window).width();
			if(winWidth <= 767 && $('.article-sidebar .fixed').hasClass('fix')){
				console.log('triggered');
				$('.article-sidebar .fixed, #main .article_container article, .article-sidebar').removeClass('fix');
				$('.video-player').removeClass('fixed');
				$('.video-player').css('height','');
				//$('.article-nav').removeClass('visible');
			}

		});
	}

	////*******************SCIENCE EDUCATION VIDEO SCROLL FUNCTIONALITY***/////
	if($('.page-template-page-scied-video').length !== 0 && winWidth > 767 ){
		var SEpadTod = Math.round($(window).width() * 0.17);
		var SEvidHeight = Math.round($('#player_0').height()); // the intial height of the video container, since it will be removed while the video is fixed right
		if(SEvidHeight < 50){SEvidHeight = Math.round($('#player_0').attr('data-height')); }
		var SEstartTop = Math.round($('.video-nav').offset().top)-200;
		var SEdifference = Math.round($(window).height() - $('.video-nav').height());
		var SEstartBot = (Math.round($(window).height() - $('article').offset().top - $('article').height())*-1)+(SEdifference-84)-SEpadTod;
		var artHeight = Math.round($('#main article').height());

			$(window).scroll(function() {

				if(artHeight > 3000){
					var SEwinWidth = $(window).width();
					var SEelTop = Math.round($('.video-nav').offset().top) + 400;
					var SEwinTop = Math.round($(window).scrollTop());
					if (SEwinTop >= SEelTop && SEwinTop >= SEstartTop && !$('.video-nav').hasClass('fixed') && SEwinTop < SEstartBot && SEwinWidth > 767) {
						$('#player_0_container,.video-nav, section.video-player, .subscription_block_holder').addClass('fixed');
						$('#main article').addClass('fix');
					} else if($('.video-nav').hasClass('fixed') && SEwinTop <= SEelTop && SEwinTop <= SEstartTop && SEwinTop < SEstartBot) {
						$('#player_0_container,.video-nav, section.video-player, .subscription_block_holder').removeClass('fixed');
						$('#main article').removeClass('fix');
					}
				}
			});
			$(window).resize(function(){
				var winWidth = $(window).width();
				if(winWidth <= 767 && $('.video-nav').hasClass('fixed')){
					$('#player_0_container,.video-nav, section.video-player, .subscription_block_holder').removeClass('fixed');
					$('#main article').removeClass('fix');
				}
			});

	}
	////////////////////////////////////////////////////////////////

	var clipboard = new Clipboard('.citation-box .copy');

	clipboard.on('success', function() {
		$('.citation-box .copy #cite-text').html('Copied Citation!');
		$('.citation-box .copy').addClass('active');
		setTimeout(function() {
			$('.citation-box .copy #cite-text').html('Copy Citation');
			$('.citation-box .copy').removeClass('active');
		}, 2500);
	});

	$('#banner .close').click(function(){
		$('#banner').slideUp();
		var date = new Date();
        date.setTime(date.getTime() + (90*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
		document.cookie="BannerClosed=true" + expires + "; path=/";
	});

	if($('body').hasClass('page-id-18')){
		var query = getQueryParams(document.location.search);
		if(query.hasOwnProperty("form")){
			var preload_form = query.form;
			var preload_form_button = preload_form.replace('form-','form-button-');

			$('.form-panel.panel-widget-style').hide();
			$('.'+preload_form+'.panel-widget-style').show();
			$("[class^=form-button-]").removeClass('active');
			$('a.'+preload_form_button).addClass('active');

		} else {
			var preload_form = '';
			$('a.form-button-general').addClass('active');
			$('.form-panel.panel-widget-style').hide();
			$('.form-general.panel-widget-style').show();
		}

		$("[class^=form-button-]").click(function(){
			var fc = $(this).attr('rel');
			var fcb = fc.replace('form-','form-button-');
			$('.form-panel.panel-widget-style').hide();

			$("[class^=form-button-]").removeClass('active');
			$('a.'+fcb).addClass('active');

			$('.'+fc+'.panel-widget-style').show();

			var url = window.location.protocol+'//'+window.location.host+window.location.pathname;
			var query = getQueryParams(document.location.search);

			history.pushState(null, null, url+'?form='+fc);


		    $('html,body').animate({
		      scrollTop: $('#panel-18-0-0-1').offset().top - 160
		    }, 500);

		});
	}
	if ($(window).width() < 767) {
		var slickDraggable = true;
	}else{
		var slickDraggable = false;
	}
	$('.slider.panel-row-style > .panel-grid-cell').slick(
		{
			variableWidth : false,
			adaptiveHeight: true,
			draggable: slickDraggable,
			responsive: [
				{
				breakpoint: 740,
				settings: "unslick"
				}
			]
		}
	);

	$('.slider.panel-row-style > .panel-grid-cell').on('afterChange', function(event, slick, currentSlide){
        $('.slider-nav.panel-row-style ul li').removeClass('active');
        $('.slider-nav.panel-row-style ul li:nth-child('+(currentSlide+1)+')').addClass('active');
	});

    $(".slider-nav.panel-row-style ul li").click(function(){
        var slideIndex = $(this).index();
        var slider = $('.slider.panel-row-style > .panel-grid-cell');
        $('.slider-nav.panel-row-style ul li').removeClass('active');
        $(this).addClass('active');
        slider[0].slick.slickGoTo( parseInt(slideIndex) );

	    $('html,body').animate({
	      scrollTop: $('.slider-nav').offset().top - 220
	    }, 500);


    });

	$('.faq.panel-row-style .so-widget-sow-editor .textwidget').hide();
	$('.faq.panel-row-style .so-widget-sow-editor .widget-title').click(function(){
		if($(this).parent().hasClass('open')){
			$(this).parent().removeClass('open');
			$(this).parent().children('.textwidget').slideUp();
		} else {
			$('.faq.panel-row-style .so-widget-sow-editor').removeClass('open');
			$('.faq.panel-row-style .so-widget-sow-editor .textwidget').slideUp();

			$(this).parent().addClass('open');
			$(this).parent().children('.textwidget').slideDown();
		}
	});


	$('.video-slide-panel .slider .slides').slick({
		slidesToShow: 4,
		slidesToScroll: 4,
		centerMode: false,
		arrows: true,
		swipeToSlide: true,
		infinite: false,
	    responsive: [
		    {
		      breakpoint: 1024,
		      settings: {
		        slidesToShow: 3,
		        slidesToScroll: 3
		      }
		    },
		    {
		      breakpoint: 800,
		      settings: {
		        slidesToShow: 2,
		        slidesToScroll: 2
		      }
		    },
		    {
		      breakpoint: 480,
		      settings: {
		        slidesToShow: 1,
		        slidesToScroll: 1
		      }
		    }
	    ]
	});

	/*
	$('.home-slide .slider-video').on('init', function(event, slick){
		$('.home-slide .slider-video video#video1').get(0).play();
	});

	$('.home-slide .slider-video').slick({
		appendArrows: false,
		autoplay: true,
		autoplaySpeed: 6000,
		asNavFor: '.home-slide .slider-nav .nav-items'
	});



	$('.home-slide .slider-video').on('afterChange', function(event, slick, currentSlide){
		var videos = $('.home-slide .slider-video video').get();
		for (var v=0; v < videos.length; v++ ){
			var curVid = videos[v];
			var isPlaying = curVid.currentTime > 0 && !curVid.paused && !curVid.ended && curVid.readyState > 2;

			if (isPlaying) {
				curVid.pause();
			}
		}
		var i = currentSlide+1;
		$('.home-slide .slider-video video#video'+i).get(0).play();
	});*/
	/*$('.home-slide .slider-nav .nav-items').slick({
		dots: true,
 	    fade: true,
		appendArrows: false,
		asNavFor: '.home-slide .slider-video'
	});*/

	$('.video-slide-panel .slider .header .filter-list li').click(function(){
		var el = $(this);
		if(el.parent().hasClass('open')){
			if(el.hasClass('active')){
				el.parent().removeClass('open')
			} else {
				el.parent().children('li.active').html(el.html());
				el.parent().children('li').removeClass('hidden');
				el.addClass('hidden');
				el.parent().removeClass('open')
			}
		} else {
			el.parent().addClass('open')
		}
	});

	$('.chapters .chapter h4').click(function(){
		var el = $(this);

		if(!el.parent().hasClass('active')){
			$('.chapters .chapter').removeClass('active');
			$('.chapters .chapter .summary').slideUp();
			el.parent().addClass('active');
			el.parent().children('.summary').slideDown();
		} else {
			el.parent().removeClass('active');
			el.parent().children('.summary').slideUp();
		}
	});


	function getQueryParams(qs) {
	    qs = qs.split('+').join(' ');
	    var params = {},
	        tokens,
	        re = /[?&]?([^=]+)=([^&]*)/g;

	    while (tokens = re.exec(qs)) {
	        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
	    }

	    return params;
	}

	// team section for bios
	var teamCell = $('.team > .panel-grid-cell .trigger');

	if (teamCell.length > 0) {
		teamCell.on("click", function(){

			// check for active bio, remove if there
			var par = $(this).parent().parent(),
				allCells = $('.team > .panel-grid-cell'),
				allBios = allCells.find(".bio.active"),
				gPar = par.parent(), // should be team row
				bio = par.find(".bio"),
				aBio = gPar.find(".bio.active"),
				act = gPar.find(".panel-grid-cell.active"),
				bPar = bio.parent(),
				bttn = $("<button>", {
					"class":  "close",
					"text": "close"
				});
				allCells.removeClass("active");

				if (allBios.length > 0) {
					for (x = 0; x < allBios.length; x++) {
						console.o
						$(allBios[x]).removeClass("active");
					}
				}

				if (aBio.length > 0){
					var id = aBio.data("parent"),
						origPar = $("#" + id);
						aBttn = aBio.find("button.close");
						act.removeClass("active");

					aBttn.remove();
				}
				par.addClass("active");
				bio.attr("data-parent", bPar.attr("id"));
				bio.addClass("active");
				bio.prepend(bttn);

				bttn.on("click", function(){
					var bttnPar = $(this).parent();
						gPar = bttnPar.parent().parent();
						gPar.removeClass("active");
						bttnPar.removeClass("active");
						$(this).remove();
				});
		});
	}


});
