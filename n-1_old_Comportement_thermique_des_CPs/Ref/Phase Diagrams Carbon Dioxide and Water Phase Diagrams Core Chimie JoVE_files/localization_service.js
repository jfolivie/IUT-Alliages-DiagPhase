var LOCALIZATION = (function ($) {
	var locale = {};
	var _language = 'English';
	var _translation_map = {};
	var _translation_files = [];
	var _language_pool = ['English', 'Chinese', 'German', 'Russian', 'Korean', 'Spanish', 'Portuguese', 'Italian', 'Dutch', 'Turkish', 'French', 'Japanese', 'Arabic', 'Hebrew'];

	locale.init = function (language, paths) {
		language = language || 'English';
		paths = paths || [];

		try {
			if (!_language_pool.includes(language) || paths.length === 0) {
				_language = 'English';
			} else {
				_language = language;
			}
			if (_language !== 'English') {
				paths.forEach(function (path) {
					var full_path = '/localization/' + path + '/languages/' + _language + '.json';
					if (!_translation_files.includes(full_path)) {
						_translation_files.push(full_path);
						$.getJSON(full_path, {
							format: 'json'
						}).done(function (data) {
							$.each(data, function (key, val) {
								_translation_map[key] = val;
							});
						}).fail(function (jqxhr, textStatus, error) {
							var err = textStatus + ", " + error;
							console.log("Request Failed: " + err);
						});
					}
				});
			}
		} catch (e) {
			console.error(e.name + ': ' + e.message);
		}
	}

	locale.get_translation = function (msgid) {
		if (_language === 'English') {
			return msgid;
		}
		if (_translation_map === undefined || _translation_map[msgid] === undefined || _translation_map[msgid].length === 0) {
			return msgid;
		}
		return _translation_map[msgid];
	}

	locale.show_translation_map = function () {
		return _translation_map;
	}

	return locale;
})(jQuery);

function get_site_language() {
	var pathname = window.location.pathname;
	var cn_regex = /^\/cn(\/|$)/g;
	var de_regex = /^\/de(\/|$)/g;
	var es_regex = /^\/es(\/|$)/g;
	var kr_regex = /^\/kr(\/|$)/g;
	var it_regex = /^\/it(\/|$)/g;
	var fr_regex = /^\/fr(\/|$)/g;
	var pt_regex = /^\/pt(\/|$)/g;
	var ja_regex = /^\/ja(\/|$)/g;
	var tr_regex = /^\/tr(\/|$)/g;
	var ar_regex = /^\/ar(\/|$)/g;
	if (cn_regex.test(pathname)) {
		return 'Chinese';
	} else if (de_regex.test(pathname)) {
		return 'German';
	} else if (es_regex.test(pathname)) {
		return 'Spanish';
	} else if (kr_regex.test(pathname)) {
		return 'Korean';
	} else if (it_regex.test(pathname)) {
		return 'Italian';
	} else if (pt_regex.test(pathname)) {
		return 'Portuguese';
	} else if (fr_regex.test(pathname)) {
		return 'French';
	} else if (ja_regex.test(pathname)) {
		return 'Japanese';
	} else if (tr_regex.test(pathname)) {
		return 'Turkish';
	} else if (ar_regex.test(pathname)) {
		return 'Arabic';
	} else {
		return 'English';
	}
}
