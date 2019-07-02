$(function(){
	loadAPIList();
	getBranchInfo();
	loadccyType();
	loadTdPeriodList();
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
	var queryUrl = 'http://' + hostname + ':8086/deposit/deposit/rate/getAllTdRateList';
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
        	mergeTable("tdperiod");
        },
        columns: [{
            field: 'tdperiod',
            title: 'Deposit Period',
            sortable: false
        },{
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
        	field: 'tdinterestrate',
            title: 'Deposit Rate',
            sortable: false
        },{
            title: 'Operate',
            sortable: false,
            formatter:function(value, row, index){
            	var html = "<div id='"+ row.id +"'><button class='btn btn-default' onclick=updateRate('" + row.id + "')>Update</button> <button class='btn btn-default' onclick=deleteTdRate('" + row.id + "')>Delete</button></div>";
            	return html;
            }
        }]
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

function loadTdPeriodList(){
	var html = '<option value="">-- Option --</option>';
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl ='http://' +hostname+ ':8086/deposit/deposit/rate/getPeirodList';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "get",
		headers:{
    		"developerID" : sessionStorage.getItem("userID")
    	},
		success: function(res){
			if(res != null && res.PeriodList.length > 0){
				for(var i=0; i< res.PeriodList.length; i++){
					html += "<option value='" + res.PeriodList[i].tdperiod + "'>"+ res.PeriodList[i].tdperiod +"</option>"
				}
			}
			$("#tdPeriodSelect").html(html);
		}
	});
}

function updateRate(id){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl ='http://' +hostname+ ':8086/deposit/deposit/rate/getTDRateDetails';
	var html = "<option value=''>-- Option --</option>";
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
			var list = res.list;
			if(list.length >0){
				$("#tdPeriodSelect").val(res.list[0].tdperiod);
				$("#tdRate").val(res.list[0].tdinterestrate);
			}else{
				$("#tdPeriodSelect").val("");
				$("#tdRate").val("");
			}
			$("#amountRangeSelect").html(html);
			$("#funcName").text("Update Rate");
			$("#tdRateId").text(id);
			$(".aboutRate").show();
			$(".aboutPeriod").hide();
			$("#modifyMadal").modal('show');
		}
	});
}

function addTdPeriod(){
	var html = "<option value=''>-- Option --</option>";
	$("#tdRateId").text("");
	$("#funcName").text("Add New Period");
	$("#amountRangeSelect").html(html);
	$("#tdPeriodInput").val("");
	$("#tdPeriodSelect").val("");
	$("#tdRate").val("");
	$(".aboutRate").hide();
	$(".aboutPeriod").show();
	$("#modifyMadal").modal('show');
}

function addTdRate(){
	var html = "<option value=''>-- Option --</option>";
	$("#tdRateId").text("");
	$("#funcName").text("Add Td Rate");
	$("#amountRangeSelect").html(html);
	$("#tdPeriodInput").val("");
	$("#tdPeriodSelect").val("");
	$("#tdRate").val("");
	$(".aboutRate").show();
	$(".aboutPeriod").hide();
	$("#modifyMadal").modal('show');
}

function deleteTdRate(id){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' +hostname+ ':8086/deposit/deposit/rate/deleteTdRate';
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
			var yg = new Ygtoast();
			yg.toast(res.msg);
			loadTdPeriodList();
			$("#tableContent").bootstrapTable("refresh");
		}
	});
}

function confirmAction(){
	var tdRateId = $("#tdRateId").text();
	var funcName = $("#funcName").text();
	var amountRangeSelect = $("#amountRangeSelect").val();
	var tdPeriodSelect = $("#tdPeriodSelect").val();
	var tdPeriodInput = $("#tdPeriodInput").val();
	var tdRate = $("#tdRate").val();
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = "";
	var data = {
			depositrange: amountRangeSelect,
			tdinterestrate: tdRate
	};
	if(tdRateId != ''){
		data.id = tdRateId;
		data.tdperiod = tdPeriodSelect;
		queryUrl ='http://' +hostname+ ':8086/deposit/deposit/rate/updateTdRate';
	}else{
		if(funcName == "Add Td Rate"){
			data.tdperiod = tdPeriodSelect;
			queryUrl ='http://' +hostname+ ':8086/deposit/deposit/rate/addTdRate';
		}else if(funcName == "Add New Period"){
			data.tdperiod = tdPeriodInput;
			queryUrl ='http://' +hostname+ ':8086/deposit/deposit/rate/addTdPeriod';
		}
	}
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "post",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify(data),
		headers:{
    		"developerID" : sessionStorage.getItem("userID")
    	},
		success: function(res){
			var yg = new Ygtoast();
			yg.toast(res.msg);
			$("#tableContent").bootstrapTable("refresh");
			$('#modifyMadal').modal('hide');
			if(funcName == "Add New Period" && res.code == "1" ){
				loadTdPeriodList();
			}
		}
	});
}

