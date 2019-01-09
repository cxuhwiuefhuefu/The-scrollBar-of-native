// 高内聚 低耦合
// 功能模块化 
// 性能优化 
// 取消默认事件
// 兼容性强大 火狐 IE主流浏览器



// 避免变量冲突 防止污染全局变量 所以用立即执行函数

(function() {


    // 全局变量
      
    var content = document.getElementsByClassName('content')[0],
        contentH = content.offsetHeight;
    var container = document.getElementsByClassName('container')[0],
        containerTop = container.offsetTop,
        containerH = container.offsetHeight;
    var bar = document.getElementsByClassName('bar')[0],
        barH;
    var IcoH = document.getElementsByClassName('ico')[0].offsetHeight,
        scrollH = document.getElementsByClassName('scrollArea')[0].offsetHeight;
   
   
    
   
    // 初始函数 
    //     1. 生成bar的高度
    //     2. 拖拽bar事件
    //     3. 点击上下按钮事件
    //     4. 鼠标滑轮事件

    function init() {
        createBar();
        dragBar();
        clickIco();
        mouseWheel();
    }
    init();




    // 由于bar的高度是由内容区的多少决定的 内容越多 bar的高度越短 所以bar的高度是由js动态生成的
    function createBar() {

        barH = Math.floor(containerH / contentH * scrollH);
        bar.style.height = barH + 'px';
                    
    }




    // 拖拽bar事件
    function dragBar() {

        // 鼠标到达bar上边框的高度
        var topY ;

        // 鼠标点击事件
        var mousedown = function(e) {
           
            preventDefault(e);
           
            topY = e.pageY - bar.offsetTop - containerTop - IcoH;
        
            bindEvent(document, 'mousemove', mousemove);
        }

        // 鼠标移动事件
        var mousemove = function(e2) {

            preventDefault(e2);

            // 要移动的距离
            var moveY;        
            moveY = e2.pageY - topY  - containerTop - IcoH;
            
            // 用moveY把要移动的距离存起来 来个范围判断
            if(moveY < 0) {
                bar.style.top = 0 + 'px';
            }else if(moveY > (scrollH - barH)){
                bar.style.top = (scrollH - barH) + 'px';
            }else {
                bar.style.top = moveY + 'px';
            }

            // 内容区滑动
            slideContent();
            bindEvent(document, 'mouseup', mouseup);
        }

        // 鼠标抬起事件
        var mouseup = function(e3) {
            preventDefault(e3);
            removeEvent(document, 'mousemove', mousemove);
            removeEvent(document, 'mouseup', mouseup);
        }
        
        // 拖拽滚轮事件绑定
        bindEvent(bar, 'mousedown', mousedown);

    }




    // 点击按钮事件
    function clickIco() {
        
        var ulIco = document.getElementsByTagName('ul')[0];

        // 点击事件
        var click = function(e) {
            preventDefault(e);
            var event = e || window.event;
            var target = event.target || event.srcElement;
            var classN = target.className;
            
            // 判断点击的是哪个按钮
            if(classN === 'ico up') { // content向上移动

                var moveY = bar.offsetTop - 10;
                
                if(moveY < 0) {
                    bar.style.top = 0 + 'px';
                }else {
                    bar.style.top = moveY + 'px';
                }

            }else if(classN === 'ico down'){

                var moveY = bar.offsetTop + 10;

                if(moveY > (scrollH - barH)) {
                    bar.style.top = (scrollH - barH) + 'px';
                }else {
                    bar.style.top = moveY + 'px';
                }

            }
        
            
            slideContent();
        }

        // 事件委托  1. 灵活(就是插入新元素也不需要重新绑定) 2. 性能(不需要循环每个逐个绑定)
        bindEvent(ulIco, 'click', click);

    }




    // 鼠标滚轮事件
    function mouseWheel() {

        // 鼠标滑轮事件
        var mousewheel = function(e) {

            preventDefault(e);

            var direction = e.wheelDeltaY || e.detail;

            if(direction < 0) { // 向上滑动

                var moveY = bar.offsetTop - 10;
                if(moveY < 0) {
                    bar.style.top = 0 + 'px';
                }else {
                    bar.style.top = moveY + 'px';
                }

            }else if(direction > 0){

                var moveY = bar.offsetTop + 10;
                if(moveY > (scrollH - barH)) {
                    bar.style.top = (scrollH - barH) + 'px';
                }else {
                    bar.style.top = moveY + 'px'
                }
            
            }
            
            slideContent();
        } 

        // 兼容火狐
        if(typeof container.onmousewheel === 'object') {
            bindEvent(container, 'mousewheel', mousewheel);
        }else {
            bindEvent(container, 'DOMMouseScroll', mousewheel);
        }

    }

    


    // 内容区滚动事件   因为使用频繁 所以单独把它封装成功能函数
    function slideContent() {
        
        var scale = bar.offsetTop / (scrollH - barH);
        content.style.top = - scale * (contentH - containerH) + 'px'; 

    }




    // 取消默认事件
    function preventDefault(event) {
        var e = event || window.event;
        if(e.preventDefault) {
            e.preventDefault();
        }else {
            e.returnValue();
        }
    }




    // 绑定事件
    function bindEvent(elem, type, handle) {
        if(elem.addEventListener) {
            elem.addEventListener(type, handle, false);
        }else if(elem.attachEvent) {
            elem.attachEvent('on' + type, function() {
                handle.call(elem);
            })
        }else {
            elem['on' + type] = handle;
        }
    }




    // 解除绑定事件
    function removeEvent(elem, type, handle) {
        if(elem.removeEventListener) {
            elem.removeEventListener(type, handle, false);
        }else {
            elem.detach('on' + type, function() {
                handle.call(elem);
            })
        }
    }


} ())

















