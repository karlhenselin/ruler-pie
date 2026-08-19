var markwidth;
var leftedge;
var leftmark;
var shaded =1;
var rulerright;
function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  if (numerator == 0){
	return 0;
  }else if (numerator == 16){
    return "One Whole" ;
  }
  gcd = gcd(numerator,denominator);
  return [numerator/gcd +"/" + denominator/gcd];
}
function moveHighlight(){
  var ratio = $("#ruler").width() / 400
  rulerright = $("#ruler").width()*.92;
  markwidth = rulerright / 16;
  leftmark = 12 * ratio;
	leftedge = $("#ruler").offset().left + leftmark;
	$("#highlight").css("left", leftedge + markwidth * shaded).css("width", 10*ratio).css("height", 75*ratio);
	$("#highlight").css("top", $("#ruler").offset().top);
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
    
  
   
   $("#chartContainer").CanvasJSChart(options);
   chart = $("#chartContainer").CanvasJSChart();
   $("#ruler").mousemove(function (e) {
   if(e.pageY-this.offsetTop > this.height /2){
    return;
   }
		var shadedText;
		shaded = Math.max(0,Math.min(Math.round(((e.pageX-leftedge-markwidth/2)/rulerright) * 16),16));
		chart.options.data[0].dataPoints[1].y = shaded;
		if(shaded % 2 === 0){
			shadedText = reduce(shaded, 16) + " (or " + shaded + "/16) is shaded."
		}else{
			shadedText = shaded + "/16 is shaded.";
		}
		chart.options.data[0].dataPoints[1].indexLabel = shadedText;
    chart.options.data[0].dataPoints[1].toolTipContent = shadedText;
		$("#highlight").css("left", leftedge + markwidth * shaded);
		$("#fraction").text(shadedText);
		chart.options.data[0].dataPoints[0].y = 16-shaded;
		chart.render();
	});

moveHighlight();
});



