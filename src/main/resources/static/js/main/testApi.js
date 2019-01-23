$(function(){
	loadApiInfo();
});
//enter键触发send点击发生
$(document).keyup(function(event){
	  if(event.keyCode ==13){
	    return false;
	  }
});
//加载API信息
function loadApiInfo(){
	var hostname =  window.location.hostname;
	var id=sessionStorage.getItem('apiId');
	var queryUrl ='http://' +hostname+ ':8086/sysadmin/sysadmin/getApiInfo/'+ id;
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type:"get",
		success: function(data){
			$("#requestMethod").val(data.requestmode);
			$("#apiUrl").val(data.apiaddress);
			$("#inputDesc").val(data.inputdescription);
			
		}	
	});
}

//当api发生请求方式、url或者输入参数发生变化时，隐藏输出框
function hideOutput(){
	$("#outputDesc").val();
	$("#output").removeClass("show").addClass("hidden");
}

//返回API主页面
function returnListPage(){
	sessionStorage.removeItem('apiId')
	window.location.href = "/sysweb/index";
}

//发送API请求
function sendApi(){
	var hostname =  window.location.hostname;
	var apiaddress = $("#apiUrl").val();
	var requestmode = $("#requestMethod").val();
	var inputDesc = $("#inputDesc").val();
	var data = {
			"apiaddress": apiaddress,
			"requestmode" : requestmode,
			"inputDesc": inputDesc
	};
	$.ajax({
		url: 'http://' +hostname+ ':8086/sysadmin/sysadmin/testApiSend',
		dataType: "json",
		type: "post",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify(data),
		success: function(res){
			var data = JSON.stringify(res);
			$("#outputDesc").val(data);
			$("#output").removeClass("hidden").addClass("show");
		}
	});
}