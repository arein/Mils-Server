(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-48761343-1', 'milsapp.com');
ga('send', 'pageview');

var _tsq = _tsq || [];
_tsq.push(["setAccountName", "milsapp"]);
_tsq.push(["fireHit", "javascript_tracker", []]);

(function() {
    function z(){
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = "async";
        s.src = window.location.protocol + "//cdn.tapstream.com/static/js/tapstream.js";
        var x = document.getElementsByTagName("script")[0];
        x.parentNode.insertBefore(s, x);
    }
    if (window.attachEvent)
        window.attachEvent("onload", z);
    else
        window.addEventListener("load", z, false);
})();