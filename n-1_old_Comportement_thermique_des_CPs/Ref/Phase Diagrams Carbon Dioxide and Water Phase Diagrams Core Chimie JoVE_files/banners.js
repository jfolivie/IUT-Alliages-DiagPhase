function mktbShow(banner) {
    $tb = $('#jove-trial-banner');
    if (banner.newTheme == '1')
        $tb = $('#jove-trial-banner-advance');

    if (!banner || $tb.length === 0) return; // bail if something is missing
    if (banner.class.indexOf('mktb-popup') !== -1 &&
        localStorage.getItem('accept-jove-cookie') !== '1') return; // bail if bottom banner and cookies are showing
    // if (banner.class.indexOf('mktb-banner') !== -1 
    // 	&& localStorage.getItem('accept-country-preference') !== '1'
    // 	&& getCookie('country') === 'cn') return; // bail if country redirect message popup is showing

    // inject some banner content
    $tb.find('#mktb-title').text(banner.title);
    $tb.find('#mktb-description').html(banner.description);
    $tb.find('#mktb-action').html(banner.action);
    $tb.find('#mktb-action').attr('href', banner.href)

    // insert banner at the top of main content, then show it fancy
    $tb.prependTo($("#content.site-content")).addClass(banner.class).show();
    setTimeout(function() {
        $tb.addClass('expand');
    }, 300);

    $('.mktb-banner, .mktb-popup').find('.jove-trial-banner-close').on('click', function() {
        if (banner.newTheme == '1')
            $(this).closest('.mktb-banner, .mktb-popup').hide('500');
        else
            $(this).closest('.expand').removeClass('expand');
    });
}

function mktbCheckAccess(section_id, banner) {
    $.post(create_path_country() + '/account/ajax', { action: 'has_section_access', section_id: section_id }).done(function(data) {
        if (data === 'false') {
            mktbShow(banner);
        }
    });
}

