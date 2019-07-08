/**
 * Created by sjb on 19/2/26.
 */
var db_name="ruihao";
var is_debug=false;
var home_url='http://life1.rehau.cn/';
var img_url='http://life1.rehau.cn/';
var img_url2='http://life3.erehau.com/';
if(is_debug){
    var home_url='http://localhost:8180/tst-consumer-huixiang/';
    var img_url='http://life1.rehau.cn/';
}


function layeditRender(layedit,id,optios){
    layedit.set({
        uploadImage: {
            url: img_url+'/settingInterfaces/v1.0/uploadImgLayui'
            ,type: 'post' //默认post
        }
    });

    var index=layedit.build(id,optios); //建立编辑器
    return index;
}

function changeFile(id,showId) {
    post(home_url+"/memberInterfaces/v1.0/getQiniuToken",{},function (data) {
        var file = document.getElementById(id).files[0];

        var key = file.name;

        var observable = qiniu.upload(file, key, data, {},{
            useCdnDomain: true,
            region: qiniu.region.z0
        })
        var subscription = observable.subscribe(function (response){

        }, function (err){
            var layer = layui.layer;
            layer.msg(err.message + "");
        },function (res){
            $(showId).attr('src', img_url2+res.key);
        })
    })
}

function uploadRender(upload,elem,id,doSuccess) {



    upload.render({
        elem: elem //绑定元素
        ,url: img_url+'/settingInterfaces/v1.0/uploadImg' //上传接口
        ,accept: "images"
        ,size:'3036'
        ,before: function(obj){
            //预读本地文件示例，不支持ie8
            obj.preview(function(index, file, result){
                if(!doSuccess){
                    //$(id).attr('src', result); //图片链接（base64）
                }

            });
        }
        ,done: function(response){
            //上传完毕回调
            if (response.status === 'ok') {
                if(doSuccess){
                    doSuccess(response.data);
                }else{
                    $(id).attr('src', response.data);
                }
            } else if (response.status === 'error') {
                layer.msg(response.error, {
                    offset: '15px'
                    ,icon: 2
                    ,time: 1000
                })
            } else {
                layer.msg("登录失效,请重新登录", {
                    offset: '15px'
                    ,icon: 1
                    ,time: 1000
                })
            }
            //$('#test-upload-normal-img').attr('src', res.data);
        }
        ,error: function(){
            //请求异常回调
            layer.msg("上传异常", {
                offset: '15px'
                ,icon: 2
                ,time: 1000
            })
        }
    });
}

function tableRender(table,elem,url,params,
                   cols,doSuccess) {
    var cate = layui.data(db_name);
    var systemAccountBean=cate.systemAccountBean;

    if(!isNull(systemAccountBean)){
        params["account_id1"]=getNull(systemAccountBean.account_id+"","-1");
        params["system_token"]=systemAccountBean.system_token+"";
    }

    table.render({
        elem: elem
        ,url:url
        ,where:params
        ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        ,cols:cols
        ,page:true
        ,request: {
            pageName: 'page' //页码的参数名称，默认：page
            ,limitName: 'pageSize' //每页数据量的参数名，默认：limit
        }
        ,response: {
            statusName: 'status' //规定数据状态的字段名称，默认：code
            ,statusCode: "ok" //规定成功的状态码，默认：0
            ,msgName: 'error' //规定状态信息的字段名称，默认：msg
            ,countName: 'total' //规定数据总数的字段名称，默认：count
            ,dataName: 'data' //规定数据列表的字段名称，默认：data
        }
        ,autoSort: false
        ,method:'post'
        ,limits:[10,20,30]
        ,done: function(res, curr, count){
            var response =res;
            if (response.status === 'ok') {
                doSuccess(response.data,response.total);
            } else if (response.status === 'error') {
                layer.msg(response.error, {
                    offset: '15px'
                    ,icon: 2
                    ,time: 1000
                })
            } else {
                layer.msg("登录失效,请重新登录", {
                    offset: '15px'
                    ,icon: 2
                    ,time: 1000
                })
            }
        }
    });
}


function tableRender2(table,elem,cols,data) {
    table.render({
        elem: elem
        ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        ,cols:cols
        ,data:data
    });
}

function post(url,params,doSuccess,doFailed){
    var cate = layui.data(db_name);
    var systemAccountBean=cate.systemAccountBean;

    if(!isNull(systemAccountBean)){
        params["account_id1"]=getNull(systemAccountBean.account_id+"","-1");
        params["system_token"]=systemAccountBean.system_token+"";
    }
    $.post(url,params, function(data) {
        var response =data;
        if (response.status === 'ok') {
            doSuccess(response.data,response.total);
        } else if (response.status === 'error') {
            layer.msg(response.error, {
                offset: '15px'
                ,icon: 2
                ,time: 1000
            })
            if(doFailed){
                doFailed(response.error);
            }
        } else {
            window.location.href = './user/login.html';
            layer.msg("登录失效,请重新登录", {
                offset: '15px'
                ,icon: 2
                ,time: 1000
            })

        }
    }.bind(this));
}

/**
 *
 * @param msg 提示内容
 * @param icon 1：成功的图标 2:失败的图标
 */
function tip(msg,icon){
    layer.msg(msg, {
        offset: '15px'
        ,icon:getNull(icon,2)
        ,time: 1000
    })
}

function isNull(value){
    if(!value||value===''||value==='undefined'){
        return true;
    }else{
        return false;
    }
}

function isNaN(value){
    if(!value||value===''||value==='undefined'){
        return true;
    }

    if(isNaN(value)){
        return true
    }

    return false
}


function split(value){
    if(!value||value===""){
        return [];
    }

    return value.split(",")
}
function getNull(value,result){
    return this.isNull(value)?result:value;
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}


/**
 * 数组删除指定元素
 */
function removeArray(arr,value){
    for(var i=0;i<arr.length;i++){
        if(arr[i]+""===value+""){
            arr.splice(i,1);
            break;
        }
    }
    return arr;
}

function removeArrayV2(arr,key,value){
    for(var i=0;i<arr.length;i++){
        if(arr[i][key]+""===value+""){
            arr.splice(i,1);
            break;
        }
    }
    return arr;
}

/**
 * 链接参数
 */

function getParameter(index,name){
    var str =decodeURIComponent(window.location.search); // location.search是从当前URL的?号开始的字符串
    // 例如：http://www.51job.com/viewthread.jsp?tid=22720
    // 它的search就是?tid=22720
    str = str.substring(1, str.length);
    var arr = str.split('&');

    if (arr[index].indexOf(name) != -1) {
        var pos_start = arr[index].indexOf(name) + name.length + 1;
        var pos_end = arr[index].indexOf("&", pos_start);
        if (pos_end == -1) {
            return arr[index].substring(pos_start);
        } else {

        }
    }
}

/**
 * 点击展示图片
 * @param id
 */
function select_img(id){
    $(id).click();
}

function show_img(t) {
    var t = $(t).find("img");
    //页面层
    layer.open({
        type: 1,
        area: ['80%', '80%'], //宽高
        shadeClose: true, //开启遮罩关闭
        end: function (index, layero) {
            return false;
        },
        content: '<div style="text-align:center"><img src="' + $(t).attr('src') + '" /></div>'
    });
}