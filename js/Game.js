(function(){
    var Game = window.Game = function(){
        //得到画布，上下文
        this.canvas = document.getElementsByTagName("canvas")[0];
        this.ctx = this.canvas.getContext("2d");

        //帧编号
        this.frameNumber = 0;
        //分数
        this.score = 0;
        //时间
        this.during = 0;
        //等级
        this.level = 0;

        //加载图片
        this.blockPic = new Image();
        this.blockPic.src = "images/block.png";
        //数字图片
        this.numberPicArr = [];
        for(var i = 0 ; i <= 9 ; i++){
            var image = new Image();
            image.src = "images/number_score_0"+  i +".png";
            this.numberPicArr.push(image);
        }

        //备份this
        var self = this;
        //所有的图片数组
        var images = [this.blockPic].concat(this.numberPicArr);
        var count = 0;  //已经加载好的图片个数
        for(var i = 0; i < images.length; i++){
            images[i].onload = function(){
                count++;
                if(count == images.length){
                    self.init();
                    self.start();
                }
            }
        } 
    
    }

     Game.prototype.init = function(){
        //自己的地图
        this.map = new Map();
        //自己的活动体
        this.blockunit = new BlockUnit(3,6);

        //备份this
        var self = this;

        //监听
        document.onkeydown = function(event){
            //左上右下：37,38,39,40
            switch (event.keyCode){
                case 37:
                    var cc = self.blockunit.col - 1;
                    if(self.blockunit.canMove(self.blockunit.row , cc)){
                        self.blockunit.moveTo(self.blockunit.row , --self.blockunit.col);
                    }
                    break;
                case 39:
                    var cc = self.blockunit.col + 1;
                    if(self.blockunit.canMove(self.blockunit.row , cc)){
                        self.blockunit.moveTo(self.blockunit.row , ++self.blockunit.col);
                    }
                    break;
                case 38:
                    self.blockunit.changeDirection();
                    break;
                case 40:
                    // self.goDown();
                    while(self.goDown()){

                    }
                    break;
            }
        }
     }

    //主循环
    Game.prototype.mainloop = function(){
        //擦除画布
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        //帧编号++
        this.frameNumber++;
        //打印帧编号
        this.ctx.fillText(this.frameNumber, 10,10);

        //渲染组合体
        this.blockunit.render();

        //间隔时间
        var jiange = (50 - this.level * 10);
        if(jiange < 10){
            jiange = 10;
        }
        //下落逻辑：
        if(this.frameNumber % jiange == 0){
            this.goDown();
        }

        //地图渲染
        this.map.render();

        //渲染分数
        this.drawNumber(this.score , 300, 40);
        //时间没秒更新
        if(this.frameNumber % 80 == 0){
           this.during++;
        }
        //渲染时间
        this.drawNumber(this.during , 300, 130);

        //每帧判断当前是多少等级
        this.level = parseInt(this.score / 6);
        //渲染等级
        this.drawNumber(this.level , 300, 230);
    }

    Game.prototype.goDown = function(){
        var rr = this.blockunit.row + 1;
        //先来判断是不是能下落
        var yesorno = this.blockunit.canMove(rr , this.blockunit.col);
        if(!yesorno){
            console.log("不能下落了");
            //这里是不能下落之后做的事情
            //1.把blockunit持有的blocksArray变为map.blocksArray。活砖块要变为死砖块
            this.map.blocksArray =  this.map.blocksArray.concat( this.blockunit.blocksArray);
            //2.改变map的code
            for(var r = 0; r <= 3; r++){
                var themapcode = this.map.code[this.blockunit.row + r];
                var theblockunit = (this.blockunit.shapeCode >> (4 * (3 - r))) & 0xf;
                //然后再进行计算
                this.map.code[this.blockunit.row + r] = themapcode | (theblockunit << (10 - this.blockunit.col));
            }
            //3.new一个新砖块
            this.blockunit = new BlockUnit(0,4);

            //测试能不能new出来，如果不能就死了
            if(!this.blockunit.canMove(0,4)){
                alert("游戏结束!!!")
                clearInterval(g.timer);
            }
            //4.消行判定
            this.map.check();
        }else{
            this.blockunit.row  = this.blockunit.row + 1;
            this.blockunit.moveTo(rr , this.blockunit.col);
        }

        return yesorno;
    }

    //开始游戏
    Game.prototype.start = function(){
        //备份this
        var self = this;
        this.timer = setInterval(function(){
            self.mainloop();
        },20)
    }

    //渲染数字
    Game.prototype.drawNumber = function(number,x,y){
        for(var i = 0; i < number.toString().length; i++){
            this.ctx.drawImage(this.numberPicArr[parseInt(number.toString().charAt(i))] , x + 14 * i , y);
        }
    }
})();