function mktbInit() {

    //var matches = window.location.pathname.match(/(\/[^?\/]+)/g);	//maybe later :)
    var path = window.location.pathname;

    /**
     *  TRIAL BANNERS - MUST USE mktbCheckAccess() function!
     */

    //regex Core Chem
    /*if(get_site_language() == 'English'){
    	var regex = '^/science-education/corechem$';
    	// trial Core Chemistry - Gategory (EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(115, {
    			class: "mktb-banner",
    			title: "",
    			description: "This undergraduate Chemistry video textbook now has 300+ videos explaining essential concepts.",
    			action: "Request a trial",
    			href: "https://info.jove.com/core-chem-trial"			
    		});
    	}
    }else if(get_site_language() == 'Korean'){
    	var regex = '^/kr/science-education/corechem$';
    	// trial Core Chemistry - Gategory (EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(115, {
    			class: "mktb-banner",
    			title: "",
    			description: "이 학부 화학 비디오 교과서에는 이제 필수 개념을 설명하는 300개 이상의 비디오가 있습니다.",
    			action: "평가판 요청하기",
    			href: "https://info.jove.com/kr-core-chem-trial"			
    		});
    	}
    }else if(get_site_language() == 'Spanish'){
    	var regex = '^/es/science-education/corechem$';
    	// trial Core Chemistry - Gategory (ES)
    	if (path.match(regex)) {
    		mktbCheckAccess(115, {
    			class: "mktb-banner",
    			title: "",
    			description: "Este libro de texto en video de química de pregrado ahora tiene 300+ videos que explican conceptos esenciales.",
    			action: "Solicita una versión de prueba",
    			href: "https://info.jove.com/es/core-chem-trial"			
    		});
    	}
    }else if(get_site_language() == 'Chinese'){
    	var regex = '^/cn/science-education/corechem$';
    	// trial Core Chemistry - Gategory (CN)
    	if (path.match(regex)) {
    		mktbCheckAccess(115, {
    			class: "mktb-banner",
    			title: "",
    			description: "这本本科化学视频教科书现在有 300 多个解释基本概念的视频。",
    			action: "申请试用",
    			href: "https://info.jove.com/zh-cn/core-chem-trial"			
    		});
    	}
    }else if(get_site_language() == 'German'){
    	var regex = '^/de/science-education/corechem$';
    	// trial Core Chemistry - Gategory (DE)
    	if (path.match(regex)) {
    		mktbCheckAccess(115, {
    			class: "mktb-banner",
    			title: "",
    			description: "Dieses Videolehrbuch für Chemiestudenten im Grundstudium bietet jetzt mehr als 300 Videos zur Erläuterung der wichtigsten Konzepte.",
    			action: "Testzugang anfordern",
    			href: "https://info.jove.com/de-core-chem-trial-ws"			
    		});
    	}
    }else if(get_site_language() == 'Italian'){
    	var regex = '^/it/science-education/corechem$';
    	// trial Core Chemistry - Gategory (DE)
    	if (path.match(regex)) {
    		mktbCheckAccess(115, {
    			class: "mktb-banner",
    			title: "",
    			description: "Questo video-manuale di Chimica per studenti universitari ha ora più di 300 video che spiegano i concetti essenziali.",
    			action: "Richiedi un periodo di prova",
    			href: "https://info.jove.com/it/core-chem-trial"			
    		});
    	}
    }
	
    //regex Core Organic Chemistry
    if(get_site_language() == 'English'){
    	var regex = '^/science-education/coreorgchem$';
    	// trial Core Organic Chemistry - Gategory	(EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(136, {
    			class: "mktb-banner",
    			title: "",
    			description: "This new undergraduate Organic Chemistry video textbook explains basic concepts through concise video lessons.",
    			action: "Request a trial",
    			href: "https://info.jove.com/core-org-chem-trial"			
    		});
    	}
    }else if(get_site_language() == 'Korean'){
    	var regex = '^/kr/science-education/coreorgchem$';
    	// trial Core Organic Chemistry - Gategory	(EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(136, {
    			class: "mktb-banner",
    			title: "",
    			description: "이 새로운 학부 유기화학 비디오 교과서는 간결한 비디오 수업을 통해 기본 개념을 설명합니다.",
    			action: "평가판 요청하기",
    			href: "https://info.jove.com/kr-core-org-chem-trial"			
    		});
    	}
    }else if(get_site_language() == 'Spanish'){
    	var regex = '^/es/science-education/coreorgchem$';
    	// trial Core Organic Chemistry - Gategory	(ES)
    	if (path.match(regex)) {
    		mktbCheckAccess(136, {
    			class: "mktb-banner",
    			title: "",
    			description: "Este libro de texto audiovisual de Química Orgánica explica conceptos básicos a través de lecciones audiovisuales concisas.",
    			action: "Solicita una versión de prueba",
    			href: "http://info.jove.com/es-es/core-org-chem-trial"	
    		});
    	}
    }else if(get_site_language() == 'Chinese'){
    	var regex = '^/cn/science-education/coreorgchem$';
    	// trial Core Organic Chemistry - Gategory	(CN)
    	if (path.match(regex)) {
    		mktbCheckAccess(136, {
    			class: "mktb-banner",
    			title: "",
    			description: "这本全新的本科有机化学视频教科书通过简洁的视频课程对基本概念进行了解释。",
    			action: "申请试用",
    			href: "https://info.jove.com/core-org-chem-trial-0"			
    		});
    	}
    }else if(get_site_language() == 'German'){
    	var regex = '^/de/science-education/coreorgchem$';
    	// trial Core Organic Chemistry - Gategory	(DE)
    	if (path.match(regex)) {
    		mktbCheckAccess(136, {
    			class: "mktb-banner",
    			title: "",
    			description: "Dieses neue Lehrbuch für Organische Chemie erklärt grundlegende Konzepte in kurzen.",
    			action: "Testzugang anfordern",
    			href: "https://info.jove.com/de-core-org-chem-trial-ws"			
    		});
    	}
    }else if(get_site_language() == 'Italian'){
    	var regex = '^/it/science-education/coreorgchem$';
    	// trial Core Organic Chemistry - Gategory	(EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(136, {
    			class: "mktb-banner",
    			title: "",
    			description: "Questo nuovo video-manuale di chimica organica per studenti universitari spiega i concetti di base attraverso concise video-lezioni.",
    			action: "Richiedi un periodo di prova",
    			href: "https://info.jove.com/it/core-org-chem-trial"			
    		});
    	}
    }	

    //regex Core Molecular Biology
    if(get_site_language() == 'English'){
    	var regex = '^/science-education/coremolbio$';
    	// trial Core Molecular Biology - Gategory	(EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(140, {
    			class: "mktb-banner",
    			title: "",
    			description: "This new undergraduate Molecular Biology video textbook offers 300+ videos explaining essential concepts.",
    			action: "Request a trial",
    			href: "https://info.jove.com/core-mol-bio-trial"
    		});
    	}
    }else if(get_site_language() == 'Korean'){
    	var regex = '^/kr/science-education/coremolbio$';
    	// trial Core Molecular Biology - Gategory	(EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(140, {
    			class: "mktb-banner",
    			title: "",
    			description: "이 새로운 학부 분자 생물학 비디오 교과서는 필수 개념을 설명하는 300개 이상의 비디오를 제공합니다.",
    			action: "평가판 요청하기",
    			href: "https://info.jove.com/kr-core-mol-bio-trial"
    		});
    	}
    }else if(get_site_language() == 'Spanish'){
    	var regex = '^/es/science-education/coremolbio$';
    	// trial Core Molecular Biology - Gategory	(ES)
    	if (path.match(regex)) {
    		mktbCheckAccess(140, {
    			class: "mktb-banner",
    			title: "",
    			description: "Este nuevo libro de texto en video de biología molecular para pregrado ofrece 300+ videos que explican conceptos esenciales.",
    			action: "Solicita una versión de prueba",
    			href: "https://info.jove.com/es/core-mol-bio-trial"
    		});
    	}
    }else if(get_site_language() == 'Chinese'){
    	var regex = '^/cn/science-education/coremolbio$';
    	// trialCore Molecular Biology - Gategory	(CN)
    	if (path.match(regex)) {
    		mktbCheckAccess(140, {
    			class: "mktb-banner",
    			title: "",
    			description: "这本全新的本科分子生物学视频教科书提供了 300 多个解释基本概念的视频。",
    			action: "申请试用",
    			href: "https://info.jove.com/zh-cn/core-mol-bio-trial"
    		});
    	}
    }else if(get_site_language() == 'German'){
    	var regex = '^/de/science-education/coremolbio$';
    	// trial Core Organic Chemistry - Gategory	(DE)
    	if (path.match(regex)) {
    		mktbCheckAccess(140, {
    			class: "mktb-banner",
    			title: "",
    			description: "Dieses Videolehrbuch für Studenten der Molekularbiologie im Grundstudium bietet jetzt mehr als 300 Videos zur Erläuterung der wichtigsten Konzepte.",
    			action: "Testzugang anfordern",
    			href: "https://info.jove.com/de-core-mol-bio-trial-ws"
    		});
    	}
    }else if(get_site_language() == 'Italian'){
    	var regex = '^/it/science-education/coremolbio$';
    	// trial Core Molecular Biology - Gategory	(EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(116, {
    			class: "mktb-banner",
    			title: "",
    			description: "Questo nuovo video-libro di Biologia molecolare per studenti universitari offre più di 300 video che spiegano i concetti essenziali.",
    			action: "Richiedi un periodo di prova",
    			href: "https://info.jove.com/it/core-mol-bio-trial"
    		});
    	}
    }	

    	//regex core statistics
    if(get_site_language() == 'English'){
    	var regex = '^/science-education/corestats$';
    	// trial Core statistics - Gategory (EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(116, {
    			class: "mktb-banner",
    			title: "",
    			description: "This new undergraduate Statistics video textbook explains basic concepts through concise video lessons.",
    			action: "Request a trial",
    			href: "https://info.jove.com/core-stats-trial"			
    		});
    	}
    }else if(get_site_language() == 'Korean'){
    	var regex = '^/kr/science-education/corestats$';
    	// trial Core statistics - Gategory (EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(116, {
    			class: "mktb-banner",
    			title: "",
    			description: "생물학, 화학 등 다양한 실험을 진행한 후 연구 데이터의 통계적 유효성을 따지는데 필요한 통계학 시리즈를 지금 확인해 보시고 무료",
    			action: "트라이얼을 신청하세요!",
    			href: "https://info.jove.com/ko/core-stats-trial-0"			
    		});
    	}
    }else if(get_site_language() == 'Spanish'){
    	var regex = '^/es/science-education/corestats$';
    	// trial Core statistics - Gategory (ES)
    	if (path.match(regex)) {
    		mktbCheckAccess(116, {
    			class: "mktb-banner",
    			title: "",
    			description: "Este libro de texto audiovisual de Estadística, dirigido a estudiantes universitarios, explica conceptos básicos a través de lecciones de video concisas.",
    			action: "Solicita un periodo de prueba",
    			href: "https://info.jove.com/core-statistics-trial-0-0-2"			
    		});
    	}
    }else if(get_site_language() == 'Chinese'){
    	var regex = '^/cn/science-education/corestats$';
    	// trial Core statistics - Gategory (CN)
    	if (path.match(regex)) {
    		mktbCheckAccess(116, {
    			class: "mktb-banner",
    			title: "",
    			description: "This new undergraduate Statistics video textbook explains basic concepts through concise video lessons.",
    			action: "Request a trial",
    			href: "https://info.jove.com/core-stats-trial"			
    		});
    	}
    }else if(get_site_language() == 'German'){
    	var regex = '^/de/science-education/corestats$';
    	// trial Core statistics - Gategory (DE)
    	if (path.match(regex)) {
    		mktbCheckAccess(116, {
    			class: "mktb-banner",
    			title: "Brandneue Veröffentlichung!",
    			description: "Unser neues Video-Lehrbuch rund um Statistik erklärt grundlegende Konzepte durch prägnante Videolektionen.",
    			action: "Sichern Sie sich Ihren kostenfreien Testzugang!",
    			href: "https://info.jove.com/de/core-statistics-trial-request-website"			
    		});
    	}
    }
    //CORE PHYSICS
    if(get_site_language() == 'English'){
    	var regex = '^/science-education(-library)?/(corephysics|1(?:6[3-9]|7\d))';
    	// trial Core statistics - Gategory (EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(141, {
    			class: "mktb-banner",
    			title: "New Release!",
    			description: "This new undergraduate Physics video textbook explains basic concepts through concise video lessons.",
    			action: "Request a trial",
    			href: "https://info.jove.com/core-physics-trial-request-lp"			
    		});
    	}
    }else if(get_site_language() == 'Korean'){
    	var regex = '^/kr/science-education(-library)?/(corephysics|1(?:6[3-9]|7\d))';
    	// trial Core statistics - Gategory (EN)
    	if (path.match(regex)) {
    		mktbCheckAccess(141, {
    			class: "mktb-banner",
    			title: "새로운 시리즈!",
    			description: "이 새로운 학부 물리학 비디오 교과서는 간결한 비디오 수업을 통해 기본 개념을 상세히 설명합니다.",
    			action: "무료 트라이얼 신청하세요!",
    			href: "https://info.jove.com/ko/core-physics-trial-request"			
    		});
    	}
    }else if(get_site_language() == 'Spanish'){
    	var regex = '^/es/science-education(-library)?/(corephysics|1(?:6[3-9]|7\d))';
    	// trial Core statistics - Gategory (ES)
    	if (path.match(regex)) {
    		mktbCheckAccess(141, {
    			class: "mktb-banner",
    			title: "¡Nuevo lanzamiento!",
    			description: "Este nuevo libro de texto en video de física para estudiantes universitarios explica conceptos básicos a través de lecciones en video concisas.",
    			action: "Solicita una prueba",
    			href: "https://info.jove.com/es/es/es/core-physics-trial-request-0-0-0"			
    		});
    	}
    }else if(get_site_language() == 'Chinese'){
    	var regex = '^/cn/science-education(-library)?/(corephysics|1(?:6[3-9]|7\d))';
    	// trial Core statistics - Gategory (CN)
    	if (path.match(regex)) {
    		mktbCheckAccess(141, {
    			class: "mktb-banner",
    			title: "新品发布!",
    			description: "这个全新本科物理视频教材通过简明的视频课程诠释基本概念。",
    			action: "申请试用",
    			href: "https://info.jove.com/zh-cn/core-physics-trial-request-lp"			
    		});
    	}
    }else if(get_site_language() == 'German'){
    	var regex = '^/de/science-education(-library)?/(corephysics|1(?:6[3-9]|7\d))';
    	// trial Core statistics - Gategory (DE)
    	if (path.match(regex)) {
    		mktbCheckAccess(141, {
    			class: "mktb-banner",
    			title: "Neue Veröffentlichung!",
    			description: "Unser neues Video-Lehrbuch für Physik im Bachelor-Studium erklärt grundlegende Konzepte durch prägnante Videolektionen.",
    			action: "Fordern Sie einen kostenfreien Testzugang an",
    			href: "https://info.jove.com/de/core-physics-trial-request-lp"			
    		});
    	}
    }else if(get_site_language() == 'Italian'){
    	var regex = '^/it/science-education(-library)?/(corephysics|1(?:6[3-9]|7\d))';
    	// trial Core statistics - Gategory (DE)
    	if (path.match(regex)) {
    		mktbCheckAccess(141, {
    			class: "mktb-banner",
    			title: "Nuova pubblicazione!",
    			description: "Questo nuovo video textbook sulla Fisica illustra concetti di base attraverso video animazioni.",
    			action: "Richiedi un trial.",
    			href: "https://info.jove.com/it/core-physics-trial-request-lp"			
    		});
    	}
    }

    // trial Core Molecular Biology - Chapter Level
    /*var regex = '^/science-education-library/[\d]*';
    if (path.match(regex)) {
    	if (typeof section_id === 'undefined' || section_id !== 116) return;
    	mktbCheckAccess(116, {
    		class: "mktb-banner",
    		title: "New Release!",
    		description: "This new undergraduate Molecular Biology video textbook offers 300+ videos explaining essential concepts.",
    		action: "Request a trial",
    		href: "https://info2.jove.com/core-molecular-bio-cl-lp"		
    		//missing form for here
    	});
    }*/
    // trial Core Molecular Biology - Chapter
    // var regex = '^/science-education-library/[\d]*';
    // if (path.match(regex)) {
    // 	if (typeof section_id === 'undefined' || section_id !== 116) return;
    // 	mktbCheckAccess(116, {
    // 		class: "mktb-popup dark-popup",
    // 		title: "New Release!",
    // 		description: "This new undergraduate Molecular Biology video textbook offers 190 videos explaining essential concepts.",
    // 		action: "Request a trial",
    // 		href: "https://info2.jove.com/core-molecular-bio-cl-lp"				
    // 	});
    // }

    // trial banner for eoe Cancer Research
    // var regex = '^/encyclopedia-of-experiments/cancer-research$';
    // var regex2 = '^/encyclopedia-of-experiments/category/(4|5|6|7)/';
    // if(path.match(regex) || path.match(regex2)) {
    // 	mktbCheckAccess(117, {
    // 		class: "mktb-banner eoe-cancer-research-banner",
    // 		title: "New Release!",
    // 		description: "This new online video encyclopedia features advanced experiments in cancer research.",
    // 		action: "Request a trial",
    // 		href: "https://info.jove.com/eoe-cancer-research-trials"			
    // 	});
    // }

    /**
     *  OTHER, NON-TRIAL BANNERS
     */
    /**
     * ASSESSMENTS
     */
    var regex = '^/librarians/resources$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup librarian-contact dark-popup",
            title: "",
            description: "<b>For dedicated support for your library</b>, please reach out to us!",
            action: "Contact Us",
            href: "https://info.jove.com/librarian-resources-contact"
        });
    }

    var regex = '^/de/librarians/resources$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup librarian-contact dark-popup",
            title: "",
            description: "<b>Wenn Ihre Bibliothek Unterstützung benötigt wenden Sie sich bitte an uns!",
            action: "Kontaktieren Sie uns!",
            href: "https://info.jove.com/librarian-resources-contact"
        });
    }

    var regex = '^/cn/librarians/resources$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup librarian-contact dark-popup",
            title: "",
            description: "<b>如需对您的图书馆的专门支持，</b>请与我们联系！",
            action: "联系我们",
            href: "https://info.jove.com/librarian-resources-contact"
        });
    }

    var regex = '^/it/librarians/resources$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup librarian-contact dark-popup",
            title: "",
            description: "<b>Per un supporto dedicato alla vostra biblioteca</b>, contattateci!",
            action: "Contattaci",
            href: "https://info.jove.com/librarian-resources-contact"
        });
    }

    var regex = '^/kr/librarians/resources$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup librarian-contact dark-popup",
            title: "",
            description: "<b>라이브러리에 대한 전담 지원을 받으려면 </b>저희에게 연락을 해주세요!",
            action: "문의하기",
            href: "https://info.jove.com/librarian-resources-contact"
        });
    }

    var regex = '^/es/librarians/resources$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup librarian-contact dark-popup",
            title: "",
            description: "<b>Para obtener soporte especializado para su biblioteca</b>, comuníquese con nosotros",
            action: "Contáctenos",
            href: "https://info.jove.com/librarian-resources-contact"
        });
    }

    var regex = '^/fr/librarians/resources$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup librarian-contact dark-popup",
            title: "",
            description: "<strong>Pour bénéficier d'un accompagnement dédié pour votre bibliothèque,</strong> n'hésitez pas à nous <a href=''>contacter !</a>",
            action: "",
            href: "https://info.jove.com/fr/librarian-resources-contact"
        });
    }

    //banner for education/core and education/lab-manual page
    // var regex = '^/education/(?:core|lab-manual)$';
    // var regex2 = '^/science-education-library$';
    // if(path.match(regex) || path.match(regex2)) {
    // 	mktbShow({
    // 		class: "mktb-banner training-webinar",
    // 		title: "Curious how JoVE can support your science instruction?",
    // 		description: "",
    // 		action: "Join a training webinar",
    // 		href: "https://info2.jove.com/weekly-training-webinars"			
    // 	});
    // }

    // banner for syllabus mapping page
    // var regex = '^/syllabus-mapping$';
    // if(path.match(regex)) {
    // 	mktbShow({
    // 		class: "mktb-popup syllabus-mapping dark-popup",
    // 		title: "Curious how JoVE can support your science instruction?",
    // 		description: "",
    // 		action: "Join a training webinar",
    // 		href: "https://info2.jove.com/weekly-training-webinars"				
    // 	});
    // }

    // login banner for embed directions page
    if (path.match(/\/embed\/directions\/[\d]+/) && $('#user_id').val() == 0 && $('#access_level').val() < 3) {
        var sample_length = $('#stream_id').val() == 1 ? '2 minute' : '22 second';
        var articleid = path.match(/([\d]+)/)[0];
        var langFolder = getCookie('country') ? '/' + getCookie('country') : '';
        //console.dir(langFolder);
        var loginurl = NEW_APPLICATION_URL + langFolder + '/auth/signin?redirectTo=' + encodeURIComponent('/embed/directions/' + articleid);
        mktbShow({
            class: "mktb-banner embed-directions",
            title: "",
            description: "<span id=\"sample-length\" class=\"bold-text\">" + sample_length + "</span> sample clip. <a href=\"" + loginurl + "\" class=\"bold-text\">Log in</a> as <em class=\"medium-text\">Author</em> or <em class=\"medium-text\">Professor</em> to embed <span class=\"bold-text\">FULL</span> video",
            action: "",
            href: ""
        });
    }

    //banner for authors/overview page

    var regex = '^/authors/overview$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "Interested in publishing in JoVE?",
            description: "<b>Connect with our Editorial Team</b>",
            action: "CONTACT EDITOR <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    var regex = '^/authors/publication$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "Interested in publishing in JoVE?",
            description: "<b>Connect with our Editorial Team</b>",
            action: "CONTACT EDITOR <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest-publicationpage"
        });
    }

    var regex = '^/cn/authors/overview$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "有兴趣在 JoVE 中发表期刊吗？",
            description: "<b>请与我们的编辑团队联系</b>",
            action: "联系编辑 <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    var regex = '^/cn/authors/publication$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "有兴趣在 JoVE 中发表期刊吗？",
            description: "<b>请与我们的编辑团队联系</b>",
            action: "联系编辑 <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    var regex = '^/de/authors/overview$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "Sind Sie an einer Publikation in JoVE interessiert?",
            description: "<b>Nehmen Sie Kontakt zu unserem Redaktionsteam auf</b>",
            action: "REDAKTION KONTAKTIEREN <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    var regex = '^/de/authors/publication$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "Sind Sie an einer Publikation in JoVE interessiert?",
            description: "<b>Nehmen Sie Kontakt zu unserem Redaktionsteam auf</b>",
            action: "REDAKTION KONTAKTIEREN <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    var regex = '^/es/authors/overview$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "¿Interesado en publicar en JoVE?",
            description: "<b>Conéctese con nuestro Equipo Editorial</b>",
            action: "CONTACTE AL EDITOR <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    var regex = '^/es/authors/publication$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "¿Interesado en publicar en JoVE?",
            description: "<b>Conéctese con nuestro Equipo Editorial</b>",
            action: "CONTACTE AL EDITOR <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    var regex = '^/kr/authors/overview$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "JoVE를 통한 출판에 관심이 있으신가요?",
            description: "<b>편집 팀과 연결하기</b>",
            action: "편집자에게 문의하기 <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    var regex = '^/kr/authors/publication$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "JoVE를 통한 출판에 관심이 있으신가요?",
            description: "<b>편집 팀과 연결하기</b>",
            action: "편집자에게 문의하기 <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }

    var regex = '^/it/authors/overview$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "Interessato a pubblicare su JoVE?",
            description: "<b>Entra in contatto con il nostro team editoriale</b>",
            action: "CONTATTA L'EDITORE <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    var regex = '^/it/authors/publication$';
    if (path.match(regex)) {
        mktbShow({
            newTheme: '1',
            class: "mktb-popup",
            title: "Interessato a pubblicare su JoVE?",
            description: "<b>Entra in contatto con il nostro team editoriale</b>",
            action: "CONTATTA L'EDITORE <span id='show-arrow'><i style='font-weight:100' class='fa fa-arrow-right'></i></span>",
            href: "https://info.jove.com/publication_interest"
        });
    }
    

    
    
    /*
    if user logged in
    */
    /*if($('#user_id').length > 0){
        mktbShow({
            class: "mktb-banner",
            title: "",
            description: "We have recently upgraded our systems, you have been redirected to a read-only version of the site. Depending on your geographic location, it may take 2-24 hours for this to be resolved. Please check back at www.jove.com",
            action: "Visit Us",
            href: "https://www.jove.com"				
        });
    }*/
    /*
   //all user
    mktbShow({
        class: "mktb-banner",
        title: "",
        description: "We are upgrading our systems in the next several hours, if you have more than a momentary disruption, please contact customersuccess@jove.com",
        action: "Contact Us",
        href: "mailto:customersuccess@jove.com"				
    });*/
    /*var regex = '^/((cn|de|es|kr|it|fr)/)?facultyresources';
    if (path.match(regex)) {
    	mktbShow({
    		class: "mktb-banner",
    		title: "",
    		description: "Don't miss the July 18 deadline to apply for the 2022 JoVE Educator Innovation Award.",
    		action: "Apply now",
    		href: "https://info.jove.com/awards/educators"			
    	});
    }
    var regex = '^/((cn|de|es|kr|it|fr)/)?facultyresources/9';
    if (path.match(regex)) {
    	mktbShow({
    		class: "mktb-banner",
    		title: "",
    		description: "We want to recognize your achievements. Enter the 2022 JoVE Educator Innovation Award contest.",
    		action: "Learn more",
    		href: "https://info.jove.com/awards/educators"			
    	});
    }

    var regex = '^/((cn|de|es|kr|it|fr)/)?authors/overview';
    if (path.match(regex)) {
    	mktbShow({
    		class: "mktb-banner",
    		title: "",
    		description: "Don't miss the July 18 deadline to apply for the 2022 JoVE Researcher Innovation Award.",
    		action: "Apply now",
    		href: "https://info.jove.com/awards/researcher"				
    	});
    }

    var regex = '^/((cn|de|es|kr|it|fr)/)?librarians/overview';
    if (path.match(regex)) {
    	mktbShow({
    		class: "mktb-banner",
    		title: "",
    		description: "Don't miss the July 18 deadline to apply for the 2022 JoVE Librarian Innovation Award.",
    		action: "Apply now",
    		href: "https://info.jove.com/awards/librarians"				
    	});
    }

    var regex = '^/((cn|de|es|kr|it|fr)/)?librarians/subscriptions';
    if (path.match(regex)) {
    	mktbShow({
    		class: "mktb-banner",
    		title: "",
    		description: "We want to recognize your achievements. Enter the 2022 JoVE Librarian Innovation Award contest.",
    		action: "Learn more",
    		href: "https://info.jove.com/awards/librarians"				
    	});
    }

    var regex = '^/((cn|de|es|kr|it|fr)/)?librarians/resources';
    if (path.match(regex)) {
    	mktbShow({
    		class: "mktb-banner",
    		title: "",
    		description: "Enter the JoVE Librarian Innovation Award contest for a chance to win professional development funds.",
    		action: "Learn more",
    		href: "https://info.jove.com/awards/librarians"				
    	});
    }*/
}


$(function() {

    // TRIAL BANNERS
    mktbInit();

    // COOKIES BANNER
    if (localStorage.getItem('accept-jove-cookie') != '1') {
        $('#cookie-banner').show();
        $('.jove-footer').addClass('add-banner-bottom');
    }
    $('.accept-cookie, .accept-cookie-close').on('click', function() {
        localStorage.setItem('accept-jove-cookie', '1');
        $('#cookie-banner').hide();
        $('.jove-footer').removeClass('add-banner-bottom');
    });

});