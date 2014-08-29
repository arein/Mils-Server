(function () {
var windowH = $(window).height();
//console.log(windowH);
	var wrapperH = $('#welcome').height();
	if(windowH > wrapperH && windowH < 1169) {
		var padding = (windowH - wrapperH)  / 2;
		//console.log($('#welcome .container').css('padding-top'));
		//console.log(padding, (parseFloat($('#welcome .container').css('padding-bottom').replace('px', '')) + padding) + 'px');
	    $('#welcome').css({
    	  'height':(($(window).height()) - 30) +'px'
    	});
	    $('#welcome.container').css({
	        'padding-top': (parseFloat($('#welcome .container').css('padding-top').replace('px', '')) + padding) + 'px',
	    	'padding-bottom': (parseFloat($('#welcome .container').css('padding-bottom').replace('px', '')) + padding) + 'px'
	    });
	}
})(); 

$(document).ready(function() {
	$(".fancybox").fancybox();
    $('.fancybox-media').fancybox({
        openEffect  : 'none',
        closeEffect : 'none',
        width: '450',
        height: '253',
        helpers : {
            media : {}
        }
    });
	$("#pages").change(pagesChanged);
	$("#countries").change(pagesChanged);
	queryPrice();
    loadGif();
});

function pagesChanged() {
	var intRegex = /^\d+$/;
	if(intRegex.test($("#pages").val())) {
		queryPrice();
	}
}

function countryChanged() {
	queryPrice();
}

function queryPrice() {
	var pages = $("#pages").val();
	if (pages == 1) {
		$("#pagestext").text(" page to");
	} else {
		$("#pagestext").text(" pages to");
	}
	
	var country = $("#countries").val();
	var intRegex = /^\d+$/;
	if(intRegex.test(pages)) {
		showLoading();
		$.get( "/letters/calculate-price?pages=" + pages + "&destination=" + country + "&preferred_currency=EUR", function(data) {
		  $('#costs').text('EUR ' + parseFloat(data.priceInEur).toFixed(2));
		  hideLoading();
		})
		.fail(function() {
			$('#costs').text('Ups...and error occurred loading the priceInAud.');
			hideLoading();
		});
	}
}

var spritespinner = undefined;
function showLoading() {
	// UI
	if (spritespinner == undefined) { 
		$(".sprite-spinner").each(function(i){
	      spritespinner = new SpriteSpinner(this, {
	         interval:50
	      });
	      spritespinner.start();
	    });
    } else {
	   $('.sprite-spinner').show();
	}
    $('#pricebox').hide();
}

function hideLoading() {
	// UI
	$('.sprite-spinner').hide();
    $('#pricebox').show();
}

(function() {
    SpriteSpinner = function(el, options){
        var self = this,
            img = el.children[0];
        this.interval = options.interval || 10;
        this.diameter = options.diameter || img.width;
        this.count = 0;
        this.el = el;
        img.setAttribute("style", "position:absolute");
        el.style.width = this.diameter+"px";
        el.style.height = this.diameter+"px";
        return this;
    };
    SpriteSpinner.prototype.start = function(){
        var self = this,
            count = 0,
            img = this.el.children[0];
        this.el.display = "block";
        self.loop = setInterval(function(){
            if(count == 19){
                count = 0;
            }
            img.style.top = (-self.diameter*count)+"px";
            count++;
        }, this.interval);
    };
    SpriteSpinner.prototype.stop = function(){
        clearInterval(this.loop);
        this.el.style.display = "none";
    };
    document.SpriteSpinner = SpriteSpinner;
})();

function loadGif() {
    /*
    var counter = 0;
    var loaded = function () {
        counter++;
        if (counter == 4) {
            var osxframe = (isRetina()) ? "/images/mac-frame-2x.png" : "/images/mac-frame.png";
            var osx = (isRetina()) ? "/images/Mac-2x.mp4" : "/images/Mac.mp4";
            $('#osxframe').after('<img src="' + osxframe + '" width="348" style="margin-bottom: -117px" /><video width="320" height="200" controls="controls" autoplay="autoplay" style="position: relative;margin-top: -185px;margin-left: 2px;"><source src="' + osx +'" type="video/mp4"></video>');
            $('#osxframe').hide();


            var win8frame = (isRetina()) ? "/images/win-frame-2x.png" : "/images/win-frame.png";
            var win8 = (isRetina()) ? "/images/Win8-2x.mp4" : "/images/Win8.mp4";
            $('#winframe').after('<img src="' + win8frame + '" width="348" style="margin-bottom: -87px" /><video width="320" height="200" controls="controls" autoplay="autoplay" style="position: relative;margin-top: -185px;margin-left: 2px;"><source src="' + win8 +'" type="video/mp4"></video>');
            $('#winframe').hide();

            $('#macbutton').css('margin-top', '-5px');
            $('#winbutton').css('margin-top', '-3px');
        }
    };

    var mac = new Image();
    mac.onload = loaded;
    mac.src = (isRetina()) ? "/images/Mac-2x.gif" : "/images/Mac.gif";
    var macFrame = new Image();
    macFrame.onload = loaded;
    macFrame.src = (isRetina()) ? "/images/mac-frame-2x.png" : "/images/mac-frame.png";;

    var win = new Image();
    win.onload = loaded;
    win.src = (isRetina()) ? "/images/Win8-2x.gif" : "/images/Win8.gif";
    var winFrame = new Image();
    winFrame.onload = loaded;
    winFrame.src = (isRetina()) ? "/images/win-frame-2x.png" : "/images/win-frame.png";
    */
}

function isRetina() {
    if (window.matchMedia) {
        var mq = window.matchMedia("only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)");
        if (mq && mq.matches || (window.devicePixelRatio > 1)) {
            return true;
        } else {
            return false;
        }
    }
}