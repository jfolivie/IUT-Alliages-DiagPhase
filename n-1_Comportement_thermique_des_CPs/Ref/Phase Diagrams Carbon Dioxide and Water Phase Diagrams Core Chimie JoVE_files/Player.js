/*
Capture clicks on anchor links. Since this is intrinsicly global,
it breaks the OO-model. If we revive the idea of multiple players per page,
then we'll need to figure out how to assisgn a click to a player.

(A different approach would be to use onhashchange.)
*/
LOCALIZATION.init(get_site_language(), ['js/Player']);
//IN CASE ANY VISUALIZE PAGES AREN'T SERVING STATIC CONTENT
if (!prepub) {
    var prepub = 0;
}
if (!has_timesliders) {
    var has_timesliders = 0;
}

jove.Player = function(el, timeslider_path /*,webm_path*/ ) {
    /*
    Abstract class:
    Given an element,
    injects a jwplayer inside it,
    and gives it the appropriate settings.

    To be concrete, needs chapters_callback to be defined.
    For each chapter, chapters_callback will be given:
    	an object like {title:'Your title', time:123}
    and it should return an html snippet. Player will handle the click handler.

    (Although this is a constructor, the object created has no public properties:
    if new interaction needs to be supported, it's probably better to add the handlers inside,



    than to start leaking from the closure.)
    */

    var $el = $(el);
    var id = $el.attr('id');
    var container_id = id + '_container';
    var last_position = 0;
    var last_chapter = 0;
    var $chapters = $('#for_' + id);
    var $links = $('.link_for_' + id);
    var $subtitles = "";
    var $thumbs = "";
    var api = "";
    var lang = "English";
    var $chapter_cues = {};
    var $next_timer = '';

    var seek_done = false; // if there is a timestamp in the url's hash, whether we've already gone to it.
    var modal_done = false; // if 20 secs modal pops up, don't display it anymore

    var props = {};


    parse_to_props($el, function() {
        // TODO: if we get rid of chapters-xml,
        // make this normal, sequentially executed code.

        $el.append("<div id='" + container_id + "'></div>");
        play_video_article(false, timeslider_path /*,webm_path*/ );
        if ($chapters.length && typeof jove.Player.chapter_callback == 'function') {
            render_chapters(
                $chapters,
                jove.Player.chapter_container_html,
                jove.Player.chapter_callback);
        } else {
            bind_lab_chapters();
        }
        if ($links.length) {
            $links.each(function(i, link) {
                $(link).on('click', function() {
                    this.seek($(this).data('time'));
                });
            });
        }
    });


    /***********
    	Parse Input
    ************/

    function parse_to_props($el, callback) {
        // Given the JQ object at the root,
        // gets its immediate properties (ultimately from CPlayer)
        // and those it references (ultimately from chapters-xml),
        // sets props,
        // and does the callback (after the required ajax).

        // props is a var of Player scope.
        props = {
            play: $el.data('play'),
            loop: $el.data('loop'),
            block: $el.data('block'),
            start: $el.data('start'),
            width: $el.data('width'),
            height: $el.data('height'),
            image: $el.data('image'),
            language: $el.data('language'),
            is_se: $el.data('isse'),
            is_eoe: $el.data('iseoe'),
            enable_subtitle: $el.data('enable_subtitle')
        };


        $.get($el.data('url'), function(xml) {
            // TODO: error handling?
            var $xml = $(xml.documentElement);
            props.video_url = $xml.attr('video');
            props.hls_url = $xml.attr('hls');
            props.duration = $xml.attr('duration');
            var throttle = $xml.attr('extras');
            if (throttle) {
                props.video_url += '?' + throttle;
            }

            var $insert = $xml.find('insert');
            props.ad_url = $insert.length ? {
                    video: $insert.attr('url'),
                    image: $insert.attr('image_url'),
                    link: $insert.attr('link_url')
                } :
                false;

            props.chapters = $xml.find('chapter')
                .map(function(i, chapter) {
                    var $chapter = $(chapter);
                    var time = $chapter.attr('time');
                    return {
                        title: $chapter.attr('title'),
                        time: $chapter.attr('time'),
                        minutes_seconds: Math.floor(time / 60) + ':' + (time % 60 < 10 ? '0' : '') + (time % 60)
                    };
                });

            callback();
        });
    }

    /***********
    	getters
    ************/

    // These all could just be properties on the object,
    // but I wanted to minimize their visibility

    function get_play() {
        return props.play;
    }

    function get_loop() {
        return props.loop;
    }

    function get_block() {
        return props.block;
    }

    function get_start() {
        return props.start;
    }

    function get_video_url() {
        return props.video_url;
    }

    function get_ad_url() {
        return props.ad_url;
    }

    function get_chapters() {
        return props.chapters;
    }

    function get_width() {
        return props.width;
    }

    function get_height() {
        return props.height;
    }

    function get_image() {
        return props.image;
    }

    function get_language() {
        return props.language;
    }

    function get_hls_url() {
        return props.hls_url;
    }

    function get_is_se() {
        return props.is_se;
    }

    function get_is_eoe() {
        return props.is_eoe;
    }

    function get_duration() {
        return props.duration;
    }

    function get_enable_subtitle() {
        return props.enable_subtitle;
    }

    /***********
    	Chapters
    ************/

    function render_chapters($chapters, container_html, callback) {
        $container = $(container_html);
        $container.addClass('chapters').addClass('video-nav-panel');
        if (get_is_se()) {
            $container.append('<div class="video-navigation-tabs jove-flex"></div>');
            $container.find('.video-navigation-tabs').append(LOCALIZATION.get_translation("<h3 class='video-chapter-tab active'><i class='fal fa-book-open'></i><span>Chapters</span></h3>"));
            $container.find('.video-navigation-tabs').append(LOCALIZATION.get_translation("<h3 class='video-language-tab'><i class='fal fa-language'></i><span>Languages</span></h3>"));
            $container.append('<div class="video-chapters-panel active"></div>');
            get_chapters().each(function(i, chapter) {
                $container.find('.video-chapters-panel').append(
                    $(callback(chapter))
                    .addClass('chapter')
                    .attr('id', 'chapter' + (i))
                    .attr('data-time', chapter.time)
                    .on('click', function() {
                        $('.chapter.chapter_selected').removeClass('chapter_selected').removeClass('active');
                        $(this).addClass('chapter_selected').addClass('active').trigger('chapterChange');
                        seek($(this).data('time'));
                    })
                );
            });
            $container.append('<div class="video-languages-panel"></div>');
            // generate language list
            $container.find('.video-languages-panel').append('<ul class="video-languages-list jove-flex"></ul>');
            $ul = $('.video-languages-panel .video-languages-list');
            var langs = [
                { "name": "English", "code": "en", "label": "English", "lc": "en" },
                { "name": "Arabic", "code": "ar", "label": "العربية", "lc": "ar" },
                { "name": "Chinese", "code": "zh-si", "label": "中文", "lc": "ch" },
                /*{"name": "Dutch", "code": "nl", "label": "Nederlands","lc":"nl"},*/
                { "name": "German", "code": "de", "label": "Deutsch", "lc": "de" },
                { "name": "French", "code": "fr", "label": "Français", "lc": "fr" },
                { "name": "Hebrew", "code": "hb", "label": "עִבְרִית", "lc": "he" },
                { "name": "Italian", "code": "it", "label": "Italiano", "lc": "it" },
                { "name": "Japanese", "code": "ja", "label": "日本語", "lc": "ja" },
                { "name": "Korean", "code": "ko", "label": "한국어", "lc": "ko" },
                { "name": "Portuguese", "code": "pt-br", "label": "Português", "lc": "pt" },
                { "name": "Russian", "code": "ru", "label": "Русский", "lc": "ru" },
                { "name": "Spanish", "code": "es", "label": "Español", "lc": "es" },
                { "name": "Turkish", "code": "tr", "label": "Türkçe", "lc": "tr" },
                { "name": "Polish", "code": "pl", "label": "Polskie", "lc": "pl" }
            ];
            for (var i = 0; i < langs.length; i++) {
                var active = '';
                if (langs[i]['name'] == 'English') {
                    if (location.search.substring(1) == '' && (getCookie('SE_LANGUAGE') == null || getCookie('SE_LANGUAGE') == 'English')) {
                        active = 'active';
                    }
                    $container.find('.video-languages-panel .video-languages-list').append('<li class="video-language-item"><a class="' + active + '" data-language="English" href="' + location.pathname + '">English</a></li>');
                } else {
                    if (location.search.substring(1) != '' && location.search.substring(1).startsWith('language')) {
                        var page_language = parse_query_string(location.search.substring(1))['language'];
                        if (page_language == langs[i]['name']) {
                            active = 'active';
                        }
                    } else if (location.search.substring(1) == '' && getCookie('SE_LANGUAGE') != null) {
                        var page_language = getCookie('SE_LANGUAGE');
                        if (page_language == langs[i]['name']) {
                            active = 'active';
                        }
                    }
                    $container.find('.video-languages-panel .video-languages-list').append('<li class="video-language-item"><a class="' + active + '" data-language="' + langs[i]['name'] + '" href="' + location.pathname + '?language=' + langs[i]['name'] + '">' + langs[i]['label'] + '</a></li>');
                }
            }

            $chapters.append($container);
        } else {
            $container.append(LOCALIZATION.get_translation("<h3>Chapters</h3>"));
            get_chapters().each(function(i, chapter) {
                $container.append(
                    $(callback(chapter))
                    .addClass('chapter')
                    .attr('id', 'chapter' + (i))
                    .attr('data-time', chapter.time)
                    .on('click', function() {
                        $('.chapter.chapter_selected').removeClass('chapter_selected').removeClass('active');
                        $(this).addClass('chapter_selected').addClass('active').trigger('chapterChange');
                        seek($(this).data('time'));
                    })
                );
            });
            $chapters.append($container);
        }
    }

    function bind_lab_chapters() {
        $('div.table-contents ul li a').off('click');
    }

    /***********
    	Handlers
    ************/

    function onError_handler(error) {
        if (!error.message) {
            error.message = 'Unknown Error';
        }
        var playerinfo = '';
        mainplayer = flowplayer('#' + container_id);
        if (mainplayer) {
            playerinfo = JSON.stringify(mainplayer);
        }
        $.post('/api/misc/log_player_error.php', { 'id': $('#article_id').val(), 'message': error.message, 'playerinfo': playerinfo });
        $('#' + container_id).remove();
        // It's possible that there are recoverable errors, in which case the player shouldn't be destroyed,
        // but I haven't seen any, and the errors I do know of expose the CDN url to the user.
        if (error.message.match('Unsupported video format.')) {
            $el.find('.error_media').show();
        } else if (error.message.match('Video not found')) {
            $el.find('.error_connection').show();
        } else {
            if (!window.location.host.match(/^www[.]jove[.]com/i)) {
                $('.error_other').html("It looks like you are using a proxy server, if so your stanza may need to be updated. We recommend contacting your adminstrator and verifying the stanza is up to date. If so and you continue to experience issues please email <a href=\"mailto:support@jove.com\">support@jove.com</a>. In the meantime, you can log in to JoVE using your institutional email address for uninterrupted access, simply got to &#x68;&#x74;&#x74;&#x70;&#x73;&#x3A;&#x2F;&#x2F;&#x77;&#x77;&#x77;&#x2E;&#x6A;&#x6F;&#x76;&#x65;&#x2E;&#x63;&#x6F;&#x6D; and click \"sign in\" in the navigation bar above.").css('position', 'relative').css('z-index', '10000').show();
            } else {
                $el.find('.error_other').show();
            }
        }
        $('.error_other, .error_connection, .error_media').css('padding', '1em');
        $el.css('padding-top', '100px');
        $('.page-template-page-journal-video #content #main article section.video-player div.section, .page-template-page-scied-video #content #main article section.video-player div.section, .overlay').css('display', 'none');
    }

    function onTime_handler(event, position) {
        if (position >= 5 && $('div.splash-top').is(':visible')) {
            $('div.splash-top').fadeOut();
        }
    }

    function exist_modal() {
        var modal_trial_overlay = $('.modal-trial-overlay');
        var se_modal_trial_overlay = $('.se-modal-trial-overlay');
        var modal_overlay = $('.modal-overlay');
        var jove_modal = $('.jove-modal');
        var jovebox_container = $('#jovebox_container'); // old rec
        var notification_top = $('.notification-top-banner'); // blue notification banner
        if (modal_trial_overlay.length > 0 && modal_trial_overlay.attr('aria-hidden') == "false") {
            return true;
        } else if (se_modal_trial_overlay.length > 0 && se_modal_trial_overlay.attr('aria-hidden') == "false") {
            return true;
        } else if (modal_overlay.length > 0 && modal_overlay.attr('aria-hidden') == "false") {
            return true;
        } else if (jove_modal.length > 0 && jove_modal.attr('aria-hidden') == "false") {
            return true;
        } else if (jovebox_container.length > 0 && jovebox_container.is(':visible')) {
            return true;
        } else if (notification_top.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    function initialize_next_timer() {
        //for now just forward the user don't use a timer.
        window.location.href = $('.suggested-button a.button.hollow').attr('href');
        /*$('.suggested-video .suggested-text h5').html('Up Next (Video will start in <span id="next-timer">5</span>) <span id="cancel-timer">Cancel</span>');
        $next_timer = setInterval(
        function(){
        	cur = parseInt($('#next-timer').html());
        	if(cur > 0){
        		cur--;
        		$('#next-timer').html(cur);
        	}else{
        		console.log('forwarding the user');
        		window.location.href = $('.suggested-button a.button.hollow').attr('href');
        		clearInterval($next_timer);
        	}
        },1000);
        $('#cancel-timer').on('click',function(){
        	clearInterval($next_timer);
        	$('#cancel-timer').html('Cancelled');
        	$('.suggested-video .suggested-text h5').html('Suggested Video');
        });*/
    }



    var stats_fired = false;

    function record_stats_view() {
        cur_time = mainplayer.currentTime;
        if (cur_time === 0 && !stats_fired) { //should only ever record the playback if the current time is 0 
            stats_fired = true;
            $('#overlay-buttons .fa-play, .fp-play-1, .fp-play-2, .fp-play-3').off('click');
            ip = '';
            ua = '';
            page = 'Video Playback';
            referrer = window.location.href;
            joveuser = getCookie('JoVEUser2');
            user_id = $('#user_id').val();
            country = $('#stats_country').val();
            access = $('#access_level').val();
            $.get('https://stats.jove.com/process.php', { 'page': page, 'referrer': referrer, 'ip': ip, 'joveuser': joveuser, 'browser': ua, 'access': access, 'user_id': user_id, 'country': country }, function(data) {
                $('#overlay-buttons .fa-play, .fp-play-1, .fp-play-2, .fp-play-3').on('click', function() {
                    mainplayer.play();
                });
                stats_fired = false;
            });
        }
    }

    /***********
    	play_video
    ************/

    function play_video(args) {
        var url = args.url;
        var hls_url = args.hls_url;
        var play = false;
        var width = args.width;
        var height = args.height;
        var image = args.image;
        var language = args.language;
        var is_se = args.is_se;
        var is_eoe = args.is_eoe;
        var regstr = /\/((\d+).*)\.mp4/i;
        var subs = [];
        var srcs = [];
        var vids = [];
        var ad_info = get_ad_url();
        var videoid = '';
        var videofull = '';
        var played_main = false;
        var questions = [];
        var $next_q_below = 0;
        var cue = [];
        var cuepoints = [];
        var is_sample = url !== undefined ? url.match(/\/samples(2|3)\//) !== null : false;
        var enable_subtitle = args.enable_subtitle;

        var aspect = parseFloat(width / height);

        if (is_se && location.pathname.indexOf("embed") == -1 && getCookie('SE_LANGUAGE') !== null && ($('#category_id').val() != 9) && ($('#category_id').val() != 10) && ($('#category_id').val() != 12) && ($('#category_id').val() != 13)) {
            language = getCookie('SE_LANGUAGE');
        }

        if (url !== undefined && url.match(regstr)) {
            matches = regstr.exec(url);
            videoid = matches[2];
            videofull = matches[1];
        } else {
            videoid = null;
            videofull = null;
        }

        /*AD HANDLER*/
        if (ad_info) { //if this video has an ad we should play it first
            ad_srcs = [];
            ad_srcs.push({ type: "video/mp4", src: ad_info.video });
            ad = { src: ad_srcs };
            //vids.push(ad);
        }
        var articleid = '';
        /*SET ARTICLE ID*/
        articleid = $('#article_id').val(); //this is present on all article pages now
        var gatitle = articleid;
        var gaeventcat = is_sample ? 'Samples' : 'Videos';
        if (!is_sample && (prepub !== true || is_se === 1 || is_eoe === 1)) {
            //INTERACTIVE QUIZ

            if ($('#iqid').val() > 0 && !is_eoe) {
                $.post("/account/ajax", {
                    action: 'load_interactive_template',
                    'iqid': $('#iqid').val()
                }, function(data) {
                    if (data !== false) {
                        var cross_image = new Image();
                        cross_image.src = '/img/icons/incorrect-answer-cross.gif';
                        var thumb_image = new Image();
                        thumb_image.src = '/img/icons/correct-answer-thumb.gif';
                        quiz_html = '';
                        questions = data;
                        $.each(data, function(index, question) {
                            cue.push({ start: parseInt(question.question_timestamp) - 1, end: parseInt(question.question_timestamp) });
                            mainplayer.cuepoints.push({ start: parseInt(question.question_timestamp) - 1, end: parseInt(question.question_timestamp) });
                            quiz_html += '<div class="interactive-quiz-question" id="question-' + index + '" data-timestamp="' + question.question_timestamp + '">';
                            quiz_html += '<div class="interactive-quiz-question-outer-wrapper jove-flex">';
                            quiz_html += '<div class="interactive-quiz-question-wrapper">';
                            quiz_html += '<img class="displaying-question" src="/img/icons/displaying-question.gif" />';
                            quiz_html += '<img class="incorrect-answer-cross" />';
                            quiz_html += '<img class="correct-answer-thumb" />';
                            quiz_html += '<div class="interactive-quiz-question-inner-wrapper">';
                            quiz_html += '<div class="question-index" >Question ' + (index + 1) + '</div>';
                            quiz_html += '<hr class="interactive-quiz-index-question-seperator" />';
                            quiz_html += '<div class="quiz-question">' + question.question_text + '</div>';
                            quiz_html += '<div id="question-' + index + '-hint" class="question-hint">Hint: ' + question.question_hint + '</div>';
                            quiz_html += '<div class="quiz-answers">';
                            $.each(question.question_choices, function(aindex, answer) {
                                quiz_html += '<div class="quiz_answer_wrapper"><label class="quiz_answer"><input type="radio" value="' + answer.answer_choice + '" data-correct="' + answer.answer_correct + '" data-question-num="' + index + '" name="question-' + index + '"><span class="checkmark"></span>' + answer.answer_choice + '<span class="question-message"></span></label></div>';
                            });
                            quiz_html += '</div>';
                            quiz_html += '<div id="question-' + index + '-proceed" class="question-continue">Continue</div>';
                            quiz_html += '</div>'; //interactive-quiz-question-inner-wrapper
                            quiz_html += '</div>'; //interactive-quiz-question-wrapper
                            quiz_html += '</div>'; //interactive-quiz-question-outer-wrapper
                            quiz_html += '</div>';
                        });
                        $('#' + container_id).append(quiz_html);
                        //bind answer handler
                        $('.quiz_answer input').on('click', function() {
                            //remove all message and css
                            $('.interactive-quiz-question .question-message').html('');
                            $('.interactive-quiz-question .checkmark').removeClass('correct incorrect');
                            qid = $(this).data('question-num');
                            correct = $(this).data('correct');
                            rightanswer = $('#question-' + qid).find('input[data-correct="true"]');
                            if ($(this).data('correct') == true) {
                                $(this).parent().find('.question-message').html('<span style="color:#0FCD85">Correct answer, well done!</span>');
                                $('#question-' + qid + '-proceed').show();
                                $('#question-' + qid + '-hint').hide();
                                $(this).next('.checkmark').addClass('correct');
                                //gif 
                                $('#question-' + qid + ' .correct-answer-thumb').attr('src', thumb_image.src).show();
                                $('#question-' + qid + ' .displaying-question').hide();
                                $('#question-' + qid + ' .incorrect-answer-cross').hide();
                                $('#question-' + qid + ' .interactive-quiz-question-wrapper').addClass('correct-answer-bg');
                                setTimeout(function() {
                                    $('#question-' + qid + ' .correct-answer-thumb').hide().attr('src', '');
                                    $('#question-' + qid + ' .interactive-quiz-question-wrapper').removeClass('correct-answer-bg');
                                }, 1200);
                            } else {
                                if (!$('#question-' + qid + '-hint').is(':visible')) {
                                    $('#question-' + qid + '-hint').show();
                                    $('#question-' + qid + '-proceed').hide();
                                    $(this).next('.checkmark').addClass('incorrect');
                                    //gif
                                    $('#question-' + qid + ' .incorrect-answer-cross').attr('src', cross_image.src).show();
                                    $('#question-' + qid + ' .displaying-question').hide();
                                    $('#question-' + qid + ' .correct-answer-thumb').hide();
                                    $('#question-' + qid + ' .interactive-quiz-question-wrapper').addClass('shake');
                                    setTimeout(function() {
                                        $('#question-' + qid + ' .incorrect-answer-cross').hide().attr('src', '');
                                        $('#question-' + qid + ' .interactive-quiz-question-wrapper').removeClass('shake');
                                    }, 1200);

                                } else {
                                    $(this).parent().find('.question-message').html('<span style="color:#F7B500">Your Answer</span>');
                                    $('#question-' + qid + '-proceed').show();
                                    $('#question-' + qid + '-hint').hide();
                                    $(this).next('.checkmark').removeClass('hint').addClass('incorrect');
                                    rightanswer.parent().find('.question-message').html('<span style="color:#0FCD85">Correct answer</span>');
                                    rightanswer.next('.checkmark').addClass('correct');
                                }
                            }
                        });
                        //bind continue btn handler
                        if (questions.length) {
                            $('#' + id).on('click', '.question-continue', function() {
                                $('.interactive-quiz-question').slideUp();
                                mainplayer.play();
                            });
                        }
                        mainplayer.emit(
                            flowplayer.events.CUEPOINTS, { cuepoints: mainplayer.cuepoints.concat(cue) }
                        );
                    }
                }, 'json');
            } else if (!is_sample && !is_eoe) {
                chapt = get_chapters();
                chapt.each(function(i, chapter) {
                    st = i === 0 ? 1 : parseInt(chapter.time);
                    ed = i == (chapt.length - 1) ? parseInt(get_duration()) : parseInt(chapt[i + 1].time) - 6;
                    m = chapter.title;
                    cuepoints.push({ start: st, end: ed, msg: m });
                });
            }

            /*SET UP SUBTITLES*/
            $.ajax({
                async: false,
                type: "POST",
                data: { vid: articleid },
                url: "/api/articles/v0/subtitle_check.php",
                success: function(msg) {
                    if (msg == "exists") {
                        $subtitles = '/files/vtt/' + articleid + '/' + articleid + '.vtt';
                    }
                }
            });
            if ($subtitles !== "") {
                var is_default_lang = false;
                var current_url = window.location.href;
                //set english subtitle as default if it is science education video page or lab manual video page
                if (is_se === 1 && (current_url.indexOf('/v/') !== -1 || (current_url.indexOf('/science-education/') !== -1 && $('#category_id').val() == 9))) {
                    if (get_site_language() != 'English') {
                        var is_default_lang = true;
                    }
                }
                subs = [
                    { "default": is_default_lang, kind: "subtitles", label: "English", srclang: "en", src: $subtitles },
                ];
                if (is_se === 1 || is_eoe === 1) {
                    var collection_id = $('#collection_id').val();
                    var category_id = $('#category_id').val();
                    langs = [
                        { "name": "Arabic", "code": "ar", "label": "العربية", "lc": "ar" },
                        { "name": "Chinese", "code": "zh-si", "label": "中文", "lc": "ch" },
                        { "name": "Dutch", "code": "nl", "label": "Nederlands", "lc": "nl" },
                        { "name": "German", "code": "de", "label": "Deutsch", "lc": "de" },
                        { "name": "French", "code": "fr", "label": "Français", "lc": "fr" },
                        { "name": "Hebrew", "code": "hb", "label": "עִבְרִית", "lc": "he" },
                        { "name": "Italian", "code": "it", "label": "Italiano", "lc": "it" },
                        { "name": "Japanese", "code": "ja", "label": "日本語", "lc": "ja" },
                        { "name": "Korean", "code": "ko", "label": "한국어", "lc": "ko" },
                        { "name": "Portuguese", "code": "pt-br", "label": "Português", "lc": "pt" },
                        { "name": "Russian", "code": "ru", "label": "Русский", "lc": "ru" },
                        { "name": "Spanish", "code": "es", "label": "Español", "lc": "es" },
                        { "name": "Turkish", "code": "tr", "label": "Türkçe", "lc": "tr" }
                    ];
                    if (category_id == 10) { // if core bio, show all subtitles except russian. 
                        langs = [
                            { "name": "Arabic", "code": "ar", "label": "العربية", "lc": "ar" },
                            { "name": "Chinese", "code": "zh-si", "label": "中文", "lc": "ch" },
                            { "name": "Dutch", "code": "nl", "label": "Nederlands", "lc": "nl" },
                            { "name": "German", "code": "de", "label": "Deutsch", "lc": "de" },
                            { "name": "French", "code": "fr", "label": "Français", "lc": "fr" },
                            { "name": "Hebrew", "code": "hb", "label": "עִבְרִית", "lc": "he" },
                            { "name": "Italian", "code": "it", "label": "Italiano", "lc": "it" },
                            { "name": "Japanese", "code": "ja", "label": "日本語", "lc": "ja" },
                            { "name": "Korean", "code": "ko", "label": "한국어", "lc": "ko" },
                            { "name": "Portuguese", "code": "pt-br", "label": "Português", "lc": "pt" },
                            { "name": "Russian", "code": "ru", "label": "Русский", "lc": "ru" },
                            { "name": "Spanish", "code": "es", "label": "Español", "lc": "es" },
                            { "name": "Turkish", "code": "tr", "label": "Türkçe", "lc": "tr" },
                            //{ "name": "Polish", "code": "pl", "label": "Polskie", "lc": "pl" }
                        ];
                    }
                    if (category_id == 12) { // if core chem, only show subtitles we have. 
                        langs = [
                            { "name": "Arabic", "code": "ar", "label": "العربية", "lc": "ar" },
                            { "name": "Chinese", "code": "zh-si", "label": "中文", "lc": "ch" },
                            { "name": "Dutch", "code": "nl", "label": "Nederlands", "lc": "nl" },
                            { "name": "French", "code": "fr", "label": "Français","lc":"fr"},
                            { "name": "German", "code": "de", "label": "Deutsch", "lc": "de" },
                            { "name": "Italian", "code": "it", "label": "Italiano", "lc": "it" },
                            { "name": "Hebrew", "code": "hb", "label": "עִבְרִית", "lc": "he" },
                            { "name": "Portuguese", "code": "pt-br", "label": "Português", "lc": "pt" },
                            { "name": "Russian", "code": "ru", "label": "Русский", "lc": "ru" },
                            { "name": "Spanish", "code": "es", "label": "Español", "lc": "es" },
                            { "name": "Korean", "code": "ko", "label": "한국어", "lc": "ko" },
                            { "name": "Turkish", "code": "tr", "label": "Türkçe", "lc": "tr" },
							{ "name": "Japanese", "code": "ja", "label": "日本語", "lc": "ja" }
							 // { "name": "Polish", "code": "pl", "label": "Polskie", "lc": "pl" }
                        ];
                    }
                    if (category_id == 13) { // if core mol bio, only show subtitles we have. 
                        langs = [
                            { "name": "Arabic", "code": "ar", "label": "العربية", "lc": "ar" },
                            { "name": "Chinese", "code": "zh-si", "label": "中文", "lc": "ch" },
                            { "name": "Dutch", "code": "nl", "label": "Nederlands", "lc": "nl" },
                            { "name": "German", "code": "de", "label": "Deutsch", "lc": "de" },
                            { "name": "French", "code": "fr", "label": "Français", "lc": "fr" },
                            { "name": "Hebrew", "code": "hb", "label": "עִבְרִית", "lc": "he" },
                            { "name": "Italian", "code": "it", "label": "Italiano", "lc": "it" },
                            { "name": "Japanese", "code": "ja", "label": "日本語", "lc": "ja" },
                            { "name": "Korean", "code": "ko", "label": "한국어", "lc": "ko" },
                            { "name": "Portuguese", "code": "pt-br", "label": "Português", "lc": "pt" },
                            { "name": "Russian", "code": "ru", "label": "Русский", "lc": "ru" },
                            { "name": "Spanish", "code": "es", "label": "Español", "lc": "es" },
							{ "name": "Turkish", "code": "tr", "label": "Türkçe", "lc": "tr" }
							 // { "name": "Polish", "code": "pl", "label": "Polskie", "lc": "pl" }
                        ];
                    }
                    if (category_id == 14) {
                        langs = [
                            { "name": "Arabic", "code": "ar", "label": "العربية", "lc": "ar" },
                            { "name": "Chinese", "code": "zh-si", "label": "中文", "lc": "ch" },
                            { "name": "Dutch", "code": "nl", "label": "Nederlands", "lc": "nl" },
                            { "name": "German", "code": "de", "label": "Deutsch", "lc": "de" },
                            { "name": "French", "code": "fr", "label": "Français", "lc": "fr" },
                            { "name": "Hebrew", "code": "hb", "label": "עִבְרִית", "lc": "he" },
                            { "name": "Italian", "code": "it", "label": "Italiano", "lc": "it" },
                            { "name": "Japanese", "code": "ja", "label": "日本語", "lc": "ja" },
                            { "name": "Korean", "code": "ko", "label": "한국어", "lc": "ko" },
                            { "name": "Portuguese", "code": "pt-br", "label": "Português", "lc": "pt" },
                            { "name": "Russian", "code": "ru", "label": "Русский", "lc": "ru" },
                            { "name": "Spanish", "code": "es", "label": "Español", "lc": "es" },
                            { "name": "Turkish", "code": "tr", "label": "Türkçe", "lc": "tr" }
                        ];
                    }
                    if (category_id == 15) { // if core stats, only show subtitles we have. 
                        langs = [
                            { "name": "Arabic", "code": "ar", "label": "العربية", "lc": "ar" },
                            { "name": "Chinese", "code": "zh-si", "label": "中文", "lc": "ch" },
                            { "name": "Dutch", "code": "nl", "label": "Nederlands", "lc": "nl" },
                            { "name": "German", "code": "de", "label": "Deutsch", "lc": "de" },
                            { "name": "French", "code": "fr", "label": "Français", "lc": "fr" },
                            { "name": "Italian", "code": "it", "label": "Italiano", "lc": "it" },
                            { "name": "Japanese", "code": "ja", "label": "日本語", "lc": "ja" },
                            { "name": "Portuguese", "code": "pt-br", "label": "Português", "lc": "pt" },
                            { "name": "Russian", "code": "ru", "label": "Русский", "lc": "ru" },
                            { "name": "Hebrew", "code": "hb", "label": "עִבְרִית", "lc": "he" },
                            { "name": "Korean", "code": "ko", "label": "한국어", "lc": "ko" },
                            { "name": "Spanish", "code": "es", "label": "Español", "lc": "es" },
                            { "name": "Turkish", "code": "tr", "label": "Türkçe", "lc": "tr" }
                        ];
                    }
                    if (category_id == 16) { // if core physics, only show subtitles we have. 
                        langs = [
                            { "name": "Arabic", "code": "ar", "label": "العربية", "lc": "ar" },
                            //{"name": "Chinese", "code": "zh-si", "label": "中文","lc":"ch" },
                            { "name": "Dutch", "code": "nl", "label": "Nederlands", "lc": "nl" },
                            { "name": "German", "code": "de", "label": "Deutsch", "lc": "de" },
                            { "name": "French", "code": "fr", "label": "Français", "lc": "fr" },
                            { "name": "Italian", "code": "it", "label": "Italiano", "lc": "it" },
                            // {"name": "Japanese", "code": "ja", "label": "日本語","lc":"ja"},
                            { "name": "Portuguese", "code": "pt-br", "label": "Português", "lc": "pt" },
                            { "name": "Russian", "code": "ru", "label": "Русский", "lc": "ru" },
                            {"name": "Hebrew", "code":"hb", "label": "עִבְרִית","lc":"he"},
                            { "name": "Korean", "code": "ko", "label": "한국어", "lc": "ko" },
                            //{"name": "Spanish", "code": "es", "label": "Español","lc":"es"},
                            { "name": "Turkish", "code": "tr", "label": "Türkçe", "lc": "tr" }
                        ];
                    }
                    if (category_id == 17) { // if core cell bio, only show subtitles we have. 
                        langs = [
                            { "name": "Arabic", "code": "ar", "label": "العربية", "lc": "ar" },
                            { "name": "Chinese", "code": "zh-si", "label": "中文", "lc": "ch" },
                            { "name": "Dutch", "code": "nl", "label": "Nederlands", "lc": "nl" },
                            { "name": "German", "code": "de", "label": "Deutsch", "lc": "de" },
                            //{"name": "French", "code": "fr", "label": "Français","lc":"fr"},
                            { "name": "Italian", "code": "it", "label": "Italiano", "lc": "it" },
                            {"name": "Japanese", "code": "ja", "label": "日本語","lc":"ja"},
                            { "name": "Portuguese", "code": "pt-br", "label": "Português", "lc": "pt" },
                            { "name": "Russian", "code": "ru", "label": "Русский", "lc": "ru" },
                            //{"name": "Hebrew", "code":"hb", "label": "עִבְרִית","lc":"he"},
                            { "name": "Korean", "code": "ko", "label": "한국어", "lc": "ko" },
                            // {"name": "Spanish", "code": "es", "label": "Español","lc":"es"},
                            { "name": "Turkish", "code": "tr", "label": "Türkçe", "lc": "tr" }
                        ];
                    }
                    for (lcount = 0; lcount < langs.length; lcount++) {
                        cur_lang = langs[lcount];
                        show_subs = false;
                        fsub = '/files/vtt/' + articleid + '/' + articleid + '.' + cur_lang.code + '.vtt';
                        if (category_id == 10 || category_id == 12 || category_id == 13 || category_id == 15) {
                            language = $('#sub_language').val() ? $('#sub_language').val() : 'English';
                        }
                        if (language == cur_lang.name) {
                            show_subs = true;
                            if (window.location.href.indexOf('/embed/player') !== -1 && enable_subtitle === 0 && language == 'Korean') {
                                show_subs = false;
                            }
                        }
                        //var core_molbio_1_collections = [125,126,127,128,129,130,131,132,133,134,135];
                        // [153, 154, 155, 156, 157] Core Organic Chemistry(chapter7-11)
                        var bad_collections = [224]; // [159,160,161];// no core stats in any language except english

                        var no_japanese = [41, 82, 100];
                        var good_eoe_articles = [20109, 20119, 20122, 20124, 20143,
                            20076, 20087, 20107, 20108, 20116, 20126, 20144, 20145,
                            20146, 20147, 20117, 20048, 20127, 20128, 20068, 20078,
                            20100, 20101, 20102, 20103, 20104, 20105, 20106, 20110,
                            20111, 20112, 20113, 20114, 20115, 20118, 20120, 20121,
                            20123, 20125, 20129, 20140, 20141, 20142, 20148, 20149,
                            20150, 20151, 20152
                        ];
                        var bad_articles = [];
                        //var bad_articles = [10643, 10612, 10611];

                        collection_id = parseInt(collection_id);
                        articleid = parseInt(articleid);
                        category_id = parseInt(category_id);
                        if ((!is_eoe && $.inArray(articleid, bad_articles) === -1 && $.inArray(collection_id, bad_collections) === -1) || $.inArray(articleid, good_eoe_articles) !== -1) { // skip bad articles and collections
                            if (cur_lang.code == 'tr' && collection_id != 82) {
                                subs.push({ "is_default": show_subs, "label": cur_lang.label, "src": fsub, "kind": "subtitles", "srclang": cur_lang.lc });
                            } else if (cur_lang.code == 'ko' && collection_id != 82) {
                                subs.push({ "is_default": show_subs, "label": cur_lang.label, "src": fsub, "kind": "subtitles", "srclang": cur_lang.lc });
                            } else if (cur_lang.code == 'ja' && $.inArray(collection_id, no_japanese) === -1) {
                                subs.push({ "is_default": show_subs, "label": cur_lang.label, "src": fsub, "kind": "subtitles", "srclang": cur_lang.lc });
                            } else if (cur_lang.code == 'nl' && (category_id == 10 || category_id == 11 || category_id == 12 || category_id == 15 || category_id == 16 || category_id == 17 || category_id == 6 || collection_id == 41 || collection_id == 99 || is_eoe || category_id == 14 || category_id == 13 || category_id == 2 || category_id == 1 || category_id == 6)) { //limit dutch to just core bio, core chem, lab chem, clinical skills, and eoe, and core org chem1-6, adv bio, basic bio, core physics
                                subs.push({ "is_default": show_subs, "label": cur_lang.label, "src": fsub, "kind": "subtitles", "srclang": cur_lang.lc });
                            } else if (cur_lang.code == 'hb' && (collection_id == 99 || collection_id == 41 || category_id == 1 || category_id == 2 || category_id == 3 || category_id == 4 || category_id == 8 || category_id == 10 || category_id == 11 || category_id == 12 || category_id == 13 || category_id == 14 || category_id == 15 || category_id == 16 || collection_id == 28 || collection_id == 19 || collection_id == 20 || collection_id == 25 || collection_id == 26 || collection_id == 27 || collection_id == 29 || is_eoe) && collection_id != 84 && collection_id != 21) {
                                subs.push({ "is_default": show_subs, "label": cur_lang.label, "src": fsub, "kind": "subtitles", "srclang": cur_lang.lc });
                                //I think the code below this line could be just setting the is_default to true in the condition
                            } else if (cur_lang.code != 'hb' && cur_lang.code != 'ja' && cur_lang.code != 'nl' && cur_lang.code != 'tr' && cur_lang.code != 'ko' && collection_id != 82) {
                                subs.push({ "is_default": show_subs, "label": cur_lang.label, "src": fsub, "kind": "subtitles", "srclang": cur_lang.lc });
                            }
                        }
                    }
                }
            } /* END SUBTITLES */
        }
        /* ADD HLS SOURCE */
        if (hls_url !== undefined && window.con_dmarc != 19) { // we don't want to play the full hls version if we are playing the sample version
            if (hls_url.substring(0, 1) == '//') {
                hls_url = 'https:' + hls_url;
            }
            hls_url = hls_url.replace('/cn/', '/').replace('/de/', '/').replace('/es/', '/');
            srcs.push({ type: "application/x-mpegurl", src: hls_url });

        }

        /*SET MAIN SOURCE*/
        if (window.con_dmarc == 19) {
            url = "https://cloudfront.jove.com/CDNSource/samples2/" + articleid + ".mp4";
            srcs.push({ type: "video/mp4", src: url });
        } else {
            srcs.push({ type: "video/mp4", src: url });
        }
        if (is_eoe === 1) {
            var splash_clip = {
                src: [{ type: "video/mp4", src: "https://cloudfront.jove.com/CDNSource/protected/JoVE_Splash_EoE_051019.mp4" }],
            };
            vids.push(splash_clip);
        }
        main_vid = { src: srcs, thumbnails: { src: 'https://cloudfront.jove.com/files/vttthumbs/' + articleid + '.vtt' }, subtitles: { tracks: subs } };
        vids.push(main_vid);

        play = flowplayer.autoplay.OFF;

        if (image.length > 0 && image.indexOf('https://') === -1) {
            image = 'https://' + image;
        }
        //set the proper ga_instance based on the url.
        var ga_subinstance = '1';
        if (window.location.href.indexOf('staging.') !== -1) {
            ga_subinstance = '3';
        } else if (window.location.href.match(/-dev\d?\./) !== null) {
            ga_subinstance = '4';
        }

        mainplayer = flowplayer.playlist('#' + container_id, {
            playlist: vids,
            auto_orient: false,
            speed: {
                options: [0.75, 1, 1.5, 2],
                labels: ['Slow', 'Normal', 'Fast', 'Faster']
            },
            ga: { 'ga_instances': ['UA-1871394-' + ga_subinstance], 'media_title': gatitle, 'event_categories': { 'videos': gaeventcat } },
            poster: image,
            keyboard: { seek_step: "15" },
            autoplay: flowplayer.autoplay.OFF,
            ui: flowplayer.ui.USE_THIN_CONTROLBAR | flowplayer.ui.NO_TITLE | flowplayer.ui.NO_DESCIPTION,
            token: 'eyJraWQiOiJZRjk0UDlMM0phTzUiLCJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NiJ9.eyJjIjoie1wiYWNsXCI6NixcImlkXCI6XCJZRjk0UDlMM0phTzVcIn0iLCJpc3MiOiJGbG93cGxheWVyIn0.GwJk8dFr3gmm7wBniq0FjDGKq2p6B9OEnYYBKG-roi6SjcF7G8ljbXmEfwwRWDmWNY_3oMJEuun3w-UGUQWb0g',
            //Add cuepoints to player
            'cuepoints': cuepoints,
            //Create elements on progress bar 
            draw_cuepoints: true,
            time: true
        }).on('loadstart', function() {
            $('.fp-switch.fp-play-1 .fp-play').attr('tabindex', '0');
            /*var vidheight = 510;
            vidheight = $('.video-container').height();
            //console.dir(vidheight);
            $('#video-chapters').css('max-height',vidheight);*/
            $('.fp-play-1 .fp-play').prop('tabindex', '1').on('click', function() {
                record_stats_view();
            });
            // For SciEd videos, create external subtitles dropdown



            if (is_se && category_id != 9 && category_id != 10) {
                var attach = $('.fp-cc.fp-menu-container ul').html();
                if ($(attach).children().length > 0) {
                    $('#overlay-captions-list').append($('.fp-cc.fp-menu-container ul').html());
                    var lang_map = {
                        "English": { "code": "en", "label": "English", "lc": "en" },
                        "Arabic": { "code": "ar", "label": "العربية", "lc": "ar" },
                        "Chinese": { "code": "zh-si", "label": "中文", "lc": "ch" },
                        "Dutch": { "code": "nl", "label": "Nederlands", "lc": "nl" },
                        "German": { "code": "de", "label": "Deutsch", "lc": "de" },
                        "French": { "code": "fr", "label": "Français", "lc": "fr" },
                        "Hebrew": { "code": "hb", "label": "עִבְרִית", "lc": "he" },
                        "Italian": { "code": "it", "label": "Italiano", "lc": "it" },
                        "Japanese": { "code": "ja", "label": "日本語", "lc": "ja" },
                        "Korean": { "code": "ko", "label": "한국어", "lc": "ko" },
                        "Portuguese": { "code": "pt-br", "label": "Português", "lc": "pt" },
                        "Russian": { "code": "ru", "label": "Русский", "lc": "ru" },
                        "Spanish": { "code": "es", "label": "Español", "lc": "es" },
                        "Turkish": { "code": "tr", "label": "Türkçe", "lc": "tr" }
                    };
                    if (getCookie('SE_LANGUAGE') !== null && getCookie('SE_LANGUAGE') !== '') {
                        $('#splash-lang').html(lang_map[getCookie('SE_LANGUAGE')]['label']);
                    } else {
                        $('#splash-lang').html('English');
                    }
                    $('#overlay-captions-list li').on('click', function() {
                        var videos = document.getElementsByTagName('video');
                        var video = videos[0];
                        if ($(this).hasClass('active')) {
                            $('#overlay-captions-list li').removeClass('active');
                            var lang = 'English';
                            for (var i = 0; i < video.textTracks.length; i++) {
                                //video.textTracks[i].mode = 'hidden'; // 'hidden' don't work but 'disabled' do
                                video.textTracks[i].mode = 'disabled';
                            }
                            $('#splash-lang').html('Subtitles');
                            $('#overlay-captions').trigger('click');
                        } else {
                            $('#overlay-captions-list li').removeClass('active');
                            $(this).addClass('active');
                            var activate = $(this).find('span').html();
                            // new
                            for (var i = 0; i < langs.length; i++) {
                                if (activate == langs[i]['label']) {
                                    activate = langs[i]['name'];
                                    break;
                                }
                            }
                            setCookie('SE_LANGUAGE', activate, 1);
                            window.location.href = location.pathname + '?language=' + activate;
                            // for (var l = 0; l < video.textTracks.length; l++) {
                            // 	if (video.textTracks[l].label == activate) {
                            // 		var lang = video.textTracks[l].label;
                            // 		video.textTracks[l].mode = 'showing';
                            // 		$('#splash-lang').html(lang);
                            // 	}
                            // 	else {
                            // 		//video.textTracks[l].mode = 'hidden'; // 'hidden' don't work but 'disabled' do
                            // 		video.textTracks[l].mode = 'disabled';
                            // 	}
                            // 	$('#overlay-captions').trigger('click');
                            // }
                            // $('#overlay-captions').trigger('click');
                        }

                    });
                } else {
                    $('#splash-lang').html('No Subtitles');
                    $('.far.fa-chevron-down').hide();
                }
                //},1000);
            }
            //LAB MANUAL CHAPTER LINKS
            $('.chapters-list .chapter').first().addClass('active');
            if (category_id == 9) {
                if ($('div.table-contents ul li a').length > 0) {
                    $('div.table-contents ul li a').off('click');
                    setTimeout(function() {
                        $('div.table-contents ul li a').on('click', function(e) {
                            e.preventDefault();
                            t = $(this).data('time');
                            seek(t);
                        });
                    }, 200);
                }
            }
            if (mainplayer.playlist.queue.idx != mainplayer.playlist.queue.last_idx) {
                $('.flowplayer .fp-controls').css('display', 'none'); //hide controls to prevent interaction
            } else if (mainplayer.playlist.queue.idx == mainplayer.playlist.queue.last_idx) { //this is the last video in the queue
                $('.flowplayer .fp-controls').css('display', 'flex');
                $('#overlay-captions-container').show();
                if (!is_se) {
                    $('#' + container_id).off('click');
                }
            }


            //SHOW THE SECTION TAG
            $(".page-template-page-journal-video #content #main article section.video-player div.section, .page-template-page-scied-video #content #main article section.video-player div.section, .eoe-header-type").fadeIn();
            $('#overlay-access, #overlay-message, #embed-message').css('display', 'inline-flex');

            if (typeof new_trial !== 'undefined') {
                if (new_trial == 'false') {
                    $("div.splash-top, .page-template-page-journal-video #content #main article section.video-player div.section, .page-template-page-scied-video #content #main article section.video-player div.section").fadeIn();
                }
            }

            //DISABLE LOADING WHEEL
            $('.jove_player').css('background-image', 'none');

            if (width / height > 1.4) {
                $('head').append("<style>section.article-sidebar div.fixed.fix{margin-top:-50px;}</style>");
            }
            //ADD SE
            if (is_se) {
                $('#' + container_id).addClass('se');
            }
            //disables the wheel while video plays
            $('.jove_player').css('background-image', 'none').css('min-height', '0px');

            if (mainplayer.playlist.queue.members.length == 1) {
                played_main = true;
            }
            if ($('#iqid').val() > 0) {
                $('#' + container_id).append('<div id="interactive-quiz-question-msg">Interactive Mode (Beta)</div>');
            }
        }).on('error', function(e) {
            if (e.defaultPrevented) return; //if the error behavior shouldn't fire ignore this error
            if (e.data) {
                onError_handler(e.data);
            }
            //disables the wheel while showing errors
            $('.jove_player').css('background-image', 'none');
        }).on('ended', function() {
            if (mainplayer.playlist.queue.members.length === 1) {
                played_main = true;
            }
            if (played_main === true && mainplayer.in_fullscreen) {
                mainplayer.toggleFullScreen();
            }
            if (played_main === true) {
                //console.log($('.tabs .tab.active').html().trim());
                /*if(is_eoe && !is_sample && $('.jove-flex.suggested-video').length && $('.tabs .tab.active').html().trim() == 'Concept'){
                	console.log('fired');
                	initialize_next_timer();
                }*/
                /*if($('#embed-message').length > 0){
                	$('#embed-message').show();
                }*/
                if (questions.length) {
                    //here we want to reset the quiz	
                    //need to reset the all of the html and set the question counter back to 0
                    $('.question-hint, .question-continue').hide();
                    $('.question-message').html('');
                    $('label.quiz_answer input').prop('checked', false);
                    $('.interactive-quiz-question').removeClass('seen');
                    $('.interactive-quiz-question .checkmark').removeClass('correct incorrect');
                    $next_q_below = 0;
                }
                if (mainplayer.in_fullscreen) {
                    mainplayer.toggleFullScreen();
                }
                if ($('#overlay-end').length > 0) {
                    $('.overlay, .fp-play-1').hide();
                    $('.fp-small-play').show();
                    $('#overlay-end').css('display', 'flex');
                } else {
                    $('#overlay-buttons .fa-play, .fp-play-1').on('click', function() {
                        record_stats_view();
                    });
                }
                if ($('#embed-message').length > 0) {
                    $('#embed-message').css('display', 'inline-flex');
                }

                // redesign trial
                var block = get_block();
                if (block && !modal_done && !exist_modal() && $.fn.jovebox) {
                    appurl = new URL(NEW_APPLICATION_URL);
                    apphost = appurl.host;
                    url = new URL(window.location.href);
                    if(url.href.match(/science-education\/(\d+)\/.*/)){
                        url.href = url.href.replace(/(\d+)/,'v/$1');
                    }
                    url.host = apphost;
                    url.search += 'trialstart=1';
                    window.location.href = url.href;
                    return false;
                }
            }
            if (mainplayer.playlist.queue.members.length > 1 && mainplayer.playlist.queue.idx == mainplayer.playlist.queue.last_idx && !played_main && mainplayer.playlist.queue.members[1].src[0].src.indexOf('.jove.com') !== -1) {
                mainplayer.play();
                played_main = true;
            }
        }).on('loadeddata', function() {
            if (mainplayer.playlist.queue.idx === 0) {
                seek(0);
            }
            //INJECT THE OVERLAY INTO THE PLAYER - fullscreen hack
            if ($('#overlay-end').length) {
                el = $('#overlay-end');
                $('#player_0_container').append(el);
            }
            if ($('#embed-message').length) {
                el = $('#embed-message');
                $('#player_0_container').append(el);
            }


        }).on('loadedmetadata', function() {
            if (mainplayer.playlist.queue.members.length > 1 && mainplayer.playlist.queue.idx == mainplayer.playlist.queue.last_idx && !played_main && mainplayer.playlist.queue.members[1].src[0].src.indexOf('.jove.com') === -1) {
                mainplayer.play();
                played_main = true;
            }
        }).on('pause', function() {
            $('.fp-small-play').show();

            if (mainplayer.playlist.queue.idx == mainplayer.playlist.queue.last_idx) {
                $('#overlay-access').fadeOut('fast');


                $('.video-container #overlay-pause, .video_container #overlay-pause').fadeIn();
                $('.video-container #overlay-buttons, .video_container #overlay-buttons').css('display', 'flex');
                if ($('#embed-message').length > 0) {
                    $('#embed-message').css('display', 'inline-flex');
                }
            }
        }).on('playing', function() {
            if(SHOW_PREVIEWS == '0' && is_sample){
                mainplayer.pause();
                appurl = new URL(NEW_APPLICATION_URL);
                apphost = appurl.host;
                url = new URL(window.location.href);
                if(url.href.match(/science-education\/(\d+)\/.*/)){
                    url.href = url.href.replace(/(\d+)/,'v/$1');
                }
                url.host = apphost;
                url.search += 'trialstart=1';
                window.location.href = url.href;
                return false;
            }
            $('.fp-small-play').hide();
            //$('#embed-message').hide();
            $('.video-container .overlay,.video-container #overlay-buttons, .video_container .overlay,.video_container #overlay-buttons, #splash-top, #embed-message').fadeOut('fast');
            //don't bind the click until the video starts to play in case we are in a poster setup
            $('.video-popup-link').remove();
            if (mainplayer.playlist.queue.idx != mainplayer.playlist.queue.last_idx) {
                $('.flowplayer .fp-controls').css('display', 'none');
                if (!is_se && !is_eoe) {
                    $('#' + container_id).on('click', function() {
                        window.open(ad_info.link);
                        setTimeout(function() { mainplayer.play(); }, 50);
                    });
                }
            }
        }).on('seeked', function(e) {
            hasbeenset = false;
            if (questions.length) {
                $('.interactive-quiz-question').each(function() {
                    if ($(this).data('timestamp') >= mainplayer.currentTime && !hasbeenset) {
                        id_parts = $(this).prop('id').split('-');
                        if (id_parts[1]) {
                            $next_q_below = id_parts[1];
                            hasbeenset = true;
                            //reset quiz??
                            $('.question-hint, .question-continue').hide();
                            $('.question-message').html('');
                            $('label.quiz_answer input').prop('checked', false);
                            $('.interactive-quiz-question').removeClass('seen');
                            $('.interactive-quiz-question .checkmark').removeClass('correct incorrect');
                        }
                    }
                });
                if (!hasbeenset) {
                    $next_q_below = 0;
                }
            }
        }).on('seeking', function(e) {
            $('#overlay-end').css('display', 'none');
        }).on('timeupdate', function(e) {
            this_second = mainplayer.currentTime;
            onTime_handler(e, this_second);
            if (ad_info.link && ad_info.link.substr(ad_info.link.length - 1) == '=' && this_second <= 0.1) {
                //check that ads still work as expected
                //unbind the click event if the link is empty
                $('#' + container_id).off('click');
            }

            if (Math.floor(last_position) != this_second && mainplayer.playlist.queue.idx == mainplayer.playlist.queue.last_idx) {

                //quiz time handler
                /*$('.interactive-quiz-question').each(function(){
                	//set the next one to look at as the lowest possible;
                	if($(this).data('timestamp') <= this_second){
                		$next_q_below = $(this).attr('id').substring(-1);
                	}
                });*/
                //console.log($('#question-'+$next_q_below).data('timestamp'));
                //console.log(parseInt(this_second));
                if (questions.length) {
                    if ($('#question-' + $next_q_below).data('timestamp') == parseInt(this_second) && !$('#question-' + $next_q_below).hasClass('seen')) {
                        mainplayer.pause();
                        $('#question-' + $next_q_below).slideDown().addClass('seen');
                        setTimeout(function() {
                            if ($('div.overlay').is(':visible')) {
                                $('div.overlay').hide();
                            }
                        }, 100);

                        if ((questions.length - 1) > $next_q_below) {
                            $next_q_below++;
                        } else {
                            $next_q_below = 0;
                        }
                    }
                }

                // Examine the chapters in order.
                $next_below = $chapters.find('[data-time=0]');
                $chapters.find('.chapter').each(function(i, chapter) {
                    // assume each iterates in order?
                    if ($(chapter).data('time') <= this_second) {
                        $next_below = $(chapter);
                    }
                });
                // If the next chapter below this_second is not current, make it so.
                if ($next_below.not('.chapter_selected').length) {
                    last_chapter++;
                    //jove.log('On to chapter '+last_chapter);
                    $chapters.find('.chapter_selected')
                        .removeClass('chapter_selected').removeClass('active');
                    $next_below
                        .addClass('chapter_selected')
                        .addClass('active')
                        .trigger('chapterChange');
                }
            }
            if (ismobile() == true) {
                if (!mainplayer.in_fullscreen && this_second > 0 && this_second < 2) {
                    mainplayer.toggleFullScreen();
                }
            }
        });
    }
    /***********
    	(potentially) Public Methods
    ************/
    function ismobile() {
        let check = false;
        (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
        return check;
        /********* jove modal ********/
    };

    function seek(time) {
        flowplayer('#' + container_id).currentTime = time;
    }

    function no_video_ad() {
        //https://regex101.com/r/iY3yZ3/1
        return navigator.userAgent.match(/.*\b(iphone|acs|alav|alca|amoi|audi|aste|avan|benq|bird|blac|blaz|brew|cell|cldc|cmd-|dang|doco|eric|hipt|inno|ipaq|java|jigs|kddi|keji|leno|lg-c|lg-d|lg-g|lge-|maui|maxo|midp|mits|mmef|mobi|mot-|moto|mwbp|nec-|newt|noki|opwv|palm|pana|pant|pdxg|phil|play|pluc|port|prox|qtek|qwap|sage|sams|sany|sch-|sec-|send|seri|sgh-|shar|sie-|siem|smal|smar|sony|sph-|symb|t-mo|teli|tim-|tosh|tsm-|upg1|upsi|vk-v|voda|w3cs|wap-|wapa|wapi|wapp|wapr|webc|winw|winw|xda|xda-|up.browser|up.link|windowssce|iemobile|mini|mmp|symbian|midp|wap|phone|(an)?droid|pocket|mobile|pda|psp)\b.*/i);
    }

    /***********
    	wrapper
    ************/
    function play_video_article(autoplay_override, timeslider_path) {
        var autoplay = get_play();
        if (autoplay_override) {
            autoplay = '1';
        }
        in_ad = false;
        $('.preroll_video_overlay').remove();
        var show_controlbar = true;
        play_video({
            url: get_video_url(),
            hls_url: get_hls_url(),
            show_controlbar: show_controlbar,
            start: get_start(),
            play: autoplay,
            width: get_width(),
            language: get_language(),
            is_se: get_is_se(),
            is_eoe: get_is_eoe(),
            height: get_height(),
            image: get_image(),
            timeslider_path: timeslider_path,
            is_ad: false,
            enable_subtitle: get_enable_subtitle()
        });
    }

    $(window).on('unload', function() { flowplayer('#' + container_id).destroy(); });
};


$(function() {
    /*$(window).resize(function(){
    	var vidheight = 510;
    	vidheight = $('.video-container').height();
    	//console.dir(vidheight);
    	$('#video-chapters').css('max-height',vidheight);
    });*/
    // $("fp-play-1").attr('tabindex', 0);
    $('#overlay-buttons .fa-play').on('click', function() {
        mainplayer.play();
    });
    $('#overlay-buttons .fa-step-backward, #overlay-buttons .fa-step-forward').on('click', function() {
        window.location = window.location; //there is no previous or next right now so just reload the page.
    });
    $('.chapter').on('click', function() {
        $('.chapter.active').removeClass('active');
        $(this).addClass('active');
        flowplayer('#player').currentTime = $(this).data('time');

    });
    /*$('.chapter-container').mouseout(function(){
    	$('#chapter-button').trigger('click');
    });*/
    $('#chapter-button').on('click', function() {
        if ($('.fp-cc .fp-menu').is(':visible')) {
            $('span.fp-cc').trigger('click');
        }
        if ($('.chapter-container').is(':visible')) {
            //make it disappear and flip the chevron
            $('#chapter-button').find('i').css('transform', 'rotate( 360deg )');
            $('.chapter-container').hide();
        } else {
            //make chapters appear and file the chevron
            $('#chapter-button').find('i').css('transform', 'rotate( 180deg )');

            $('.chapter-container').show();
        }
    });
    $('#overlay-captions').on('click', function() {
        if ($('#overlay-captions-list').is(':visible')) {
            $('#overlay-captions').find('i.fa-chevron-down').css('transform', 'rotate( 360deg )');
            //$('.fp-cc .fp-menu').c();
        } else {
            $('#overlay-captions').find('i.fa-chevron-down').css('transform', 'rotate( 180deg )');
            //$('.fp-cc .fp-menu').hide();
        }
        $('#overlay-captions-list').toggle();
    });
    // TODO: new code from jove.com
    $("#overlay-captions-list").on('mouseleave', function() {
        $('#overlay-captions').find('i.fa-chevron-down').css('transform', 'rotate( 360deg )');
        $('#overlay-captions-list').hide();
    });
});