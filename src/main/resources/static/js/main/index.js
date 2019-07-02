$(function(){
	loadAPIList();
	getBranchInfo();
	loadCountryCodeInfo();
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
	var hostname =  "ec2-3-130-122-199.us-east-2.compute.amazonaws.com";
	var queryUrl = 'http://' + hostname + ':8086/sysadmin/sysadmin/queryApiList';
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
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: false,                //是否启用点击选中行
        //height: 500,                      //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "id",                     //每一行的唯一标识，一般为主键列
        showToggle: false,                   //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                  //是否显示父子表
        singleSelect:false, 				//禁止多选_____
        ajaxOptions:{
        	headers:{
        		"developerID" : $("#userID").val()
        	}
        },
        onLoadSuccess: function(data){
        	mergeTable("modulename");
        },
        onDblClickRow:function(row){
        	getInfo(row);
        },
        columns: [{
            field: 'modulename',
            title: 'Module Name',
            sortable: false
        },{
            field: 'apiname',
            title: 'API Name',
            sortable: false
        },{
            field: 'apidescription',
            title: 'API Description',
            sortable: false
        },{
            field: 'status',
            title: 'Status',
            sortable: false
        },{
            field: 'owner',
            title: 'Owner',
            sortable: false
        },{
            field: 'version',
            title: 'Version',
            sortable: false
        },{
            field: 'versiondesc',
            title: 'Version Description',
            sortable: false
        },{
            field: 'lastupdatedate',
            title: 'Last Upadte Date',
            sortable: false,
            formatter:function(value, row, index){
            	if(!!value){
            		return "<strong>"+new Date(value).format("yyyy-MM-dd")+"</strong>";
            	}else{
            		return "";
            	}
            }
        },{
            title: 'Test',
            sortable: false,
            formatter:function(value, row, index){
            	var html = "<div id='"+ row.id +"'><button class='btn btn-default' onclick= testApi('" + row.id + "')>Test</button></div>";
            	return html;
            }
        }
       ]
	});
}

//跳转到API 调用页面
function testApi(id){
	sessionStorage.setItem("apiId",id);
	var url = '/sysweb/index/testApi';
	window.location.href = url;	
}

//获取api详情
function getInfo(info){
	$('#modifyMadal').modal('show');
	$("#moduleName").val(info.modulename);
	$("#apiName").val(info.apiname);
	$("#status").val(info.status);
	$("#requestmethod").val(info.requestmode);
	$("#owner").val(info.owner);
	if(!!info.lastupdatedate){
		$("#lastupdateDate").val(new Date(info.lastupdatedate).format("yyyy-MM-dd"));
	}
	$("#version").val(info.version);
	$("#versionDesc").val(info.versiondesc);
	$("#apiDescription").val(info.apidescription);
	$("#apiaddress").val(info.apiaddress);
	$("#internalURL").val(info.internalurl);
	$("#inputDesc").val(info.inputdescription);
	$("#outputDesc").val(info.outputdescription);
	
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