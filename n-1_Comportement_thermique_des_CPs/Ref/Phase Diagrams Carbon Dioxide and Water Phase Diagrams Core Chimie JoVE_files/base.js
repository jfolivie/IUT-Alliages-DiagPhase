$(function() {
	//var d = new Date();
    //d.setTime(d.getTime() + (2*24*60*60*1000));
    //ex = d.toUTCString();
	//document.cookie = "country=kr; expires=" + ex + "; path=/; domain=.richard-dev2.jove.com";
	//document.cookie = "country=kr; expires=" + ex + "; path=/; domain=.richard-dev2.jove.com";
    /******* global trial timer ********/
    if(new_trial && new_time_remaining >= 0) {
        // $('#nav-contact').hide();
        $('#trial-timer').show();
        var check_timer = setInterval(function() {
            if(parseInt(new_time_remaining) <= 0) {
                // $('#nav-contact').show();
                $('#trial-timer').hide();
                clearInterval(check_timer);
            }
        }, 1000);
    }
    /******* enable sidebar *******/
    $('.site-title i.fa-bars').on('click',function() {
        $('#jove-sidebar').toggleClass('active');
    });
    // show site sidebar
    $('.header-black #body-header-hamburger').on('click',function() {
        $('body').addClass('body-noscroll');
        $('#site-sidebar-overlay').show();
        setTimeout(function() {
            $('.site-sidebar').addClass('show');
        }, 100);
    });
    // hide site sidebar
    $('#site-sidebar-overlay .fa-times').on('click',function() {
        $('.site-sidebar').removeClass('show');
        setTimeout(function() {
            $('body').removeClass('body-noscroll');
            $('#site-sidebar-overlay').hide();
        }, 100);
    });
    // click other place to hide site sidebar
    $('#site-sidebar-overlay').on('click',function(event) {
        if(event.target == this) {
            $('.site-sidebar').removeClass('show');
            setTimeout(function() {
                $('body').removeClass('body-noscroll');
                $('#site-sidebar-overlay').hide();
            }, 100);
        }
    });
    //subheaeder mobile version
    $('.jove-subheader .head').on('click',function(){
        if($('.jove-subheader .head i').is(':visible')){
            if( $('.jove-subheader .list').is(':visible')){
                $('.jove-subheader .list').hide();
            }else{
                $('.jove-subheader .list').css('display','flex');
            }
            //$('.jove-subheader .list').toggle();
        }
    });
}); // end of ready
/********* jove modal ********/
function initate_modal(args) {
    var modal_id = 'jove-' + args.modal_name;
    $('#'+args.modal_name).wrap('<div class="jove-modal-box">');
    $('#'+args.modal_name).closest('.jove-modal-box').wrap('<div class="jove-modal-wrapper">').prepend('<span class="jove-modal-close" onclick="hide_jove_modal({modal_name:\''+args.modal_name+'\'});"><i class="far fa-times"></i></span>');
    $('#'+args.modal_name).closest('.jove-modal-wrapper').wrap('<div class="jove-modal-container">');
    $('#'+args.modal_name).closest('.jove-modal-container').wrap('<div id="'+modal_id+'" class="jove-modal-overlay fade" aria-hidden="true">');
}

function show_jove_modal(args) {
    var modal_id = 'jove-' + args.modal_name;
    $('#'+modal_id).attr('aria-hidden', false);
    setTimeout(function() {
        $('#'+modal_id).addClass('show');
    }, 150);
    $('#'+args.modal_name).show();
    $('body').addClass('body-noscroll');
}

function hide_jove_modal(args) {
    var modal_id = 'jove-' + args.modal_name;
    $('#'+args.modal_name).hide();
    $('#'+modal_id).attr('aria-hidden', true);
    setTimeout(function() {
        $('#'+modal_id).removeClass('show');
    }, 150);
    $('body').removeClass('body-noscroll');
}
/********cookie control********/
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/; secure";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {
  setCookie(name,'');
  document.cookie = name+'=; Max-Age=-99999999;';
}

