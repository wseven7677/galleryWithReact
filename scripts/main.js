// console.log("main.js is ok.");
(function(){
    var GalleryApp = React.createClass({
        render: function(){
            return (
                <section className="stage">
                    <section className="img-src"></section>
                    <nav className="controller-nav"></nav>
                </section>
            );
        }
    });

    ReactDOM.render(
        <GalleryApp />,
        document.getElementById("outter")
    );
})();