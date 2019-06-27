$(function(){
	loadTranTypeList();
});

function loadTranTypeList(){
	var hostname =  window.location.hostname;
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
            field: 'currency',
            title: 'Currency',
            sortable: false
        },{
            field: 'ccycode',
            title: 'Ccy Code',
            sortable: false
        },{
            field: 'ccyplaces',
            title: 'Ccy Places',
            sortable: false
        },{
            field: 'bankbuy',
            title: 'Bank Buy',
            sortable: false
        },{
            field: 'banksell',
            title: 'Bank Sell',
            sortable: false
        },{
            title: 'Operate',
            sortable: false,
            formatter:function(value, row, index){
            	var html = "<div id='"+ row.id +"'><button class='btn btn-default' onclick=updateTran('" + row.ccycode + "')>Update</button> <button class='btn btn-default' onclick=deleteTran('" + row.id + "')>Delete</button></div>";
            	return html;
            }
        }
       ]
	});
}

function addNewTran(){
	$("#funcName").text("Insert Currency");
	$("#currencyId").text("");
	$("#currency").val("");
	$("#ccycode").val("").removeAttr("readonly");
	$("#ccyplaces").val("");
	$("#bankbuy").val("");
	$("#banksell").val("");
	$('#modifyMadal').modal('show');
}

function updateTran(ccycode){
	var hostname =  window.location.hostname;
	var queryUrl ='http://' +hostname+ ':8086/sysadmin/sysadmin/currency/queryByCcyCode';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "post",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify({"ccycode": ccycode}),
		headers:{
			"developerID": "123"
		},
		success: function(res){
			$("#funcName").text("Update Currency");
			$("#currencyId").text(res.id);
			$("#currency").val(res.currency);
			$("#ccycode").val(res.ccycode).attr("readonly","readonly");
			$("#ccyplaces").val(res.ccyplaces);
			$("#bankbuy").val(res.bankbuy);
			$("#banksell").val(res.banksell);
			$('#modifyMadal').modal('show');
		}
	});	
}

function deleteTran(id){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' +hostname+ ':8086/sysadmin/sysadmin/currency/deleteCurrency';
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
	var hostname =  window.location.hostname;
	var queryUrl = "";
	var currencyId = $("#currencyId").text();
	var currency = $("#currency").val();
	var ccycode = $("#ccycode").val();
	var ccyplaces = $("#ccyplaces").val();
	var bankbuy = $("#bankbuy").val();
	var banksell = $("#banksell").val();
	var data = {};
	var yg = new Ygtoast();
	if(!currency || !ccycode || !ccyplaces || !bankbuy || !banksell){
		yg.toast("The Input Can't Be Empty");
		return false;
	}
	if(isNaN(bankbuy) || isNaN(banksell)){
		yg.toast("Bank Buy and Bank Sell Can Only Input Number");
		return false;
	}
	if(bankbuy.split(".")[1]!=null && bankbuy.split(".")[1].length > 4 || banksell.split(".")[1]!=null && banksell.split(".")[1].length > 4){
		yg.toast("Bank Buy and Bank Sell are accurate to four decimal places");
		return false;
	}
	data ={
			"currency": currency,
			"ccycode": ccycode,
			"ccyplaces": ccyplaces,
			"bankbuy": bankbuy,
			"banksell": banksell
			};
	if(currencyId == ""){
		queryUrl = 'http://' +hostname + ':8086/sysadmin/sysadmin/currency/insertCurrency';
	}else{
		data.id = currencyId;
		queryUrl = 'http://' +hostname+ ':8086/sysadmin/sysadmin/currency/updateCurrency';
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
