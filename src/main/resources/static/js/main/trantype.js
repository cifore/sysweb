$(function(){
	loadTranTypeList();
});

function loadTranTypeList(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' + hostname + ':8086/sysadmin/sysadmin/trantype/getAll';
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
        columns: [{
            field: 'trantype',
            title: 'Transaction Type',
            sortable: false
        },{
            field: 'trantypename',
            title: 'Transaction Type Name',
            sortable: false
        },{
            title: 'Operate',
            sortable: false,
            formatter:function(value, row, index){
            	var html = "<div id='"+ row.id +"'><button class='btn btn-default' onclick=updateTran('" + row.trantype + "')>Update</button> <button class='btn btn-default' onclick=deleteTran('" + row.id + "')>Delete</button></div>";
            	return html;
            }
        }
       ]
	});
}

function addNewTran(){
	$("#funcName").text("Insert Transaction Type");
	$("#trantypeId").text("");
	$("#transTypeModel").hide();
	$("#transname").val("");
	$('#modifyMadal').modal('show');
}

function updateTran(trantype){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl ='http://' +hostname+ ':8086/sysadmin/sysadmin/trantype/queryTranType/'+trantype;
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "get",
		contentType:"application/json",
		async:false,
		cache:false,
		success: function(res){
			var info = res.typeInfo;
			$("#funcName").text("Update Transaction Type");
			$("#trantypeId").text(info.id);
			$("#transtype").val(info.trantype);
			$("#transname").val(info.transname);
			$("#transTypeModel").show();
			$('#modifyMadal').modal('show');
		}
	});	
}

function deleteTran(id){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' +hostname+ ':8086/sysadmin/sysadmin/trantype/deleteTranType';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "POST",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify({"id": id}),
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
	var trantypeId = $("#trantypeId").text();
	var transname = $("#transname").val();
	var data = {};
	var yg = new Ygtoast();
	if(!transname){
		yg.toast("The Input Can't Be Empty");
		return false;
	}
	data ={
			"trantypename": transname
			};
	if(trantypeId == ""){
		queryUrl = 'http://' +hostname + ':8086/sysadmin/sysadmin/trantype/addTranType';
	}else{
		data.id = trantypeId;
		queryUrl = 'http://' +hostname+ ':8086/sysadmin/sysadmin/trantype/updateTranType';
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
