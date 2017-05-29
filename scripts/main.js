
require(["scripts/dataTrans"],function(dataTrans){

    // ----json保存的图片资源和路径相关----
    var imageDatas = dataTrans("data"),
        imagePath = "datas/imgs/";

    //------- 生成相关随机数---------
    function getRangeRandom(low,high){
        return Math.ceil(Math.random() * (high - low) + low);
    }

    function get30DegRandom(){
        return ((Math.random() > 0.5 ? "":"-") + Math.ceil(Math.random() * 30));
    }

    // -------单张图片控制器---------
    var ImgFigure = React.createClass({

        handleClick: function(event){

            if(this.props.arrange.isCenter){
                this.props.inverse();
            }else{
                this.props.center();
            }

            event.stopPropagation();
            event.preventDefault();
        },

        render: function(){

            var styleObj = {};
            //角度、旋转、z轴、翻转 样式确定：
            if(this.props.arrange.pos){
                styleObj = this.props.arrange.pos;
            }

            if(this.props.arrange.rotate){
                (["-moz-","-ms-","-webkit-",""]).forEach(function(value){
                    styleObj[value+"transform"] = "rotate(" + this.props.arrange.rotate + "deg)";
                }.bind(this));
            }

            if(this.props.arrange.isCenter){
                styleObj.zIndex = 11;
            }/*将中心图片z轴方向置于靠前的层*/

            var imgFigureClassName = "img-figure";
            imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";
            //返回模板：
            return (
                <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                    <img src={imagePath + this.props.data.filename}
                         alt={this.props.data.title}/>
                    <figcaption>
                        <h2 className="img-title">{this.props.data.title}</h2>
                        <div className="img-back" onClick={this.handleClick}>
                            <p>
                                {this.props.data.desc}
                            </p>
                        </div>
                    </figcaption>
                </figure>
            );
        }
    });
    // -------总控制器---------
    var GalleryApp = React.createClass({
// 区域范围常量保存：
        Constant: {
            centerPos: {
                left: 0,
                right: 0
            },
            hPosRange: {
                leftSecX: [0,0],
                rightSecX: [0,0],
                y: [0,0]
            },
            vPosRange: {
                x: [0,0],
                topY: [0,0]
            }
        },
// 利用闭包保存并更新图片的正反状态：
        inverse: function (index){
            return function(){
                var imgsArrangeArr = this.state.imgsArrangeArr;

                imgsArrangeArr[index].isInverse = ! imgsArrangeArr[index].isInverse;

                this.setState({
                    imgsArrangeArr: imgsArrangeArr
                });
            }.bind(this);
        },

// 对图片中心进行重定位：
        rearrange: function(centerIndex){
            var imgsArrangeArr = this.state.imgsArrangeArr,
                Constant = this.Constant,
                centerPos = Constant.centerPos,
                hPosRange = Constant.hPosRange,
                vPosRange = Constant.vPosRange,
                hPosRangeLeftSecX = hPosRange.leftSecX,
                hPosRangeRightSecX = hPosRange.rightSecX,
                hPosRangeY = hPosRange.y,
                vPosRangeTopY = vPosRange.topY,
                vPosRangeX = vPosRange.x,

                imgsArrangeTopArr = [],
                topImgNum = Math.ceil(Math.random() * 2),/*上方有1or2图片，比较好看。 */
                topImgSpliceIndex = 0,
                imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

                // 中心图片安排：
                imgsArrangeCenterArr[0] = {
                    pos: centerPos,
                    rotate: 0,
                    isCenter: true
                };

                // 上方图片安排：
                topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
                imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

                imgsArrangeTopArr.forEach(function(value,index){
                    imgsArrangeTopArr[index] = {
                        pos: {
                            left: getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
                            top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
                    
                        },
                        rotate: get30DegRandom(),
                        isCenter: false
                    };
                });
                // 左右图片安排：
                for(var i = 0,j = imgsArrangeArr.length,k = j / 2;i < j;++i){
                    var hPosRangeLORX = null;

                    if(i < k){
                        hPosRangeLORX = hPosRangeLeftSecX;
                    }else{
                        hPosRangeLORX = hPosRangeRightSecX;
                    }

                    imgsArrangeArr[i] = {
                        pos: {
                            top: getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                            left: getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                    
                        },
                        rotate: get30DegRandom(),
                        isCenter: false
                    };
                }

                if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                    imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);

                    if(imgsArrangeTopArr[1]){
                        imgsArrangeArr.splice(topImgSpliceIndex+1,0,imgsArrangeTopArr[1]);
                    }/*bug fixed& improved：上方有两张图片时的回插代码。 */
                }/*如果上方有图片，就把图片的信息插入回imgarrarr中 */

                imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

                // 触发render重新渲染：
                this.setState({
                    imgsArrangeArr: imgsArrangeArr
                });
        },
// 用于居中被点击的图片：（闭包）
        center: function(index){
            return function(){
                this.rearrange(index);
            }.bind(this);
        },
// 状态初始化：
        getInitialState: function(){
            return {
                imgsArrangeArr: [
                    // {
                    //     pos: {
                    //         left: "0",
                    //         top: "0"
                    //     },
                    //     rotate: 0,
                    //     isInverse: false,
                    //     isCenter: false
                    // }
                ]
            };
        },
// 组件加载后进行处理：（计算范围 + 调用重定位）
        componentDidMount: function(){
            var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
                stageW = stageDOM.scrollWidth,
                stageH = stageDOM.scrollHeight,
                halfStageW = Math.ceil(stageW / 2),
                halfStageH = Math.ceil(stageH / 2);

            var imgDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
                imgW = imgDOM.scrollWidth,
                imgH = imgDOM.scrollHeight,
                halfImgW = Math.ceil(imgW / 2),
                halfImgH = Math.ceil(imgH / 2);

            this.Constant.centerPos = {
                left: halfStageW - halfImgW,
                top: halfStageH - halfImgH
            };
        // 左右侧区域范围：
            this.Constant.hPosRange.leftSecX[0] = -halfImgW;
            this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
            this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
            this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
            this.Constant.hPosRange.y[0] = -halfImgH;
            this.Constant.hPosRange.y[1] = stageH - halfImgH;
        // 上侧区域范围：
            this.Constant.vPosRange.topY[0] = -halfImgH;
            this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
            this.Constant.vPosRange.x[0] = halfStageW - imgW;
            this.Constant.vPosRange.x[1] = halfStageW;
        // 调用重定位：
            this.rearrange(0);
        },

        render: function(){

            var controllerUnits = [],
                imgFigures = [];

            // 循环填充每一幅图片的信息：（资源+位置+角度）（填充在数组中）
            imageDatas.forEach(function(value,index){

                if(! this.state.imgsArrangeArr[index]){
                    this.state.imgsArrangeArr[index] = {
                        pos: {
                            left: 0,
                            top: 0
                        },
                        rotate: 0,
                        isInverse: false,
                        isCenter: false
                    };
                }/*解析：getinitialstate中只是将imgsArrangeArr出现了一下，里面没有任何结构可言；此处render时，如果发现arrangearr没有内容，就初始化一下结构和内容。*/

                imgFigures.push(<ImgFigure data={value} ref={"imgFigure"+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

            }.bind(this));

            return (
                <section className="stage" ref="stage">
                    <section className="img-sec">
                        {imgFigures}
                    </section>
                    <nav className="controller-nav">
                        {controllerUnits}
                    </nav>
                </section>
            );
        }
    });

    ReactDOM.render(
        <GalleryApp />,
        document.getElementById("outter")
    );
});