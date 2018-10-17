class DemographicsCard extends React.Component {
    constructor() {
        super();
        this.state = {
            chart: "challenge",
            chartDropdownOpen: false,
        };
    }

    selectChart(chart) {
        if (chart) {
            this.setState({
                chart: chart,
                chartDropdownOpen: false
            });
        } else {
            this.setState({
                chartDropdownOpen: !this.state.chartDropdownOpen
            });
        }
    }

    render() {
        try {
            var demographics = null;

            var allMonsters = [];
            this.props.library.forEach(group => group.monsters.forEach(monster => allMonsters.push(monster)));
            if (allMonsters.length !== 0) {
                var buckets = [];
                var maxBucketSize = 0;
                var monsters = {};

                switch (this.state.chart) {
                    case "challenge": {
                        var challenges = [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
                        challenges.forEach(cr => {
                            buckets.push({
                                value: cr,
                                title: "challenge " + challenge(cr)
                            })
                        });

                        buckets.forEach(bucket => {
                            var cr = bucket.value;
                            monsters[cr] = allMonsters.filter(monster => monster.challenge === cr);
                        });

                        buckets.forEach(bucket => {
                            var cr = bucket.value;
                            maxBucketSize = Math.max(monsters[cr].length, maxBucketSize);
                        });
                    }
                        break;
                    case "size": {
                        var sizes = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
                        sizes.forEach(size => {
                            buckets.push({
                                value: size,
                                title: size
                            })
                        });

                        buckets.forEach(bucket => {
                            var size = bucket.value;
                            monsters[size] = allMonsters.filter(monster => monster.size === size);
                        });

                        buckets.forEach(bucket => {
                            var size = bucket.value;
                            maxBucketSize = Math.max(monsters[size].length, maxBucketSize);
                        });
                    }
                        break;
                    case "type": {
                        var types = ["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"];
                        types.forEach(type => {
                            buckets.push({
                                value: type,
                                title: type
                            })
                        });

                        buckets.forEach(bucket => {
                            var type = bucket.value;
                            monsters[type] = allMonsters.filter(monster => monster.category === type);
                        });

                        buckets.forEach(bucket => {
                            var type = bucket.value;
                            maxBucketSize = Math.max(monsters[type].length, maxBucketSize);
                        });
                    }
                        break;
                }

                var bars = [];
                for (var index = 0; index != buckets.length; ++index) {
                    var bucket = buckets[index];
                    var set = monsters[bucket.value];
                    var count = set ? set.length : 0;
                    bars.push(
                        <div
                            key={bucket.title}
                            className="bar-container"
                            style={{
                                width: "calc((100% - 1px) / " + buckets.length + ")",
                                left: "calc((100% - 1px) * " + index + " / " + buckets.length + ")"
                            }}
                            title={bucket.title + ": " + set.length + " monsters"}>
                            <div
                                className="bar-space"
                                style={{
                                    height: "calc((100% - 1px) * " + (maxBucketSize - count) + " / " + maxBucketSize + ")"
                                }}>
                            </div>
                            <div
                                className="bar"
                                style={{
                                    height: "calc((100% - 1px) * " + count + " / " + maxBucketSize + ")"
                                }}>
                            </div>
                        </div>
                    );
                };

                demographics = (
                    <div>
                        <div className="section">
                            <div className="dropdown">
                                <button className="dropdown-button" onClick={() => this.selectChart()}>
                                    <div className="title">{this.state.chart}</div>
                                    <img className="image" src="content/ellipsis.svg" />
                                </button>
                                <div className={this.state.chartDropdownOpen ? "dropdown-content open" : "dropdown-content"}>
                                    <DropdownItem
                                        text={"challenge rating"}
                                        item={"challenge"}
                                        selected={this.state.chart === "challenge"}
                                        onSelect={item => this.selectChart(item)} />
                                    <DropdownItem
                                        text={"size"}
                                        item={"size"}
                                        selected={this.state.chart === "size"}
                                        onSelect={item => this.selectChart(item)} />
                                    <DropdownItem
                                        text={"type"}
                                        item={"type"}
                                        selected={this.state.chart === "type"}
                                        onSelect={item => this.selectChart(item)} />
                                </div>
                            </div>
                        </div>
                        <div className="section">
                            <div className="chart">
                                <div className="plot">{bars}</div>
                            </div>
                        </div>
                    </div>
                );
            }

            return (
                <div className="card wide">
                    <div className="heading">
                        <div className="title">demographics</div>
                        <img className="image" src="content/close-white.svg" onClick={() => this.props.close()} />
                    </div>
                    <div className="card-content">
                        {demographics}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}