/********js get query string ********/
function parse_query_string(query) {
  var vars = query.split("&");
  var query_string = {};
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    var key = decodeURIComponent(pair[0]);
    var value = pair[1];//I don't think we want to decodeURIComponent here unless we didn't want to later on.
    if (typeof query_string[key] === "undefined") {
	  //console.log(value);		
      query_string[key] = decodeURIComponent(value);//throwing error
      // If second entry with this name
    } else if (typeof query_string[key] === "string") {
      var arr = [query_string[key], decodeURIComponent(value)];
      query_string[key] = arr;
      // If third or later entry with this name
    } else {
      query_string[key].push(decodeURIComponent(value));
    }
  }
  return query_string;
}
/**** end ****/
/*** js escape html string ***/
// https://github.com/janl/mustache.js/blob/master/mustache.js#L67-L82
function jove_escape_html (string) {
    var entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(string).replace(/[&<>"'`=]/g, function (s) {
        return entityMap[s];
    });
}
/*** end ***/
function ignoreEmailDomain(email) {
	var ignore_domains = ['yahoo','gmail','hotmail','msn','mail2web','aol','mailinator','lycos','mail',
		  'netaddress','fastmail','walla','postmaster','abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijk',
		  'trbvm','zzn','excite','mail2','icqmail','juno','earthlink','indiatimes','prontoemail','fuzzmail',
		  'usermail','888mail','ezwebmailer','icedmail','oddmail','tekmail','mauimail','camail',
		  'californiamail','stagemail','stagecrew','emailforiphone','hotmac','macbox','thedoghousemail',
		  'emailaccount','returnreceipt','zzn','byke','muchomail','rediff','zapak','nz11','bestsearch',
		  'zappo', '10minutemail','mvrht','live', 'outlook', 'naver', 'foxmail', 'hanmail','yeah','icloud',
		  'comcast', 'orange', 'qq', '126', '163', '263', 'aliyun', 'alice', 'live', 'whitecoatwaste'];
	var ignore_regex = new RegExp("[@.](" + ignore_domains.join('|') + ")\\.(com|net|org|co\\.uk|ru|fr|it|nl)(\\.(tw|hk))?$", 'i');
	if(email.match(ignore_regex)) {
		return true;
	} else {
		return false;
	}
}

