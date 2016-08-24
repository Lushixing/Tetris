(function(){
    //地图类，构造函数
    var Map = window.Map = function(){
        //地图的码。只有0、1。无论这个方块是什么颜色，都是0、1
        this.code = [
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xc003,
            0xffff,
            0xffff,
            0xffff,
            0xffff
        ];
        //地图持有的砖块block，这个block的颜色是color
        //这里给的数据主要是为了测试
        this.blocksArray = [];

        // for(var r = 17; r <= 19; r++){
        //     for(var c = 0; c <= 11; c++){
        //         if(c == 8){
        //             continue;
        //         }
        //         this.blocksArray.push(new Block(r , c ,1));
        //     }
        // }

        // this.blocksArray.push(new Block(16,10,1));
    }

    // 渲染
    Map.prototype.render = function(){
        _.each(this.blocksArray,function(block){
            block.render();
        })
    }

    //消行判定
    Map.prototype.check = function(){
        //记录下来慢行的行号
        var full = [];
        //遍历自己的code，看看有没有0xffff，如果有那么删除这一行，头部插一行
        for(var r = 0; r <= 19; r++){
            if(this.code[r] == 0xffff){
                full.push(r);
            }
        }

        //备份this
        var self = this;

        //遍历full数组
        for(var i = 0; i < full.length; i++){
            //删除这一项
            this.code.splice(full[i],1);
            //顶部加一项
            this.code.unshift(0xc003);

            //消除方块
            _.each(this.blocksArray,function(block){
                if(block.row == full[i]){
                    self.blocksArray = _.without(self.blocksArray , block);
                }else if(block.row < full[i]){
                    block.row++;
                }
            })
        }

         //加分逻辑
        switch (full.length){
            case 1 :
                g.score += 1;
                break;
            case 2 :
                g.score += 3;
                break;
            case 3 :
                g.score += 5;
                break;
            case 4 :
                g.score += 8;
                break;
            case 5 :
                g.score += 12;
                break;
        }
        
    }

   
    
})();