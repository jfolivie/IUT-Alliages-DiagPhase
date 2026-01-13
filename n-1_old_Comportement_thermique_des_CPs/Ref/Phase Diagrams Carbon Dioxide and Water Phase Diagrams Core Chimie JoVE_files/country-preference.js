function mktcpInit() {
    var cur_country_code = get_path_country();
    var cur_countrys = ['','','','','','','','','','','','','',''];
    switch (cur_country_code) {
        case 'us':
 		cur_countrys[0] = 1;
        break;
        case 'cn':
		cur_countrys[1] = 1;
        break;
        case 'de':
		cur_countrys[2] = 1;
        break;
	case 'es':
		cur_countrys[3] = 1;
        break;
	case 'kr':
		cur_countrys[4] = 1;
        break;
	case 'it':
		cur_countrys[5] = 1;
        break;
	case 'fr':
		cur_countrys[6] = 1;
        break;
	case 'pt':
		cur_countrys[7] = 1;
	break;
	case 'tr':
		 cur_countrys[8] = 1;
	break;
	case 'ja':
		cur_countrys[9] = 1;
	break;
        default :
		cur_countrys[0] = 1;
    }
    mktcpShow({cur_countrys: cur_countrys, country_preference_selector: '.nav-mobile-country-preference'});
    mktcpShow({cur_countrys: cur_countrys, country_preference_selector: '#nav-country-preference'});
}
function mktcpShow(country_preference) {
	$tcp = $(country_preference.country_preference_selector);
	if (!country_preference || $tcp.length === 0) return; // bail if something is missing
	// add disabled class to cur country preference link
	$tcp.find('.country-preference').each(function(index,item){
		if(country_preference.cur_countrys[index]){
			$(this).addClass('disabled-link');
		}
	});
}

$(function() {
    // country preference
	mktcpInit();
    
    // toggle country preference dropdown on click
    $('.header-links-container, .nav-country-preference').on('click','.cur-country-preference',function(){
        $(this).next('.country-dropdown-content').toggleClass('show');
        $(this).toggleClass('expand');
        $('#country-popup').hide();
    });
    $('.header-links-container, .nav-country-preference').on('click','.country-preference',function(e) {
        e.preventDefault();
        if($(this).hasClass('disable-link')){
            return false;
        }
        $(this).css('pointer-events', 'none');//ie does not seem to work
        $(this).addClass('disabled-link');
        var from_country = get_path_country();
        var cur_path = window.location.href;
        if (!window.location.origin) {
          window.location.origin = window.location.protocol + "//" 
            + window.location.hostname 
            + (window.location.port ? ':' + window.location.port : '');
        }
        cur_path = cur_path.replace(window.location.origin, '');
        var country_code = $(this).data('country-preference');
        log_events('Regional Website','Select Region',from_country.toUpperCase()+'-'+country_code.toUpperCase());
        setCookie('country',country_code,365);
        cur_path = cur_path.replace(/^\/(?:cn|pt|de|es|kr|it|fr|ja|tr)(?:\/|$)/i, '/');
        if(country_code == 'us'){
            location.href = cur_path;
        }else{
            location.href = '/' + country_code + cur_path; 
        }
    });
    
    //pops up message 
    if(localStorage.getItem('accept-country-preference') != '1'){
        $('#country-popup').appendTo('#nav-country-preference').show();
    }
    $('.jove-header-container').on('click', '#country-popup .accept-country-preference',function(){
        localStorage.setItem('accept-country-preference', '1');
        $('#country-popup').hide();
    });
    $(window).on('load resize', function() {
        if(window.matchMedia('(max-width: 1200px)').matches){
            $("#country-popup").appendTo('#main-header .jove-header-container');
        }else{  
            $("#country-popup").appendTo('#nav-country-preference');
        }
    });
    $(document).on('mouseup',function(e){
        // hide country preference dropdown when clicked outside
        var country_container = $('.country-dropdown-content');
        var country_button = $('.cur-country-preference');
        if (!country_button.is(e.target) && country_button.has(e.target).length === 0 
            && !country_container.is(e.target) && country_container.has(e.target).length === 0){
            country_container.removeClass('show');
            country_button.removeClass('expand');
        }
        // hide country pop up message when clicked outside
        var country_popup = $('#country-popup');
        if (!country_popup.is(e.target) && country_popup.has(e.target).length === 0){
            country_popup.hide();
        }
    });
});
