<template>
<div class="yd-flexview">
    <div class="g-scrollview">
        <div class="divline"><span>发货箱数</span> <input v-model="sendbox" type="tel" name="" id=""></div>
        <div class="divline"><span>发货数量</span> <input v-model="sendqty" type="tel" name="" id=""></div>
        <div class="divline divimg">
            <span>装箱单图片</span>
            <ul v-if="isAndroid" class="checkimg">
                <li style="position: relative;">从相册选择
                    <input id="checkimg" type="file" value="" capture="filesystem" @change="selectImg">
                </li>
                <li style="position: relative;">拍照
                    <input id="checkimg" type="file" value="" accept="image/*" capture="filesystem"  @change="selectImg">
                </li>
            </ul>
            <ul v-if="isIOS" class="checkimg">
                <li style="position: relative;">选择图片sss
                    <input id="checkimg" type="file" value=""  @change="selectImg">
                </li>
            </ul>
                <canvas id="myCanvas" style="display: none"></canvas>
                <img id="img" :src="img" alt="">
                <div class="imgclose" v-if="isShowImgCloseBtn" @click="deleteImg">
                    <span>-</span>
                </div>
            
        </div>
      </div>
      <div class="m-button">
          <span class="m-but-master" @click="submit">提交</span>
      </div>
      <foot :idx = '4'></foot>
