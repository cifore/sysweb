$(function(){
	loadAPIList();
});

function loadAPIList(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' + hostname + ':8086/investment/order/getOrder';
    // var  queryUrl = "http://localhost:8097/investment/order/getOrder";
	var table = $("#tableContent").bootstrapTable({
		url: queryUrl,
        method: 'POST',                      //请求方式（*）
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
        		"developerID" : "123"
        	}
        },
        columns: [{
            field: 'stockaccountnumber',
            title: 'Stock AccountNumber',
            sortable: false
        },{
            field: 'relaccountnumber',
            title: 'Rel AccountNumber',
            sortable: false
        },{
            field: 'stockcode',
            title: 'Stock Code',
            sortable: false
        },{
            field: 'ordertype',
            title: 'Order Type',
            sortable: false
        },{
            field: 'tradingoption',
            title: 'Trading Option',
            sortable: false
        },{
            field: 'sharingno',
            title: 'Sharing No',
            sortable: false
        },{
            field: 'tradingprice',
            title: 'Trading Price',
            sortable: false
        },{
            field: 'totalamount',
            title: 'Total Amount',
            sortable: false
        },{
            field: 'currencycode',
            title: 'Currency Code',
            sortable: false
        },{
            field: 'requesttime',
            title: 'Request Time',
            sortable: false,
            formatter: function (value, row, index) {
                if (row.ordertype == 'Fix Price'){
                    return formatDateHms(value)
                }else if (row.ordertype == 'Market Price'){
                    return '-';
                }
        }
        },{
            field: 'expirydate',
            title: 'Expiry Date',
            sortable: false,
            formatter: function (value, row, index) {
                return formatDateYmd(value)
            }
        },{
            field: 'status',
            title: 'Status',
            sortable: false,
            formatter: function (value, row, index) {
                return formatStatus(value)
        }
        },{
            field: 'operationreasons',
            title: 'Operation Reasons',
            sortable: false
        },{
            field: 'operationdate',
            title: 'Operation Date',
            sortable: false,
            formatter: function (value, row, index) {
                return formatDateHms(value)
            }
        },{
            title: 'Operate',
            sortable: false,
            formatter:function(value, row, index){
            	var html = "<div id='"+ row.id +"'><button class='btn btn-default'>Approve</button>";
            	if(row.ordertype == 'Market Price'){
            	    html += "</div>";
                }else {
            	    html += "<button class='btn btn-default' onclick = 'rejectStockOrder()'>Reject</button></div>";
                }
            	return html;
            }
        }
       ]
	});
}

function rejectStockOrder(){
    $('#rejectMadal').modal('show');
}

function addNewStockOrder(){
    $("#funcName").text("Insert Stock Order");
    $("#stockaccountnumber").val("");
    $("#relaccountnumber").val("");
    $("#stockcode").val("");
    $("#ordertype").val("");
    $("#tradingoption").val("");
    $("#sharingno").val("");
    $("#tradingprice").val("");
    $("#totalamount").val("");
    $("#currencycode").val("");
    $("#requesttime").val("");
    $("#expirydate").val("");
    $("#status").val("");
    $("#operationreasons").val("");
    $("#operationdate").val("");
	$('#modifyMadal').modal('show');
}



function confirmAction(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
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

function rejectconfirmAction(){
	$('#rejectMadal').modal('hide');
}
function rejectcancelAction(){
	$('#rejectMadal').modal('hide');
}

function deleteCurrency(id){
    var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
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

function formatDateHms(time) {
    if (time==0 || time=='' || time==null){
        return '-';
    }
    var date = new Date(time*1000);
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}

function formatDateYmd(time) {
    if (time==0 || time==''|| time==null){
        return '-';
    }
    var date = new Date(time*1000);
    var seperator1 = "-";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

function formatStatus(status) {
    var result = '';
    if (status == '0'){
        result = 'pending';
    }else if(status == '1'){
        result = 'approve';
    }else if(status == '2'){
        result = 'reject';
    }else if(status == '3'){
        result = 'cancel';
    }
    return result;
}