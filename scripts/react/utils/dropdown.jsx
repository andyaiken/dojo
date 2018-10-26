/*
var options = [
    {
        id: "total",
        text: "Total wealth"
    },
    {
        id: "purse",
        text: "Purse"
    }
];

<Dropdown
    options={options}
    selectedID={CURRENT_OPTION_ID}
    select={optionID => this.changeValue(SOURCEOBJECT, FIELDNAME, optionID)}
/>
*/

class Dropdown extends React.Component {
    constructor() {
        super();

        this.state = {
            open: false
        };
    }

    toggleOpen(e) {
        e.stopPropagation();
        this.setState({
            open: !this.state.open
        });
    }

    select(optionID) {
        this.setState({
            open: false
        });
        this.props.select(optionID);
    }

    render() {
        try {
            var style = "dropdown";
            var content = [];

            var selectedText = null;
            var selectedTextStyle = null;
            var title = null;
            if (this.props.selectedID) {
                var option = null;
                this.props.options.forEach(o => {
                    if (o.id === this.props.selectedID) {
                        option = o;
                    }
                });

                selectedText = option.text;
                selectedTextStyle = "dropdown-selection";
                title = option.text;
            } else {
                selectedText = this.props.text ? this.props.text : "Select...";
                selectedTextStyle = "dropdown-placeholder";
            }

            content.push(
                <div key="selection" className={selectedTextStyle} title={title}>
                    <div className="item-text">{selectedText}</div>
                    <img className={this.state.open ? "arrow open" : "arrow"} src="content/down-arrow-black.svg" />
                </div>
            );

            if (this.state.open) {
                style += " open";

                var items = this.props.options.map(option => {
                    return (
                        <DropdownOption
                            key={option.id}
                            option={option}
                            selected={option.id === this.props.selectedID}
                            select={optionID => this.select(optionID)}
                        />
                    );
                });

                //content.push(<hr key="divider" />);
                content.push(
                    <div key="options" className="dropdown-options">
                        {items}
                    </div>
                );
            }

            return (
                <div className={style} onClick={e => this.toggleOpen(e)}>
                    {content}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}

class DropdownOption extends React.Component {
    click(e) {
        e.stopPropagation();
        this.props.select(this.props.option.id);
    }

    render() {
        try {
            var style = this.props.selected ? "dropdown-option selected" : "dropdown-option";

            return (
                <div className={style} title={this.props.option.text} onClick={e => this.click(e)}>
                    {this.props.option.text}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}