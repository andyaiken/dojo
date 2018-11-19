/*
var options = [
    {
        id: "one",
        text: "One",
        disabled: false
    },
    {
        id: "two",
        text: "Two",
        disabled: true
    },
    {
        id: "three",
        text: "Three",
        disabled: false
    }
];

<Dropdown
    options={options}
    placeholder={PLACEHOLDER_TEXT}
    selectedID={CURRENT_OPTION_ID}
    disabled={BOOLEAN}
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
            var style = this.props.disabled ? "dropdown disabled" : "dropdown";
            var content = [];

            var selectedText = null;
            var title = null;
            if (this.props.selectedID) {
                var option = null;
                this.props.options.forEach(o => {
                    if (o.id === this.props.selectedID) {
                        option = o;
                    }
                });

                selectedText = option.text;
                title = option.text;
            } else {
                selectedText = this.props.text || this.props.placeholder || "select...";
            }

            content.push(
                <div key="selection" className="dropdown-top" title={title}>
                    <div className="item-text">{selectedText}</div>
                    <img className={this.state.open ? "arrow open" : "arrow"} src="resources/images/down-arrow-black.svg" />
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
            var style = "dropdown-option";
            if (this.props.selected) {
                style += " selected";
            }
            if (this.props.disabled) {
                style += " disabled";
            }

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