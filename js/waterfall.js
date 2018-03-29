/* jshint asi:true */
//先等图片都加载完成
//再执行布局函数

/**
 * 执行主函数
 * @param  {[type]} function( [description]
 * @return {[type]}           [description]
 */
(function() {

  /**
     * 内容JSON
     */
    var demoContent = [
	{
        demo_link: 'http://v.youku.com/v_show/id_XMjgyNDEwMjU0OA==.html?from=s1.8-1-1.2',
        img_link: '/css/Graduate.png',
        //code_link: 'http://v.youku.com/v_show/id_XMjgyNDEwMjU0OA==.html?from=s1.8-1-1.2',
        title: '毕业相册',
        core_tech: 'Ae and Edius',
        description: '纪念我们一起走过的青春'
    },
	{
        demo_link: 'https://github.com/zhangquan1995/QQ_Manager',
        img_link: '/css/QQ_Manager.png',
        //code_link: 'https://github.com/zhangquan1995/QQ_Manager',
        title: 'Qt腾讯管家',
        core_tech: 'Qt',
        description: '用Qt做的电脑管家小程序'
    },
	{
        demo_link: 'https://github.com/zhangquan1995/C_Manager',
        img_link: '/css/C_Manager.png',
        //code_link: 'https://github.com/zhangquan1995/C_Manager',
        title: 'C语言课程设计',
        core_tech: 'C/C++',
        description: '曾经很菜，现在依然很菜'
    }
  ];

  contentInit(demoContent) //内容初始化
  waitImgsLoad() //等待图片加载，并执行布局初始化
}());

/**
 * 内容初始化
 * @return {[type]} [description]
 */
function contentInit(content) {
  var htmlStr = ''
  for (var i = 0; i < content.length; i++) {
    htmlStr += '<div class="grid-item">' + '   <a class="a-img" href="' + content[i].demo_link + '">' + '       <img src="' + content[i].img_link + '">' + '   </a>' + '   <h3 class="demo-title">' + 
    '       <a href="' + content[i].demo_link + '">' + content[i].title + '</a>' + '   </h3>' + '   <p>主要技术：' + content[i].core_tech + '</p>' + '   <p>' + content[i].description + '   </p>' + '</div>'
  }
  var grid = document.querySelector('.grid')
  grid.insertAdjacentHTML('afterbegin', htmlStr)
}

/**
 * 等待图片加载
 * @return {[type]} [description]
 */
function waitImgsLoad() {
  var imgs = document.querySelectorAll('.grid img')
  var totalImgs = imgs.length
  var count = 0
  //console.log(imgs)
  for (var i = 0; i < totalImgs; i++) {
    if (imgs[i].complete) {
      //console.log('complete');
      count++
    } else {
      imgs[i].onload = function() {
        // alert('onload')
        count++
        //console.log('onload' + count)
        if (count == totalImgs) {
          //console.log('onload---bbbbbbbb')
          initGrid()
        }
      }
    }
  }
  if (count == totalImgs) {
    //console.log('---bbbbbbbb')
    initGrid()
  }
}

/**
 * 初始化栅格布局
 * @return {[type]} [description]
 */
function initGrid() {
  var msnry = new Masonry('.grid', {
    // options
    itemSelector: '.grid-item',
    columnWidth: 250,
    isFitWidth: true,
    gutter: 20
  })
}
