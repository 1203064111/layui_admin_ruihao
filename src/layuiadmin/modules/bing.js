


layui.define(function(exports){

    /*
      下面通过 layui.use 分段加载不同的模块，实现不同区域的同时渲染，从而保证视图的快速呈现
    */


    //区块轮播切换
    layui.use(['admin', 'carousel'], function(){
        var $ = layui.$
            ,admin = layui.admin
            ,carousel = layui.carousel
            ,element = layui.element
            ,device = layui.device();

        //轮播切换
        $('.layadmin-carousel').each(function(){
            var othis = $(this);
            carousel.render({
                elem: this
                ,width: '100%'
                ,arrow: 'none'
                ,interval: othis.data('interval')
                ,autoplay: othis.data('autoplay') === true
                ,trigger: (device.ios || device.android) ? 'click' : 'hover'
                ,anim: othis.data('anim')
            });
        });

        element.render('progress');

    });

    //数据概览
    layui.use(['admin', 'carousel', 'echarts'], function() {
        var echarts = layui.echarts,
            $ = layui.jquery;
        var myecharts = echarts.init(document.getElementById('echarts'));
        myecharts.showLoading({
            text: "正在努力的读取数据中。。。。。",
        })
        var option = {
            title: {
                text: '商户申请积分分布图',
                subtext: '数据来源商户',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: []
            },
            series: [{
                name: '访问来源',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [],
                /*data: [
                    { value: 335, name: '熟食' },
                    { value: 310, name: '水产' },
                    { value: 234, name: '蔬菜' },
                    { value: 135, name: '肉品' },
                    { value: 1548, name: '面包' }
                ],*/
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };
        $.ajax({
            type: "post",
            async: false, //同步执行
            url: home_url+'/memberController/v1.0/getMemberOrderDataByDate',
            dataType: "json", //返回数据形式为json
            success: function (result) {
                if (result) {
                    //初始化option.xAxis[0]中的data
                    for (var i = 0; i < result.length; i++) {
                        option.legend.data.push(result[i].order_resource);
                    }
                    //初始化option.series[0]中的data
                    for (var i = 0; i < result.length; i++) {
                        /*option.series[0].data['value'].push(result[i].integral_val);
                            option.series[0].data['name'].push(result[i].name);*/
                        option.series[0].data.push({'name': result[i].order_resource, 'value': result[i].total});
                    }
                    myecharts.hideLoading();    //隐藏加载动画
                    myecharts.setOption(option);
                }
            },
            error: function (errorMsg) {
                alert("图表请求数据失败啦!");
            }

        });
    });

    exports('test', {})
});