(function($){
    /**
     * jovebox
     */
    var modal, container, wrapper, box, close, opts, objects = [], index = 0,
        _init = function () {
            if(!$('#jove-modal').length) {
                // if(opts.bgTheme == 'dark') {
                //     modal = $('<div id="jove-modal" class="jove-modal-overlay modal-dark-overlay fade" aria-hidden="true">');
                //     container = $('<div class="jove-modal-container jove-modal-dark">').appendTo(modal);
                // } else if (opts.bgTheme == 'video') {
                //     modal = $('<div id="jove-modal" class="jove-modal-overlay modal-dark-overlay fade" aria-hidden="true">');
                //     container = $('<div class="jove-modal-container jove-modal-video">').appendTo(modal);
                // } else {
                //     modal = $('<div id="jove-modal" class="jove-modal-overlay fade" aria-hidden="true">');
                //     container = $('<div class="jove-modal-container">').appendTo(modal);
                // }
                modal = $('<div id="jove-modal" class="jove-modal-overlay fade" aria-hidden="true">');
                container = $('<div class="jove-modal-container">').appendTo(modal);
                $('body').append(modal);
                close = '<span id="jove-modal-close" tabindex="0"><img src="/img/times-black.svg" alt="Close"/></span>';
                wrapper = $('<div class="jove-modal-wrapper">').appendTo(container);
                box = $('<div class="jove-modal-box">').append(close).appendTo(wrapper);
                $('body').on('click', '#jove-modal-close', $.fn.jovebox.close);
            } else {
				if(opts.bgTheme == 'dark') {
					$('.jove-modal-container').addClass('jove-modal-dark');
				} else if (opts.bgTheme == 'video') {
					$('.jove-modal-container').addClass('jove-modal-video');
				} else if(opts.bgTheme == 'trial'){
					$('.jove-modal-container').addClass('jove-modal-dark').addClass('modal-trial-container');
				}
			}
        },
        _show = function () {
            if(opts.bgTheme == 'dark' || opts.bgTheme == 'trial') {
                if(!$('#jove-modal').hasClass('modal-dark-overlay')) {
                    $('#jove-modal').addClass('modal-dark-overlay');
                }
				if(opts.bgTheme == 'trial' && !$('#jove-modal').hasClass('modal-trial-container')){
					 $('#jove-modal').addClass('modal-trial-container');				
				}
                if(!$('.jove-modal-container').hasClass('jove-modal-dark')) {
                    $('.jove-modal-container').addClass('jove-modal-dark');
                }
            } else if (opts.bgTheme == 'video') {
                if(!$('#jove-modal').hasClass('modal-dark-overlay')) {
                    $('#jove-modal').addClass('modal-dark-overlay');
                }
                if(!$('.jove-modal-container').hasClass('jove-modal-video')) {
                    $('.jove-modal-container').addClass('jove-modal-video');
                }
            } else if (opts.bgTheme == 'search') {
                if($('#jove-modal').hasClass('modal-dark-overlay')) {
                    $('#jove-modal').removeClass('modal-dark-overlay');
                }
                if($('.jove-modal-container').hasClass('jove-modal-video')) {
                    $('.jove-modal-container').removeClass('jove-modal-video');
                }
                if($('.jove-modal-container').hasClass('jove-modal-dark')) {
                    $('.jove-modal-container').removeClass('jove-modal-dark');
                }
                $('.jove-modal-wrapper').css({
                    'padding': '45px 0px'
                });
                if(!$('#jove-modal-title').length) {
                    var modal_title = '<span id="jove-modal-title">' + opts.title + '</span>';
                    $('.jove-modal-wrapper').prepend(modal_title);
                } else {
                    $('#jove-modal-title').html(opts.title);
                }
            } else {
                if($('#jove-modal').hasClass('modal-dark-overlay')) {
                    $('#jove-modal').removeClass('modal-dark-overlay');
                }
                if($('.jove-modal-container').hasClass('jove-modal-video')) {
                    $('.jove-modal-container').removeClass('jove-modal-video');
                }
                if($('.jove-modal-container').hasClass('jove-modal-dark')) {
                    $('.jove-modal-container').removeClass('jove-modal-dark');
                }
            }
            container.css({
                'max-width': opts.max_width,
                'margin': opts.margin
            });
        };
        // _destroy = function() {
        //     $('body').append($('#jove-modal .jove-modal-box').next('div'));
        //     $('#jove-modal').remove();
        // };

    $.fn.jovebox = function (options) {
        return this.each(function() {
            opts = $.extend({}, $.fn.jovebox.defaults, options);
            objects.push(this);
            index = objects.indexOf(this);
            _init();
            box.append(this);
            _show();
            $.fn.jovebox.open();
        });
    };

    $.fn.jovebox.defaults = {
        max_width: '684px',
        margin: '10vh auto',
        bgColor: '#FFFFFF',
        bgTheme: 'default',
        onOpen : function() {},
        onClose : function() {}
    };

    $.fn.jovebox.open = function () {
        if(typeof opts.onOpen === 'function') {
            opts.onOpen();
        }
        $('#jove-modal').attr('aria-hidden', false);
		$('#jove-modal').addClass('show');
        $(objects[index]).show();
		modalPlayerFocusTrap(objects[index]);
        $('body').addClass('body-noscroll');
    }
    $.fn.jovebox.close = function () {
        if(typeof opts.onClose === 'function') {
            opts.onClose();
        }
        $(objects[index]).hide();
        $('#jove-modal').attr('aria-hidden', true);
        $('#jove-modal').removeClass('show');
		$('.jove-modal-container').removeClass('jove-modal-video');
		$('.jove-modal-container').removeClass('jove-modal-dark');
        $('body').removeClass('body-noscroll');
        // _destroy();
    }
})(jQuery);


// JoVE JS CONSTANTS 
var JOVE = {};
Object.defineProperty(JOVE, "RESEARCH_INPRESS_SECTIONS", {
    value:        [15, 48, 11, 0, 49, 13, 29, 12, 14, 47, 2, 4, 1, 50, 112, 117, 144, 148],
    enumerable:   true,
    writable:     false,
    configurable: false
});

//Focus trap inside modal video
function modalPlayerFocusTrap(ind){
	$('span#jove-modal-close').focus();
	$('#jove-modal').keydown(function(e){
	  	if($('.fp-speed').is(":focus") && (e.which || e.keyCode) == 9){
	    	e.preventDefault();
	    	$('span#jove-modal-close').trigger('focus');
	  	}
		if($('#resource-request-send').is(":focus") && (e.which || e.keyCode) == 9){
	    	e.preventDefault();
	    	$('span#jove-modal-close').trigger('focus');
	  	}
	});
	$('#jove-modal-close').keydown(function(e){  
	  if (e.keyCode == 13) {
	    $(ind).hide();
        $('#jove-modal').attr('aria-hidden', true);
        $('#jove-modal').removeClass('show');
		$('.jove-modal-container').removeClass('jove-modal-video');
		$('.jove-modal-container').removeClass('jove-modal-dark');
        $('body').removeClass('body-noscroll');
	   } 
	});
}
