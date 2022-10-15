var mouseX = null;
var mouseY = null;
    
document.addEventListener('mousemove', onMouseUpdate, false);
document.addEventListener('mouseenter', onMouseUpdate, false);
    
function onMouseUpdate(e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
}

function ScrollZoom(container,max_scale,factor) {
    var target = container.children().first()
    var size = {w:target.width(),h:target.height()}
    var pos = {x:0,y:0}
    var zoom_target = {x:0,y:0}
    var zoom_point = {x:0,y:0}
    var scale = 1
    target.css('transform-origin','0 0')
    target.on("mousewheel DOMMouseScroll",scrolled)

    function scrolled(e) {
        var offset = container.offset()
        zoom_point.x = e.pageX - offset.left
        zoom_point.y = e.pageY - offset.top

        e.preventDefault();
        var delta = e.delta || e.originalEvent.wheelDelta;
        if (delta === undefined) {
          delta = e.originalEvent.detail;
        }
        delta = Math.max(-1,Math.min(1,delta))

        zoom_target.x = (zoom_point.x - pos.x)/scale
        zoom_target.y = (zoom_point.y - pos.y)/scale

        scale += delta*factor * scale
        scale = Math.max(1,Math.min(max_scale,scale))

        pos.x = -zoom_target.x * scale + zoom_point.x
        pos.y = -zoom_target.y * scale + zoom_point.y

        if(pos.x>0)
            pos.x = 0
        if(pos.x+size.w*scale<size.w)
            pos.x = -size.w*(scale-1)
        if(pos.y>0)
            pos.y = 0
         if(pos.y+size.h*scale<size.h)
            pos.y = -size.h*(scale-1)

        update()
    }

    function update(){
        target.css('transform','translate('+(pos.x)+'px,'+(pos.y)+'px) scale('+scale+','+scale+')')
    }
}

function InitMap() {
    var countries = document.querySelectorAll('.world-map__country');
    countries.forEach(country => {
        var id = country.getAttribute("id");
        
        id = id.replace("country-", "");

        country.addEventListener("mouseover", function () {
            if (hoverDisabled) return; 
            $(this).css({
                "fill" :　"#2596be",
                "cursor" : "pointer"
            });
            var url = "Countries/" + id + ".svg";
            //$('.flag').css('background-image', 'url(' + url + ')')
        });
        country.addEventListener("mouseleave", function () {
            if (hoverDisabled) return; 
            $(this).css({
                "fill" :　"#51abcb",
            });
        });

        
    });
    
    setTimeout(() => {
        new ScrollZoom($(".worldmapWrapper"), 4, 0.5)
    }, 0);
}

function Ready() {
    hoverDisabled = false;
    setTimeout(() => {
        $('#gamemode0').css('display', 'flex');
        $('#gamemode1').css('display', 'none');
        $('#gamemode2').css('display', 'none');
        $('#gamemode3').css('display', 'none');
        $('#gamemode4').css('display', 'none');

        var countries = document.querySelectorAll('.world-map__country');

        countries.forEach(country => {
            var id = country.getAttribute("id");
            id = id.replace("country-", "");
            var _country = _countries.FindCountryByAbbr(id);

            switch(_country.continent) {
                case "Asia": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(255, 94, 0)","cursor" : "pointer" }); break;
                case "Europe": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(134, 0, 0)","cursor" : "pointer" }); break;
                case "Africa": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(212, 181, 0)","cursor" : "pointer" }); break;
                case "Americas": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(35, 95, 50)","cursor" : "pointer" }); break;
                case "Oceania": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(95, 35, 90)","cursor" : "pointer" }); break;
            }

            country.addEventListener("mouseover", function () {
                if (hoverDisabled) return; 
                switch(_country.continent) {
                    case "Asia": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(173, 64, 0)","cursor" : "pointer" }); break;
                    case "Europe": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(87, 0, 0)","cursor" : "pointer" }); break;
                    case "Africa": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(146, 124, 0)","cursor" : "pointer" }); break;
                    case "Americas": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(21, 65, 32)","cursor" : "pointer" }); break;
                    case "Oceania": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(66, 24, 63)","cursor" : "pointer" }); break;
                }
                setTimeout(() => {
                    $('.flag').css({
                        'background-image': "url('Countries/" + _country.abbr + ".svg')",
                    });
                    $('#gamemode0 #__Country').html(capitalizeFirstLetter(_country.name));
                    $('#gamemode0 #__Continent').html(_country.continent);
                    $('#gamemode0 #__Region').html(_country.region);
                    $('#gamemode0 #__Capital').html(_country.capital);
                    $('#gamemode0 .infobox').css({
                        'display': 'flex',
                        'top': mouseY + 'px',
                        'left': mouseX + 'px'
                    });
                }, 1); 
                
            });
            country.addEventListener("mouseleave", function () {
                if (hoverDisabled) return; 
                switch(_country.continent) {
                    case "Asia": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(255, 94, 0)","cursor" : "pointer" }); break;
                    case "Europe": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(134, 0, 0)","cursor" : "pointer" }); break;
                    case "Africa": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(212, 181, 0)","cursor" : "pointer" }); break;
                    case "Americas": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(35, 95, 50)","cursor" : "pointer" }); break;
                    case "Oceania": $('#gamemode0 #country-' + _country.abbr).css({"fill" :　"rgb(95, 35, 90)","cursor" : "pointer" }); break;
                }
                $('#gamemode0 .infobox').css('display', 'none');
                
            });


        });
    }, 100);     
}