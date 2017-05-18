function adjustelement(){
	/*$("#mainDiv").height(window.innerHeight- $(".header-part").height())*/
	$("#mainDiv").height(window.innerHeight);
	$("#leftDiv").height($("#mainDiv").height()-20);
	$("#rightDiv").height($("#mainDiv").height()-20);
	$("#centreDiv").height($("#mainDiv").height()-16);
	$(".fileviewing-box").css("height",$("#mainDiv").height()-150);
	$(".filesharing-box").css("height","130px");
	$('[data-toggle="tooltip"]').tooltip();
}

document.getElementById("logoutBtn").onclick=function(){
  //window.location="https://"+window.location.hostname+"/";
  window.location="https://"+window.location.hostname+"/connect.php?endTime="+sessionid;
}

function onVideoAdded() {
    var allvids = document.getElementsByTagName("video");
    var count;
    for (x in allvids) {
        if (document.getElementsByName(x) && document.getElementsByName(x).length>0 && document.getElementsByName(x)[0].src) 
            count++;
    }

    alert(" on video added");
    if (count > 3) {
        document.getElementsByClassName("leftDiv1").hidden = false;
    }
    if (count > 5) {
        document.getElementsByClassName("leftDiv2").hidden = false;
    }
}

var allvids = document.getElementsByTagName("video");
for (x in allvids) {
    if (document.getElementsByName(x) && document.getElementsByName(x).length>0 && document.getElementsByName(x)[0].src) 
        document.getElementsByName(x)[0].addEventListener('onplaying', onVideoAdded, false);
}