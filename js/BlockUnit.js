(function(){
    //组合体的构造函数，组合体就是4 * 4
    //为了设计方便，我们物理上是20行12列，
    //我们把地图设计为逻辑上22行，16列。也就是说给物理画布左侧加2列，右侧加2列，底部加2行。
    //row的合法值是0~21
    //col的合法值是-2~13
    //shape的合法值是0~6
    var BlockUnit = window.BlockUnit = function(row,col,shape,direction){
        this.row = row;
        this.col = col;
        //自己的形状
        this.shape = shape != undefined ? shape : _.random(0,6);
        //自己的所有可能地图形态，是一个数组,形如[0x4460,0x0e80,0xc440,0x2e00]
        this.shapeCodes = shapeCodes[this.shape];
        //可能的方向总数
        this.directionAmount = this.shapeCodes.length;
        //自己的方向，我们要随机生成一个
        this.direction = direction != undefined ? direction : _.random(0,this.directionAmount - 1);
        //自己此时的地图形态
        this.shapeCode = this.shapeCodes[this.direction];
        //自己的砖块，这个数组里面存放着block对象
        this.blocksArray = [];
        //遍历自己的shapeCode，new出来相应的block，放入自己的blocksArray
        for(var i = 0; i < 4; i++){
            var r = this.shapeCode >> (3 - i) * 4 & 0xf;
            for(var j = 0; j < 4; j++){
                var char = r >> (3 - j) & 0x1;
                //成功拿到第i行第j列的情形（要么是0要么是1）
                if(char){
                    //根据自己的shapeCode来改变自己的数组
                    var b = new Block(this.row + i , this.col + j , this.shape);
                    //给这个b补属性，i表示相对于组合体自己的row，0~3
                    //给这个b补属性，j表示相对于组合体自己的col，0~3
                    b.i = i;
                    b.j = j;
                    this.blocksArray.push(b);
                }
            }
        }

    }
     BlockUnit.prototype.changeDirection = function(){
        var direction = this.direction + 1;
        if(direction > this.directionAmount - 1){
            direction = 0;
        }

        var themapcode = shapeCodes[this.shape][direction];
        var mapcode = g.map.code;
        for(var i = 0; i <= 3 ; i++){
            //地图的那一行
            var r = mapcode[this.row + i];
            //地图的那一行4个0或1
            var mapchar = r >> (10 - this.col) & 0xf;
            //这个块的char
            var thischar = themapcode >> (3 - i) * 4 & 0xf;
            //4个位和4个位进行比较，如果比出来不是0，就是冲突，不能移动了
            if((mapchar & thischar) != 0){
                //下落不了，把组合体的小砖块交给地图
                return false;
            }
        }

        //重新new一个新的组合体出来
        g.blockunit = new BlockUnit(this.row , this.col , this.shape , direction);
     }

      BlockUnit.prototype.canMove = function(row,col){
        if(col > 10 || col < -2){
            return false;
        }
        //测试自己能否到一个地方
        var mapcode = g.map.code;
        for(var i = 0; i <= 3 ; i++){
            //地图的那一行
            var r = mapcode[row + i];
            //地图的那一行4个0或1
            var mapchar = r >> (10 - col) & 0xf;
            //这个块的char
            var thischar = this.shapeCode >> (3 - i) * 4 & 0xf;
            //4个位和4个位进行比较，如果比出来不是0，就是冲突，不能移动了
            if((mapchar & thischar) != 0){
                //下落不了，把组合体的小砖块交给地图
                return false;
            }
        }
        return true;
      }

    //将这个组合体移动到一个位置
    //row的合法值是0~22
    //col的合法值是-2~13
    BlockUnit.prototype.moveTo = function(row,col){
        this.row = row;
        this.col = col;
        //blocksArray里面的数组都需要移动
        _.each(this.blocksArray,function(block){
            block.row = row + block.i;
            block.col = col + block.j;
        })
    }
    //渲染
    BlockUnit.prototype.render = function(){
        _.each(this.blocksArray,function(block){
            block.render();
        })
    }

    var shapeCodes = [
        [0x0660],
        [0x4460,0x0e80,0xc440,0x2e00],
        [0x44c0,0x8e00,0x6440,0x0e20],
        [0xc600,0x2640],
        [0x4620,0x6c00],
        [0xe400,0x4c40,0x4e00,0x4640],
        [0x4444,0x0f00]
    ]
})();