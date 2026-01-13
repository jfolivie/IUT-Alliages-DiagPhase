/**
 * File navigation.js.
 *
 * Handles toggling the navigation menu for small screens and enables TAB key
 * navigation support for dropdown menus.
 */
( function() {
	var container, button, menu, links, i, len, subcontainer;

	container = document.getElementById( 'masthead' );
	if ( ! container ) {
		return;
	}

	subcontainer = document.getElementsByClassName( 'menu-wordpress-navigation-areas-container' )[0];

	if (subcontainer != undefined) {
		var button2 = subcontainer.getElementsByTagName('button')[0],
			header = document.getElementsByClassName('entry-header')[0],
			hY = header != undefined ? header.offsetHeight : 0,
			subH = subcontainer.getElementsByTagName('li')[0].offsetHeight,
			resizetimeout,
			subcontmen = subcontainer.getElementsByClassName('menu')[0],
			wScroll = window.scrollY,
			pCont = document.getElementById('content'),
			pTop = getStyle(pCont, "padding-top"),
			pTop = pTop.replace("px", "");
			if (subcontmen != "undefined") {
				var aLink = subcontmen.getElementsByClassName('current-menu-item'),
				aX = aLink.length > 0 ? aLink[0].getBoundingClientRect().left : 0,
				wWidth = window.innerWidth;

				subcontmen.scrollLeft = aLink.length > 0 ? aX - (wWidth/2) + (aLink[0].clientWidth/2) : 0;
			}

			if (button2) {
				button2.onclick = function() {
					if ( -1 !== subcontainer.className.indexOf( 'toggled' ) ) {
						subcontainer.className = subcontainer.className.replace( ' toggled', '' );
						button2.setAttribute( 'aria-expanded', 'false' );
					} else {
						subcontainer.className += ' toggled';
						button2.setAttribute( 'aria-expanded', 'true' );
					}
				}
			}

			window.addEventListener("scroll", function(){
				if (resizetimeout) {
    				clearTimeout(resizetimeout);
  				}
  				resizetimeout = setTimeout(function() {
 					wScroll = window.scrollY;
					if(header !== undefined && header.hasOwnProperty('offsetHeight')){
 						hY = header.offsetHeight;
					} else {
						hY = 0;
					}

	 				if (wScroll > hY) {
	 					if ( -1 === subcontainer.className.indexOf( 'fixed' ) ) {
	 						subcontainer.className += ' fixed';
	 						pCont.style.paddingTop = (parseInt(pTop) + subH) + "px";
							//move nav based on trial banner
							if(window.innerWidth > 741){
								if($('#trial-banner').is(':visible')){
									$('.menu-wordpress-navigation-areas-container.fixed').css('top','161px');
								} else {
									$('.menu-wordpress-navigation-areas-container.fixed').css('top','112px');
								}
							} else {
								if($('#trial-banner').is(':visible')){
									$('.menu-wordpress-navigation-areas-container.fixed').css('top','108px');
								} else {
									$('.menu-wordpress-navigation-areas-container.fixed').css('top','60px');
								}
							} 
							
						}
	 				} else if (wScroll <= hY) {
	 						subcontainer.className = subcontainer.className.replace( ' fixed', '' );
	 						pCont.style.paddingTop = parseInt(pTop) + "px";
							
	 				}
	  			}, 15);
  			});
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	subbutton = container.getElementsByClassName('expand');

	menu = container.getElementsByTagName( 'ul' )[0];

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
		menu.className += ' nav-menu';
	}

	button.onclick = function() {
		if ( -1 !== container.className.indexOf( 'toggled' ) ) {
			container.className = container.className.replace( ' toggled', '' );
			button.setAttribute( 'aria-expanded', 'false' );
			menu.setAttribute( 'aria-expanded', 'false' );
		} else {
			container.className += ' toggled';
			button.setAttribute( 'aria-expanded', 'true' );
			menu.setAttribute( 'aria-expanded', 'true' );
		}
	};


	for (z = 0, len = subbutton.length; z < len; z++) {
		subbutton[z].onclick = function(){
			var par = this.parentElement;
			if (-1 !== par.className.indexOf('toggled')) {
				par.className = par.className.replace(' toggled', '');
			} else {
				par.className += ' toggled';
			}
		}
	}

	// Get all the link elements within the menu.
	links    = menu.getElementsByTagName( 'a' );

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}

	function getStyle(oElm, strCssRule){
    	var strValue = "";
    	if(document.defaultView && document.defaultView.getComputedStyle){
    	    strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
    	}
    	else if(oElm.currentStyle){
    	    strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
    	        return p1.toUpperCase();
    	    });
    	    strValue = oElm.currentStyle[strCssRule];
    	}
    	return strValue;
	}

	/**
	 * Toggles `focus` class to allow submenu access on tablets.
	 */
	( function( container ) {
		var touchStartFn, i,
			parentLink = container.querySelectorAll( '.menu-item-has-children > a, .page_item_has_children > a' );

		if ( 'ontouchstart' in window ) {
			touchStartFn = function( e ) {
				var menuItem = this.parentNode, i;

				if ( ! menuItem.classList.contains( 'focus' ) ) {
					e.preventDefault();
					for ( i = 0; i < menuItem.parentNode.children.length; ++i ) {
						if ( menuItem === menuItem.parentNode.children[i] ) {
							continue;
						}
						menuItem.parentNode.children[i].classList.remove( 'focus' );
					}
					menuItem.classList.add( 'focus' );
				} else {
					menuItem.classList.remove( 'focus' );
				}
			};

			for ( i = 0; i < parentLink.length; ++i ) {
				parentLink[i].addEventListener( 'touchstart', touchStartFn, false );
			}
		}
	}( container ) );
} )();
