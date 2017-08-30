function adjustelement(){
	/*$("#mainDiv").height(window.innerHeight- $(".header-part").height())*/
	$("#mainDiv").height(window.innerHeight);
	$("#leftDiv").height($("#mainDiv").height()-20);
	$("#rightDiv").height($("#mainDiv").height()-20);
	//$("#centreDiv").height($("#mainDiv").height());
	$("#centreDiv").height("100%");
	$(".fileviewing-box").css("height",$("#mainDiv").height()-150);
	$(".filesharing-box").css("height","130px");
	$('[data-toggle="tooltip"]').tooltip();
}

document.getElementById("logoutBtn").onclick=function(){
  //window.location="https://"+window.location.hostname+"/";
  window.location="https://"+window.location.hostname+"/connect.php?endTime="+sessionid;
}
