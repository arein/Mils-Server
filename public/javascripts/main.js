(function () {
var windowH = $(window).height();
//console.log(windowH);
	var wrapperH = $('#welcome').height();
	if(windowH > wrapperH && windowH < 1069) {          
		var padding = (windowH - wrapperH)  / 2;
		//console.log($('#welcome .container').css('padding-top'));
		//console.log(padding, (parseFloat($('#welcome .container').css('padding-bottom').replace('px', '')) + padding) + 'px');
	    $('#welcome').css({
    	  'height':($(window).height())+'px'
    	});
	    $('#welcome.container').css({
	        'padding-top': (parseFloat($('#welcome .container').css('padding-top').replace('px', '')) + padding) + 'px',
	    	'padding-bottom': (parseFloat($('#welcome .container').css('padding-bottom').replace('px', '')) + padding) + 'px'
	    });
	}
})(); 

$(document).ready(function() {
	$(".fancybox").fancybox();
	$("#pages").change(pagesChanged);
	$("#countries").change(pagesChanged);
	queryPrice();
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
			$('#costs').text('Ups...and error occurred loading the price.');
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