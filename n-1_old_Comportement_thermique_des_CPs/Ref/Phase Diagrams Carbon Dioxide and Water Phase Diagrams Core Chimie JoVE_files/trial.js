$(function() {
    var has_new_access_button = false;
    if (new_trial) {
		new_trial_timer = setInterval(function(){ new_adjust_time_left(); },1000);
	}

    function new_adjust_time_left(){
		hours = Math.floor(new_time_remaining/3600);
		hour_string = String(hours);
    	if (hour_string.length < 2) {
    		hour_string = '0'+hours;
    	}
    	minutes = Math.floor((new_time_remaining-(3600*hours))/60);
		minute_string = String(minutes);
    	if (minute_string.length < 2) {
    		minute_string = '0'+minutes;
    	}
    	seconds = new_time_remaining % 60;
    	second_string = String(seconds);
    	if (second_string.length < 2) {
    		second_string = '0'+seconds;
    	}

    	time_string = hour_string+":"+minute_string+":"+second_string;
    	if (hours<=0 && minutes <= 0 && seconds <= 0 && new_trial_timer) {
    		clearInterval(new_trial_timer);
    		new_trial_timer = false;
    	}else{
    		new_time_remaining--;
    	}
        // display time string
        $('#trial-timer span').html(time_string);
        $('#mobile-trial-timer span').html(time_string);
    }
});

function openSimpleTrial() {
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
	/*
	var userid = $('#user_id').val();
    if(userid != '') {
		// logged in 
		$('#access-modal').jovebox({
            max_width: '375px',
            margin: '30vh auto',
            bgTheme: 'trial',
			onOpen: function() {
				$('.access-signup-wrap').hide();
				$('.access-login-wrap').hide();
				$('#access-login-status').removeClass('show');
				$('.access-reset-wrap').hide();
				$('.access-redirect-wrap').hide();
				$('.access-response-wrap').hide();
				$('.access-used-wrap').hide();
				$('.access-trial-login-create-wrap').hide();
				$('.access-trial-login-create-wrap_2').hide();
				$('.access-trial-wrap').hide();
				$('.trial-form-status').removeClass('show');
				$('.jove-modal-container.jove-modal-dark').css({marginTop: '10vh'});
				$('.access-form-wrap').hide();
				$('.access-trial-wrap').show();
				//do we want to clear on open? why not just clear on close
				//$('.access-trial-wrap input[type="text"]:not(#access-trial-email):not(#access-trial-inst), .access-trial-wrap textarea').val('');
				dataLayer.push({'event': 'startTrialJourney'});
				dataLayer.push({'event': 'showTrialFormModal'});
			},
			onClose: function() {
				$('#access-email').val('');
				$('.access-signup-wrap').hide();
				$('.access-login-wrap').hide();
				$('#access-login-status').removeClass('show');
				$('.access-reset-wrap').hide();
				$('.access-role-wrap').hide();
				$('.access-redirect-wrap').hide();
				$('.access-response-wrap').hide();
				$('.access-used-wrap').hide();
				$('.access-trial-login-create-wrap').hide();
				$('.access-trial-login-create-wrap_2').hide();
				$('.access-trial-wrap').hide();
				$('#other_inst_name').hide();
				$('.access-trial-wrap input[type="text"]:not(#access-trial-email):not(#access-trial-inst), .access-trial-wrap input[type="tel"], .access-trial-wrap textarea').val('');
				$('#access-modal #captcha_container a[title="Refresh Image"]').trigger('click');
				$('.trial-form-status').removeClass('show');
				$('.trial-role-status').removeClass('show');
				$('.jove-modal-container.jove-modal-dark').css({marginTop: '10vh'});
				$('.access-form-wrap').show();
				$('.access-check-status').removeClass('show');
			}
        });
	} else {
		// not logged in
		$('#access-modal').jovebox({
            max_width: '375px',
            margin: '30vh auto',
            bgTheme: 'trial',
			onClose: function() {
				$('#access-email').val('');
				$('.access-signup-wrap').hide();
				$('.access-login-wrap').hide();
				$('#access-login-status').removeClass('show');
				$('.access-reset-wrap').hide();
				$('.access-role-wrap').hide();
				$('.access-redirect-wrap').hide();
				$('.access-response-wrap').hide();
				$('.access-used-wrap').hide();
				$('.access-trial-login-create-wrap').hide();
				$('.access-trial-login-create-wrap_2').hide();
				$('.access-trial-wrap').hide();
				$('#other_inst_name').hide();
				$('.access-trial-wrap input[type="text"]:not(#access-trial-email), .access-trial-wrap input[type="tel"], .access-trial-wrap textarea').val('');
				$('#access-modal #captcha_container a[title="Refresh Image"]').trigger('click');
				$('.trial-form-status').removeClass('show');
				$('.trial-role-status').removeClass('show');
				$('.jove-modal-container.jove-modal-dark').css({marginTop: '30vh'});
				$('.access-form-wrap').show();
				$('.access-check-status').removeClass('show');
			}
        });
		dataLayer.push({'event': 'startTrialJourney'});
		dataLayer.push({'event': 'showTrialEmailModal'});
	}*/
	return false;
}