function cancelAction(){
	$('#modifyMadal').modal('hide');
}

function showAmountRange(){
	$('#modifyMadal').modal('hide');
	$('#amountRangeInfo').modal('show');
	loadAmountRangeList();
}

function loadAmountRangeList(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' + hostname + ':8086/deposit/deposit/rate/getAllAmountRangeList/all';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "get",
		headers: {
			"developerID" : sessionStorage.getItem("userID") ? sessionStorage.getItem("userID") : "123"
		},
		success: function(res){
			loadeAmountRangeTable(res);
			loadCountryCodeInfo();
			$('#modifyMadal').modal('hide');
			$('#amountRangeInfo').modal('show');
		}
	});
	
}

function searchAmountRange(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var countryCode = $("#countrycode").val();
	var clearingCode = $("#clearingcode").val();
	var branchcode = $("#branchcode").val();
	var ccytype = $("#ccytype").val();
	var queryUrl = 'http://' + hostname + ':8086/deposit/deposit/rate/getAllAmountRangeList/' + ccytype;
	if(ccytype == ""){
		queryUrl = 'http://' + hostname + ':8086/deposit/deposit/rate/getAllAmountRangeList/all';
	}
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "get",
		headers: {
			"developerID" : sessionStorage.getItem("userID") ? sessionStorage.getItem("userID") : "123",
		    "countryCode" :　countryCode,
		    "clearingcode" : clearingCode,
		    "branchcode" : clearingCode
		},
		success: function(res){
			$('#amountRangeTable').bootstrapTable('load', res);
		}
	});
}

function loadeAmountRangeTable(data){
	return $("#amountRangeTable").bootstrapTable({
		data: data,
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
        onDblClickRow:function(row){
        	getInfo(row);
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
        }]
	});
}

function getInfo(row){
	var html = "";
	if(row.amountrangemax != null){
		html = "<option value='"+ row.id +"'>" + row.amountrangemin + row.ccytype + " - " + row.amountrangemax + row.ccytype +"</option>";
	}else{
		html = "<option value='"+ row.id +"'>" + row.amountrangemin + row.ccytype + " Or Above </option>";
	}
	$("#amountRangeSelect").html(html);
	$('#amountRangeInfo').modal('hide');
	$('#modifyMadal').modal('show');
}

function closeAction(){
	$('#amountRangeInfo').modal('hide');
	$('#modifyMadal').modal('show');
}

function loadCountryCodeInfo(){
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
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

/**
 * 合并行
 * @param data  原始数据（在服务端完成排序）
 * @param fieldName 合并属性名称数组
 * @param colspan 列数
 * @param target 目标表格对象
 */

function mergeTable(field){
    $table=$("#tableContent");
    var obj=getObjFromTable($table,field);
 
     for(var item in obj){  
    	 $("#tableContent").bootstrapTable('mergeCells',{
        index:obj[item].index,  //从第index行合并
        field:field,
        colspan:1,
        rowspan:obj[item].row,  //合并row咧
        });
      }
 
 
}
 
function getObjFromTable($table,field){
    var obj=[];
    var maxV=$table.find("th").length;
    var columnIndex=0;
    var filedVar;
    
    //获取需要合并列的field的index
    for(columnIndex=0;columnIndex<maxV;columnIndex++){
        filedVar=$table.find("th").eq(columnIndex).attr("data-field");
        if(filedVar==field) break;
 
    }
    var $trs=$table.find("tbody > tr");
    var $tr;
    var index=0;
    var content="";
    var row=1;
    for (var i = 0; i <$trs.length;i++){   
        $tr=$trs.eq(i);
        var contentItem=$tr.find("td").eq(columnIndex).html();
        //如果存在。则个数+1
        if(contentItem.length>0 && content==contentItem ){
            row++;
        }else{
            //当新的field时，把上一个push进obj
            if(row>1){
                obj.push({"index":index,"row":row});
            }
            index=i;
            content=contentItem;
            row=1;
        }
    }
    if(row>1){
    	obj.push({"index":index,"row":row});
    }
    return obj; 
}
