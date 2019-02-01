$(function(){
	loadAPIList();
});

function loadAPIList(){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' + hostname + ':8086/creditcard/merchant/getMerchants';
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
            field: 'merchantname',
            title: 'Merchant Name',
            sortable: false
        },{
            field: 'merchantnumber',
            title: 'Merchant Number',
            sortable: false
        },{
            field: 'merchantaddress',
            title: 'Merchant Address',
            sortable: false
        },{
            title: 'Operate',
            sortable: false,
            formatter:function(value, row, index){
            	var html = "<div id='"+ row.id +"'><button class='btn btn-default' onclick=updateMerchant('" + row.id + "')>Update</button> <button class='btn btn-default' onclick=deleteMerchant('" + row.id + "')>Delete</button></div>";
            	return html;
            }
        }
       ]
	});
}

function addNewMerchant(){
	$("#funcName").text("Insert Merchant");
	$("#merchantId").text("");
	$("#merchantname").val("");
	$("#merchantnumber").val("").removeAttr("readonly");
	$("#merchantaddress").val("");
	$('#modifyMadal').modal('show');
}

function updateMerchant(id){
	var hostname =  window.location.hostname;
	var queryUrl ='http://' +hostname+ ':8086/creditcard/merchant/queryMerchantById';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "post",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify({"id": id}),
		success: function(res){
			var merchant = res.merchant;
			$("#funcName").text("Update Merchant");
			$("#merchantId").text(merchant.id);
			$("#merchantname").val(merchant.merchantname);
			$("#merchantnumber").val(merchant.merchantnumber).attr("readonly","readonly");
			$("#merchantaddress").val(merchant.merchantaddress);
			$('#modifyMadal').modal('show');
		}
	});	
}

function deleteMerchant(id){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' +hostname+ ':8086/creditcard/merchant/deleteMerchant';
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
	var hostname =  window.location.hostname;
	var merchantId = $("#merchantId").text();
	var queryUrl = "";
	var data ={
			"merchantname": $("#merchantname").val(),
			"merchantnumber": $("#merchantnumber").val(),
			"merchantaddress": $("#merchantaddress").val()
	};
	if(merchantId == ""){
		queryUrl = 'http://' +hostname+ ':8086/creditcard/merchant/insertMerchant';
	}else{
		data.id = merchantId;
		queryUrl = 'http://' +hostname+ ':8086/creditcard/merchant/updateMerchant';
	}
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "POST",
		contentType:"application/json",
		data: JSON.stringify(data),
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
