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
      demo_link: 'https://github.com/zhangquan1995/QQ_Manager',
      img_link: 'http://i1.bvimg.com/639183/abd793ee5c4bbef2t.jpg',
      code_link: 'https://github.com/zhangquan1995/QQ_Manager',
      title: '腾讯电脑管家',
      core_tech: 'Qt',
      description: '利用Qt制作的腾讯电脑管家'
    }, {
      demo_link: 'http://v.youku.com/v_show/id_XMjgyNDEwMjU0OA==.html?spm=a2h0k.8191407.0.0&from=s1.8-1-1.2',
      img_link: 'http://i2.bvimg.com/639183/ce1e6453a5e06034t.jpg',
      code_link: 'http://v.youku.com/v_show/id_XMjgyNDEwMjU0OA==.html?spm=a2h0k.8191407.0.0&from=s1.8-1-1.2',
      title: '毕业电子相册',
      core_tech: 'Ae & Edius',
      description: '献给悄悄流逝的四年时光'
    }, {
      demo_link: 'https://zhangquan1995.github.io/ImgChange',
      img_link: 'http://i2.bvimg.com/639183/2f6a035376586a1dt.jpg',
      code_link: 'https://github.com/zhangquan1995/ImgChange',
      title: '网页轮播图',
      core_tech: 'JavaScript',
      description: '图片自动切换，按钮切换'
    }, {
      demo_link: 'https://github.com/zhangquan1995/LicensePlateRecognition',
      img_link: 'http://i1.bvimg.com/639183/3aabb548251793b9t.jpg',
      code_link: 'https://github.com/zhangquan1995/LicensePlateRecognition',
      title: 'Matlab车牌识别',
      core_tech: 'Matlab',
      description: 'License plate recognition'
    }, {
      demo_link: 'https://github.com/zhangquan1995/QQbyQt',
      img_link: 'http://i2.bvimg.com/639183/a9efb52d155fff36t.jpg',
      code_link: 'https://github.com/zhangquan1995/QQbyQt',
      title: 'QQ局域网聊天',
      core_tech: 'Qt',
      description: 'A program made with Qt'
    }, {
      demo_link: 'https://zhangquan1995.github.io/AdaptiveScreen',
      img_link: 'http://i4.bvimg.com/639183/29e89fd763c32a2ct.jpg',
      code_link: 'https://github.com/zhangquan1995/AdaptiveScreen',
      title: 'Adaptive Screen',
      core_tech: 'CSS3',
      description: 'div长宽比自适应屏幕尺寸'
    }, {
      demo_link: 'https://zhangquan1995.github.io/3DPhoto',
      img_link: 'http://i2.bvimg.com/639183/8fe4e96c26ce3425t.jpg',
      code_link: 'https://github.com/zhangquan1995/3DPhoto',
      title: '3D图像切换',
      core_tech: 'CSS3',
      description: '百度前端学院3D图像切换'
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
  // var htmlArr = [];
  // for (var i = 0; i < content.length; i++) {
  //     htmlArr.push('<div class="grid-item">')
  //     htmlArr.push('<a class="a-img" href="'+content[i].demo_link+'">')
  //     htmlArr.push('<img src="'+content[i].img_link+'">')
  //     htmlArr.push('</a>')
  //     htmlArr.push('<h3 class="demo-title">')
  //     htmlArr.push('<a href="'+content[i].demo_link+'">'+content[i].title+'</a>')
  //     htmlArr.push('</h3>')
  //     htmlArr.push('<p>Skills：'+content[i].core_tech+'</p>')
  //     htmlArr.push('<p>'+content[i].description)
  //     htmlArr.push('<a href="'+content[i].code_link+'">Code <i class="fa fa-code" aria-hidden="true"></i></a>')
  //     htmlArr.push('</p>')
  //     htmlArr.push('</div>')
  // }
  // var htmlStr = htmlArr.join('')
  var htmlStr = ''
  for (var i = 0; i < content.length; i++) {
    htmlStr += '<div class="grid-item">' + '   <a class="a-img" href="' + content[i].demo_link + '">' + '       <img src="' + content[i].img_link + '">' + '   </a>' + '   <h3 class="demo-title">' + '       <a href="' + content[i].demo_link + '">' + content[i].title + '</a>' + '   </h3>' + '   <p>Skills：' + content[i].core_tech + '</p>' + '   <p>' + content[i].description + '       <a href="' + content[i].code_link + '">Code <i class="fa fa-code" aria-hidden="true"></i></a>' + '   </p>' + '</div>'
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
