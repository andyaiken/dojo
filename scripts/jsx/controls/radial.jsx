/*
<Radial
    click={dir => console.log(dir)}
    inverted=BOOLEAN
    disabled-BOOLEAN
/>
*/

class Radial extends React.Component {
    click(e, dir) {
        e.stopPropagation();
        this.props.click(dir);
    }

    render() {
        try {
            var style = "radial";
            if (this.props.inverted) {
                style += " inverted";
            }
            if (this.props.disabled) {
                style += " disabled";
            }

            return (
                <div className={style}>
                    <div className="empty"></div>
                    <div className="btn n" onClick={e => this.click(e, "N")}>
                        <img src="resources/images/down-arrow-black.svg" />
                    </div>
                    <div className="empty"></div>
                    <div className="btn w" onClick={e => this.click(e, "W")}>
                        <img src="resources/images/down-arrow-black.svg" />
                    </div>
                    <div className="empty"></div>
                    <div className="btn e" onClick={e => this.click(e, "E")}>
                        <img src="resources/images/down-arrow-black.svg" />
                    </div>
                    <div className="empty"></div>
                    <div className="btn s" onClick={e => this.click(e, "S")}>
                        <img src="resources/images/down-arrow-black.svg" />
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