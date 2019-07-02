$(function(){
	loadAPIList();
	getBranchInfo();
});

function getBranchInfo(){
	$.ajax({
		url      : "/json/config.json",
		type     : "get",
		dataType : "json",
		success  : function(res){
			$("#userID").val(res.userID);
		}
	});
}

function loadAPIList(){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' + hostname + ':8086/sysadmin/sysadmin/sysconfig/querySysConfList';
	var table = $("#tableContent").bootstrapTable({
		url: queryUrl,
        method: 'GET',                      //请求方式（*）
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        striped: true,                      //是否显示行间隔色
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
        singleSelect:false, 				//禁止多选_____
        onDblClickRow:function(row){
        	getInfo(row);
        },
        columns: [{
            field: 'sort',
            title: 'Sort',
            sortable: false
        },{
            field: 'item',
            title: 'Item Name',
            sortable: false
        },{
            field: 'value',
            title: 'Value',
            sortable: false,
            formatter:function(value, row, index){
            	if(row.item == "SystemDate"){
            		return ""+ new Date(Number(value)).format("yyyy-MM-dd") +"";
            	}else{
            		return "" + value + "";
            	}
            }
        },{
            field: 'remark',
            title: 'Remark',
            sortable: false
        }]
	});
}

//获取api详情
function getInfo(info){
	$('#modifyMadal').modal('show');
	$('#modifyMadal').modal({backdrop:"static"});
	$("#itemId").text(info.id);
	$("#itemName").val(info.item);
	$("#value").val(info.value);
	if( info.item == "SystemDate"){
		$("#value").val(new Date(Number(info.value)).format("yyyy-MM-dd"));
	}
	
	$("#remark").val(info.remark);
	sessionStorage.setItem("itemName", info.item);
	sessionStorage.setItem("itemValue", info.value);
	sessionStorage.setItem("remark", info.remark);
}

function confirmAction(){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' +hostname+ ':8086/sysadmin/sysadmin/sysconfig/updateParam';
	var itemId = $("#itemId").text();
	var value = $("#value").val();
	var remark =$("#remark").val();
	var data = {
			"id": itemId,
			"value": value,
			"remark": remark
			};
	var yg = new Ygtoast();
	if(!value){
		yg.toast("The value Can't Be Empty");
		return false;
	}
	if(sessionStorage.getItem("itemName") == "SystemDate"){
		var reg = /^(([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29)$/
		var d = "";
		if(!reg.test(value)){
			yg.toast("Incorrect system date format !");
			return false;
		}
		d = new Date(value).getTime();
		data.value = d;
	}
	if(sessionStorage.getItem("itemValue") && value == sessionStorage.getItem("itemValue") 
			&& remark == sessionStorage.getItem("remark")){
		yg.toast("The value isn't changed");
		return false;
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
			if(sessionStorage.getItem("itemValue")){
				sessionStorage.removeItem("itemValue");
			}
			if(sessionStorage.getItem("itemName")){
				sessionStorage.removeItem("itemName");
			}
			if(sessionStorage.getItem("remark")){
				sessionStorage.removeItem("remark");
			}
			if(res.code == "1"){
				$("#tableContent").bootstrapTable("refresh");
			}
			$('#modifyMadal').modal('hide');
		}
	});
}

function cancelAction(){
	if(sessionStorage.getItem("itemValue")){
		sessionStorage.removeItem("itemValue");
	}
	if(sessionStorage.getItem("itemName")){
		sessionStorage.removeItem("itemName");
	}
	if(sessionStorage.getItem("remark")){
		sessionStorage.removeItem("remark");
	}
	$('#modifyMadal').modal('hide');
}

//Date Format
Date.prototype.format = function(fmt) { 
    var o = { 
       "M+" : this.getMonth()+1,
       "d+" : this.getDate(),
       "h+" : this.getHours(),
       "m+" : this.getMinutes(),
       "s+" : this.getSeconds(),
       "q+" : Math.floor((this.getMonth()+3)/3),
       "S"  : this.getMilliseconds()
   }; 
   if(/(y+)/.test(fmt)) {
           fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
   }
    for(var k in o) {
       if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
   return fmt; 
}