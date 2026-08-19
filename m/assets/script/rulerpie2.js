var markwidth;
var leftedge;
var leftmark;
var shaded =1;
var rulerright;
function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  if (numerator === 0){
	return 0;
  }else if (numerator === 16){
    return "One Whole" ;
  }
  gcd = gcd(numerator,denominator);
  return [numerator/gcd +"/" + denominator/gcd];
}
function moveHighlight(){
  var ratio = $("#ruler").width() / 400;
  $('#fitin h1').css('font-size', '3em');
  while( $('#fitin h1').height() > $('#fitin').height() ) {
      $('#fitin h1').css('font-size', (parseInt($('#fitin h1').css('font-size')) - 1) + "px" );
  }
  
  rulerright = $("#ruler").width()*.92;
  markwidth = rulerright / 16;
  leftmark = 12 * ratio;
	leftedge = $("#ruler").offset().left + leftmark;
	$("#highlight").css("left", leftedge + markwidth * shaded).css("width", 10*ratio).css("height", 75*ratio);
}
$(function () {
   
	$(window).resize(function(){
		moveHighlight()
	});

	var options = {
      animationEnabled: true,
      data: [
      {
         type: "pie",
        startAngle:"-90",
       dataPoints: [
       {  y: 15, indexLabel: null, toolTipContent: null, color: "rgba(150,12,32,.2)"},
       {  y: 1, indexLabel: "1/16 Shaded", toolTipContent:"1/16 Shaded" }
       ]
     }
     ]
   };
   
    var ww = ( $(window).width() < window.screen.width ) ? $(window).width() : window.screen.width; //get proper width
    var mw = 420; // min width of site
    var ratio =  ww / mw; //calculate ratio
    if( ww < 600){ //small screen - no animation on load.
      options.animationEnabled = false;
    }
    $('#Viewport').attr('content', 'initial-scale=' + ratio + ', maximum-scale=' + ratio + ', minimum-scale=' + ratio + ', user-scalable=no, width=' + ww);
    
  
   
   
   $("#ruler").mousemove(function (e) {
   if(e.pageY-this.offsetTop > this.height / 2){
    return;
   }
		var shadedText;
		shaded = Math.max(0,Math.min(Math.round(((e.pageX-leftedge-markwidth/4)/rulerright) * 16),16));
		if(shaded % 2 === 0){
			shadedText = reduce(shaded, 16) + " (or " + shaded + "/16) is shaded."
		}else{
			shadedText = shaded + "/16 is shaded.";
		}
		$("#layers").css("background-position-y",  -shaded * 230 + "px"  );
		$("#highlight").css("left", leftedge + markwidth * shaded);
		$("#fraction").text(shadedText);
	});

moveHighlight();
});



