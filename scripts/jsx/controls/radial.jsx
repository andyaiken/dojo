/*
<Radial
    direction="out" "in" "both"
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

            var showOut = (this.props.direction === "out") | (this.props.direction === "both");
            var showIn = (this.props.direction === "in") | (this.props.direction === "both");

            return (
                <div className={style}>
                    <div className="empty"></div>
                    <div className="btn">
                        <div>
                            <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(180deg)" }} onClick={e => this.click(e, "N", "out")}/>
                        </div>
                        <div>
                            <img src="resources/images/down-arrow-black.svg" style={{ display: showIn ? "inline-block" : "none" }} onClick={e => this.click(e, "N", "in")}/>
                        </div>
                    </div>
                    <div className="empty"></div>
                    <div className="btn" style={{ padding: (showIn && showOut) ? "10px 0" : "0"}}>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(90deg)" }} onClick={e => this.click(e, "W", "out")}/>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showIn ? "inline-block" : "none", transform: "rotate(-90deg)" }} onClick={e => this.click(e, "W", "in")}/>
                    </div>
                    <div className="empty"></div>
                    <div className="btn" style={{ padding: (showIn && showOut) ? "10px 0" : "0"}}>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showIn ? "inline-block" : "none", transform: "rotate(90deg)" }} onClick={e => this.click(e, "E", "in")}/>
                        <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none", transform: "rotate(-90deg)" }} onClick={e => this.click(e, "E", "out")}/>
                    </div>
                    <div className="empty"></div>
                    <div className="btn">
                        <div>
                            <img src="resources/images/down-arrow-black.svg" style={{ display: showIn ? "inline-block" : "none", transform: "rotate(180deg)" }} onClick={e => this.click(e, "S", "in")}/>
                        </div>
                        <div>
                            <img src="resources/images/down-arrow-black.svg" style={{ display: showOut ? "inline-block" : "none" }} onClick={e => this.click(e, "S", "out")}/>
                        </div>
                    </div>
                    <div className="empty"></div>
                </div>
            );

        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}