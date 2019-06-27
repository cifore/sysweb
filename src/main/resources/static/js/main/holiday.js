$(function(){
	loadHolidayList();
});

function loadHolidayList(){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' + hostname + ':8086/sysadmin/sysadmin/queryHolidayList';
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
        		"developerID" : "123"
        	}
        },
        columns: [{
            field: 'countrycode',
            title: 'Country Code',
            sortable: false
        },{
            field: 'day',
            title: 'Holiday Date',
            sortable: false
        },{
            title: 'Operate',
            sortable: false,
            formatter:function(value, row, index){
            	var html = "<div id='"+ row.id +"'><button class='btn btn-default' onclick=updateHoldiay('" + row.id + "')>Update</button> <button class='btn btn-default' onclick=deleteHoliday('" + row.id + "')>Delete</button></div>";
            	return html;
            }
        }
       ]
	});
}

function addNewHoldiay(){
	$("#funcName").text("Insert Holiday");
	$("#currencyId").text("");
	$("#countrycode").val("");
	$("#day").val("");
	$('#modifyMadal').modal('show');
}

function updateHoldiay(id){
	var hostname =  window.location.hostname;
	var queryUrl ='http://' +hostname+ ':8086/sysadmin/sysadmin/getHolidayInfo';
	$.ajax({
		url: queryUrl,
		dataType: "json",
		type: "post",
		contentType:"application/json",
		async:false,
		cache:false,
		data: JSON.stringify({"id": id}),
		success: function(res){
			if(res.code == "1"){
				var info = res.holidayInfo;
				$("#funcName").text("Update Holiday");
				$("#holidayId").text(info.id);
				$("#countrycode").val(info.countrycode);
				$("#day").val(info.day);
				$('#modifyMadal').modal('show');
				sessionStorage.setItm("countrycode",info.countrycode );
				sessionStorage.setItm("day",info.day );
			}else{
				var yg = new Ygtoast();
				yg.toast(res.msg);
			}
		}
	});	
}

function deleteHoliday(id){
	var hostname =  window.location.hostname;
	var queryUrl = 'http://' +hostname+ ':8086/sysadmin/sysadmin/deleteHoliday';
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
	var queryUrl = "";
	var holidayId = $("#holidayId").text();
	var countrycode = $("#countrycode").val();
	var day = $("#day").val();
	var data = {};
	var yg = new Ygtoast();
	var reg =/((\\d{2}(([02468][048])|([13579][26]))((((0?[13578])|(1[02]))((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))((0?[1-9])|([1-2][0-9])|(30)))|(0?2((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][1235679])|([13579][01345789]))((((0?[13578])|(1[02]))((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))((0?[1-9])|([1-2][0-9])|(30)))|(0?2((0?[1-9])|(1[0-9])|(2[0-8]))))))/;
	if(!day || !countrycode){
		yg.toast("The Input Can't Be Empty");
		return false;
	}
	if(!reg.test(day)){
		yg.toast("Invaild date format!");
		return false
	}
	data ={"countrycode": countrycode,"day": day};
	if(holidayId == ""){
		queryUrl = 'http://' +hostname + ':8086/sysadmin/sysadmin/insertHoliday';
	}else{
		data.id = holidayId;
		queryUrl = 'http://' +hostname+ ':8086/sysadmin/sysadmin/updateHoliday';
		if(sessionStorage.getItem("countrycode") == countrycode && sessionStorage.getItem("day") == day){
			yg.toast("No Holiday Info Changes! ");
			return false;
		}
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
			if(holidayId){
				sessionStorage.removeItem("countrycode");
				sessionStorage.removeItem("day");
			}
			if(res.code == "1"){
				$("#tableContent").bootstrapTable("refresh");
			}
			$('#modifyMadal').modal('hide');
		}
	});
}

function cancelAction(){
	var holidayId = $("#holidayId").text();
	if(holidayId){
		sessionStorage.removeItem("countrycode");
		sessionStorage.removeItem("day");
	}
	$('#modifyMadal').modal('hide');
}
