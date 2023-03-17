    function handleImportFile() {
      let img = "https://img.alicdn.com/imgextra/i2/35353105/O1CN01t6ic7y1Yo8UtlM9ah_!!0-saturn_solar.jpg_468x468q75.jpg_.webp";//这里是淘宝上随便找的一张图片
    //   let _ = this
      let imgRes
      getBase64(img, (dataURL) => {
        imgRes = dataURLtoFile(dataURL,'xxx.jpg');
        console.log(imgRes)
      });
    }
    function getBase64(url, callback) {
      //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片，相比 createElement() 创建 <img> 省去了 append()，也就避免了文档冗余和污染
      var Img = new Image(),
        dataURL = "";
      Img.src = url + "?v=" + Math.random(); // 处理缓存,fix缓存bug,有缓存，浏览器会报错;
      Img.setAttribute("crossOrigin", "Anonymous"); // 解决控制台跨域报错的问题
      Img.onload = function () {
        //要先确保图片完整获取到，这是个异步事件
        var canvas = document.createElement("canvas"), //创建canvas元素
          width = Img.width, //确保canvas的尺寸和图片一样
          height = Img.height;
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
        dataURL = canvas.toDataURL("image/jpeg"); //转换图片为dataURL
        callback ? callback(dataURL) : null; //调用回调函数
      };
    }

    function dataURLtoFile(dataurl, filename) {
      //将base64转换为文件，dataurl为base64字符串，filename为文件名（必须带后缀名，如.jpg,.png）
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
}
    handleImportFile()
