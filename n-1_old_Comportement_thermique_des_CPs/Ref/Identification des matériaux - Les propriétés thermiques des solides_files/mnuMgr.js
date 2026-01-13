/* === Opale menu manager =============================================== */
var mnuMgr = {
	fMainPath : "ide:tplMain",
	fMnuPath : "ide:tplMnu",
	fOutPath : "ide:tplMnu/des:ul.mnu",
	fClsOut : "tplOut",
	
	fOut : null,
	fTglBtn : null,
	fUrlOutline : null,

	fCls : "mnu",
	fClsTgl : "btnOutTgl",
	fResPrefix : "/skin/img/mnu",
	fOverflowMethod : "hidden",
	
	fStrings : ["défilement haut","Faire défiler le menu vers le haut",
	            "défilement bas","Faire défiler le menu vers le bas",
	            "Masquer le plan","Afficher le plan",
	            "Masquer / afficher le plan",""],


	/* === Public ============================================================= */
	init : function() {
		scCoLib.util.log("mnuMgr.init");
		this.fIsLocal = window.location.protocol == "file:";
		var vMnu = scPaLib.findNode(this.fMnuPath);
		this.fOut = scPaLib.findNode(this.fOutPath);
		this.fMain = scPaLib.findNode(this.fMainPath);
		if (!this.fOut || !vMnu || !this.fMain) return;
		this.fMnuFra = this.fOut.parentNode;
		this.fFilterIsClosed = scPaLib.compileFilter("ul.mnu_sub_c");
		this.fSelMnuItem = scPaLib.findNode("des:div.mnu_sel_yes",this.fOut);
		this.fPortrait = window.innerHeight > window.innerWidth;
		if(tplMgr.fScreenTouch || tplMgr.fScreenSmall) window.addEventListener('resize',this.sResize,false);

		// Init
		this.fCurrItem = scPaLib.findNode("des:li.mnu_sel_yes",this.fOut);
		this.fSubLbls = scPaLib.findNodes("des:div.mnu_b",this.fOut);
		for (var i=0; i < this.fSubLbls.length; i++) {
			var vLbl = this.fSubLbls[i];
			var vSub = scPaLib.findNode("nsi:ul",vLbl);
			vLbl.fTglBtn = this.xAddBtn(vLbl,"mnu_tgle_"+(vSub?"o":"c"),(vSub?"v":">"));
			vLbl.fTglBtn.onclick = this.sToggleItem;
			vLbl.fTglBtn.fLbl = vLbl;
			vLbl.fTglBtn.fUl = vSub;
		}
		
		// Init Scroll
		var vVisRule = null;
		if (ScSiRuleEnsureVisible) vVisRule = new ScSiRuleEnsureVisible("ide:tplMnu/des:div.mnu_sel_yes", "anc:ul.mnu");
		this.fOut.className = this.fOut.className.replace("mnu_static", "");
		if (tplMgr.fScreenTouch){
			vVisRule.xEnsureVis = function(){
				try{
					mnuMgr.fMnuFra.fScroller.refresh();
					if (scSiLib.getContentHeight(vMnu)< scSiLib.getOffsetTop(this.fNode,vMnu)+this.fNode.offsetHeight) mnuMgr.fMnuFra.fScroller.scrollToElement(this.fNode,0);
				}catch(e){alert(e);}
			}
		} else {
			this.fOut.style.overflow=this.fOverflowMethod;
			this.fSrlUp = this.xAddElt("div", this.fMnuFra, this.fCls+"SrlUpFra", null, null, this.fOut);
			this.fSrlUpBtn = this.xAddBtn(this.fSrlUp, this.fCls+"SrlUpBtn", this.xGetStr(0), this.xGetStr(1));
			this.fSrlDwn = this.xAddElt("div", this.fMnuFra, this.fCls+"SrlDwnFra");
			this.fSrlDwnBtn = this.xAddBtn(this.fSrlDwn, this.fCls+"SrlDwnBtn", this.xGetStr(2), this.xGetStr(3));
		}
		
		// Init Menu Collapser
		var vMnuOpn = this.xAddElt("div", vMnu, this.fCls+"Opn", null, null, scPaLib.findNode("nsi:",this.fMnuFra));
		var vMnuOpnBtn = this.xAddBtn(vMnuOpn, this.fCls+"OpnBtn", null, this.xGetStr(4));
		vMnuOpnBtn.onclick = function(){return mnuMgr.xCloseMnu()};
		var vMnuOpnImg = this.xAddElt("img", vMnuOpnBtn, "btnImg");
		vMnuOpnImg.setAttribute("alt", this.xGetStr(4));
		vMnuOpnImg.src = scServices.scLoad.getRootUrl()+mnuMgr.fResPrefix+"/collapse.png";
		vMnuOpnImg.onmouseover = function(){this.src=scServices.scLoad.getRootUrl()+mnuMgr.fResPrefix+"/collapseOver.png";}
		vMnuOpnImg.onmouseout = function(){this.src=scServices.scLoad.getRootUrl()+mnuMgr.fResPrefix+"/collapse.png";}
		var vMnuOpnLbl = this.xAddElt("span", vMnuOpnBtn, "btnLbl");
		vMnuOpnLbl.innerHTML = this.xGetStr(4);
		
		var vMnuCls = this.xAddElt("div", this.fMain, this.fCls+"Cls", null, null, scPaLib.findNode("nsi:",vMnu));
		var vMnuClsBtn = this.xAddBtn(vMnuCls, this.fCls+"ClsBtn", null, this.xGetStr(5));
		vMnuClsBtn.onclick = function(){return mnuMgr.xOpenMnu();};
		var vMnuClsImg = this.xAddElt("img", vMnuClsBtn, "btnImg");
		vMnuClsImg.setAttribute("alt", this.xGetStr(5));
		vMnuClsImg.src = scServices.scLoad.getRootUrl()+mnuMgr.fResPrefix+"/open.png";
		vMnuClsImg.onmouseover = function(){this.src=scServices.scLoad.getRootUrl()+mnuMgr.fResPrefix+"/openOver.png";}
		vMnuClsImg.onmouseout = function(){this.src=scServices.scLoad.getRootUrl()+mnuMgr.fResPrefix+"/open.png";}
		var vMnuClsLbl = this.xAddElt("span", vMnuClsBtn, "btnLbl");
		vMnuClsLbl.innerHTML = this.xGetStr(5);
		var vPlayBtn = scPaLib.findNode("ide:tplLft/des:span.playBtnSel");
		if (vPlayBtn) {
			vPlayBtn.onclick = function(){return mnuMgr.xToggleMnu();};
			vPlayBtn.title = this.xGetStr(6);
		}
		
		this.fMnuCollapse = false;
		if(tplMgr.fStore.get("mnuCollapse") == "true" || this.fPortrait && tplMgr.fScreenSmall) this.xCloseMnu(true,true);

		scOnLoads[scOnLoads.length] = this;
	},

	declareOutline : function(pUrl){
		scCoLib.util.log("mnuMgr.declareOutline: "+pUrl);
		this.fUrlOutline = pUrl;
	},

	onLoad : function() {
		scCoLib.util.log("mnuMgr.onLoad");
		try{
		if (tplMgr.fScreenTouch && "iScroll" in window){
			this.fMnuFra.fScroller = new iScroll(this.fMnuFra,{fixedScrollbar:true,bounce:false});
		} else {
			// Init Scroll up button
			this.fSrlUp.onclick = function(){
				mnuMgr.scrollTask.fSpeed -= 2;
			}
			this.fSrlUp.onmouseover = function(){
				if(mnuMgr.scrollTask.fSpeed >= 0) {
					mnuMgr.scrollTask.fSpeed = -2; 
					scTiLib.addTaskNow(mnuMgr.scrollTask);
				}
			}
			this.fSrlUp.onmouseout = function(){
				mnuMgr.scrollTask.fSpeed = 0;
			}
			this.fSrlUpBtn.onclick = function(){
				mnuMgr.scrollTask.step(-20); 
				return false;
			}
			// Init Scroll down button
			this.fSrlDwn.onclick = function(){
				mnuMgr.scrollTask.fSpeed += 2;
			}
			this.fSrlDwn.onmouseover = function(){
				if(mnuMgr.scrollTask.fSpeed <= 0) {
					mnuMgr.scrollTask.fSpeed = 2; 
					scTiLib.addTaskNow(mnuMgr.scrollTask);
				}
			}
			this.fSrlDwn.onmouseout = function(){
				mnuMgr.scrollTask.fSpeed = 0;
			}
			this.fSrlDwnBtn.onclick = function(){
				mnuMgr.scrollTask.step(20);
				return false;
			}
			// Init scroll manager
			this.scrollTask.checkBtn();
			scSiLib.addRule(this.fOut, this.scrollTask);
			this.fOut.onscroll = function(){mnuMgr.scrollTask.checkBtn()};
			this.fOut.onmousewheel = function(){mnuMgr.scrollTask.step(Math.round(-event.wheelDelta/(scCoLib.isIE ? 60 : 40)))}; //IE, Safari, Chrome, Opera.
			if(this.fOut.addEventListener) this.fOut.addEventListener('DOMMouseScroll', function(pEvent){mnuMgr.scrollTask.step(pEvent.detail)}, false);
		}
		}catch(e){alert(e);}
	},
	openAll : function() {
		for (var i=0; i < this.fSubs.length; i++) {
			var vSub = this.fSubs[i];
			if (scPaLib.checkNode(this.fFilterIsClosed,vSub)) this.xAutoToggleItem(vSub.fTglBtn);
		}
	},
	loadSortKey : "AZ",

	sResize : function() {
		mnuMgr.fPortrait = window.innerHeight > window.innerWidth;
		if (mnuMgr.fPortrait) mnuMgr.xCloseMnu(null,true);
		else if(tplMgr.fStore.get("mnuCollapse") != "true") mnuMgr.xOpenMnu(null,true);
	},

	sToggleItem : function() {
		try{
			mnuMgr.xToggleItem(this,false);
			if (tplMgr.fScreenTouch && mnuMgr.fMnuFra.fScroller) mnuMgr.fMnuFra.fScroller.refresh();
			else mnuMgr.scrollTask.checkBtn();
		} catch(e){}
		return false;
	},

	xContainedInSub : function(pSub,pNode) {
		var vAncSubs = scPaLib.findNodes("anc:ul.mnu_sub",pNode);
		for (var i=0; i < vAncSubs.length; i++) if (vAncSubs[i] == pSub) return true;
		return false;
	},

	xAutoToggleItem : function(pBtn) {
		this.xToggleItem(pBtn,true);
	},

	xBuildSub : function(pBtn) {
		if (!this.fBranches) {// Load outline.xml if needed
			var vAjax = this.xGetHttpRequest();
			var vXml;
			vAjax.open('GET', this.fUrlOutline, false);
			vAjax.send();
			if (scCoLib.isIE && this.fIsLocal) {
				vXml = new ActiveXObject("Microsoft.XMLDOM");
				vXml.async = false;
				vXml.loadXML(vAjax.responseText);
			} else vXml = vAjax.responseXML;
			this.fXmlMnu = vXml;
			if (!this.fXmlMnu) return false;
			this.fBranches = vXml.getElementsByTagName("b");
		}
		var vBranch;
		var vLbl = pBtn.fLbl;
		for (var i=0; i < this.fBranches.length; i++){
			vBranch = this.fBranches[i];
			if (vBranch.getAttribute("u") == vLbl.id){
				pBtn.fUl = this.xAddElt("ul",vLbl.parentNode,"mnu_sub mnu_sub_o");
				pBtn.fUl.fTglBtn = pBtn;
				var vChi = vBranch.firstChild;
				var vLi,vDiv,vLnk, vDpth, vTyp, vCls, vUrl, vTi;
				while (vChi){
					while (vChi && vChi.nodeType != 1) vChi = vChi.nextSibling;
					if (vChi){
						vDpth = scPaLib.findNodes("anc:ul.mnu_sub", pBtn).length + 1;
						vTyp = vChi.localName || vChi.baseName;
						vCls = vChi.getAttribute("c");
						vUrl = vChi.getAttribute("u");
						vTi = vChi.getAttribute("t");
						vLi = this.xAddElt("li",pBtn.fUl,"mnu_sel_no mnu_"+vTyp+" mnu_dpt_"+vDpth+" "+vCls);
						vDiv = this.xAddElt("div",vLi,"mnuLbl mnu_sel_no mnu_"+vTyp+" mnu_dpt_"+vDpth+" "+vCls+" mnu_sch_no");
						vDiv.id = vUrl;
						vLnk = this.xAddElt("a",vDiv,"mnu_i mnu_lnk");
						vLnk.href = vUrl;
						vLnk.target = "_self";
						vLnk.innerHTML = "<span class='mnu_sch'><span><span class='mnu_cursor'></span>"+vTi+"</span></span>";
						if (vTyp == "b"){
							vDiv.fTglBtn = this.xAddBtn(vDiv,"mnu_tgle_c",">");
							vDiv.fTglBtn.onclick = this.sToggleItem;
							vDiv.fTglBtn.fLbl = vDiv;
						}
						vChi = vChi.nextSibling;
					}
				}
				break;
			}
		}
	},

	xToggleItem : function(pBtn) {
		if (!pBtn) return;
		var vStatus = pBtn.className;
		if (!pBtn.fUl) this.xBuildSub(pBtn);
		var vUl = pBtn.fUl;
		if (!vUl) return;
		if(vStatus == "mnu_tgle_c") {
			pBtn.className = "mnu_tgle_o";
			pBtn.innerHTML = "<span>v</span>"
			vUl.className = vUl.className.replace("mnu_sub_c", "mnu_sub_o");
			vUl.style.display = "";
			vUl.fClosed = false;
		} else {
			pBtn.className = "mnu_tgle_c";
			pBtn.innerHTML = "<span>></span>"
			vUl.className = vUl.className.replace("mnu_sub_o", "mnu_sub_c");
			vUl.style.display = "none";
			vUl.fClosed = true;
			var vOpendSubMnus = scPaLib.findNodes("des:ul.mnu_sub_o",vUl);
			for (var j=0; j < vOpendSubMnus.length; j++) this.xAutoToggleItem(vOpendSubMnus[j].fTglBtn);
		}
	},

	xToggleMnu : function(pDontResize,pDontMemorize) {
		if (this.fMnuCollapse) return this.xOpenMnu(pDontResize,pDontMemorize);
		else return this.xCloseMnu(pDontResize,pDontMemorize);
	},

	xCloseMnu : function(pDontResize,pDontMemorize) {
		if(!pDontMemorize) tplMgr.fStore.set("mnuCollapse", "true");
		this.fMnuCollapse = true;
		this.fMain.className = this.fMain.className.replace(/tplMainMnu_[a-zA-Z]*/gi,"tplMainMnu_closed");
		if(!pDontResize) scSiLib.fireResizedNode(document.body);
		return false;
	},

	xOpenMnu : function(pDontResize,pDontMemorize) {
		if(!pDontMemorize) tplMgr.fStore.set("mnuCollapse", "false");
		this.fMnuCollapse = false;
		this.fMain.className = this.fMain.className.replace(/tplMainMnu_[a-zA-Z]*/gi,"tplMainMnu_open");
		if(!pDontResize) scSiLib.fireResizedNode(document.body);
		return false;
	},

	/* === Utilities ========================================================== */
	/** mnuMgr.xAddElt : Add an HTML element to a parent node. */
	xAddElt : function(pName, pParent, pClassName, pNoDisplay, pHidden, pNxtSib){
		var vElt;
		if(scCoLib.isIE && pName.toLowerCase() == "iframe") {
			//BUG IE : impossible de masquer les bordures si on ajoute l'iframe via l'API DOM.
			var vFrmHolder = pParent.ownerDocument.createElement("div");
			if (pNxtSib) pParent.insertBefore(vFrmHolder,pNxtSib)
			else pParent.appendChild(vFrmHolder);
			vFrmHolder.innerHTML = "<iframe scrolling='no' frameborder='0'></iframe>";
			vElt = vFrmHolder.firstChild;
		} else {
			vElt = pParent.ownerDocument.createElement(pName);
			if (pNxtSib) pParent.insertBefore(vElt,pNxtSib)
			else pParent.appendChild(vElt);
		}
		if (pClassName) vElt.className = pClassName;
		if (pNoDisplay) vElt.style.display = "none";
		if (pHidden) vElt.style.visibility = "hidden";
		return vElt;
	},
	/** mnuMgr.xAddBtn : Add a HTML button to a parent node. */
	xAddBtn : function(pParent, pClassName, pCapt, pTitle, pNxtSib) {
		var vBtn = pParent.ownerDocument.createElement("a");
		vBtn.className = pClassName;
		vBtn.fName = pClassName;
		vBtn.href = "#";
		vBtn.target = "_self";
		if (pTitle) vBtn.setAttribute("title", pTitle);
		if (pCapt) vBtn.innerHTML = "<span>" + pCapt + "</span>"
		if (pNxtSib) pParent.insertBefore(vBtn,pNxtSib)
		else pParent.appendChild(vBtn);
		return vBtn;
	},
	xGetHttpRequest: function(){
		if (window.XMLHttpRequest && (!this.fIsLocal || !window.ActiveXObject)) return new XMLHttpRequest();
		else if (window.ActiveXObject) return new ActiveXObject("Microsoft.XMLHTTP");
	},
	/** Reteive a string. */
	xGetStr: function(pStrId) {
		return this.fStrings[pStrId];
	},
	
	/* === Tasks ============================================================== */
	/** mnuMgr.scrollTask : menu scroll timer & size task */
	scrollTask : {
		fClassOffUp : "btnOff",
		fClassOffDown : "btnOff",
		fSpeed : 0,
		execTask : function(){
			try {
				if(this.fSpeed == 0) return false;
				mnuMgr.fOut.scrollTop += this.fSpeed;
				return true;
			}catch(e){
				this.fSpeed = 0;
				return false;
			}
		},
		step: function(pPx) {
			try { mnuMgr.fOut.scrollTop += pPx; }catch(e){}
		},
		checkBtn: function(){
			var vScrollTop = mnuMgr.fOut.scrollTop;
			var vBtnUpOff = mnuMgr.fSrlUp.className.indexOf(this.fClassOffUp);
			if(vScrollTop <= 0) {
				if(vBtnUpOff < 0) mnuMgr.fSrlUp.className+= " "+this.fClassOffUp;
			} else {
				if(vBtnUpOff >= 0) mnuMgr.fSrlUp.className = mnuMgr.fSrlUp.className.substring(0, vBtnUpOff);
			}
		
			var vContentH = scSiLib.getContentHeight(mnuMgr.fOut);
			var vBtnDownOff = mnuMgr.fSrlDwn.className.indexOf(this.fClassOffDown);
			if( vContentH - vScrollTop <= mnuMgr.fOut.offsetHeight){
				if(vBtnDownOff < 0) mnuMgr.fSrlDwn.className+= " "+this.fClassOffDown;
			} else {
				if(vBtnDownOff >=0) mnuMgr.fSrlDwn.className = mnuMgr.fSrlDwn.className.substring(0, vBtnDownOff);
			}
		},
		onResizedAnc:function(pOwnerNode, pEvent){
			if(pEvent.phase==2) this.checkBtn();
		},
		ruleSortKey : "checkBtn"
	}
}


