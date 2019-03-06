/*
<Radial
    direction="out" "in" "both" "eight"
    disabled=BOOLEAN
    click={(dir, in|out => null}
/>
*/

class Radial extends React.Component {
    click(e, dir, dir2) {
        e.stopPropagation();
        this.props.click(dir, dir2);
    }

    render() {
        try {
            var style = "radial "+ (this.props.direction || "out");
            if (this.props.disabled) {
                style += " disabled";
            }

            var showOut = (this.props.direction === "out") | (this.props.direction === "both") | (this.props.direction === "eight");
            var showIn = (this.props.direction === "in") | (this.props.direction === "both");
            var showDiag = (this.props.direction === "eight");

            return (
                <div className={style}>
                    <div className="empty" style={{ display: showDiag ? "none" : "inline-block" }}></div>
                    <div className="btn diag" style={{ display: showDiag ? "inline-block" : "none" }}>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(135deg)" }} onClick={e => this.click(e, "NW")}/>
                    </div>
                    <div className="btn">
                        <div>
                            <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(180deg)" }} onClick={e => this.click(e, "N", "out")}/>
                        </div>
                        <div>
                            <img src="resources/images/down-arrow-black.svg" style={{ display: showIn ? "inline-block" : "none" }} onClick={e => this.click(e, "N", "in")}/>
                        </div>
                    </div>
                    <div className="empty" style={{ display: showDiag ? "none" : "inline-block" }}></div>
                    <div className="btn diag" style={{ display: showDiag ? "inline-block" : "none" }}>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(-135deg)" }} onClick={e => this.click(e, "NE")}/>
                    </div>
                    <div className="btn" style={{ padding: (showIn && showOut) ? "10px 0" : "0"}}>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(90deg)" }} onClick={e => this.click(e, "W", "out")}/>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showIn ? "inline-block" : "none", transform: "rotate(-90deg)" }} onClick={e => this.click(e, "W", "in")}/>
                    </div>
                    <div className="empty"></div>
                    <div className="btn" style={{ padding: (showIn && showOut) ? "10px 0" : "0"}}>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showIn ? "inline-block" : "none", transform: "rotate(90deg)" }} onClick={e => this.click(e, "E", "in")}/>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(-90deg)" }} onClick={e => this.click(e, "E", "out")}/>
                    </div>
                    <div className="empty" style={{ display: showDiag ? "none" : "inline-block" }}></div>
                    <div className="btn diag" style={{ display: showDiag ? "inline-block" : "none" }}>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(45deg)" }} onClick={e => this.click(e, "SW")}/>
                    </div>
                    <div className="btn">
                        <div>
                            <img src="resources/images/down-arrow-black.svg" style={{ display: showIn ? "inline-block" : "none", transform: "rotate(180deg)" }} onClick={e => this.click(e, "S", "in")}/>
                        </div>
                        <div>
                            <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none" }} onClick={e => this.click(e, "S", "out")}/>
                        </div>
                    </div>
                    <div className="empty" style={{ display: showDiag ? "none" : "inline-block" }}></div>
                    <div className="btn diag" style={{ display: showDiag ? "inline-block" : "none" }}>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(-45deg)" }} onClick={e => this.click(e, "SE")}/>
                    </div>
                </div>
            );

        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}