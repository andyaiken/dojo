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

<Selector
    tabs={BOOLEAN}
    options={options}
    noBorder={BOOLEAN}
    selectedID={CURRENT_OPTION_ID}
    disabled={BOOLEAN}
    select={optionID => this.changeValue(SOURCEOBJECT, FIELDNAME, optionID)}
/>
*/

class Selector extends React.Component {
    render() {
        try {
            var style = (this.props.tabs) ? "selector tabs" : "selector radio";
            if (this.props.disabled) {
                style += " disabled";
            }
            if (this.props.noBorder) {
                style += " no-border";
            }

            var itemsPerRow = this.props.itemsPerRow ? this.props.itemsPerRow : this.props.options.length;
            var rowCount = Math.ceil(this.props.options.length / itemsPerRow);
            var rowContents = [];
            for (var n = 0; n !== rowCount; ++n) {
                rowContents.push([]);
            }

            this.props.options.forEach(option => {
                var index = this.props.options.indexOf(option);
                var rowIndex = Math.floor(index / itemsPerRow);
                var row = rowContents[rowIndex];
                row.push(
                    <SelectorOption
                        key={option.id}
                        option={option}
                        selected={option.id === this.props.selectedID}
                        count={itemsPerRow}
                        select={optionID => this.props.select(optionID)}
                    />
                );
            });

            var rowSections = rowContents.map(row => {
                var index = rowContents.indexOf(row);
                return <div key={index}>{row}</div>;
            });

            return (
                <div className={style}>
                    {rowSections}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}

class SelectorOption extends React.Component {
    click(e) {
        e.stopPropagation();
        if (!this.props.option.disabled) {
            this.props.select(this.props.option.id);
        }
    }

    render() {
        try {
            var width = "calc(((100% - 1px) / " + this.props.count + ") - 2px )";

            var style = "option";
            if (this.props.selected) {
                style += " selected";
            }
            if (this.props.option.disabled) {
                style += " disabled";
            }

            return (
                <div key={this.props.option.id} className={style} style={{ width: width }} title={this.props.option.text} onClick={e => this.click(e)}>
                    {this.props.option.text}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}