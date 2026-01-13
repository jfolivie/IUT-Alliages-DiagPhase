$(function() {
	$('.video_chapters div.text ul li').on('click',function() {
		$('.video_chapters div.text ul li.selected').removeClass('selected');
		$(this).addClass('selected');
	});

	$(document).on('chapterChange', function(event) {
		if ($('#script_'+0).html().length !== 0) {
			$('.chapter_script').slideUp();
			var chapterIndex = 0;
			var $target = $(event.target);
			chapterIndex = $target.attr('id').replace('chapter','');

			if ($target.children(':not(.chapter_time)').children('.chapter_script').length === 0) {
				$target.children(':not(.chapter_time)').append('<div class="chapter_script"></div>');
				$target.children(':not(.chapter_time)').children('.chapter_script').html($('#script_'+chapterIndex).html());
			}
			$target.children(':not(.chapter_time)').children('.chapter_script').slideDown();
		}
	});

	$('.article_thumb_container').on('mouseover',function() {
		$('.thumb_description').hide();
		$(this).children('.thumb_description').show();
	}).on('mouseout',function() {
		$('.thumb_description').hide();
	});

	$('#submit_new_quiz').on('click',function() {
    	$(this).off('click');
    	$(this).html('Submitting&hellip;');

    	var question_count = $('.quiz_question_content').length;
    	var answers = [];
		
		$('.quiz_question_content').each(function(){
			ans = $(this).find('.question_choice_content label input:checked').val();
			if(ans){
				answers.push(ans);
			}
		});
    	if (answers.length == question_count) {
    		var json = JSON.stringify(answers);
	    	$.post("/quiz/ajax",
    		{
    			action: 'save_quiz_results',
    			quiz_taker_id: $('#quiz_taker_id').val(),
    			quiz_id: $('#quiz_id').val(),
    			content: json
    		}, function(data) {
    			$('#quiz_box').slideUp("slow", function() {

					$('#quiz_box').slideDown("slow");
    				$('#quiz_box').html(data);
					$('html, body').animate({ scrollTop: "0px" });

    			});
    		});
    	} else {
    		$(this).html('Submit');
    		alert('Please answer all questions!');
    	}
    });

	$('#reset_password_link_modal').on('click',function() {
		console.log("test");
		$('.signin_form_modal').slideUp('slow');
		$('#signin_status_modal').slideUp('slow');
		$('#reset_password_modal').slideDown('slow');
		$('#reset_password_email_modal').trigger('focus');
	});

	$('#reset_password_cancel_modal').on('click',function() {
		$('#reset_password_modal').slideUp('slow');
		$('#signin_status_modal').slideUp('slow');
		$('.signin_form_modal').slideDown('slow');
	});

	$('a.share').on('click',function(){
		$('.share-wrapper').fadeToggle('fast');
	});
	$('.share-wrapper').on('mouseleave',function(){
		$('.share-wrapper').fadeOut('fast');
	});	
});
