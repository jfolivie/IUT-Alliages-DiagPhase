"use strict";

var langMgr = {
	fLangs: [
		{
			"urlPattern":"/en/",
			"viewName":"webEn",
			"type":"en",
			"lang":"Anglais"
		},
		{
			"urlPattern":"/es/",
			"viewName":"webEs",
			"type":"es",
			"lang":"Espagnol"
		},
		{
			"urlPattern":"/ar/",
			"viewName":"webAr",
			"type":"ar",
			"lang":"Arabe"
		},
		{
			"urlPattern":"/en/solution/",
			"viewName":"webSolEn",
			"type":"en",
			"lang":"Anglais"
		},
		{
			"urlPattern":"/es/solution/",
			"viewName":"webSolEs",
			"type":"es",
			"lang":"Espagnol"
		},
		{
			"urlPattern":"/ar/solution/",
			"viewName":"webSolAr",
			"type":"ar",
			"lang":"Arabe"
		},
		{
			"urlPattern":"/fr/solution/",
			"viewName":"webSol",
			"type":"fr",
			"lang":"Français"
		},
		{
			"urlPattern":"/fr/",
			"viewName":"web",
			"type":"fr",
			"lang":"Français"
		}
	],
	fCurrentView: "web",
	fCurrentLangs: [],

	onLoad : function() {
		// DEV //
		// var vCurrentUrl = "http://127.0.0.1:8134/OpaleEmac/opaleEMACDEV~_all/scenari/depot/tree/truc/fr/co/nte01_1.html";
		// DEV //
		var vCurrentUrl = window.location.toString();
		// DEV //
		// this.fCurrenPage = vCurrentUrl.substring(vCurrentUrl.lastIndexOf("co/"));
		// DEV //
		this.fCurrenPage = scServices.scLoad.getUrlFromRoot(window.location.href);
		this.fCurrentRootUrl = scServices.scLoad.fRootUrl;
		this.fLangs.forEach(function(pLang) {
			if (vCurrentUrl.includes(pLang.urlPattern)) {
				langMgr.fCurrentView = pLang.viewName;
				langMgr.fCurrentRootUrl = scServices.scLoad.fRootUrl.substring(0, (scServices.scLoad.fRootUrl + "/").indexOf(pLang.urlPattern));
			}
		});
		var vReqInfoView = io.openHttpRequest(this.fCurrentRootUrl + "?listChildren");
		vReqInfoView.onload = function(pEvt) {
			try {
				var vChildren = JSON.parse(pEvt.target.response).ch;
				if (pEvt.target.status === 200 && vChildren) {
					JSON.parse(pEvt.target.response).ch.forEach(function(pChild) {
						langMgr.fCurrentLangs.push(pChild.n);
					});
					langMgr.buildLangsBtn();
				}
			}
			catch(e) {
				console.log("NO INFOVIEW : " + e);
			}
		};
		vReqInfoView.send();
	},

	buildLangsBtn : function() {
		var vHeader = sc$("header");
		var vBd = dom.newBd(vHeader);
		vBd.elt("div", "langs");
		var vIsSolutionView = langMgr.fCurrentView.includes("Sol");
		this.fLangs.forEach(function(pLang) {
			if(langMgr.fCurrentLangs.includes(pLang.type) && (vIsSolutionView && pLang.viewName.includes("Sol") || !vIsSolutionView && !pLang.viewName.includes("Sol"))) {
				var vUrlPage = langMgr.fCurrentRootUrl + pLang.urlPattern + langMgr.fCurrenPage;
				var vReqIsPage = io.openHttpRequest(vUrlPage);
				vReqIsPage.onload = function(pEvt) {
					try {
						if (pEvt.target.status === 200) {
							vBd.elt("div", "lang " + pLang.type);
							if (pLang.viewName !== langMgr.fCurrentView) vBd.elt("a").att("href", vUrlPage).elt("span").text(pLang.lang).up().up();
							else vBd.elt("span").elt("span").text(pLang.lang).up().up();
							vBd.up();
						}
					}
					catch(e) {
						console.log("NO PAGE : " + e);
					}
				};
				vReqIsPage.send();
			}
		});
	}
};

scOnLoads.push(langMgr);