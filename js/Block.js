(function(){
    //砖块类
    //row的合法值是0-19
    //col的合法值是0-11
    //color的合法值是0-6
    var Block = window.Block = function(row,col,color){
        this.row = row;
        this.col = col;
        this.color = color;
        //这个图片
        this.pic = g.blockPic;
    }

    //渲染
    Block.prototype.render = function(){
        g.ctx.drawImage(this.pic , 122 * this.color , 0 , 122 , 122 , 25 * this.col , 25 * this.row , 25 , 25);
    }
})();