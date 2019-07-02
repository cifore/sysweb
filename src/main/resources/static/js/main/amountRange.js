$(function(){
	loadAPIList();
	getBranchInfo();
	loadccyType();
});

function getBranchInfo(){
	$.ajax({
		url      : "/json/config.json",
		type     : "get",
		dataType : "json",
		success  : function(res){
			sessionStorage.setItem("userID", res.userID);
		}
	});
}

function loadAPIList(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' + hostname + ':8086/deposit/deposit/rate/getAllAmountRangeList/all';
	var table = $("#tableContent").bootstrapTable({
		url: queryUrl,
        method: 'GET',                      //请求方式（*）
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        striped: false,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: false,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        search: false,                      //是否显示表格搜索
        strictSearch: false,				//精确搜索
        showColumns: false,                  //是否显示所有的列（选择显示的列）
        showRefresh: false,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: false,                //是否启用点击选中行
        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                   //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        singleSelect:true, 				    //禁止多选_____
        ajaxOptions:{
        	headers:{
        		"developerID" : sessionStorage.getItem("userID") ? sessionStorage.getItem("userID") : "123"
        	}
        },
        onLoadSuccess: function(data){
        },
        columns: [{
            field: 'countrycode',
            title: 'Country Code',
            sortable: false
        },{
            field: 'clearingcode',
            title: 'Clearing Code',
            sortable: false
        },{
            field: 'branchcode',
            title: 'Branch Code',
            sortable: false
        },{
            field: 'ccytype',
            title: 'Ccy Type',
            sortable: false
        },{
            field: 'amountrangemin',
            title: 'Amount Range Min',
            sortable: false
        },{
            field: 'amountrangemax',
            title: 'Amount Range Max',
            sortable: false
        },{
            title: 'Operate',
            sortable: false,
            formatter:function(value, row, index){
            	var html = "<div id='"+ row.id +"'><button class='btn btn-default' onclick=updateAmountRange('" + row.id + "')>Update</button> <button class='btn btn-default' onclick=deleteAmountRange('" + row.id + "')>Delete</button></div>";
            	return html;
            }
        }
       ]
	});
}

function loadccyType(){
	var html = '<option value="">-- Option --</option>';
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl ='http://' +hostname+ ':8086/sysadmin/sysadmin/sysconfig/getSystemParameter';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "post",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify({"item": "ccytype"}),
		headers:{
    		"developerID" : sessionStorage.getItem("userID")
    	},
		success: function(res){
			if(res != null && res.length > 0){
				for(var i=0; i< res.length; i++){
					html += "<option value='" + res[i].value + "'>"+ res[i].value +"</option>"
				}
			}
			$("#ccytype").html(html);
		}
	});
}

function addNewAmountRange(){
	var html = '<option value="">-- Option --</option>';
	$("#funcName").text("Add Amount Range");
	$("#amountRangeId").text("");
	$("#ccytype").val("");
	$("#amountrangemin").val("");
	$("#amountrangemax").val("");
	$("#countrycode").html(html);
	$("#clearingcode").html(html);
	$("#branchcode").html(html);
	loadCountryCodeInfo();
	$('#modifyMadal').modal('show');
}

function updateAmountRange(id){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl ='http://' +hostname+ ':8086/deposit/deposit/rate/getAmountRangeInfoById';
	var html = '<option value="">-- Option --</option>';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "post",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify({"id": id}),
		headers:{
    		"developerID" : sessionStorage.getItem("userID")
    	},
		success: function(res){
			if(res.amountrangeInfo){
				var amountrangeInfo = res.amountrangeInfo;
				$("#funcName").text("Update Amount Range");
				$("#amountRangeId").text(amountrangeInfo.id);
				$("#ccytype").val(amountrangeInfo.ccytype);
				$("#amountrangemin").val(amountrangeInfo.amountrangemin);
				$("#amountrangemax").val(amountrangeInfo.amountrangemax);
				$("#countrycode").html(html);
				$("#clearingcode").html(html);
				$("#branchcode").html(html);
				loadCountryCodeInfo();
				$('#modifyMadal').modal('show');
			}else{
				var yg = new Ygtoast();
				yg.toast("Can't find the amount range infomation!");
			}
		}
	});
}

function deleteAmountRange(id){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' +hostname+ ':8086/deposit/deposit/rate/deleteAmountRange';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "POST",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify({"id": id}),
		headers:{
			"developerID" : sessionStorage.getItem("userID")
		},
		success: function(res){
			var yg = new Ygtoast();
			yg.toast(res.msg);
			if(res.code == "1"){
				$("#tableContent").bootstrapTable("refresh");
			}
			$('#modifyMadal').modal('hide');
		}
	});
}

function confirmAction(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var amountRangeId = $("#amountRangeId").text();
	var queryUrl = "";
	var countrycode = $("#countrycode").val();
	var clearingcode = $("#clearingcode").val();
	var branchcode = $("#branchcode").val();
	if(!countrycode || !clearingcode || !branchcode){
		var yg = new Ygtoast();
		yg.toast("Required fields are incomplete!");
		return;
	}
	var data ={
			"ccytype" : $("#ccytype").val(),
			"amountrangemin" : $("#amountrangemin").val(),
			"amountrangemax" : $("#amountrangemax").val()
	};
	if(amountRangeId == ""){
		queryUrl = 'http://' +hostname+ ':8086/deposit/deposit/rate/addAmountRange';
	}else{
		data.id = amountRangeId;
		queryUrl = 'http://' +hostname+ ':8086/deposit/deposit/rate/upateAmountRange';
	}
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "POST",
		contentType:"application/json",
		data: JSON.stringify(data),
		headers: {
			"developerID" : sessionStorage.getItem("userID"),
			"countryCode" : countrycode,
			"clearingCode" :　clearingcode,
			"branchCode" : branchcode
		},
		success: function(res){
			var yg = new Ygtoast();
			yg.toast(res.msg);
			if(res.code == "1"){
				$("#tableContent").bootstrapTable("refresh");
			}
			$('#modifyMadal').modal('hide');
		}
	});
}

function cancelAction(){
	$('#modifyMadal').modal('hide');
}

function loadCountryCodeInfo(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' + hostname + ':8086/sysadmin/sysadmin/branch/getCountryCodes';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "get",
		success: function(res){
			var html = '<option value="-1">-- Option --</option>';
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
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
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
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
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