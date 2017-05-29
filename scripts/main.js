// console.log("main.js is ok.");
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
        render: function(){

            var styleObj = {};

            if(this.props.arrange.pos){
                styleObj = this.props.arrange.pos;
            }

            if(this.props.arrange.rotate){
                (["-moz-","-ms-","-webkit-",""]).forEach(function(value){
                    styleObj[value+"transform"] = "rotate(" + this.props.arrange.rotate + "deg)";
                }.bind(this));
            }

            return (
                <figure className="img-figure" style={styleObj}>
                    <img src={imagePath + this.props.data.filename}
                         alt={this.props.data.title}/>
                    <figcaption>
                        <h2 className="img-title">{this.props.data.title}</h2>
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
                topImgNum = Math.ceil(Math.random() * 2),
                topImgSpliceIndex = 0,
                // 中心图片安排：
                imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

                imgsArrangeCenterArr[0].pos = centerPos;

                imgsArrangeCenterArr[0].rotate = 0;

                // 上方图片安排：
                topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
                imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
                
                imgsArrangeTopArr.forEach(function(value,index){
                    imgsArrangeTopArr[index] = {
                        pos: {
                            left: getRangeRandom(vPosRangeX[0],vPosRangeX[1]),
                            top: getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1])
                    
                        },
                        rotate: get30DegRandom()
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
                        rotate: get30DegRandom()
                    };
                }

                if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
                    imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
                }

                imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

                // 触发render重新渲染：
                this.setState({
                    imgsArrangeArr: imgsArrangeArr
                });
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
                    //     isInverse: false
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
                        isInverse: false
                    };
                }/*解析：getinitialstate中只是将imgsArrangeArr出现了一下，里面没有任何结构可言；此处render时，如果发现arrangearr没有内容，就初始化一下结构和内容。*/

                imgFigures.push(<ImgFigure data={value} ref={"imgFigure"+index} arrange={this.state.imgsArrangeArr[index]}/>);

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