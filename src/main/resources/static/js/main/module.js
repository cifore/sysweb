$(function(){
	loadModuleList();
});

function getUserID(){
	$.ajax({
		url      : "/json/config.json",
		type     : "get",
		dataType : "json",
		success  : function(res){
			sessionStorage.setItem("userID", res.userID);
		}
	});
}

function loadModuleList(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' + hostname + ':8086/sysadmin/sysadmin/module/queryModuleList';
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
        minimumCountColumns: 1,             //最少允许的列数
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
        columns: [{
            field: 'name',
            title: 'Module Name',
            sortable: false
        },{
            title: 'Operate',
            sortable: false,
            formatter:function(value, row, index){
            	var html = "<div id='"+ row.id +"'><button class='btn btn-default' onclick=queryModule('" + row.id + "')>Update</button> <button class='btn btn-default' onclick=deleteModule('" + row.id + "')>Delete</button></div>";
            	return html;
            }
        }
       ]
	});
}

function addNewModule(){
	$("#funcName").text("Insert Module");
	$("#moduleId").text("");
	$("#moduleName").val("");
	$('#modifyMadal').modal('show');
}

function queryModule(id){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl ='http://' +hostname+ ':8086/sysadmin/sysadmin/module/findModule';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "post",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify({"id": id}),
		headers:{
			"developerID": "123"
		},
		success: function(res){
			var moduleInfo = res.moduleInfo;
			$("#funcName").text("Update Module Information");
			$("#moduleId").text(moduleInfo.id);
			$("#moduleName").val(moduleInfo.name);
			$('#modifyMadal').modal('show');
			sessionStorage.setItem("moduleName", moduleInfo.name);
		}
	});	
}

function deleteModule(id){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' +hostname+ ':8086/sysadmin/sysadmin/module/delete';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "POST",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify({"id": id}),
		headers: {
			"developerID":"123"
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
	var queryUrl = "";
	var moduleId = $("#moduleId").text();
	var moduleName = $("#moduleName").val();
	var data = {};
	var yg = new Ygtoast();
	if(!moduleName){
		yg.toast("Module Name Can't Be Empty");
		return false;
	}
	if(sessionStorage.getItem("moduleName") && moduleName == sessionStorage.getItem("moduleName")){
		yg.toast("Module Name doesn't change");
		return false;
	}
	data ={"name": moduleName};
	if(moduleId == ""){
		queryUrl = 'http://' +hostname + ':8086/sysadmin/sysadmin/module/insert';
	}else{
		data.id = moduleId;
		queryUrl = 'http://' +hostname+ ':8086/sysadmin/sysadmin/module/update';
	}
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "POST",
		contentType:"application/json",
		data: JSON.stringify(data),
		headers: {
			"developerID": "123"
		},
		success: function(res){
			var yg = new Ygtoast();
			yg.toast(res.msg);
			if(sessionStorage.getItem("moduleName")){
				sessionStorage.removeItem("moduleName");
			}
			if(res.code == "1"){
				$("#tableContent").bootstrapTable("refresh");
			}
			$('#modifyMadal').modal('hide');
		}
	});
}

function cancelAction(){
	if(sessionStorage.getItem("moduleName")){
		sessionStorage.removeItem("moduleName");
	}
	$('#modifyMadal').modal('hide');
}
