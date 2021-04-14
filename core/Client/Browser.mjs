let versionSearchString;

const BROWSER_TYPES = [
    { string: navigator.userAgent, subString: "chrome", identity: "Chrome" },
    { string: navigator.userAgent, subString: "omniweb", versionSearch: "OmniWeb/", 
    identity: "OmniWeb" },
    { string: navigator.vendor, subString: "apple", identity: "Safari", versionSearch: "Version" },
    { prop: window.opera, identity: "opera", versionSearch: "Version" },
    { string: navigator.vendor, subString: "icab", identity: "iCab" },
    { string: navigator.vendor, subString: "kde", identity: "Konqueror" },
    { string: navigator.userAgent, subString: "firefox", identity: "Firefox" },
    { string: navigator.vendor, subString: "camino", identity: "Camino" },
    { string: navigator.userAgent, subString: "netscape", identity: "Netscape" },
    { string: navigator.userAgent, subString: "msie", identity: "Explorer", versionSearch: "MSIE" },
    { string: navigator.userAgent, subString: "gecko", identity: "Mozilla", versionSearch: "rv" },
    // for older Netscapes (4-)
    { string: navigator.userAgent, subString: "mozilla", identity: "Netscape", 
    versionSearch: "Mozilla" }
];

var platforms = {
    mac: { str: navigator.platform.toLowerCase(), terms: ['mac'] },
    win: { str: navigator.platform.toLowerCase(), terms: ['win'] },
    ios: { str: navigator.platform.toLowerCase(), terms: ['ipad','iphone','ipod'] },
    andriod: { str: navigator.userAgent.toLowerCase(), terms: ['android'] },
    iemoble: { str: navigator.userAgent.toLowerCase(), terms: ['iemobile'] }
};
    
    
var vendors = 'Webkit Moz O ms Khtml'.split(' ');	
const prefix = { js: null, css: null };


(function( pre ){
    var prop = 'BorderRadius';
    var tmp = document.createElement('div'),
    len = vendors.length;
    while(len--){
        if( vendors[len] + prop in tmp.style ){
            pre.js = vendors[len];
            pre.css = '-'+vendors[len].toLowerCase()+'-';
            document.body.classList.add( pre.css );
            break;
        }
    }
})( prefix );


function searchVersion(dataString){
    var index = dataString.indexOf(versionSearchString);
    if (index == -1) return;
    return parseFloat(dataString.substring(index+versionSearchString.length+1));
};

function testData(data){
    for (var i=0;i<data.length;i++)	{
        var testType = null;
        var tester = ( typeof data[i].string != 'undefined' ? 
            data[i].string.toLowerCase() : ( typeof data[i].prop != 'undefined' ? data[i].prop  : null ) );			
        if(tester){
            versionSearchString = data[i].versionSearch || data[i].identity;
            if(typeof tester == 'string'){
                if (tester.indexOf(data[i].subString) != -1) return data[i].identity;
            }else if (typeof tester == 'object' && tester){
                return data[i].identity;
            }
        }
    }
};


class ClientBrowser {
    static get name(){ return testData( BROWSER_TYPES ) || "unknown" }
    static get version(){ 
        return searchVersion(navigator.userAgent) || searchVersion(navigator.appVersion) || "unknown"
    }
    static get prefix(){
        return prefix;
    }
}

export default ClientBrowser;