</div>
</template>
<script>
import './exif.js'
export default {
  data(){
      return{
          dtldata:{},//链接中参数的 对象集合
          type:'',//类型
          id:'',//发货记录表ID，新增时可为空 
          dtlid:'',//明细ID  列表中的id 变成明细id ，新的id是生成的。
          mainid:'',//主表ID  
          img:'',//图片 只用于展示
          sendbox:'',//发货箱数
          sendqty:'',//发货数量
          isUpload:false,//是否上传 了图片
          uploadImgurl:'',//上传后 图片的路径
          packImgUrl:'',//装箱图片
          orderno:'',//主订单号
          picValue:'',headerImage:'',extname:'',//上传相关
          isShowImgCloseBtn:false,//是否显示 删除图片按钮
          isIOS:false,
          isAndroid:false
      }
  },
  mounted(){
    this.dtldata = this.$route.query;
    console.log(this.dtldata)
    this.orderno = this.dtldata.orderno;
    this.packImgUrl = this.dtldata.packingpic2;//
    if(this.dtldata.type =='add'){
        this.type = this.dtldata.type;
        this.id= '';
        this.dtlid = this.dtldata.id;
        this.mainid = this.dtldata.mainid;
        this.img = '';
        this.sendbox = '';
        this.sendqty = '';
    }else{
        this.type = this.dtldata.type;
        this.id= this.dtldata.id;
        this.dtlid = this.dtldata.dtlid;
        this.mainid = this.dtldata.mainid;
        this.img = this.dtldata.imgurl;
        this.sendbox = this.dtldata.sendbox;
        this.sendqty = this.dtldata.sendqty;
    }
   
    //区分 手机系统 
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
    var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
       this.isAndroid = true;
    }
    if (isIOS) {
　　　　this.isIOS = true;
    }
    console.log(this.isIOS)
  },
  methods:{
    submit:function(){
        var _this = this;
        var vBiz = new D.FYBusiness("DOCUMENTARYTRACKINGSENDSAVE");
        var vOpr1 = vBiz.addCreateService("DOCUMENTARYTRACKINGSENDSAVE", false);
        var vOpr1Data = vOpr1.addCreateData();
        vOpr1Data.setValue("AS_USER_ID", localStorage.loginname);
        vOpr1Data.setValue("AS_DEPT_ID", '');
        vOpr1Data.setValue("AS_FUNC_NAME", "DOCUMENTARYTRACKINGSENDSAVE");
        vOpr1Data.setValue("AS_OPRFLAG",_this.type );//add-新增，update-编辑
        vOpr1Data.setValue("AS_ID", _this.id);//发货记录表ID，新增时可为空
        vOpr1Data.setValue("AS_DTLID",_this.dtlid );//明细ID
        vOpr1Data.setValue("AS_MAINID",_this.mainid );//主表ID
        vOpr1Data.setValue("AS_PACKINGPIC",_this.packImgUrl );//装箱单图片
        vOpr1Data.setValue("AS_SENDBOX",_this.sendbox );//发货箱数
        vOpr1Data.setValue("AS_SENDQTY",_this.sendqty );//发货数量
        vOpr1Data.setValue("AS_REMARK",'' );//备注 as_picurl
        vOpr1Data.setValue("AS_PICURL",_this.uploadImgurl );//本地应用服务器文件路径
        var ip = new D.InvokeProc();
        ip.addBusiness(vBiz);
        console.log(JSON.stringify(ip))
        ip.invoke(function(d){
            if ((d.iswholeSuccess == "Y" || d.isAllBussSuccess == "Y")) {
                // todo...
                console.log('成');
                _this.ydui.alert({
                    mes:"保存成功",
                    callback:()=>{
                        console.log(_this.dtldata)
                        if(_this.type =='add'){
                            //window.location.reload();
                            _this.$router.go(-1) 
                        }else{
                            _this.$router.go(-1) 
                        }
                        //_this.sets()
                        //_this.$router.go(-1)
                        //window.location.reload();
                    }
                })
            } else {
                console.log(d.errorMessage);
                _this.ydui.alert({
                mes:d.errorMessage
                });
            }
        })
      },
      sets:function(){
          this.$set(this.dtldata,'sendbox','24')
      },
    upload (e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) return;
        this.picValue = files[0];
        this.imgPreview(this.picValue);
        this.extname = this.picValue.name.split('.')[1]
        console.log(this.picValue)
        console.log(this.extname)
        this.isShowImgCloseBtn = true;
    },
    deleteImg:function(){
        $('#img').attr('src','');
        this.isShowImgCloseBtn = false;
        this.uploadImgurl= '';
    },
    imgPreview (file) {
        //图片读取
        let self = this;
        let Orientation;
        //去获取拍照时的信息，解决拍出来的照片旋转问题
        EXIF.getData(file, function(){
            Orientation = EXIF.getTag(this, 'Orientation');
            alert('旋转角度：'+Orientation)
        });
        // 看支持不支持FileReader
        if (!file || !window.FileReader) return;

        if (/^image/.test(file.type)) {
            // 创建一个reader
            let reader = new FileReader();
            // 将图片2将转成 base64 格式
            reader.readAsDataURL(file);
            // 读取成功后的回调
            reader.onloadend = function () {
                let result = this.result;
                let img = new Image();
                img.src = result;
                //console.log(result)
                $('#img').attr('src',result);
                //判断图片是否大于100K,是就直接上传，反之压缩图片
                if (this.result.length <= (100 * 1024)) {
                self.headerImage = this.result;
                self.postImg();
                }else {
                img.onload = function () {
                    let data = self.compress(img,Orientation);//压缩图片
                    self.headerImage = data;
                    self.postImg();
                }
                }
            }
            }
      },
      postImg () {
        //上传
        let _this = this;
        let img = this.imgname();
        let formData = new FormData();
        formData.append("src",$('#img').attr('src'));
        //alert($('#img').attr('src'))
        _this.ydui.loading.open('图片上传中');
        //console.log(formData.get("src"))
        $.ajax({
            //url:'http://192.168.20.102:8083/FY_APP_SVR/servlet/Base64FtpUploadPic?childpath=kuaifan/SendPic/C3CD53D038900/688638F231303965E0534414A8C07BA5/wfy&filename=111&extname=jpg',
            url: basicUrl._wfy_mobile_api_upload_url+"?childpath=kuaifan/SendPic/"+this.mainid+'/'+this.dtlid+"/"+localStorage.loginname+"&filename="+img+ "&extname="+_this.extname,
            type: "POST",
            data: formData,
            processData: false,  // 告诉jQuery不要去处理发送的数据
            contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
            success: function(xhr){
                console.log('上传成');
                var url = xhr.split('#@#@')[1];
                _this.packImgUrl = "kuaifan/SendPic/"+_this.mainid+'/'+_this.dtlid+"/"+localStorage.loginname+"/"+img+'.'+_this.extname;
                _this.uploadImgurl = xhr.split('#@#@')[1];
                _this.ydui.loading.close();
                console.log(_this.packImgUrl);
                console.log(url);
            },
            error:function(e){
                _this.ydui.loading.close();
                _this.ydui.alert({
                    mes:'上传失败'
                    });
                console.log(e)
            }
        });
      },
      imgname:function(){
           //生成 图片的名字
           let time = new Date();
           let name = 'upload'+time.getTime();
           return name;
      },
      rotateImg (img, direction,canvas) {
        //最小与最大旋转方向，图片旋转4次后回到原方向
        const min_step = 0;
        const max_step = 3;
        if (img == null)return;
        //img的高度和宽度不能在img元素隐藏后获取，否则会出错
        let height = img.height;
        let width = img.width;
        let step = 2;
        if (step == null) {
            step = min_step;
        }
        if (direction == 'right') {
            step++;
            //旋转到原位置，即超过最大值
            step > max_step && (step = min_step);
        } else {
            step--;
            step < min_step && (step = max_step);
        }
        //旋转角度以弧度值为参数
        let degree = step * 90 * Math.PI / 180;
        let ctx = canvas.getContext('2d');
        switch (step) {
          case 0:
              canvas.width = width;
              canvas.height = height;
              ctx.drawImage(img, 0, 0);
              break;
          case 1:
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(degree);
              ctx.drawImage(img, 0, -height);
              break;
          case 2:
              canvas.width = width;
              canvas.height = height;
              ctx.rotate(degree);
              ctx.drawImage(img, -width, -height);
              break;
          case 3:
              canvas.width = height;
              canvas.height = width;
              ctx.rotate(degree);
              ctx.drawImage(img, -width, 0);
              break;
        }
    },
    compress(img,Orientation) {
        //压缩
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext('2d');
        //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = width * height / 4000000) > 1) {
        console.log("大于400万像素")
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
     //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = width * height / 1000000) > 1) {
        console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
     //            计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //修复ios上传图片的时候 被旋转的问题
      if(Orientation != "" && Orientation != 1){
        switch(Orientation){
          case 6://需要顺时针（向左）90度旋转
              this.rotateImg(img,'left',canvas);
              break;
          case 8://需要逆时针（向右）90度旋转
              this.rotateImg(img,'right',canvas);
              break;
          case 3://需要180度旋转
              this.rotateImg(img,'right',canvas);//转两次
              this.rotateImg(img,'right',canvas);
              break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1);
      console.log('压缩前：' + initSize);
      console.log('压缩后：' + ndata.length);
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    //上面的 从 upload 开始是网上一搜就出现的 案例 ，卧槽 实测在手机上 不压缩，而且 导入 exif的方式都是报错，最终还是回到原先的代码，
    //将 exif 绑在window对象上 ，用原先的代码 处理~~ 用过多次 靠谱~~
    selectImg:function(e){
        let _this = this;
        let files = e.target.files || e.dataTransfer.files;
        let file = files[0]
        console.log(file)
        _this.extname = file.name.split('.')[1]
        console.log(_this.extname)
        _this.isShowImgCloseBtn = true;
        var Orientation = null;
        if (file) {
            var rFilter = /^(image\/jpeg|image\/png)$/i; // 检查图片格式
            console.log(file.type)
            if (!rFilter.test(file.type)) {
                alert("请选择jpeg、png格式的图片");
                return;
            }
            //获取照片方向角属性，用户旋转控制
            EXIF.getData(file, function() {
                EXIF.getAllTags(this);
                Orientation = EXIF.getTag(this, 'Orientation');
                console.log('角度'+Orientation)
            });
            var oReader = new FileReader();
            oReader.onload = function(e) {
                var image = new Image();
                image.src = e.target.result;
                image.onload = function() {
                    var expectWidth = this.naturalWidth;
                    var expectHeight = this.naturalHeight;
                    var calc = expectWidth / expectHeight;
                    var canvas = document.getElementById('myCanvas');
                    var ctx = canvas.getContext("2d");
                    canvas.width = 600;
                    canvas.height = (canvas.width)/calc;
                    console.log('canvas数据'+canvas.width)
                    var base64 = null;
                    //修复ios
                    if (Orientation == 6) {
                        //alert('需要顺时针（向左）90度旋转');
                        ctx.save(); //保存状态
                        ctx.translate(canvas.width/2, canvas.height/2); //设置画布上的(0,0)位置，也就是旋转的中心点
                        ctx.rotate(90 * Math.PI / 180); //把画布旋转90度
                        // 执行Canvas的drawImage语句
                        ctx.drawImage(image, -(canvas.width/2), -(canvas.height/2), canvas.width, canvas.height); //把图片绘制在画布translate之前的中心点，
                        ctx.restore(); //恢复状态
                    }else {
                        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    }
                    base64 = canvas.toDataURL("image/jpeg", 0.92);
                    $("#img").attr("src", base64);
                    _this.postImg()
                };
            };
            oReader.readAsDataURL(file);
        }
    },

    }
}
</script>

