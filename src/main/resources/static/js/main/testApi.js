$(function(){
	loadApiInfo();
	getBranchInfo();
	loadCountryCodeInfo();
});
//enter键触发send点击发生
$(document).keyup(function(event){
	  if(event.keyCode ==13){
	    return false;
	  }
});

function getBranchInfo(){
	$.ajax({
		url      : "/json/config.json",
		type     : "get",
		dataType : "json",
		success  : function(res){
			$("#userID").val(res.userID);
			sessionStorage.setItem("userID", res.userID);
		}
	});
}

//加载API信息
function loadApiInfo(){
	var hostname =  window.location.hostname;
	var id=sessionStorage.getItem('apiId');
	var queryUrl ='http://' +hostname+ ':8086/sysadmin/sysadmin/getApiInfo/'+ id;
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type:"get",
		headers:{
    		"developerID" : sessionStorage.getItem("userID")?sessionStorage.getItem("userID"):sessionStorage.getItem("userID")
    	},
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
		headers: {
			"developerID" : $("#userID").val(),
			"countryCode" : $("#countryCode").val(),
			"clearingCode": $("#clearingCode").val(),
			"branchCode": $("#branchCode").val()
		},
		success: function(res){
			var data = JSON.stringify(res);
			$("#outputDesc").val(data);
			$("#output").removeClass("hidden").addClass("show");
		}
	});
}

function loadCountryCodeInfo(){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' + hostname + ':8086/sysadmin/sysadmin/branch/getCountryCodes';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "get",
		success: function(res){
			var html = '<option value="">-- Option --</option>';
			if(res.countryCodes && res.countryCodes.length > 0){
				for(var i=0; i< res.countryCodes.length ; i++){
					html += "<option value='" + res.countryCodes[i].countrycode + "'> " + res.countryCodes[i].countrycode + "</option>"
				}
			}
			$("#countrycode").html(html);
		}
	});
}

function loadClearingcode(){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' + hostname + ':8086/sysadmin/sysadmin/branch/getClearingCodeByCountryCode';
	var countrycode = $("#countrycode").val();
	var html = '<option value="">-- Option --</option>';
	if(countrycode == ""){
		$("#clearingcode").html(html);
	}else{
		$.ajax({
			url: queryUrl,
			dataType: "json",
			type: "post",
			contentType:"application/json",
			async:false,
			cache:false,
			data: JSON.stringify({"countrycode": countrycode}),
			success: function(res){
				if(res.clearingCodes && res.clearingCodes.length > 0){
					for(var i=0; i< res.clearingCodes.length ; i++){
						html += "<option value='" + res.clearingCodes[i].clearingcode + "'> " + res.clearingCodes[i].clearingcode + "</option>"
					}
				}
				$("#clearingcode").html(html);
			}
		});
	}
	loadBranchcode();
}

function loadBranchcode(){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' + hostname + ':8086/sysadmin/sysadmin/branch/getBrancoByCC';
	var countrycode = $("#countrycode").val();
	var clearingcode = $("#clearingcode").val();
	var html = '<option value="">-- Option --</option>';
	if(countrycode == ""){
		$("#clearingcode").html(html);
		$("#branchcode").html(html);
	}else{
		if(clearingcode  == ""){
			$("#branchcode").html(html);
		}else{
			$.ajax({
				url: queryUrl,
				dataType: "json",
				type: "post",
				contentType:"application/json",
				async:false,
				cache:false,
				data: JSON.stringify({"countrycode": countrycode, "clearingcode": clearingcode}),
				success: function(res){
					if(res.branchCodes && res.branchCodes.length > 0){
						for(var i=0; i< res.branchCodes.length ; i++){
							html += "<option value='" + res.branchCodes[i].branchcode + "'> " + res.branchCodes[i].branchcode + "</option>"
						}
					}
					$("#branchcode").html(html);
				}
			});
		}
	}
}