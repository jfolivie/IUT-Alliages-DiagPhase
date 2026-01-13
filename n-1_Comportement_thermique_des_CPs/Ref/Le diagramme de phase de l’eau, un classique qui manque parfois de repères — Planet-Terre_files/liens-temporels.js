var doa_autoplay = "internes"; // Valeurs attendues : "internes", "externes" ou "tous"
var doa_prefix = "doa:";
var doa_fragment = location.hash.substring(1);
document.addEventListener('DOMContentLoaded', function ()
{
    if (! String.prototype.startsWith)
    {
        String.prototype.startsWith = function (searchString, position)
        {
            position = position || 0;
            return this.indexOf(searchString, position) === position;
        };
    }
    /* L'adresse contient une query string "?doa:", il s'agit donc d'un lien externe */
    if (doa_fragment)
    {
        doaPosition(location.search, doa_fragment, doa_autoplay == 'externes' || doa_autoplay == 'tous');
    }
    /* Dans tous les cas */
    links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) { 
        link = links[i]; 
        href = link.attributes.getNamedItem('href').value;
        if (href.startsWith('?' + doa_prefix) ) {
            /* Ce lien est un lien temporel dans le même document */
            link.onclick = function() {
                gotoMedia(this.attributes.getNamedItem('href').value);
                return false;
            }
        }
    
    }
});
function parseQueryString (str)
{
    str = str ? str: location.search;
    var query = str.charAt(0) == '?' ? str.substring(1): str;
    query = query.replace(/\+/g, ' ');
    var args = new Object();
    if (query)
    {
        var fields = query.split('&');
        for (var f = 0; f < fields.length; f++)
        {
            var field = fields[f].split('=');
            var key = unescape(field[0]);
            if (key.startsWith(doa_prefix))
            {
                args[key.substring(doa_prefix.length)] = unescape(field[1]);
            }
        }
    }
    return args;
}
function getTrackStartTime(media, id)
{
    var tracks = media.textTracks;
    for (var i = 0; i < tracks.length; i++)
    {
        var track = tracks[i];
        for (var j = 0; j < track.cues.length;++ j)
        {
            var cue = track.cues[j];
            if (id == cue.id)
            {
                return cue.startTime;
            }
        }
    }
    return 0;
}

/* Positionne un objet media en fonction de la query string*/
function doaPosition(query, doa_fragment, autoplay) {
        var doa_target = document.getElementById(doa_fragment);
        //doa_target.scrollIntoView();
        if (doa_target && (' ' + doa_target.className + ' ').indexOf(' mediaobject ') != -1)
        {
            var doa_parameters = parseQueryString(query);
            if (doa_parameters)
            {
                for (i = 0; i < doa_target.childNodes.length; i++)
                {
                    var media = doa_target.childNodes[i];
                    if (media.nodeName == 'VIDEO' || media.nodeName == 'AUDIO')
                    {
                        media.preload = 'auto';
                        // http://stackoverflow.com/questions/20245164/audio-currenttime-invalidstateerror-ie11-js-html5
                        media.load();
                        media.addEventListener('loadedmetadata', function ()
                        {
                            var media = this;
                            if (doa_parameters[ 't'])
                            {
                                media.currentTime = doa_parameters[ 't'];
                                // lancement automatique de la vidéo
                                if (autoplay) {
                                    media.play();
                                }
                                // plus fiable sur IE que media.autoplay = autoplay;
                            } else if (doa_parameters[ 'id'])
                            {
                                media.currentTime = getTrackStartTime(media, doa_parameters[ 'id']);
                                // lancement automatique de la vidéo
                                if (autoplay) {
                                    media.play();
                                }
                                // plus fiable sur IE que media.autoplay = autoplay;
                            }
                        },
                        false);
                    }
                }
            }
        }

}

/* Se positionne sur un objet média (utilisé uniquement pour les liens internes) */
function gotoMedia(href) {
    var parts = href.split('#');
    var query = parts[0];
    var fragment = parts[1];
    location.hash = '#' + fragment;
    history.pushState && history.pushState(null, '', href);
    doaPosition(query, fragment, doa_autoplay == 'internes' || doa_autoplay == 'tous')
    
}