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
      demo_link: 'https://github.com/joeyos/QQ_Manager',
      img_link: '/images/demo/QQManager.jpg',
      code_link: 'https://github.com/joeyos/QQ_Manager',
      title: '腾讯电脑管家',
      core_tech: 'Qt & C++',
      description: '利用Qt制作的腾讯电脑管家界面'
    }, {
      demo_link: 'http://v.youku.com/v_show/id_XMjgyNDEwMjU0OA==.html?spm=a2h0k.8191407.0.0&from=s1.8-1-1.2',
      img_link: '/images/demo/Graduate.jpg',
      code_link: 'http://v.youku.com/v_show/id_XMjgyNDEwMjU0OA==.html?spm=a2h0k.8191407.0.0&from=s1.8-1-1.2',
      title: '毕业电子相册',
      core_tech: 'Ae & Edius',
      description: '献给悄悄流逝的大学四年时光'
    }, {
      demo_link: 'https://github.com/joeyos/LicensePlateRecognition',
      img_link: '/images/demo/LicensePlateRecognition.jpg',
      code_link: 'https://github.com/joeyos/LicensePlateRecognition',
      title: 'Matlab车牌识别',
      core_tech: 'Matlab',
      description: '用模板匹配法实现的车牌识别'
    }, {
      demo_link: 'https://github.com/joeyos/QQbyQt',
      img_link: '/images/demo/QQbyQt.jpg',
      code_link: 'https://github.com/joeyos/QQbyQt',
      title: 'QQ局域网聊天',
      core_tech: 'Qt & C++',
      description: '基于Qt实现的局域网聊天系统'
    }, {
      demo_link: 'https://github.com/joeyos/SAR-imaging',
      img_link: '/images/demo/SAR.jpg',
      code_link: 'https://github.com/joeyos/SAR-imaging',
      title: '合成孔径雷达成像',
      core_tech: 'Matlab',
      description: '几种传统雷达成像算法'
    }, {
      demo_link: 'https://joeyos.github.io/AdaptiveScreen',
      img_link: '/images/demo/AdaptiveScreen.jpg',
      code_link: 'https://github.com/joeyos/AdaptiveScreen',
      title: '网页自适应屏幕',
      core_tech: 'CSS3',
      description: '网页根据长宽比自适应屏幕尺寸'
    }, {
      demo_link: 'https://joeyos.github.io/ImgChange',
      img_link: '/images/demo/ImgChange.jpg',
      code_link: 'https://github.com/joeyos/ImgChange',
      title: '网页图片切换',
      core_tech: 'JavaScript',
      description: '图片自动切换或点击按钮切换'
    }, {
      demo_link: 'https://joeyos.github.io/3DPhoto',
      img_link: '/images/demo/3DPhoto.jpg',
      code_link: 'https://github.com/joeyos/3DPhoto',
      title: '网页三维图片切换',
      core_tech: 'CSS3',
      description: '百度前端学院三维图片切换'
    }, {
      demo_link: 'https://joeyos.github.io/AboutPage/',
      img_link: '/images/demo/AboutPage.jpg',
      code_link: 'https://github.com/joeyos/AboutPage',
      title: '网页圆角边框和阴影',
      core_tech: 'CSS3',
      description: '网页文本框设置圆角和阴影'
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
    htmlStr += '<div class="grid-item">' + '   <a target="_blank" class="a-img" href="' + content[i].demo_link + '">' + '       <img src="' + content[i].img_link + '">' + '   </a>' + '   <h3 class="demo-title">' + '       <a target="_blank" href="' + content[i].code_link + '">' + content[i].title + '</a>' + '   </h3>' + '   <p><a style="color:#4d6dad;">Skills：</a>' + content[i].core_tech + '</p>' + '   <p>' + content[i].description + '   </p>' + '</div>'
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
