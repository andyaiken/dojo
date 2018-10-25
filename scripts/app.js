"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CombatManagerCard = function (_React$Component) {
    _inherits(CombatManagerCard, _React$Component);

    function CombatManagerCard() {
        _classCallCheck(this, CombatManagerCard);

        return _possibleConstructorReturn(this, (CombatManagerCard.__proto__ || Object.getPrototypeOf(CombatManagerCard)).apply(this, arguments));
    }

    _createClass(CombatManagerCard, [{
        key: "render",
        value: function render() {
            try {
                var content = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "section" },
                        "here you can run combat by specifying a party and an encounter"
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "below you will see a list of encounters that you have paused"
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "you can resume a paused combat by pressing it"
                    )
                );

                return React.createElement(InfoCard, { centered: true, getContent: function getContent() {
                        return content;
                    } });
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return CombatManagerCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DemographicsCard = function (_React$Component) {
    _inherits(DemographicsCard, _React$Component);

    function DemographicsCard() {
        _classCallCheck(this, DemographicsCard);

        var _this = _possibleConstructorReturn(this, (DemographicsCard.__proto__ || Object.getPrototypeOf(DemographicsCard)).call(this));

        _this.state = {
            chart: "challenge",
            chartDropdownOpen: false
        };
        return _this;
    }

    _createClass(DemographicsCard, [{
        key: "selectChart",
        value: function selectChart(chart) {
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
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var demographics = null;

                var allMonsters = [];
                this.props.library.forEach(function (group) {
                    return group.monsters.forEach(function (monster) {
                        return allMonsters.push(monster);
                    });
                });
                if (allMonsters.length !== 0) {
                    var buckets = [];
                    var maxBucketSize = 0;
                    var monsters = {};

                    switch (this.state.chart) {
                        case "challenge":
                            {
                                var challenges = [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
                                challenges.forEach(function (cr) {
                                    buckets.push({
                                        value: cr,
                                        title: "challenge " + challenge(cr)
                                    });
                                });

                                buckets.forEach(function (bucket) {
                                    var cr = bucket.value;
                                    monsters[cr] = allMonsters.filter(function (monster) {
                                        return monster.challenge === cr;
                                    });
                                });

                                buckets.forEach(function (bucket) {
                                    var cr = bucket.value;
                                    maxBucketSize = Math.max(monsters[cr].length, maxBucketSize);
                                });
                            }
                            break;
                        case "size":
                            {
                                var sizes = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
                                sizes.forEach(function (size) {
                                    buckets.push({
                                        value: size,
                                        title: size
                                    });
                                });

                                buckets.forEach(function (bucket) {
                                    var size = bucket.value;
                                    monsters[size] = allMonsters.filter(function (monster) {
                                        return monster.size === size;
                                    });
                                });

                                buckets.forEach(function (bucket) {
                                    var size = bucket.value;
                                    maxBucketSize = Math.max(monsters[size].length, maxBucketSize);
                                });
                            }
                            break;
                        case "type":
                            {
                                var types = ["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"];
                                types.forEach(function (type) {
                                    buckets.push({
                                        value: type,
                                        title: type
                                    });
                                });

                                buckets.forEach(function (bucket) {
                                    var type = bucket.value;
                                    monsters[type] = allMonsters.filter(function (monster) {
                                        return monster.category === type;
                                    });
                                });

                                buckets.forEach(function (bucket) {
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
                        bars.push(React.createElement(
                            "div",
                            {
                                key: bucket.title,
                                className: "bar-container",
                                style: {
                                    width: "calc((100% - 1px) / " + buckets.length + ")",
                                    left: "calc((100% - 1px) * " + index + " / " + buckets.length + ")"
                                },
                                title: bucket.title + ": " + set.length + " monsters" },
                            React.createElement("div", {
                                className: "bar-space",
                                style: {
                                    height: "calc((100% - 1px) * " + (maxBucketSize - count) + " / " + maxBucketSize + ")"
                                } }),
                            React.createElement("div", {
                                className: "bar",
                                style: {
                                    height: "calc((100% - 1px) * " + count + " / " + maxBucketSize + ")"
                                } })
                        ));
                    };

                    demographics = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "dropdown" },
                                React.createElement(
                                    "button",
                                    { className: "dropdown-button", onClick: function onClick() {
                                            return _this2.selectChart();
                                        } },
                                    React.createElement(
                                        "div",
                                        { className: "title" },
                                        this.state.chart
                                    ),
                                    React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: this.state.chartDropdownOpen ? "dropdown-content open" : "dropdown-content" },
                                    React.createElement(DropdownItem, {
                                        text: "challenge rating",
                                        item: "challenge",
                                        selected: this.state.chart === "challenge",
                                        onSelect: function onSelect(item) {
                                            return _this2.selectChart(item);
                                        } }),
                                    React.createElement(DropdownItem, {
                                        text: "size",
                                        item: "size",
                                        selected: this.state.chart === "size",
                                        onSelect: function onSelect(item) {
                                            return _this2.selectChart(item);
                                        } }),
                                    React.createElement(DropdownItem, {
                                        text: "type",
                                        item: "type",
                                        selected: this.state.chart === "type",
                                        onSelect: function onSelect(item) {
                                            return _this2.selectChart(item);
                                        } })
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "chart" },
                                React.createElement(
                                    "div",
                                    { className: "plot" },
                                    bars
                                )
                            )
                        )
                    );
                }

                return React.createElement(
                    "div",
                    { className: "card wide" },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            "demographics"
                        ),
                        React.createElement("img", { className: "image", src: "content/close-white.svg", onClick: function onClick() {
                                return _this2.props.close();
                            } })
                    ),
                    React.createElement(
                        "div",
                        { className: "card-content" },
                        demographics
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return DemographicsCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EncounterBuilderCard = function (_React$Component) {
    _inherits(EncounterBuilderCard, _React$Component);

    function EncounterBuilderCard() {
        _classCallCheck(this, EncounterBuilderCard);

        return _possibleConstructorReturn(this, (EncounterBuilderCard.__proto__ || Object.getPrototypeOf(EncounterBuilderCard)).apply(this, arguments));
    }

    _createClass(EncounterBuilderCard, [{
        key: "render",
        value: function render() {
            try {
                var action = null;
                if (this.props.encounters.length === 0) {
                    action = React.createElement(
                        "div",
                        { className: "section" },
                        "to start building an encounter, press the button below"
                    );
                } else {
                    action = React.createElement(
                        "div",
                        { className: "section" },
                        "select an encounter from the list to add monsters to it"
                    );
                }

                var content = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "section" },
                        "on this page you can set up encounters"
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "when you have created an encounter you can add monsters to it, then gauge its difficulty for a party of pcs"
                    ),
                    React.createElement("div", { className: "divider" }),
                    action
                );

                return React.createElement(InfoCard, { centered: true, getContent: function getContent() {
                        return content;
                    } });
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return EncounterBuilderCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EncounterCard = function (_React$Component) {
    _inherits(EncounterCard, _React$Component);

    function EncounterCard() {
        _classCallCheck(this, EncounterCard);

        var _this = _possibleConstructorReturn(this, (EncounterCard.__proto__ || Object.getPrototypeOf(EncounterCard)).call(this));

        _this.state = {
            showDetails: false,
            dropdownOpen: false,
            party: null
        };
        return _this;
    }

    _createClass(EncounterCard, [{
        key: "toggleDetails",
        value: function toggleDetails() {
            this.setState({
                showDetails: !this.state.showDetails
            });
        }
    }, {
        key: "selectParty",
        value: function selectParty(party) {
            if (party) {
                this.setState({
                    dropdownOpen: false,
                    party: party
                });
            } else {
                this.setState({
                    dropdownOpen: !this.state.dropdownOpen
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var heading = null;
                var content = null;

                if (this.props.selection) {
                    var dropdownItems = [];
                    if (this.props.parties) {
                        for (var n = 0; n !== this.props.parties.length; ++n) {
                            var party = this.props.parties[n];
                            dropdownItems.push(React.createElement(DropdownItem, {
                                key: party.id,
                                text: party.name,
                                item: party,
                                selected: this.state.party === party,
                                onSelect: function onSelect(item) {
                                    return _this2.selectParty(item);
                                } }));
                        }
                    }

                    var monsterCount = 0;
                    var monsterXp = 0;
                    var adjustedXp = 0;
                    var difficulty = "";
                    var adjustedDifficulty = "";

                    this.props.selection.slots.forEach(function (slot) {
                        monsterCount += slot.count;
                        var monster = _this2.props.getMonster(slot.monsterName, slot.monsterGroupName);
                        if (monster) {
                            monsterXp += experience(monster.challenge) * slot.count;
                        }
                    });

                    adjustedXp = monsterXp * experienceFactor(monsterCount);

                    if (this.state.party) {
                        var xpEasy = 0;
                        var xpMedium = 0;
                        var xpHard = 0;
                        var xpDeadly = 0;

                        for (var n = 0; n != this.state.party.pcs.length; ++n) {
                            var pc = this.state.party.pcs[n];
                            xpEasy += pcExperience(pc.level, "easy");
                            xpMedium += pcExperience(pc.level, "medium");
                            xpHard += pcExperience(pc.level, "hard");
                            xpDeadly += pcExperience(pc.level, "deadly");
                        }

                        if (adjustedXp > 0) {
                            difficulty = "trivial";
                            if (adjustedXp >= xpEasy) {
                                difficulty = "easy";
                            }
                            if (adjustedXp >= xpMedium) {
                                difficulty = "medium";
                            }
                            if (adjustedXp >= xpHard) {
                                difficulty = "hard";
                            }
                            if (adjustedXp >= xpDeadly) {
                                difficulty = "deadly";
                            }

                            if (this.state.party.pcs.length < 3 || this.state.party.pcs.length > 5) {
                                var small = this.state.party.pcs.length < 3;
                                switch (difficulty) {
                                    case "trivial":
                                        adjustedDifficulty = small ? "easy" : "trivial";
                                        break;
                                    case "easy":
                                        adjustedDifficulty = small ? "medium" : "trivial";
                                        break;
                                    case "medium":
                                        adjustedDifficulty = small ? "hard" : "easy";
                                        break;
                                    case "hard":
                                        adjustedDifficulty = small ? "deadly" : "medium";
                                        break;
                                    case "deadly":
                                        adjustedDifficulty = small ? "deadly" : "hard";
                                        break;
                                }
                            }
                        }
                    }

                    var difficultySection = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "subheading" },
                                "difficulty"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section", style: { display: this.props.parties.length !== 0 ? "" : "none" } },
                            React.createElement(
                                "div",
                                { className: "dropdown" },
                                React.createElement(
                                    "button",
                                    { className: "dropdown-button", onClick: function onClick() {
                                            return _this2.selectParty();
                                        } },
                                    React.createElement(
                                        "div",
                                        { className: "title" },
                                        this.state.party ? this.state.party.name : "select party"
                                    ),
                                    React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: this.state.dropdownOpen ? "dropdown-content open" : "dropdown-content" },
                                    dropdownItems
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "table", style: { display: this.state.party ? "" : "none" } },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "cell four" },
                                    React.createElement(
                                        "b",
                                        null,
                                        "easy"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell four" },
                                    React.createElement(
                                        "b",
                                        null,
                                        "medium"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell four" },
                                    React.createElement(
                                        "b",
                                        null,
                                        "hard"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell four" },
                                    React.createElement(
                                        "b",
                                        null,
                                        "deadly"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "cell four" },
                                    xpEasy
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell four" },
                                    xpMedium
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell four" },
                                    xpHard
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell four" },
                                    xpDeadly
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            "monsters",
                            React.createElement(
                                "div",
                                { className: "right" },
                                monsterCount
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            "xp value",
                            React.createElement(
                                "div",
                                { className: "right" },
                                monsterXp,
                                " xp"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section", style: { display: monsterCount > 1 ? "" : "none" } },
                            "adjusted for number of monsters",
                            React.createElement(
                                "div",
                                { className: "right" },
                                adjustedXp,
                                " xp"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section", style: { display: difficulty ? "" : "none" } },
                            "difficulty",
                            React.createElement(
                                "div",
                                { className: "right" },
                                difficulty
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section", style: { display: adjustedDifficulty ? "" : "none" } },
                            "adjusted for number of pcs",
                            React.createElement(
                                "div",
                                { className: "right" },
                                adjustedDifficulty
                            )
                        )
                    );

                    var imageStyle = this.state.showDetails ? "image rotate" : "image";

                    heading = React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            "encounter"
                        ),
                        React.createElement("img", { className: imageStyle, src: "content/down-arrow.svg", onClick: function onClick() {
                                return _this2.toggleDetails();
                            } })
                    );

                    content = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement("input", { type: "text", placeholder: "encounter name", value: this.props.selection.name, onChange: function onChange(event) {
                                    return _this2.props.changeValue("name", event.target.value);
                                } })
                        ),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showDetails ? "" : "none" } },
                            React.createElement("div", { className: "divider" }),
                            difficultySection
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(ConfirmButton, { text: "delete encounter", callback: function callback() {
                                    return _this2.props.removeEncounter();
                                } })
                        )
                    );
                }

                return React.createElement(InfoCard, { getHeading: function getHeading() {
                        return heading;
                    }, getContent: function getContent() {
                        return content;
                    } });
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return EncounterCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorCard = function (_React$Component) {
    _inherits(ErrorCard, _React$Component);

    function ErrorCard() {
        _classCallCheck(this, ErrorCard);

        return _possibleConstructorReturn(this, (ErrorCard.__proto__ || Object.getPrototypeOf(ErrorCard)).apply(this, arguments));
    }

    _createClass(ErrorCard, [{
        key: "render",
        value: function render() {
            try {
                var heading = null;
                if (this.props.title) {
                    heading = React.createElement(
                        "div",
                        { className: "heading" },
                        this.props.title
                    );
                }

                var content = this.props.getContent();

                return React.createElement(
                    "div",
                    { className: "card error" },
                    heading,
                    React.createElement(
                        "div",
                        { className: "card-content" },
                        content
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return ErrorCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FilterCard = function (_React$Component) {
    _inherits(FilterCard, _React$Component);

    function FilterCard() {
        _classCallCheck(this, FilterCard);

        var _this = _possibleConstructorReturn(this, (FilterCard.__proto__ || Object.getPrototypeOf(FilterCard)).call(this));

        _this.state = {
            showAll: false,
            categoryDropdownOpen: false,
            sizeDropdownOpen: false
        };
        return _this;
    }

    _createClass(FilterCard, [{
        key: "toggleAll",
        value: function toggleAll() {
            this.setState({
                showAll: !this.state.showAll
            });
        }
    }, {
        key: "selectCategory",
        value: function selectCategory(category) {
            if (category) {
                this.setState({
                    categoryDropdownOpen: false
                });
                this.props.changeValue("category", category);
            } else {
                this.setState({
                    categoryDropdownOpen: !this.state.categoryDropdownOpen,
                    sizeDropdownOpen: false
                });
            }
        }
    }, {
        key: "selectSize",
        value: function selectSize(size) {
            if (size) {
                this.setState({
                    sizeDropdownOpen: false
                });
                this.props.changeValue("size", size);
            } else {
                this.setState({
                    categoryDropdownOpen: false,
                    sizeDropdownOpen: !this.state.sizeDropdownOpen
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var sizes = ["all sizes", "tiny", "small", "medium", "large", "huge", "gargantuan"];
                var sizeDropdownItems = [];
                sizes.forEach(function (size) {
                    sizeDropdownItems.push(React.createElement(DropdownItem, {
                        key: size,
                        text: size,
                        item: size,
                        selected: _this2.props.filter.size === size,
                        onSelect: function onSelect(item) {
                            return _this2.selectSize(item);
                        } }));
                });

                var categories = ["all types", "aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"];
                var categoryDropdownItems = [];
                categories.forEach(function (category) {
                    categoryDropdownItems.push(React.createElement(DropdownItem, {
                        key: category,
                        text: category,
                        item: category,
                        selected: _this2.props.filter.category === category,
                        onSelect: function onSelect(item) {
                            return _this2.selectCategory(item);
                        } }));
                });

                var imageStyle = this.state.showAll ? "image rotate" : "image";

                var content = null;
                if (this.state.showAll) {
                    content = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement("input", { type: "text", placeholder: "name", value: this.props.filter.name, onChange: function onChange(event) {
                                    return _this2.props.changeValue("name", event.target.value);
                                } })
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue("challengeMin", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "min challenge"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        challenge(this.props.filter.challengeMin)
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue("challengeMin", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue("challengeMax", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "max challenge"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        challenge(this.props.filter.challengeMax)
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue("challengeMax", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "dropdown" },
                                React.createElement(
                                    "button",
                                    { className: "dropdown-button", onClick: function onClick() {
                                            return _this2.selectSize();
                                        } },
                                    React.createElement(
                                        "div",
                                        { className: "title" },
                                        this.props.filter.size
                                    ),
                                    React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: this.state.sizeDropdownOpen ? "dropdown-content open" : "dropdown-content" },
                                    sizeDropdownItems
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "dropdown" },
                                React.createElement(
                                    "button",
                                    { className: "dropdown-button", onClick: function onClick() {
                                            return _this2.selectCategory();
                                        } },
                                    React.createElement(
                                        "div",
                                        { className: "title" },
                                        this.props.filter.category
                                    ),
                                    React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: this.state.categoryDropdownOpen ? "dropdown-content open" : "dropdown-content" },
                                    categoryDropdownItems
                                )
                            )
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.resetFilter();
                                    } },
                                "clear filter"
                            )
                        )
                    );
                } else {
                    var summary = "";
                    if (this.props.filter.size !== "all sizes") {
                        summary += summary ? " " + this.props.filter.size : this.props.filter.size;
                    }
                    if (this.props.filter.category !== "all types") {
                        summary += summary ? " " + this.props.filter.category : this.props.filter.category;
                    }
                    summary += " monsters of cr " + challenge(this.props.filter.challengeMin) + " to " + challenge(this.props.filter.challengeMax);

                    content = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement("input", { type: "text", placeholder: "name", value: this.props.filter.name, onChange: function onChange(event) {
                                    return _this2.props.changeValue("name", event.target.value);
                                } })
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            "showing ",
                            summary
                        )
                    );
                }

                return React.createElement(
                    "div",
                    { className: "card" },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            "filter"
                        ),
                        React.createElement("img", { className: imageStyle, src: "content/down-arrow.svg", onClick: function onClick() {
                                return _this2.toggleAll();
                            } })
                    ),
                    React.createElement(
                        "div",
                        { className: "card-content" },
                        content
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return FilterCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var InfoCard = function (_React$Component) {
    _inherits(InfoCard, _React$Component);

    function InfoCard() {
        _classCallCheck(this, InfoCard);

        return _possibleConstructorReturn(this, (InfoCard.__proto__ || Object.getPrototypeOf(InfoCard)).apply(this, arguments));
    }

    _createClass(InfoCard, [{
        key: "render",
        value: function render() {
            try {
                var style = "card";
                if (this.props.centered) {
                    style += " centered";
                }

                if (this.props.welcome) {
                    style += " welcome";
                }

                if (this.props.wide) {
                    style += " wide";
                }

                var heading = null;
                if (this.props.getHeading) {
                    heading = this.props.getHeading();
                }

                var content = null;
                if (this.props.getContent) {
                    var content = this.props.getContent();
                }
                if (!content) {
                    return null;
                }

                return React.createElement(
                    "div",
                    { className: style },
                    heading,
                    React.createElement(
                        "div",
                        { className: "card-content" },
                        content
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return InfoCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MonsterCard = function (_React$Component) {
    _inherits(MonsterCard, _React$Component);

    function MonsterCard() {
        _classCallCheck(this, MonsterCard);

        var _this = _possibleConstructorReturn(this, (MonsterCard.__proto__ || Object.getPrototypeOf(MonsterCard)).call(this));

        _this.state = {
            groupDropdownOpen: false,
            categoryDropdownOpen: false,
            sizeDropdownOpen: false,
            showInit: false,
            showHP: false,
            showDetails: false
        };
        return _this;
    }

    _createClass(MonsterCard, [{
        key: "selectGroup",
        value: function selectGroup(group) {
            if (group) {
                this.props.moveToGroup(this.props.combatant, group);
            } else {
                this.setState({
                    groupDropdownOpen: !this.state.groupDropdownOpen
                });
            }
        }
    }, {
        key: "selectCategory",
        value: function selectCategory(category) {
            if (category) {
                this.props.changeTrait(this.props.combatant, "category", category);
                this.setState({
                    categoryDropdownOpen: false
                });
            } else {
                this.setState({
                    categoryDropdownOpen: !this.state.categoryDropdownOpen,
                    sizeDropdownOpen: false
                });
            }
        }
    }, {
        key: "selectSize",
        value: function selectSize(size) {
            if (size) {
                this.props.changeTrait(this.props.combatant, "size", size);
                this.setState({
                    sizeDropdownOpen: false
                });
            } else {
                this.setState({
                    categoryDropdownOpen: false,
                    sizeDropdownOpen: !this.state.sizeDropdownOpen
                });
            }
        }
    }, {
        key: "toggleInit",
        value: function toggleInit() {
            this.setState({
                showInit: !this.state.showInit,
                showHP: false
            });
        }
    }, {
        key: "toggleHP",
        value: function toggleHP() {
            this.setState({
                showInit: false,
                showHP: !this.state.showHP
            });
        }
    }, {
        key: "toggleDetails",
        value: function toggleDetails() {
            this.setState({
                showDetails: !this.state.showDetails
            });
        }
    }, {
        key: "description",
        value: function description() {
            var category = this.props.combatant.category;
            if (this.props.combatant.tag) {
                category += " (" + this.props.combatant.tag + ")";
            }
            var description = this.props.combatant.size + " " + category;
            if (this.props.combatant.alignment) {
                description += ", " + this.props.combatant.alignment;
            }
            return description.toLowerCase();
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var style = "card monster";
                if (this.props.mode.indexOf("editor") !== -1) {
                    style += " wide";
                }

                var categories = ["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey", "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"];
                var categoryDropdownItems = [];
                categories.forEach(function (category) {
                    categoryDropdownItems.push(React.createElement(DropdownItem, {
                        key: category,
                        text: category,
                        item: category,
                        selected: _this2.props.combatant.category === category,
                        onSelect: function onSelect(item) {
                            return _this2.selectCategory(item);
                        } }));
                });

                var sizes = ["tiny", "small", "medium", "large", "huge", "gargantuan"];
                var sizeDropdownItems = [];
                sizes.forEach(function (size) {
                    sizeDropdownItems.push(React.createElement(DropdownItem, {
                        key: size,
                        text: size,
                        item: size,
                        selected: _this2.props.combatant.size === size,
                        onSelect: function onSelect(item) {
                            return _this2.selectSize(item);
                        } }));
                });

                var options = [];
                if (this.props.mode.indexOf("editor") !== -1) {
                    // None
                }
                if (this.props.mode.indexOf("view") !== -1) {
                    if (this.props.mode.indexOf("editable") !== -1) {
                        options.push(React.createElement(
                            "button",
                            { key: "edit", onClick: function onClick() {
                                    return _this2.props.editMonster(_this2.props.combatant);
                                } },
                            "edit monster"
                        ));
                        options.push(React.createElement(
                            "button",
                            { key: "clone", onClick: function onClick() {
                                    return _this2.props.cloneMonster(_this2.props.combatant);
                                } },
                            "clone monster"
                        ));

                        var groups = [];
                        this.props.library.forEach(function (group) {
                            if (group.monsters.indexOf(_this2.props.combatant) === -1) {
                                groups.push(React.createElement(DropdownItem, {
                                    key: group.id,
                                    text: group.name,
                                    item: group,
                                    selected: false,
                                    onSelect: function onSelect(item) {
                                        return _this2.selectGroup(item);
                                    } }));
                            }
                        });
                        options.push(React.createElement(
                            "div",
                            { key: "move", className: "dropdown" },
                            React.createElement(
                                "button",
                                { className: "dropdown-button", onClick: function onClick() {
                                        return _this2.selectGroup();
                                    } },
                                React.createElement(
                                    "div",
                                    { className: "title" },
                                    "move to group"
                                ),
                                React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                            ),
                            React.createElement(
                                "div",
                                { className: this.state.groupDropdownOpen ? "dropdown-content open" : "dropdown-content" },
                                groups
                            )
                        ));

                        options.push(React.createElement(ConfirmButton, { key: "remove", text: "delete monster", callback: function callback() {
                                return _this2.props.removeCombatant(_this2.props.combatant);
                            } }));
                    } else {
                        if (!this.props.slot) {
                            options.push(React.createElement(
                                "button",
                                { key: "add", onClick: function onClick() {
                                        return _this2.props.addEncounterSlot(_this2.props.combatant);
                                    } },
                                "add to encounter"
                            ));
                        } else {
                            options.push(React.createElement(
                                "button",
                                { key: "remove", onClick: function onClick() {
                                        return _this2.props.removeEncounterSlot(_this2.props.slot);
                                    } },
                                "remove from encounter"
                            ));
                        }
                    }
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    if (this.props.combatant.pending && !this.props.combatant.active && !this.props.combatant.defeated) {
                        options.push(React.createElement(
                            "button",
                            { key: "makeAdd", onClick: function onClick() {
                                    return _this2.props.makeActive(_this2.props.combatant);
                                } },
                            "add to encounter"
                        ));
                    }
                    if (!this.props.combatant.pending && this.props.combatant.active && !this.props.combatant.defeated) {
                        if (this.props.combatant.current) {
                            options.push(React.createElement(
                                "button",
                                { key: "endTurn", onClick: function onClick() {
                                        return _this2.props.endTurn(_this2.props.combatant);
                                    } },
                                "end turn"
                            ));
                            options.push(React.createElement(
                                "button",
                                { key: "makeDefeated", onClick: function onClick() {
                                        return _this2.props.makeDefeated(_this2.props.combatant);
                                    } },
                                "mark as defeated and end turn"
                            ));
                        } else {
                            options.push(React.createElement(
                                "button",
                                { key: "makeCurrent", onClick: function onClick() {
                                        return _this2.props.makeCurrent(_this2.props.combatant);
                                    } },
                                "start turn"
                            ));
                            options.push(React.createElement(
                                "button",
                                { key: "makeDefeated", onClick: function onClick() {
                                        return _this2.props.makeDefeated(_this2.props.combatant);
                                    } },
                                "mark as defeated"
                            ));
                            options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                    return _this2.props.removeCombatant(_this2.props.combatant);
                                } }));
                        }
                    }
                    if (!this.props.combatant.pending && !this.props.combatant.active && this.props.combatant.defeated) {
                        options.push(React.createElement(
                            "button",
                            { key: "makeActive", onClick: function onClick() {
                                    return _this2.props.makeActive(_this2.props.combatant);
                                } },
                            "mark as active"
                        ));
                    }
                }

                var stats = null;
                if (this.props.mode.indexOf("editor") !== -1) {
                    stats = React.createElement(
                        "div",
                        { className: "stats" },
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "input-label" },
                                "name:"
                            ),
                            React.createElement("input", { type: "text", value: this.props.combatant.name, onChange: function onChange(event) {
                                    return _this2.props.changeValue(_this2.props.combatant, "name", event.target.value);
                                } })
                        ),
                        React.createElement(
                            "div",
                            { className: "column" },
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "size:"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "dropdown" },
                                    React.createElement(
                                        "button",
                                        { className: "dropdown-button", onClick: function onClick() {
                                                return _this2.selectSize();
                                            } },
                                        React.createElement(
                                            "div",
                                            { className: "title" },
                                            this.props.combatant.size
                                        ),
                                        React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: this.state.sizeDropdownOpen ? "dropdown-content open" : "dropdown-content" },
                                        sizeDropdownItems
                                    )
                                )
                            )
                        ),
                        React.createElement("div", { className: "column-divider" }),
                        React.createElement(
                            "div",
                            { className: "column" },
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "category:"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "dropdown" },
                                    React.createElement(
                                        "button",
                                        { className: "dropdown-button", onClick: function onClick() {
                                                return _this2.selectCategory();
                                            } },
                                        React.createElement(
                                            "div",
                                            { className: "title" },
                                            this.props.combatant.category
                                        ),
                                        React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: this.state.categoryDropdownOpen ? "dropdown-content open" : "dropdown-content" },
                                        categoryDropdownItems
                                    )
                                )
                            )
                        ),
                        React.createElement("div", { className: "column-divider" }),
                        React.createElement(
                            "div",
                            { className: "column" },
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "tag:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.tag, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "tag", event.target.value);
                                    } })
                            )
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(AbilityScorePanel, {
                            edit: true,
                            combatant: this.props.combatant,
                            nudgeValue: function nudgeValue(type, delta) {
                                return _this2.props.nudgeValue(_this2.props.combatant, type, delta);
                            }
                        }),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "column" },
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "alignment:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.alignment, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "alignment", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "speed:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.speed, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "speed", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "saving throws:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.savingThrows, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "savingThrows", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "skills:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.skills, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "skills", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "senses:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.senses, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "senses", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "languages:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.languages, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "languages", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "equipment:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.equipment, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "equipment", event.target.value);
                                    } })
                            )
                        ),
                        React.createElement("div", { className: "column-divider" }),
                        React.createElement(
                            "div",
                            { className: "column" },
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "challenge", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "challenge"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        challenge(this.props.combatant.challenge)
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "challenge", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" })
                                )
                            ),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "ac", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "armor class"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.ac
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "ac", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" })
                                )
                            ),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hitDice", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "hit dice"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.hitDice
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hitDice", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section centered" },
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "b",
                                        null,
                                        "hit points"
                                    ),
                                    " ",
                                    this.props.combatant.hpMax,
                                    " (",
                                    this.props.combatant.hitDice,
                                    "d",
                                    hitDieType(this.props.combatant.size),
                                    ")"
                                )
                            ),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "damage resistances:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.damage.resist, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "damage.resist", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "damage vulnerabilities:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.damage.vulnerable, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "damage.vulnerable", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "damage immunities:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.damage.immune, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "damage.immune", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "condition immunities:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.conditionImmunities, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "conditionImmunities", event.target.value);
                                    } })
                            )
                        ),
                        React.createElement("div", { className: "column-divider" }),
                        React.createElement(
                            "div",
                            { className: "column" },
                            React.createElement(TraitsPanel, {
                                combatant: this.props.combatant,
                                edit: true,
                                addTrait: function addTrait(type) {
                                    return _this2.props.addTrait(_this2.props.combatant, type);
                                },
                                removeTrait: function removeTrait(trait) {
                                    return _this2.props.removeTrait(_this2.props.combatant, trait);
                                },
                                changeTrait: function changeTrait(trait, type, value) {
                                    return _this2.props.changeTrait(trait, type, value);
                                }
                            })
                        )
                    );
                }
                if (this.props.mode.indexOf("view") !== -1) {
                    var slotSection = null;
                    if (this.props.slot) {
                        slotSection = React.createElement(
                            "div",
                            null,
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.slot, "count", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "count"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.slot.count
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button wide toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.slot, "count", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" })
                                )
                            )
                        );
                    }

                    var details = null;
                    if (this.state.showDetails) {
                        details = React.createElement(
                            "div",
                            null,
                            React.createElement("div", { className: "divider" }),
                            React.createElement(AbilityScorePanel, { combatant: this.props.combatant }),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.hpMax !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "hp"
                                    ),
                                    " ",
                                    this.props.combatant.hitDice !== "" ? this.props.combatant.hpMax + " (" + this.props.combatant.hitDice + "d" + hitDieType(this.props.combatant.size) + ")" : this.props.combatant.hpMax
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.damage.immune !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "damage immunity"
                                    ),
                                    " ",
                                    this.props.combatant.damage.immune
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.damage.resist !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "damage resistance"
                                    ),
                                    " ",
                                    this.props.combatant.damage.resist
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "damage vulnerability"
                                    ),
                                    " ",
                                    this.props.combatant.damage.vulnerable
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.conditionImmunities !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "condition immunities"
                                    ),
                                    " ",
                                    this.props.combatant.conditionImmunities
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.speed !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "speed"
                                    ),
                                    " ",
                                    this.props.combatant.speed
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.savingThrows !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "saving throws"
                                    ),
                                    " ",
                                    this.props.combatant.savingThrows
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.skills !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "skills"
                                    ),
                                    " ",
                                    this.props.combatant.skills
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.senses !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "senses"
                                    ),
                                    " ",
                                    this.props.combatant.senses
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.languages !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "languages"
                                    ),
                                    " ",
                                    this.props.combatant.languages
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.equipment !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "equipment"
                                    ),
                                    " ",
                                    this.props.combatant.equipment
                                )
                            ),
                            React.createElement(TraitsPanel, { combatant: this.props.combatant })
                        );
                    }

                    stats = React.createElement(
                        "div",
                        { className: "stats" },
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "i",
                                    null,
                                    this.description()
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "b",
                                    null,
                                    "challenge"
                                ),
                                " ",
                                challenge(this.props.combatant.challenge),
                                " (",
                                experience(this.props.combatant.challenge),
                                " xp)"
                            )
                        ),
                        slotSection,
                        details
                    );
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    var hp = this.props.combatant.hp;
                    if (this.props.combatant.hpTemp > 0) {
                        hp += " + " + this.props.combatant.hpTemp;
                    }

                    stats = React.createElement(
                        "div",
                        { className: "stats" },
                        React.createElement(HitPointGauge, { combatant: this.props.combatant }),
                        React.createElement(
                            "div",
                            { className: "section key-stats" },
                            React.createElement(
                                "div",
                                { className: "key-stat toggle", onClick: function onClick() {
                                        return _this2.toggleInit();
                                    } },
                                React.createElement(
                                    "div",
                                    { className: "stat-heading" },
                                    "init"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    this.props.combatant.initiative
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "key-stat" },
                                React.createElement(
                                    "div",
                                    { className: "stat-heading" },
                                    "ac"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    this.props.combatant.ac
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "key-stat toggle", onClick: function onClick() {
                                        return _this2.toggleHP();
                                    } },
                                React.createElement(
                                    "div",
                                    { className: "stat-heading" },
                                    "hp"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    hp
                                )
                            )
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showInit ? "" : "none" } },
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "initiative", -5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "initiative", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "initiative"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.initiative
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "initiative", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "initiative", +5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                )
                            ),
                            React.createElement("div", { className: "divider" })
                        ),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showHP ? "" : "none" } },
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hp", +5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hp", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "damage"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.hpMax - this.props.combatant.hp
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hp", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hp", -5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hpTemp", -5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hpTemp", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "temp hp"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.hpTemp
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hpTemp", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "hpTemp", +5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.damage.immune !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "damage immunity"
                                    ),
                                    " ",
                                    this.props.combatant.damage.immune
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.damage.resist !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "damage resistance"
                                    ),
                                    " ",
                                    this.props.combatant.damage.resist
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "damage vulnerability"
                                    ),
                                    " ",
                                    this.props.combatant.damage.vulnerable
                                )
                            ),
                            React.createElement("div", { className: "divider" })
                        ),
                        React.createElement(AbilityScorePanel, { combatant: this.props.combatant }),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(ConditionsPanel, {
                            combatant: this.props.combatant,
                            addCondition: function addCondition(condition) {
                                return _this2.props.addCondition(_this2.props.combatant, condition);
                            },
                            removeCondition: function removeCondition(condition) {
                                return _this2.props.removeCondition(_this2.props.combatant, condition);
                            },
                            nudgeConditionValue: function nudgeConditionValue(condition, type, delta) {
                                return _this2.props.nudgeConditionValue(condition, type, delta);
                            }
                        }),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showDetails || this.props.combatant.current ? "" : "none" } },
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "i",
                                        null,
                                        this.description()
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "b",
                                        null,
                                        "challenge"
                                    ),
                                    " ",
                                    challenge(this.props.combatant.challenge),
                                    " (",
                                    experience(this.props.combatant.challenge),
                                    " xp)"
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.speed !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "speed"
                                    ),
                                    " ",
                                    this.props.combatant.speed
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.savingThrows !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "saving throws"
                                    ),
                                    " ",
                                    this.props.combatant.savingThrows
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.skills !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "skills"
                                    ),
                                    " ",
                                    this.props.combatant.skills
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.senses !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "senses"
                                    ),
                                    " ",
                                    this.props.combatant.senses
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.languages !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "languages"
                                    ),
                                    " ",
                                    this.props.combatant.languages
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.equipment !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "equipment"
                                    ),
                                    " ",
                                    this.props.combatant.equipment
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.conditionImmunities !== "" ? "" : "none" } },
                                    React.createElement(
                                        "b",
                                        null,
                                        "conditionImmunities"
                                    ),
                                    " ",
                                    this.props.combatant.conditionImmunities
                                )
                            ),
                            React.createElement(TraitsPanel, { combatant: this.props.combatant })
                        )
                    );
                }

                var name = this.props.combatant.name;
                if (!name) {
                    name = "unnamed monster";
                }
                if (this.props.mode.indexOf("editor") !== -1) {
                    name = "monster editor";
                }

                var toggle = null;
                if (this.props.mode.indexOf("editor") === -1 && !this.props.combatant.current) {
                    var imageStyle = this.state.showDetails ? "image rotate" : "image";
                    toggle = React.createElement("img", { className: imageStyle, src: "content/down-arrow.svg", onClick: function onClick() {
                            return _this2.toggleDetails();
                        } });
                }
                if (this.props.mode.indexOf("editor") !== -1) {
                    toggle = React.createElement("img", { className: "image", src: "content/close-white.svg", onClick: function onClick() {
                            return _this2.props.closeEditor();
                        } });
                }

                return React.createElement(
                    "div",
                    { className: style },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            name
                        ),
                        toggle
                    ),
                    React.createElement(
                        "div",
                        { className: "card-content" },
                        stats,
                        React.createElement(
                            "div",
                            { style: { display: options.length > 0 ? "" : "none" } },
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section" },
                                options
                            )
                        )
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MonsterCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MonsterGroupCard = function (_React$Component) {
    _inherits(MonsterGroupCard, _React$Component);

    function MonsterGroupCard() {
        _classCallCheck(this, MonsterGroupCard);

        return _possibleConstructorReturn(this, (MonsterGroupCard.__proto__ || Object.getPrototypeOf(MonsterGroupCard)).apply(this, arguments));
    }

    _createClass(MonsterGroupCard, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var heading = null;
                var content = null;

                if (this.props.selection) {
                    heading = React.createElement(
                        "div",
                        { className: "heading" },
                        "monster group"
                    );

                    content = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement("input", { type: "text", placeholder: "group name", value: this.props.selection.name, disabled: this.props.filter, onChange: function onChange(event) {
                                    return _this2.props.changeValue("name", event.target.value);
                                } })
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "button",
                                { className: this.props.filter ? "disabled" : "", onClick: function onClick() {
                                        return _this2.props.addMonster("new monster");
                                    } },
                                "add a new monster"
                            ),
                            React.createElement(
                                "button",
                                { className: this.props.filter ? "disabled" : "", onClick: function onClick() {
                                        return _this2.props.sortMonsters();
                                    } },
                                "sort monsters"
                            ),
                            React.createElement(ConfirmButton, { text: "delete group", callback: function callback() {
                                    return _this2.props.removeMonsterGroup();
                                } })
                        )
                    );
                }

                return React.createElement(InfoCard, { getHeading: function getHeading() {
                        return heading;
                    }, getContent: function getContent() {
                        return content;
                    } });
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MonsterGroupCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MonsterLibraryCard = function (_React$Component) {
    _inherits(MonsterLibraryCard, _React$Component);

    function MonsterLibraryCard() {
        _classCallCheck(this, MonsterLibraryCard);

        return _possibleConstructorReturn(this, (MonsterLibraryCard.__proto__ || Object.getPrototypeOf(MonsterLibraryCard)).apply(this, arguments));
    }

    _createClass(MonsterLibraryCard, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var action = null;
                if (this.props.library.length === 0) {
                    action = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                null,
                                "since your collection is empty, you might want to start by pressing the button below to add monsters from the ",
                                React.createElement(
                                    "a",
                                    { href: "http://dnd.wizards.com/articles/features/systems-reference-document-srd", target: "_blank" },
                                    "system reference document"
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.addOpenGameContent();
                                    } },
                                "add monsters"
                            )
                        )
                    );
                } else {
                    action = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            "select a monster group from the list to see stat blocks for monsters in that group"
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            "to quickly find a monster, type its name into the filter box"
                        )
                    );
                }

                var content = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "section" },
                        "you can maintain your menagerie of monsters here"
                    ),
                    React.createElement("div", { className: "divider" }),
                    action
                );

                return React.createElement(InfoCard, { centered: true, getContent: function getContent() {
                        return content;
                    } });
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MonsterLibraryCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartiesCard = function (_React$Component) {
    _inherits(PartiesCard, _React$Component);

    function PartiesCard() {
        _classCallCheck(this, PartiesCard);

        return _possibleConstructorReturn(this, (PartiesCard.__proto__ || Object.getPrototypeOf(PartiesCard)).apply(this, arguments));
    }

    _createClass(PartiesCard, [{
        key: "render",
        value: function render() {
            try {
                var action = null;
                if (this.props.parties.length === 0) {
                    action = React.createElement(
                        "div",
                        { className: "section" },
                        "to start adding a party, press the button below"
                    );
                } else {
                    action = React.createElement(
                        "div",
                        { className: "section" },
                        "select a party from the list to see pc details"
                    );
                }

                var content = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "section" },
                        React.createElement(
                            "div",
                            null,
                            "this page is where you can tell dojo all about your pcs"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        React.createElement(
                            "div",
                            null,
                            "you can add a party for each of your gaming groups"
                        )
                    ),
                    React.createElement("div", { className: "divider" }),
                    action
                );

                return React.createElement(InfoCard, { centered: true, getContent: function getContent() {
                        return content;
                    } });
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return PartiesCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartyCard = function (_React$Component) {
    _inherits(PartyCard, _React$Component);

    function PartyCard() {
        _classCallCheck(this, PartyCard);

        return _possibleConstructorReturn(this, (PartyCard.__proto__ || Object.getPrototypeOf(PartyCard)).apply(this, arguments));
    }

    _createClass(PartyCard, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var heading = null;
                var content = null;

                if (this.props.selection) {
                    var insightSummary = "-";
                    var investigationSummary = "-";
                    var perceptionSummary = "-";

                    if (this.props.selection.pcs.length !== 0) {
                        var insight = { min: null, max: null };
                        var investigation = { min: null, max: null };
                        var perception = { min: null, max: null };

                        this.props.selection.pcs.forEach(function (pc) {
                            insight.min = insight.min === null ? pc.passiveInsight : Math.min(insight.min, pc.passiveInsight);
                            insight.max = insight.max === null ? pc.passiveInsight : Math.max(insight.max, pc.passiveInsight);
                            investigation.min = investigation.min === null ? pc.passiveInvestigation : Math.min(investigation.min, pc.passiveInvestigation);
                            investigation.max = investigation.max === null ? pc.passiveInvestigation : Math.max(investigation.max, pc.passiveInvestigation);
                            perception.min = perception.min === null ? pc.passivePerception : Math.min(perception.min, pc.passivePerception);
                            perception.max = perception.max === null ? pc.passivePerception : Math.max(perception.max, pc.passivePerception);
                        });

                        insightSummary = insight.min === insight.max ? insight.min : insight.min + " - " + insight.max;
                        investigationSummary = investigation.min === investigation.max ? investigation.min : investigation.min + " - " + investigation.max;
                        perceptionSummary = perception.min === perception.max ? perception.min : perception.min + " - " + perception.max;
                    }

                    heading = React.createElement(
                        "div",
                        { className: "heading" },
                        "party"
                    );

                    content = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement("input", { type: "text", placeholder: "party name", value: this.props.selection.name, onChange: function onChange(event) {
                                    return _this2.props.changeValue("name", event.target.value);
                                } })
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "subheading" },
                                "passive skills"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "table" },
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "cell three" },
                                    React.createElement(
                                        "b",
                                        null,
                                        "insight"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell three" },
                                    React.createElement(
                                        "b",
                                        null,
                                        "investigation"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell three" },
                                    React.createElement(
                                        "b",
                                        null,
                                        "perception"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "cell three" },
                                    insightSummary
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell three" },
                                    investigationSummary
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell three" },
                                    perceptionSummary
                                )
                            )
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.addPC("new pc");
                                    } },
                                "add a new pc"
                            ),
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.sortPCs();
                                    } },
                                "sort pcs"
                            ),
                            React.createElement(ConfirmButton, { text: "delete party", callback: function callback() {
                                    return _this2.props.removeParty();
                                } })
                        )
                    );
                }

                return React.createElement(InfoCard, { getHeading: function getHeading() {
                        return heading;
                    }, getContent: function getContent() {
                        return content;
                    } });
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return PartyCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PCCard = function (_React$Component) {
    _inherits(PCCard, _React$Component);

    function PCCard() {
        _classCallCheck(this, PCCard);

        var _this = _possibleConstructorReturn(this, (PCCard.__proto__ || Object.getPrototypeOf(PCCard)).call(this));

        _this.state = {
            showInit: false,
            showDetails: false
        };
        return _this;
    }

    _createClass(PCCard, [{
        key: "toggleInit",
        value: function toggleInit() {
            this.setState({
                showInit: !this.state.showInit
            });
        }
    }, {
        key: "toggleDetails",
        value: function toggleDetails() {
            this.setState({
                showDetails: !this.state.showDetails
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var options = [];
                if (this.props.mode.indexOf("edit") !== -1) {
                    options.push(React.createElement(ConfirmButton, { key: "remove", text: "delete pc", callback: function callback() {
                            return _this2.props.removeCombatant(_this2.props.combatant);
                        } }));
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    if (this.props.combatant.pending && !this.props.combatant.active && !this.props.combatant.defeated) {
                        options.push(React.createElement(
                            "button",
                            { key: "makeAdd", onClick: function onClick() {
                                    return _this2.props.makeActive(_this2.props.combatant);
                                } },
                            "add to encounter"
                        ));
                    }
                    if (!this.props.combatant.pending && this.props.combatant.active && !this.props.combatant.defeated) {
                        if (this.props.combatant.current) {
                            options.push(React.createElement(
                                "button",
                                { key: "endTurn", onClick: function onClick() {
                                        return _this2.props.endTurn(_this2.props.combatant);
                                    } },
                                "end turn"
                            ));
                            options.push(React.createElement(
                                "button",
                                { key: "makeDefeated", onClick: function onClick() {
                                        return _this2.props.makeDefeated(_this2.props.combatant);
                                    } },
                                "mark as defeated and end turn"
                            ));
                        } else {
                            options.push(React.createElement(
                                "button",
                                { key: "makeCurrent", onClick: function onClick() {
                                        return _this2.props.makeCurrent(_this2.props.combatant);
                                    } },
                                "start turn"
                            ));
                            options.push(React.createElement(
                                "button",
                                { key: "makeDefeated", onClick: function onClick() {
                                        return _this2.props.makeDefeated(_this2.props.combatant);
                                    } },
                                "mark as defeated"
                            ));
                            options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                    return _this2.props.removeCombatant(_this2.props.combatant);
                                } }));
                        }
                    }
                    if (!this.props.combatant.pending && !this.props.combatant.active && this.props.combatant.defeated) {
                        options.push(React.createElement(
                            "button",
                            { key: "makeActive", onClick: function onClick() {
                                    return _this2.props.makeActive(_this2.props.combatant);
                                } },
                            "mark as active"
                        ));
                    }
                }

                var stats = null;
                if (this.props.mode.indexOf("edit") !== -1) {
                    stats = React.createElement(
                        "div",
                        { className: "stats" },
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "input-label", style: { display: this.state.showDetails ? "" : "none" } },
                                "character name:"
                            ),
                            React.createElement("input", { type: "text", value: this.props.combatant.name, onChange: function onChange(event) {
                                    return _this2.props.changeValue(_this2.props.combatant, "name", event.target.value);
                                } }),
                            React.createElement(
                                "div",
                                { className: "input-label", style: { display: this.state.showDetails ? "" : "none" } },
                                "player name:"
                            ),
                            React.createElement("input", { type: "text", value: this.props.combatant.player, onChange: function onChange(event) {
                                    return _this2.props.changeValue(_this2.props.combatant, "player", event.target.value);
                                } })
                        ),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showDetails ? "none" : "" } },
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section centered" },
                                React.createElement(
                                    "div",
                                    null,
                                    "level ",
                                    this.props.combatant.level,
                                    " ",
                                    this.props.combatant.race || 'race',
                                    " ",
                                    this.props.combatant.classes || 'class'
                                ),
                                React.createElement(
                                    "div",
                                    { style: { display: this.props.combatant.url ? "" : "none" } },
                                    React.createElement(
                                        "a",
                                        { href: this.props.combatant.url, target: "_blank" },
                                        "d&d beyond character sheet"
                                    )
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showDetails ? "" : "none" } },
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "race:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.race, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "race", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "class:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.classes, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "classes", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "background:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.background, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "background", event.target.value);
                                    } })
                            ),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "level", -5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "level", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "level"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.level
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "level", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "level", +5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                )
                            ),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "languages:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.languages, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "languages", event.target.value);
                                    } })
                            ),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "input-label" },
                                    "d&d beyond link:"
                                ),
                                React.createElement("input", { type: "text", value: this.props.combatant.url, onChange: function onChange(event) {
                                        return _this2.props.changeValue(_this2.props.combatant, "url", event.target.value);
                                    } })
                            ),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "passive skills"
                            ),
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passiveInsight", -5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passiveInsight", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "insight"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.passiveInsight
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passiveInsight", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passiveInsight", +5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passiveInvestigation", -5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passiveInvestigation", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "investigation"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.passiveInvestigation
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passiveInvestigation", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passiveInvestigation", +5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passivePerception", -5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passivePerception", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "perception"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.passivePerception
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passivePerception", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "passivePerception", +5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                )
                            )
                        )
                    );
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    stats = React.createElement(
                        "div",
                        { className: "stats" },
                        React.createElement(
                            "div",
                            { className: "section key-stats" },
                            React.createElement(
                                "div",
                                { className: "key-stat toggle", onClick: function onClick() {
                                        return _this2.toggleInit();
                                    } },
                                React.createElement(
                                    "div",
                                    { className: "stat-heading" },
                                    "init"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    this.props.combatant.initiative
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "key-stat wide" },
                                React.createElement(
                                    "div",
                                    { className: "stat-heading" },
                                    "player"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    this.props.combatant.player ? this.props.combatant.player : "-"
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showInit ? "" : "none" } },
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section spin" },
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "initiative", -5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "initiative", -1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/minus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-value" },
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        "initiative"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "spin-label" },
                                        this.props.combatant.initiative
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "initiative", +1);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "1"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-button toggle", onClick: function onClick() {
                                            return _this2.props.nudgeValue(_this2.props.combatant, "initiative", +5);
                                        } },
                                    React.createElement("img", { className: "image", src: "content/plus.svg" }),
                                    React.createElement(
                                        "span",
                                        { className: "spin-delta" },
                                        "5"
                                    )
                                )
                            )
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section centered" },
                            React.createElement(
                                "div",
                                null,
                                "level ",
                                this.props.combatant.level,
                                " ",
                                this.props.combatant.race || 'race',
                                " ",
                                this.props.combatant.classes || 'class'
                            ),
                            React.createElement(
                                "div",
                                { style: { display: this.props.combatant.url ? "" : "none" } },
                                React.createElement(
                                    "a",
                                    { href: this.props.combatant.url, target: "_blank" },
                                    "d&d beyond character sheet"
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showDetails || this.props.combatant.current ? "" : "none" } },
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "languages"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                this.props.combatant.languages || "none"
                            ),
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "passive skills"
                            ),
                            React.createElement(
                                "div",
                                { className: "table" },
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "div",
                                        { className: "cell three" },
                                        React.createElement(
                                            "b",
                                            null,
                                            "insight"
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "cell three" },
                                        React.createElement(
                                            "b",
                                            null,
                                            "investigation"
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "cell three" },
                                        React.createElement(
                                            "b",
                                            null,
                                            "perception"
                                        )
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "div",
                                        { className: "cell three" },
                                        this.props.combatant.passiveInsight
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "cell three" },
                                        this.props.combatant.passiveInvestigation
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "cell three" },
                                        this.props.combatant.passivePerception
                                    )
                                )
                            )
                        )
                    );
                }

                var name = this.props.combatant.name;
                if (!name) {
                    name = "unnamed pc";
                }

                var toggle = null;
                if (!this.props.combatant.current) {
                    var imageStyle = this.state.showDetails ? "image rotate" : "image";
                    toggle = React.createElement("img", { className: imageStyle, src: "content/down-arrow.svg", onClick: function onClick() {
                            return _this2.toggleDetails();
                        } });
                }

                return React.createElement(
                    "div",
                    { className: "card pc" },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            name
                        ),
                        toggle
                    ),
                    React.createElement(
                        "div",
                        { className: "card-content" },
                        stats,
                        React.createElement(
                            "div",
                            { style: { display: options.length > 0 ? "" : "none" } },
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section" },
                                options
                            )
                        )
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return PCCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dojo = function (_React$Component) {
    _inherits(Dojo, _React$Component);

    function Dojo() {
        _classCallCheck(this, Dojo);

        var _this = _possibleConstructorReturn(this, (Dojo.__proto__ || Object.getPrototypeOf(Dojo)).call(this));

        _this.state = {
            view: "home",
            options: {
                showHelp: true
            },
            parties: [],
            library: [],
            encounters: [],
            combats: [],
            selectedPartyID: null,
            selectedMonsterGroupID: null,
            selectedEncounterID: null,
            selectedCombatID: null,
            modal: null
        };

        try {
            var data = null;

            try {
                var json = window.localStorage.getItem('data');
                data = JSON.parse(json);
            } catch (ex) {
                console.error("Could not parse JSON: ", ex);
                data = null;
            }

            if (data !== null) {
                _this.state = data;
                _this.state.view = "home";
            }
        } catch (ex) {
            console.error(ex);
            _this.state.parties = [];
            _this.state.library = [];
            _this.state.encounters = [];
            _this.state.combats = [];
            _this.state.selectedPartyID = null;
            _this.state.selectedMonsterGroupID = null;
            _this.state.selectedEncounterID = null;
            _this.state.selectedCombatID = null;
        }
        return _this;
    }

    _createClass(Dojo, [{
        key: "componentDidUpdate",
        value: function componentDidUpdate() {
            var json = null;
            try {
                json = JSON.stringify(this.state);
            } catch (ex) {
                console.error("Could not stringify data: ", ex);
                json = null;
            }

            if (json !== null) {
                window.localStorage.setItem('data', json);
            }
        }

        /////////////////////////////////////////////////////////////////////////////
        // Party screen

    }, {
        key: "addParty",
        value: function addParty(name) {
            var party = {
                id: this.guid(),
                name: name,
                pcs: []
            };
            var parties = [].concat(this.state.parties, [party]);
            this.sort(parties);
            this.setState({
                parties: parties,
                selectedPartyID: party.id
            });
        }
    }, {
        key: "removeParty",
        value: function removeParty() {
            var party = this.getParty(this.state.selectedPartyID);
            var index = this.state.parties.indexOf(party);
            this.state.parties.splice(index, 1);
            this.setState({
                parties: this.state.parties,
                selectedPartyID: null
            });
        }
    }, {
        key: "addPC",
        value: function addPC(name) {
            var pc = {
                id: this.guid(),
                type: "pc",
                player: "",
                name: name,
                race: "",
                classes: "",
                background: "",
                level: 1,
                languages: "Common",
                passiveInsight: 10,
                passiveInvestigation: 10,
                passivePerception: 10,
                initiative: 10,
                url: ""
            };
            var party = this.getParty(this.state.selectedPartyID);
            party.pcs.push(pc);
            this.setState({
                parties: this.state.parties
            });
            return pc;
        }
    }, {
        key: "removePC",
        value: function removePC(pc) {
            var party = this.getParty(this.state.selectedPartyID);
            var index = party.pcs.indexOf(pc);
            party.pcs.splice(index, 1);
            this.setState({
                parties: this.state.parties
            });
        }
    }, {
        key: "sortPCs",
        value: function sortPCs() {
            var party = this.getParty(this.state.selectedPartyID);
            this.sort(party.pcs);
            this.setState({
                parties: this.state.parties
            });
        }

        /////////////////////////////////////////////////////////////////////////////
        // Library screen

    }, {
        key: "addMonsterGroup",
        value: function addMonsterGroup(name) {
            var group = {
                id: this.guid(),
                name: name,
                monsters: []
            };
            var library = [].concat(this.state.library, [group]);
            this.sort(library);
            this.setState({
                library: library,
                selectedMonsterGroupID: group.id
            });
        }
    }, {
        key: "removeMonsterGroup",
        value: function removeMonsterGroup() {
            var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
            var index = this.state.library.indexOf(group);
            this.state.library.splice(index, 1);
            this.setState({
                library: this.state.library,
                selectedMonsterGroupID: null
            });
        }
    }, {
        key: "addMonster",
        value: function addMonster(name) {
            var monster = this.createMonster();
            monster.name = name;
            var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
            group.monsters.push(monster);
            this.setState({
                library: this.state.library
            });
        }
    }, {
        key: "createMonster",
        value: function createMonster() {
            return {
                id: this.guid(),
                type: "monster",
                name: "",
                size: "medium",
                category: "humanoid",
                tag: "",
                alignment: "",
                challenge: 1,
                abilityScores: {
                    str: 10,
                    dex: 10,
                    con: 10,
                    int: 10,
                    wis: 10,
                    cha: 10
                },
                ac: 10,
                hpMax: 1,
                hpTemp: 0,
                hitDice: 1,
                damage: {
                    resist: "",
                    vulnerable: "",
                    immune: ""
                },
                savingThrows: "",
                speed: "",
                skills: "",
                senses: "",
                languages: "",
                equipment: "",
                traits: [],
                conditionImmunities: ""
            };
        }
    }, {
        key: "removeMonster",
        value: function removeMonster(monster) {
            var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
            var index = group.monsters.indexOf(monster);
            group.monsters.splice(index, 1);
            this.setState({
                library: this.state.library
            });
        }
    }, {
        key: "sortMonsters",
        value: function sortMonsters() {
            var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
            this.sort(group.monsters);
            this.setState({
                library: this.state.library
            });
        }
    }, {
        key: "moveToGroup",
        value: function moveToGroup(monster, group) {
            var sourceGroup = this.findMonster(monster);
            var index = sourceGroup.monsters.indexOf(monster);

            sourceGroup.monsters.splice(index, 1);
            group.monsters.push(monster);
            this.sort(group.monsters);

            this.setState({
                library: this.state.library
            });
        }
    }, {
        key: "cloneMonster",
        value: function cloneMonster(monster) {
            var _this2 = this;

            var group = this.findMonster(monster);

            var clone = {
                id: this.guid(),
                type: "monster",
                name: monster.name + " copy",
                size: monster.size,
                category: monster.category,
                tag: monster.tag,
                alignment: monster.alignment,
                challenge: monster.challenge,
                abilityScores: {
                    str: monster.abilityScores.str,
                    dex: monster.abilityScores.dex,
                    con: monster.abilityScores.con,
                    int: monster.abilityScores.int,
                    wis: monster.abilityScores.wis,
                    cha: monster.abilityScores.cha
                },
                ac: monster.ac,
                hpMax: monster.hpMax,
                hpTemp: monster.hpTemp,
                hitDice: monster.hitDice,
                damage: {
                    resist: monster.damage.resist,
                    vulnerable: monster.damage.vulnerable,
                    immune: monster.damage.immune
                },
                savingThrows: monster.savingThrows,
                speed: monster.speed,
                skills: monster.skills,
                senses: monster.senses,
                languages: monster.languages,
                equipment: monster.equipment,
                traits: monster.traits.map(function (trait) {
                    return {
                        id: _this2.guid(),
                        name: trait.name,
                        usage: trait.usage,
                        type: trait.type,
                        text: trait.text
                    };
                }),
                conditionImmunities: monster.conditionImmunities
            };

            group.monsters.push(clone);
            this.sort(group.monsters);

            this.setState({
                library: this.state.library
            });
        }
    }, {
        key: "addTrait",
        value: function addTrait(combatant, type) {
            var trait = {
                id: this.guid(),
                name: "New trait",
                usage: "",
                type: type,
                text: ""
            };
            var trait = combatant.traits.push(trait);
            this.setState({
                library: this.state.library
            });
            return trait;
        }
    }, {
        key: "removeTrait",
        value: function removeTrait(combatant, trait) {
            var index = combatant.traits.indexOf(trait);
            combatant.traits.splice(index, 1);
            this.setState({
                library: this.state.library
            });
        }
    }, {
        key: "addOpenGameContent",
        value: function addOpenGameContent() {
            var _this3 = this;

            var request = new XMLHttpRequest();
            request.overrideMimeType("application/json");
            request.open('GET', 'data/monsters.json', true);
            request.onreadystatechange = function () {
                if (request.readyState == 4 && request.status == "200") {
                    var monsters = JSON.parse(request.responseText);
                    monsters.forEach(function (data) {
                        if (data.name) {
                            var monster = _this3.createMonster();

                            monster.type = "monster";
                            monster.name = data.name;
                            monster.size = data.size.toLowerCase();
                            monster.category = data.type;
                            monster.tag = data.subtype;
                            monster.alignment = data.alignment;
                            monster.challenge = parseChallenge(data.challenge_rating);
                            monster.ac = data.armor_class;
                            monster.hp = data.hit_points;
                            monster.hpMax = data.hit_points;
                            monster.speed = data.speed;
                            monster.senses = data.senses;
                            monster.languages = data.languages;

                            var index = data.hit_dice.indexOf("d");
                            monster.hitDice = parseInt(data.hit_dice.substring(0, index));

                            monster.abilityScores.str = data.strength;
                            monster.abilityScores.dex = data.dexterity;
                            monster.abilityScores.con = data.constitution;
                            monster.abilityScores.int = data.intelligence;
                            monster.abilityScores.wis = data.wisdom;
                            monster.abilityScores.cha = data.charisma;

                            monster.damage.resist = data.damage_resistances;
                            monster.damage.vulnerable = data.damage_vulnerabilities;
                            monster.damage.immune = data.damage_immunities;
                            monster.conditionImmunities = data.condition_immunities;

                            var saves = [{
                                field: "strength_save",
                                text: "Strength"
                            }, {
                                field: "dexterity_save",
                                text: "Dexterity"
                            }, {
                                field: "constitution_save",
                                text: "Constitution"
                            }, {
                                field: "intelligence_save",
                                text: "Intelligence"
                            }, {
                                field: "wisdom_save",
                                text: "Wisdom"
                            }, {
                                field: "charisma_save",
                                text: "Charisma"
                            }];
                            saves.forEach(function (save) {
                                if (data[save.field]) {
                                    var str = save.text + " " + data[save.field];
                                    monster.savingThrows += monster.savingThrows === "" ? str : ", " + str;
                                }
                            });

                            var skills = [{
                                field: "acrobatics",
                                text: "Acrobatics"
                            }, {
                                field: "animal_handling",
                                text: "Animal handling"
                            }, {
                                field: "arcana",
                                text: "Arcana"
                            }, {
                                field: "athletics",
                                text: "Athletics"
                            }, {
                                field: "deception",
                                text: "Deception"
                            }, {
                                field: "history",
                                text: "History"
                            }, {
                                field: "insight",
                                text: "Insight"
                            }, {
                                field: "intimidation",
                                text: "Intimidation"
                            }, {
                                field: "investigation",
                                text: "Investigation"
                            }, {
                                field: "medicine",
                                text: "Medicine"
                            }, {
                                field: "nature",
                                text: "Nature"
                            }, {
                                field: "perception",
                                text: "Perception"
                            }, {
                                field: "performance",
                                text: "Performance"
                            }, {
                                field: "persuasion",
                                text: "Persuasion"
                            }, {
                                field: "religion",
                                text: "Religion"
                            }, {
                                field: "sleight_of_hand",
                                text: "Sleight of hand"
                            }, {
                                field: "stealth",
                                text: "Stealth"
                            }, {
                                field: "survival",
                                text: "Survival"
                            }];
                            skills.forEach(function (skill) {
                                if (data[skill.field]) {
                                    var str = skill.text + " " + data[skill.field];
                                    monster.skills += monster.skills === "" ? str : ", " + str;
                                }
                            });

                            if (data.special_abilities) {
                                data.special_abilities.forEach(function (rawTrait) {
                                    var trait = _this3.buildTrait(rawTrait, "trait");
                                    monster.traits.push(trait);
                                });
                            }
                            if (data.actions) {
                                data.actions.forEach(function (rawTrait) {
                                    var trait = _this3.buildTrait(rawTrait, "action");
                                    monster.traits.push(trait);
                                });
                            }
                            if (data.legendary_actions) {
                                data.legendary_actions.forEach(function (rawTrait) {
                                    var trait = _this3.buildTrait(rawTrait, "legendary");
                                    monster.traits.push(trait);
                                });
                            }

                            var groupName = monster.tag;
                            if (groupName === "") {
                                groupName = monster.category;
                            }
                            if (groupName.indexOf("swarm") === 0) {
                                groupName = "swarm";
                            }
                            if (groupName === "any race") {
                                groupName = "npc";
                            }

                            var group = _this3.getMonsterGroupByName(groupName);
                            if (!group) {
                                var group = {
                                    id: _this3.guid(),
                                    name: groupName,
                                    monsters: []
                                };
                                _this3.state.library.push(group);
                            }
                            group.monsters.push(monster);
                        }
                    });

                    _this3.sort(_this3.state.library);

                    _this3.setState({
                        view: "library",
                        library: _this3.state.library
                    });
                }
            };
            request.send(null);
        }
    }, {
        key: "buildTrait",
        value: function buildTrait(rawTrait, type) {
            var name = "";
            var usage = "";

            var openBracket = rawTrait.name.indexOf("(");
            if (openBracket === -1) {
                name = rawTrait.name;
            } else {
                var closeBracket = rawTrait.name.indexOf(")");
                name = rawTrait.name.substring(0, openBracket - 1);
                usage = rawTrait.name.substring(openBracket + 1, closeBracket);
            }

            return {
                id: this.guid(),
                type: type,
                name: name,
                usage: usage,
                text: rawTrait.desc
            };
        }
    }, {
        key: "addEncounter",


        /////////////////////////////////////////////////////////////////////////////
        // Encounter screen

        value: function addEncounter(name) {
            var encounter = {
                id: this.guid(),
                name: name,
                slots: []
            };
            var encounters = [].concat(this.state.encounters, [encounter]);
            this.sort(encounters);
            this.setState({
                encounters: encounters,
                selectedEncounterID: encounter.id
            });
        }
    }, {
        key: "removeEncounter",
        value: function removeEncounter() {
            var encounter = this.getEncounter(this.state.selectedEncounterID);
            var index = this.state.encounters.indexOf(encounter);
            this.state.encounters.splice(index, 1);
            this.setState({
                encounters: this.state.encounters,
                selectedEncounterID: null
            });
        }
    }, {
        key: "addEncounterSlot",
        value: function addEncounterSlot(monster) {
            var group = this.findMonster(monster);
            var slot = {
                id: this.guid(),
                monsterGroupName: group.name,
                monsterName: monster.name,
                count: 1
            };
            var encounter = this.getEncounter(this.state.selectedEncounterID);
            encounter.slots.push(slot);
            this.sortEncounterSlots();
            this.setState({
                encounters: this.state.encounters
            });
            return slot;
        }
    }, {
        key: "removeEncounterSlot",
        value: function removeEncounterSlot(slot) {
            var encounter = this.getEncounter(this.state.selectedEncounterID);
            var index = encounter.slots.indexOf(slot);
            encounter.slots.splice(index, 1);
            this.setState({
                encounters: this.state.encounters
            });
        }
    }, {
        key: "sortEncounterSlots",
        value: function sortEncounterSlots() {
            var encounter = this.getEncounter(this.state.selectedEncounterID);
            encounter.slots.sort(function (a, b) {
                var aName = a.monsterName.toLowerCase();
                var bName = b.monsterName.toLowerCase();
                if (aName < bName) return -1;
                if (aName > bName) return 1;
                return 0;
            });
            this.setState({
                encounters: this.state.encounters
            });
        }

        /////////////////////////////////////////////////////////////////////////////
        // Combat screen

    }, {
        key: "startEncounter",
        value: function startEncounter(party, encounter) {
            var _this4 = this;

            var partyName = party.name;
            if (!partyName) {
                partyName = "unnamed party";
            }
            var encounterName = encounter.name;
            if (!encounterName) {
                encounterName = "unnamed encounter";
            }

            var combat = {
                id: this.guid(),
                name: partyName + " vs " + encounterName,
                combatants: [],
                round: 1,
                issues: []
            };

            encounter.slots.forEach(function (slot) {
                var group = _this4.getMonsterGroupByName(slot.monsterGroupName);
                var monster = _this4.getMonster(slot.monsterName, group);

                if (monster) {
                    var init = parseInt(modifier(monster.abilityScores.dex));
                    var roll = dieRoll();

                    for (var n = 0; n !== slot.count; ++n) {
                        var copy = JSON.parse(JSON.stringify(monster));
                        copy.id = _this4.guid();
                        if (slot.count > 1) {
                            copy.name += " " + (n + 1);
                        }
                        copy.initiative = init + roll;
                        copy.hp = copy.hpMax;
                        copy.conditions = [];
                        combat.combatants.push(copy);
                    }
                } else {
                    combat.issues.push("unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName);
                }
            });

            // Add a copy of each PC to the encounter
            party.pcs.forEach(function (pc) {
                var copy = JSON.parse(JSON.stringify(pc));
                combat.combatants.push(copy);
            });

            // Add flags to all combatants
            combat.combatants.forEach(function (combatant) {
                combatant.current = false;
                combatant.pending = combatant.type === "pc";
                combatant.active = combatant.type === "monster";
                combatant.defeated = false;
            });

            this.sortCombatants(combat);

            this.setState({
                combats: [].concat(this.state.combats, [combat]),
                selectedCombatID: combat.id
            });
        }
    }, {
        key: "pauseEncounter",
        value: function pauseEncounter() {
            var combat = this.getCombat(this.state.selectedCombatID);
            combat.timestamp = new Date().toLocaleString();
            this.setState({
                combats: this.state.combats,
                selectedCombatID: null
            });
        }
    }, {
        key: "resumeEncounter",
        value: function resumeEncounter(combat) {
            this.setState({
                selectedCombatID: combat.id
            });
        }
    }, {
        key: "endEncounter",
        value: function endEncounter() {
            var combat = this.getCombat(this.state.selectedCombatID);
            var index = this.state.combats.indexOf(combat);
            this.state.combats.splice(index, 1);
            this.setState({
                combats: this.state.combats,
                selectedCombatID: null
            });
        }
    }, {
        key: "makeCurrent",
        value: function makeCurrent(combatant, newRound) {
            var combat = this.getCombat(this.state.selectedCombatID);

            combat.combatants.forEach(function (combatant) {
                combatant.current = false;
            });
            if (combatant) {
                combatant.current = true;
            }

            if (newRound) {
                combat.round += 1;
            }

            this.setState({
                combats: this.state.combats
            });
        }
    }, {
        key: "makeActive",
        value: function makeActive(combatant) {
            combatant.pending = false;
            combatant.active = true;
            combatant.defeated = false;

            var combat = this.getCombat(this.state.selectedCombatID);
            this.sortCombatants(combat);

            this.setState({
                combats: this.state.combats
            });
        }
    }, {
        key: "makeDefeated",
        value: function makeDefeated(combatant) {
            combatant.pending = false;
            combatant.active = false;
            combatant.defeated = true;

            if (combatant.current) {
                this.endTurn(combatant);
            } else {
                this.setState({
                    combats: this.state.combats
                });
            }
        }
    }, {
        key: "removeCombatant",
        value: function removeCombatant(combatant) {
            var combat = this.getCombat(this.state.selectedCombatID);
            var index = combat.combatants.indexOf(combatant);
            combat.combatants.splice(index, 1);

            this.setState({
                combats: this.state.combats
            });
        }
    }, {
        key: "endTurn",
        value: function endTurn(combatant) {
            var combat = this.getCombat(this.state.selectedCombatID);
            var active = combat.combatants.filter(function (combatant) {
                return combatant.current || !combatant.pending && combatant.active && !combatant.defeated;
            });
            if (active.length === 0) {
                // There's no-one left in the fight
                this.makeCurrent(null, false);
            } else if (active.length === 1 && active[0].defeated) {
                // The only person in the fight is me, and I'm defeated
                this.makeCurrent(null, false);
            } else {
                var index = active.indexOf(combatant) + 1;
                var newRound = false;
                if (index >= active.length) {
                    index = 0;
                    newRound = true;
                }
                this.makeCurrent(active[index], newRound);
            }
        }
    }, {
        key: "addCondition",
        value: function addCondition(combatant, condition) {
            combatant.conditions.push(condition);

            this.setState({
                combats: this.state.combats
            });
        }
    }, {
        key: "removeCondition",
        value: function removeCondition(combatant, condition) {
            var index = combatant.conditions.indexOf(condition);
            combatant.conditions.splice(index, 1);

            this.setState({
                combats: this.state.combats
            });
        }
    }, {
        key: "sortCombatants",
        value: function sortCombatants(combat) {
            combat.combatants.sort(function (a, b) {
                // First sort by initiative, descending
                if (a.initiative < b.initiative) return 1;
                if (a.initiative > b.initiative) return -1;
                // Then sort by name, ascending
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });
        }

        /////////////////////////////////////////////////////////////////////////////
        // About screen

    }, {
        key: "toggleHelp",
        value: function toggleHelp(value) {
            this.setState({
                options: {
                    showHelp: value
                }
            });
        }
    }, {
        key: "resetAll",
        value: function resetAll() {
            this.setState({
                options: {
                    showHelp: true
                },
                parties: [],
                selectedPartyID: null,
                library: [],
                selectedMonsterGroupID: null,
                encounters: [],
                selectedEncounterID: null,
                combats: [],
                selectedCombatID: null
            });
        }

        /////////////////////////////////////////////////////////////////////////////

    }, {
        key: "setView",
        value: function setView(view) {
            this.setState({
                view: view
            });
        }
    }, {
        key: "setModal",
        value: function setModal(content) {
            this.setState({
                modal: content
            });
        }
    }, {
        key: "selectParty",
        value: function selectParty(party) {
            this.setState({
                selectedPartyID: party ? party.id : null
            });
        }
    }, {
        key: "selectMonsterGroup",
        value: function selectMonsterGroup(group) {
            this.setState({
                selectedMonsterGroupID: group ? group.id : null
            });
        }
    }, {
        key: "selectEncounter",
        value: function selectEncounter(encounter) {
            this.setState({
                selectedEncounterID: encounter ? encounter.id : null
            });
        }
    }, {
        key: "getParty",
        value: function getParty(id) {
            var result = null;
            this.state.parties.forEach(function (party) {
                if (party.id === id) {
                    result = party;
                }
            });
            return result;
        }
    }, {
        key: "getMonsterGroup",
        value: function getMonsterGroup(id) {
            var result = null;
            this.state.library.forEach(function (group) {
                if (group.id === id) {
                    result = group;
                }
            });
            return result;
        }
    }, {
        key: "getEncounter",
        value: function getEncounter(id) {
            var result = null;
            this.state.encounters.forEach(function (encounter) {
                if (encounter.id === id) {
                    result = encounter;
                }
            });
            return result;
        }
    }, {
        key: "getCombat",
        value: function getCombat(id) {
            var result = null;
            this.state.combats.forEach(function (combat) {
                if (combat.id === id) {
                    result = combat;
                }
            });
            return result;
        }
    }, {
        key: "getMonsterGroupByName",
        value: function getMonsterGroupByName(groupName) {
            var result = null;

            this.state.library.forEach(function (group) {
                if (group.name === groupName) {
                    result = group;
                }
            });

            return result;
        }
    }, {
        key: "getMonster",
        value: function getMonster(monsterName, monsterGroup) {
            var result = null;

            if (monsterGroup && monsterGroup.monsters) {
                monsterGroup.monsters.forEach(function (monster) {
                    if (monster.name === monsterName) {
                        result = monster;
                    }
                });
            }

            return result;
        }
    }, {
        key: "findMonster",
        value: function findMonster(monster) {
            var result = null;
            this.state.library.forEach(function (group) {
                if (group.monsters.indexOf(monster) !== -1) {
                    result = group;
                }
            });
            return result;
        }
    }, {
        key: "changeValue",
        value: function changeValue(combatant, type, value) {
            switch (type) {
                case "hp":
                    value = Math.min(value, combatant.hpMax);
                    break;
                case "hpTemp":
                    value = Math.max(value, 0);
                    break;
                case "level":
                    value = Math.max(value, 1);
                    if (combatant.player !== undefined) {
                        value = Math.min(value, 20);
                    } else {
                        value = Math.min(value, 6);
                    }
                    break;
                case "count":
                    value = Math.max(value, 1);
                    break;
                case "hitDice":
                    value = Math.max(value, 1);
                    break;
            }

            var tokens = type.split(".");
            var obj = combatant;
            for (var n = 0; n !== tokens.length; ++n) {
                var token = tokens[n];
                if (n === tokens.length - 1) {
                    obj[token] = value;
                } else {
                    obj = obj[token];
                }
            }

            if (type === "abilityScores.con" || type === "size" || type === "hitDice") {
                var sides = hitDieType(combatant.size);
                var conMod = parseInt(modifier(combatant.abilityScores.con));
                var hpPerDie = (sides + 1) / 2 + conMod;
                var hp = Math.floor(combatant.hitDice * hpPerDie);
                combatant.hpMax = hp;
            }

            switch (this.state.view) {
                case "parties":
                    this.sort(this.state.parties);
                    this.setState({
                        parties: this.state.parties
                    });
                    break;
                case "library":
                    this.sort(this.state.library);
                    this.setState({
                        library: this.state.library
                    });
                    break;
                case "encounter":
                    this.sort(this.state.encounters);
                    this.setState({
                        encounters: this.state.encounters
                    });
                    break;
                case "combat":
                    this.setState({
                        combats: this.state.combats
                    });
                    break;
            }
        }
    }, {
        key: "nudgeValue",
        value: function nudgeValue(combatant, type, delta) {
            var tokens = type.split(".");
            var obj = combatant;
            for (var n = 0; n !== tokens.length; ++n) {
                var token = tokens[n];
                if (n === tokens.length - 1) {
                    var value = null;
                    if (token === "challenge") {
                        value = nudgeChallenge(obj.challenge, delta);
                    } else {
                        value = obj[token] + delta;
                    }
                    this.changeValue(combatant, type, value);
                } else {
                    obj = obj[token];
                }
            }
        }
    }, {
        key: "changeOption",
        value: function changeOption(option, value) {
            this.state.options[option] = value;
            this.setState({
                options: this.state.options
            });
        }
    }, {
        key: "guid",
        value: function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
    }, {
        key: "sort",
        value: function sort(collection) {
            collection.sort(function (a, b) {
                var aName = a.name.toLowerCase();
                var bName = b.name.toLowerCase();
                if (aName < bName) return -1;
                if (aName > bName) return 1;
                return 0;
            });
        }

        /////////////////////////////////////////////////////////////////////////////

    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            try {
                var content = null;
                var action = null;
                switch (this.state.view) {
                    case "home":
                        content = React.createElement(HomeScreen, null);
                        break;
                    case "parties":
                        content = React.createElement(PartiesScreen, {
                            parties: this.state.parties,
                            selection: this.getParty(this.state.selectedPartyID),
                            showHelp: this.state.options.showHelp,
                            selectParty: function selectParty(party) {
                                return _this5.selectParty(party);
                            },
                            addParty: function addParty(name) {
                                return _this5.addParty(name);
                            },
                            removeParty: function removeParty() {
                                return _this5.removeParty();
                            },
                            addPC: function addPC(name) {
                                return _this5.addPC(name);
                            },
                            removePC: function removePC(pc) {
                                return _this5.removePC(pc);
                            },
                            sortPCs: function sortPCs() {
                                return _this5.sortPCs();
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this5.changeValue(combatant, type, value);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this5.nudgeValue(combatant, type, delta);
                            }
                        });
                        break;
                    case "library":
                        content = React.createElement(MonsterLibraryScreen, {
                            library: this.state.library,
                            selection: this.getMonsterGroup(this.state.selectedMonsterGroupID),
                            showHelp: this.state.options.showHelp,
                            selectMonsterGroup: function selectMonsterGroup(group) {
                                return _this5.selectMonsterGroup(group);
                            },
                            addMonsterGroup: function addMonsterGroup(name) {
                                return _this5.addMonsterGroup(name);
                            },
                            removeMonsterGroup: function removeMonsterGroup() {
                                return _this5.removeMonsterGroup();
                            },
                            addMonster: function addMonster(name) {
                                return _this5.addMonster(name);
                            },
                            removeMonster: function removeMonster(monster) {
                                return _this5.removeMonster(monster);
                            },
                            sortMonsters: function sortMonsters() {
                                return _this5.sortMonsters();
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this5.changeValue(combatant, type, value);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this5.nudgeValue(combatant, type, delta);
                            },
                            addTrait: function addTrait(combatant, type) {
                                return _this5.addTrait(combatant, type);
                            },
                            removeTrait: function removeTrait(combatant, trait) {
                                return _this5.removeTrait(combatant, trait);
                            },
                            editMonster: function editMonster(combatant) {
                                return _this5.setModal(combatant);
                            },
                            cloneMonster: function cloneMonster(combatant) {
                                return _this5.cloneMonster(combatant);
                            },
                            moveToGroup: function moveToGroup(combatant, group) {
                                return _this5.moveToGroup(combatant, group);
                            },
                            addOpenGameContent: function addOpenGameContent() {
                                return _this5.addOpenGameContent();
                            }
                        });
                        var count = 0;
                        this.state.library.forEach(function (group) {
                            count += group.monsters.length;
                        });
                        if (count > 0) {
                            action = React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "button",
                                    { onClick: function onClick() {
                                            return _this5.setModal("demographics");
                                        } },
                                    "demographics"
                                )
                            );
                        }
                        break;
                    case "encounter":
                        content = React.createElement(EncounterBuilderScreen, {
                            encounters: this.state.encounters,
                            selection: this.getEncounter(this.state.selectedEncounterID),
                            parties: this.state.parties,
                            library: this.state.library,
                            showHelp: this.state.options.showHelp,
                            selectEncounter: function selectEncounter(encounter) {
                                return _this5.selectEncounter(encounter);
                            },
                            addEncounter: function addEncounter(name) {
                                return _this5.addEncounter(name);
                            },
                            removeEncounter: function removeEncounter(encounter) {
                                return _this5.removeEncounter(encounter);
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this5.changeValue(combatant, type, value);
                            },
                            getMonster: function getMonster(monsterName, monsterGroupName) {
                                return _this5.getMonster(monsterName, _this5.getMonsterGroupByName(monsterGroupName));
                            },
                            addEncounterSlot: function addEncounterSlot(encounter, monster) {
                                return _this5.addEncounterSlot(encounter, monster);
                            },
                            removeEncounterSlot: function removeEncounterSlot(encounter, slot) {
                                return _this5.removeEncounterSlot(encounter, slot);
                            },
                            nudgeValue: function nudgeValue(slot, type, delta) {
                                return _this5.nudgeValue(slot, type, delta);
                            }
                        });
                        break;
                    case "combat":
                        var combat = this.getCombat(this.state.selectedCombatID);
                        content = React.createElement(CombatManagerScreen, {
                            parties: this.state.parties,
                            encounters: this.state.encounters,
                            combats: this.state.combats,
                            combat: combat,
                            showHelp: this.state.options.showHelp,
                            startEncounter: function startEncounter(party, encounter) {
                                return _this5.startEncounter(party, encounter);
                            },
                            pauseEncounter: function pauseEncounter() {
                                return _this5.pauseEncounter();
                            },
                            resumeEncounter: function resumeEncounter(combat) {
                                return _this5.resumeEncounter(combat);
                            },
                            endEncounter: function endEncounter() {
                                return _this5.endEncounter();
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this5.nudgeValue(combatant, type, delta);
                            },
                            makeCurrent: function makeCurrent(combatant) {
                                return _this5.makeCurrent(combatant);
                            },
                            makeActive: function makeActive(combatant) {
                                return _this5.makeActive(combatant);
                            },
                            makeDefeated: function makeDefeated(combatant) {
                                return _this5.makeDefeated(combatant);
                            },
                            removeCombatant: function removeCombatant(combatant) {
                                return _this5.removeCombatant(combatant);
                            },
                            addCondition: function addCondition(combatant, condition) {
                                return _this5.addCondition(combatant, condition);
                            },
                            removeCondition: function removeCondition(combatant, condition) {
                                return _this5.removeCondition(combatant, condition);
                            },
                            endTurn: function endTurn(combatant) {
                                return _this5.endTurn(combatant);
                            }
                        });
                        if (combat) {
                            action = React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "button",
                                        { onClick: function onClick() {
                                                return _this5.pauseEncounter();
                                            } },
                                        "pause encounter"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "button",
                                        { onClick: function onClick() {
                                                return _this5.endEncounter();
                                            } },
                                        "end encounter"
                                    )
                                )
                            );
                        }
                        break;
                    case "about":
                        content = React.createElement(AboutScreen, {
                            showHelp: this.state.options.showHelp,
                            options: this.state.options,
                            toggleHelp: function toggleHelp(value) {
                                return _this5.toggleHelp(value);
                            },
                            resetAll: function resetAll() {
                                return _this5.resetAll();
                            },
                            changeOption: function changeOption(option, value) {
                                return _this5.changeOption(option, value);
                            }
                        });
                        break;
                }

                var modal = null;
                if (this.state.modal) {
                    var modalContent = null;
                    if (this.state.modal === "demographics") {
                        modalContent = React.createElement(DemographicsCard, {
                            library: this.state.library,
                            close: function close() {
                                return _this5.setModal(null);
                            }
                        });
                    }
                    if (this.state.modal.type === "monster") {
                        modalContent = React.createElement(MonsterCard, {
                            key: this.state.modal.id,
                            combatant: this.state.modal,
                            mode: "editor",
                            changeValue: function changeValue(combatant, type, value) {
                                return _this5.changeValue(combatant, type, value);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this5.nudgeValue(combatant, type, delta);
                            },
                            changeTrait: function changeTrait(trait, type, value) {
                                return _this5.changeValue(trait, type, value);
                            },
                            addTrait: function addTrait(combatant, type) {
                                return _this5.addTrait(combatant, type);
                            },
                            removeTrait: function removeTrait(combatant, trait) {
                                return _this5.removeTrait(combatant, trait);
                            },
                            closeEditor: function closeEditor() {
                                return _this5.setModal(null);
                            }
                        });
                    }
                    modal = React.createElement(
                        "div",
                        { className: "overlay" },
                        React.createElement(
                            "div",
                            { className: "modal scrollable" },
                            modalContent
                        )
                    );
                }

                var contentStyle = "page-content";
                if (modal !== null) {
                    contentStyle += " blur";
                }

                return React.createElement(
                    "div",
                    { className: "dojo" },
                    React.createElement(Titlebar, {
                        view: this.state.view,
                        parties: this.state.parties,
                        library: this.state.library,
                        encounters: this.state.encounters,
                        action: action,
                        blur: modal !== null,
                        setView: function setView(view) {
                            return _this5.setView(view);
                        }
                    }),
                    React.createElement(
                        "div",
                        { className: contentStyle },
                        content
                    ),
                    modal
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return Dojo;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CombatListItem = function (_React$Component) {
    _inherits(CombatListItem, _React$Component);

    function CombatListItem() {
        _classCallCheck(this, CombatListItem);

        return _possibleConstructorReturn(this, (CombatListItem.__proto__ || Object.getPrototypeOf(CombatListItem)).apply(this, arguments));
    }

    _createClass(CombatListItem, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var combatName = this.props.combat.name;
                if (!combatName) {
                    combatName = "unnamed combat";
                }

                var style = this.props.selected ? "list-item selected" : "list-item";

                return React.createElement(
                    "div",
                    { className: "group" },
                    React.createElement(
                        "div",
                        { className: style, onClick: function onClick() {
                                return _this2.props.setSelection(_this2.props.combat);
                            } },
                        React.createElement(
                            "div",
                            { className: "heading" },
                            combatName
                        ),
                        React.createElement(
                            "div",
                            { className: "text" },
                            this.props.combat.timestamp
                        )
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return CombatListItem;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EncounterListItem = function (_React$Component) {
    _inherits(EncounterListItem, _React$Component);

    function EncounterListItem() {
        _classCallCheck(this, EncounterListItem);

        return _possibleConstructorReturn(this, (EncounterListItem.__proto__ || Object.getPrototypeOf(EncounterListItem)).apply(this, arguments));
    }

    _createClass(EncounterListItem, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var encounterName = this.props.encounter.name;
                if (!encounterName) {
                    encounterName = "unnamed encounter";
                }

                var slots = [];
                for (var n = 0; n !== this.props.encounter.slots.length; ++n) {
                    var slot = this.props.encounter.slots[n];
                    var text = slot.monsterName;
                    if (!text) {
                        text = "unnamed monster";
                    }
                    if (slot.count > 1) {
                        text += " x" + slot.count;
                    }
                    slots.push(React.createElement(
                        "div",
                        { key: slot.id, className: "text" },
                        text
                    ));
                }
                if (slots.length === 0) {
                    slots.push(React.createElement(
                        "div",
                        { key: "empty", className: "text" },
                        "no monsters"
                    ));
                }

                var style = this.props.selected ? "list-item selected" : "list-item";

                return React.createElement(
                    "div",
                    { className: "group" },
                    React.createElement(
                        "div",
                        { className: style, onClick: function onClick() {
                                return _this2.props.setSelection(_this2.props.encounter);
                            } },
                        React.createElement(
                            "div",
                            { className: "heading" },
                            encounterName
                        ),
                        slots
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return EncounterListItem;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MonsterGroupListItem = function (_React$Component) {
    _inherits(MonsterGroupListItem, _React$Component);

    function MonsterGroupListItem() {
        _classCallCheck(this, MonsterGroupListItem);

        return _possibleConstructorReturn(this, (MonsterGroupListItem.__proto__ || Object.getPrototypeOf(MonsterGroupListItem)).apply(this, arguments));
    }

    _createClass(MonsterGroupListItem, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var groupName = this.props.group.name;
                if (!groupName) {
                    groupName = "unnamed group";
                }

                var matchGroup = match(this.props.filter, this.props.group.name);

                var monsters = [];
                for (var n = 0; n !== this.props.group.monsters.length; ++n) {
                    var monster = this.props.group.monsters[n];
                    var matchMonster = match(this.props.filter, monster.name);
                    if (matchGroup || matchMonster) {
                        var name = monster.name;
                        if (!name) {
                            name = "unnamed monster";
                        }
                        monsters.push(React.createElement(
                            "div",
                            { key: monster.id, className: "text" },
                            name
                        ));
                    }
                }
                if (monsters.length === 0) {
                    monsters.push(React.createElement(
                        "div",
                        { key: "empty", className: "text" },
                        "no monsters"
                    ));
                }

                var style = this.props.selected ? "list-item selected" : "list-item";

                return React.createElement(
                    "div",
                    { className: "group" },
                    React.createElement(
                        "div",
                        { className: style, onClick: function onClick() {
                                return _this2.props.setSelection(_this2.props.group);
                            } },
                        React.createElement(
                            "div",
                            { className: "heading" },
                            groupName
                        ),
                        monsters
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MonsterGroupListItem;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartyListItem = function (_React$Component) {
    _inherits(PartyListItem, _React$Component);

    function PartyListItem() {
        _classCallCheck(this, PartyListItem);

        return _possibleConstructorReturn(this, (PartyListItem.__proto__ || Object.getPrototypeOf(PartyListItem)).apply(this, arguments));
    }

    _createClass(PartyListItem, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var partyName = this.props.party.name;
                if (!partyName) {
                    partyName = "unnamed party";
                }

                var pcs = [];
                for (var n = 0; n !== this.props.party.pcs.length; ++n) {
                    var pc = this.props.party.pcs[n];
                    var name = pc.name;
                    if (pc.player) {
                        name += " (" + pc.player + ")";
                    }
                    if (!name) {
                        name = "unnamed pc";
                    }
                    pcs.push(React.createElement(
                        "div",
                        { key: pc.id, className: "text" },
                        name
                    ));
                }
                if (pcs.length === 0) {
                    pcs.push(React.createElement(
                        "div",
                        { key: "empty", className: "text" },
                        "no pcs"
                    ));
                }

                var style = this.props.selected ? "list-item selected" : "list-item";

                return React.createElement(
                    "div",
                    { className: "group" },
                    React.createElement(
                        "div",
                        { className: style, onClick: function onClick() {
                                return _this2.props.setSelection(_this2.props.party);
                            } },
                        React.createElement(
                            "div",
                            { className: "heading" },
                            partyName
                        ),
                        pcs
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return PartyListItem;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AbilityScorePanel = function (_React$Component) {
    _inherits(AbilityScorePanel, _React$Component);

    function AbilityScorePanel() {
        _classCallCheck(this, AbilityScorePanel);

        var _this = _possibleConstructorReturn(this, (AbilityScorePanel.__proto__ || Object.getPrototypeOf(AbilityScorePanel)).call(this));

        _this.state = {
            showAbilityScores: false
        };
        return _this;
    }

    _createClass(AbilityScorePanel, [{
        key: "toggleAbilityScores",
        value: function toggleAbilityScores() {
            this.setState({
                showAbilityScores: !this.state.showAbilityScores
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var result = null;

                if (this.props.edit) {
                    result = React.createElement(
                        "div",
                        { className: "section" },
                        React.createElement(
                            "div",
                            { className: "ability-scores" },
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "spin" },
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.str", -1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/minus.svg" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin" },
                                        React.createElement(
                                            "div",
                                            { className: "ability-heading" },
                                            "str"
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "ability-value" },
                                            this.props.combatant.abilityScores.str
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.str", +1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/plus.svg" })
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "spin" },
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.dex", -1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/minus.svg" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin" },
                                        React.createElement(
                                            "div",
                                            { className: "ability-heading" },
                                            "dex"
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "ability-value" },
                                            this.props.combatant.abilityScores.dex
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.dex", +1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/plus.svg" })
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "spin" },
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.con", -1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/minus.svg" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin" },
                                        React.createElement(
                                            "div",
                                            { className: "ability-heading" },
                                            "con"
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "ability-value" },
                                            this.props.combatant.abilityScores.con
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.con", +1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/plus.svg" })
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "spin" },
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.int", -1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/minus.svg" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin" },
                                        React.createElement(
                                            "div",
                                            { className: "ability-heading" },
                                            "int"
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "ability-value" },
                                            this.props.combatant.abilityScores.int
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.int", +1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/plus.svg" })
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "spin" },
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.wis", -1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/minus.svg" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin" },
                                        React.createElement(
                                            "div",
                                            { className: "ability-heading" },
                                            "wis"
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "ability-value" },
                                            this.props.combatant.abilityScores.wis
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.wis", +1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/plus.svg" })
                                    )
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "spin" },
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.cha", -1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/minus.svg" })
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin" },
                                        React.createElement(
                                            "div",
                                            { className: "ability-heading" },
                                            "cha"
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "ability-value" },
                                            this.props.combatant.abilityScores.cha
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "ability-spin toggle", onClick: function onClick() {
                                                return _this2.props.nudgeValue("abilityScores.cha", +1);
                                            } },
                                        React.createElement("img", { className: "image", src: "content/plus.svg" })
                                    )
                                )
                            )
                        )
                    );
                } else {
                    result = React.createElement(
                        "div",
                        { className: "section" },
                        React.createElement(
                            "div",
                            { className: "ability-scores toggle", onClick: function onClick() {
                                    return _this2.toggleAbilityScores();
                                } },
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "ability-heading" },
                                    "str"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "ability-value" },
                                    this.state.showAbilityScores ? this.props.combatant.abilityScores.str : modifier(this.props.combatant.abilityScores.str)
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "ability-heading" },
                                    "dex"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "ability-value" },
                                    this.state.showAbilityScores ? this.props.combatant.abilityScores.dex : modifier(this.props.combatant.abilityScores.dex)
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "ability-heading" },
                                    "con"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "ability-value" },
                                    this.state.showAbilityScores ? this.props.combatant.abilityScores.con : modifier(this.props.combatant.abilityScores.con)
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "ability-heading" },
                                    "int"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "ability-value" },
                                    this.state.showAbilityScores ? this.props.combatant.abilityScores.int : modifier(this.props.combatant.abilityScores.int)
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "ability-heading" },
                                    "wis"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "ability-value" },
                                    this.state.showAbilityScores ? this.props.combatant.abilityScores.wis : modifier(this.props.combatant.abilityScores.wis)
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "ability-score" },
                                React.createElement(
                                    "div",
                                    { className: "ability-heading" },
                                    "cha"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "ability-value" },
                                    this.state.showAbilityScores ? this.props.combatant.abilityScores.cha : modifier(this.props.combatant.abilityScores.cha)
                                )
                            )
                        )
                    );
                }

                return result;
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return AbilityScorePanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CardGroup = function (_React$Component) {
    _inherits(CardGroup, _React$Component);

    function CardGroup() {
        _classCallCheck(this, CardGroup);

        var _this = _possibleConstructorReturn(this, (CardGroup.__proto__ || Object.getPrototypeOf(CardGroup)).call(this));

        _this.state = {
            showCards: true
        };
        return _this;
    }

    _createClass(CardGroup, [{
        key: "toggleCards",
        value: function toggleCards() {
            this.setState({
                showCards: !this.state.showCards
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                if (this.props.hidden) {
                    return null;
                }

                var heading = null;
                if (this.props.heading) {
                    var close = null;
                    if (this.props.showClose) {
                        close = React.createElement("img", { className: "image", src: "content/close-black.svg", onClick: function onClick() {
                                return _this2.props.close();
                            } });
                    }

                    var toggle = null;
                    if (this.props.showToggle) {
                        var style = this.state.showCards ? "image rotate" : "image";
                        toggle = React.createElement("img", { className: style, src: "content/down-arrow-black.svg", onClick: function onClick() {
                                return _this2.toggleCards();
                            } });
                    }

                    heading = React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            this.props.heading
                        ),
                        toggle,
                        close
                    );
                }

                var cards = [];
                if (this.props.content && this.state.showCards) {
                    cards = this.props.content;
                }

                return React.createElement(
                    "div",
                    { className: "card-group" },
                    heading,
                    cards
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return CardGroup;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CombatStartPanel = function (_React$Component) {
    _inherits(CombatStartPanel, _React$Component);

    function CombatStartPanel() {
        _classCallCheck(this, CombatStartPanel);

        var _this = _possibleConstructorReturn(this, (CombatStartPanel.__proto__ || Object.getPrototypeOf(CombatStartPanel)).call(this));

        _this.state = {
            partyDropdownOpen: false,
            party: null,
            encounterDropdownOpen: false,
            encounter: null
        };
        return _this;
    }

    _createClass(CombatStartPanel, [{
        key: "selectParty",
        value: function selectParty(party) {
            if (party) {
                this.setState({
                    partyDropdownOpen: false,
                    party: party
                });
            } else {
                this.setState({
                    partyDropdownOpen: !this.state.partyDropdownOpen,
                    encounterDropdownOpen: false
                });
            }
        }
    }, {
        key: "selectEncounter",
        value: function selectEncounter(encounter) {
            if (encounter) {
                this.setState({
                    encounterDropdownOpen: false,
                    encounter: encounter
                });
            } else {
                this.setState({
                    partyDropdownOpen: false,
                    encounterDropdownOpen: !this.state.encounterDropdownOpen
                });
            }
        }
    }, {
        key: "startEncounter",
        value: function startEncounter() {
            if (this.state.party && this.state.encounter) {
                this.props.startEncounter(this.state.party, this.state.encounter);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var items = [];

                if (this.props.parties.length === 0) {
                    items.push(React.createElement(
                        "div",
                        { key: "no-parties", className: "text" },
                        "you have not defined any pcs"
                    ));
                } else {
                    var partyDropdownItems = [];
                    for (var n = 0; n !== this.props.parties.length; ++n) {
                        var party = this.props.parties[n];
                        var partyName = party.name;
                        if (!partyName) {
                            partyName = "unnamed party";
                        }
                        partyDropdownItems.push(React.createElement(DropdownItem, {
                            key: party.id,
                            text: partyName,
                            item: party,
                            selected: this.state.party === party,
                            onSelect: function onSelect(item) {
                                return _this2.selectParty(item);
                            } }));
                    }

                    var partyName = "select party";
                    var partyContent = null;
                    if (this.state.party) {
                        partyName = this.state.party.name;
                        if (!partyName) {
                            partyName = "unnamed party";
                        }
                        var pcs = [];
                        for (var n = 0; n !== this.state.party.pcs.length; ++n) {
                            var pc = this.state.party.pcs[n];
                            var name = pc.name;
                            if (!name) {
                                name = "unnamed pc";
                            }
                            pcs.push(React.createElement(
                                "li",
                                { key: pc.id },
                                name
                            ));
                        };
                        if (pcs.length === 0) {
                            pcs.push(React.createElement(
                                "li",
                                { key: "empty" },
                                "no pcs"
                            ));
                        }
                        partyContent = React.createElement(
                            "ul",
                            null,
                            pcs
                        );
                    }
                    items.push(React.createElement(
                        "div",
                        { key: "partySelect", className: "dropdown" },
                        React.createElement(
                            "button",
                            { className: "dropdown-button", onClick: function onClick() {
                                    return _this2.selectParty();
                                } },
                            React.createElement(
                                "div",
                                { className: "title" },
                                partyName
                            ),
                            React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.partyDropdownOpen ? "dropdown-content open" : "dropdown-content" },
                            partyDropdownItems
                        )
                    ));
                    items.push(React.createElement(
                        "div",
                        { key: "party", className: "" },
                        partyContent
                    ));
                }

                if (this.props.encounters.length === 0) {
                    items.push(React.createElement(
                        "div",
                        { key: "no-encounters", className: "text" },
                        "you have not built any encounters"
                    ));
                } else {
                    var encounterDropdownItems = [];
                    for (var n = 0; n !== this.props.encounters.length; ++n) {
                        var encounter = this.props.encounters[n];
                        var encounterName = encounter.name;
                        if (!encounterName) {
                            encounterName = "unnamed encounter";
                        }
                        encounterDropdownItems.push(React.createElement(DropdownItem, {
                            key: encounter.id,
                            text: encounterName,
                            item: encounter,
                            selected: this.state.encounter === encounter,
                            onSelect: function onSelect(item) {
                                return _this2.selectEncounter(item);
                            } }));
                    }

                    var encounterName = "select encounter";
                    var encounterContent = null;
                    if (this.state.encounter) {
                        encounterName = this.state.encounter.name;
                        if (!encounterName) {
                            encounterName = "unnamed encounter";
                        }
                        var monsters = [];
                        for (var n = 0; n !== this.state.encounter.slots.length; ++n) {
                            var slot = this.state.encounter.slots[n];
                            var name = slot.monsterName;
                            if (!name) {
                                name = "unnamed monster";
                            }
                            if (slot.count > 1) {
                                name += " x" + slot.count;
                            }
                            monsters.push(React.createElement(
                                "li",
                                { key: slot.id },
                                name
                            ));
                        };
                        if (monsters.length === 0) {
                            monsters.push(React.createElement(
                                "li",
                                { key: "empty" },
                                "no monsters"
                            ));
                        }
                        encounterContent = React.createElement(
                            "ul",
                            null,
                            monsters
                        );
                    }
                    items.push(React.createElement(
                        "div",
                        { key: "encounterSelect", className: "dropdown" },
                        React.createElement(
                            "button",
                            { className: "dropdown-button", onClick: function onClick() {
                                    return _this2.selectEncounter();
                                } },
                            React.createElement(
                                "div",
                                { className: "title" },
                                encounterName
                            ),
                            React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.encounterDropdownOpen ? "dropdown-content open" : "dropdown-content" },
                            encounterDropdownItems
                        )
                    ));
                    items.push(React.createElement(
                        "div",
                        { key: "encounter", className: "" },
                        encounterContent
                    ));
                }

                items.push(React.createElement("div", { key: "start-div", className: "divider" }));
                items.push(React.createElement(
                    "button",
                    { key: "start", className: this.state.party && this.state.encounter ? "" : "disabled", onClick: function onClick() {
                            return _this2.startEncounter();
                        } },
                    "start encounter"
                ));

                return React.createElement(
                    "div",
                    { className: "group options-group" },
                    items
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return CombatStartPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConditionPanel = function (_React$Component) {
    _inherits(ConditionPanel, _React$Component);

    function ConditionPanel() {
        _classCallCheck(this, ConditionPanel);

        var _this = _possibleConstructorReturn(this, (ConditionPanel.__proto__ || Object.getPrototypeOf(ConditionPanel)).call(this));

        _this.state = {
            showDetails: false
        };
        return _this;
    }

    _createClass(ConditionPanel, [{
        key: "toggleDetails",
        value: function toggleDetails() {
            this.setState({
                showDetails: !this.state.showDetails
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var details = [];
                if (this.state.showDetails) {
                    if (this.props.condition.name === "exhausted") {
                        details.push(React.createElement(
                            "div",
                            { key: "spin", className: "section spin" },
                            React.createElement(
                                "div",
                                { className: "spin-button wide toggle", onClick: function onClick() {
                                        return _this2.props.nudgeConditionValue(_this2.props.condition, "level", -1);
                                    } },
                                React.createElement("img", { className: "image", src: "content/minus.svg" })
                            ),
                            React.createElement(
                                "div",
                                { className: "spin-value" },
                                React.createElement(
                                    "div",
                                    { className: "spin-label" },
                                    "level"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "spin-label" },
                                    this.props.condition.level
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "spin-button wide toggle", onClick: function onClick() {
                                        return _this2.props.nudgeConditionValue(_this2.props.condition, "level", +1);
                                    } },
                                React.createElement("img", { className: "image", src: "content/plus.svg" })
                            )
                        ));
                        details.push(React.createElement("div", { key: "div1", className: "divider" }));
                    }
                    var text = conditionText(this.props.condition);
                    for (var n = 0; n != text.length; ++n) {
                        details.push(React.createElement(
                            "div",
                            { key: n, className: "condition-text" },
                            text[n]
                        ));
                    }
                    details.push(React.createElement("div", { key: "div2", className: "divider" }));
                    details.push(React.createElement(
                        "div",
                        { key: "remove", className: "section" },
                        React.createElement(ConfirmButton, { key: "remove", text: "remove condition", callback: function callback() {
                                return _this2.props.removeCondition(_this2.props.condition);
                            } })
                    ));
                }

                var content = null;
                if (details.length !== 0) {
                    content = React.createElement(
                        "div",
                        { className: "mini-card-content" },
                        details
                    );
                }

                var name = this.props.condition.name;
                if (this.props.condition.name === "exhausted") {
                    name += " (" + this.props.condition.level + ")";
                }
                var imageStyle = this.state.showDetails ? "image rotate" : "image";

                return React.createElement(
                    "div",
                    { className: "mini-card" },
                    React.createElement(
                        "div",
                        { className: "heading", onClick: function onClick() {
                                return _this2.toggleDetails();
                            } },
                        React.createElement(
                            "div",
                            { className: "title" },
                            name
                        ),
                        React.createElement("img", { className: imageStyle, src: "content/down-arrow.svg" })
                    ),
                    content
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return ConditionPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConditionsPanel = function (_React$Component) {
    _inherits(ConditionsPanel, _React$Component);

    function ConditionsPanel() {
        _classCallCheck(this, ConditionsPanel);

        var _this = _possibleConstructorReturn(this, (ConditionsPanel.__proto__ || Object.getPrototypeOf(ConditionsPanel)).call(this));

        _this.state = {
            conditionDropDown: false
        };
        return _this;
    }

    _createClass(ConditionsPanel, [{
        key: "addCondition",
        value: function addCondition(condition) {
            if (condition) {
                this.props.addCondition({
                    name: condition,
                    level: 1
                });
                this.setState({
                    conditionDropdownOpen: false
                });
            } else {
                this.setState({
                    conditionDropdownOpen: !this.state.conditionDropdownOpen
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var conditions = ["blinded", "charmed", "deafened", "exhausted", "frightened", "grappled", "incapacitated", "invisible", "paralyzed", "petrified", "poisoned", "prone", "restrained", "stunned", "unconscious"];
                var conditionDropdownItems = [];
                conditions.forEach(function (condition) {
                    conditionDropdownItems.push(React.createElement(DropdownItem, {
                        key: condition,
                        text: condition,
                        item: condition,
                        selected: false,
                        onSelect: function onSelect(item) {
                            return _this2.addCondition(item);
                        } }));
                });
                var conditions = [];
                for (var n = 0; n != this.props.combatant.conditions.length; ++n) {
                    var condition = this.props.combatant.conditions[n];
                    conditions.push(React.createElement(ConditionPanel, {
                        key: n,
                        condition: condition,
                        nudgeConditionValue: function nudgeConditionValue(condition, type, delta) {
                            return _this2.props.nudgeConditionValue(condition, type, delta);
                        },
                        removeCondition: function removeCondition(condition) {
                            return _this2.props.removeCondition(condition);
                        }
                    }));
                }

                return React.createElement(
                    "div",
                    { className: "section" },
                    conditions,
                    React.createElement(
                        "div",
                        { className: "dropdown" },
                        React.createElement(
                            "button",
                            { className: "dropdown-button", onClick: function onClick() {
                                    return _this2.addCondition();
                                } },
                            React.createElement(
                                "div",
                                { className: "title" },
                                "add condition"
                            ),
                            React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                        ),
                        React.createElement(
                            "div",
                            { className: this.state.conditionDropdownOpen ? "dropdown-content open" : "dropdown-content" },
                            conditionDropdownItems
                        )
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return ConditionsPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HitPointGauge = function (_React$Component) {
    _inherits(HitPointGauge, _React$Component);

    function HitPointGauge() {
        _classCallCheck(this, HitPointGauge);

        return _possibleConstructorReturn(this, (HitPointGauge.__proto__ || Object.getPrototypeOf(HitPointGauge)).apply(this, arguments));
    }

    _createClass(HitPointGauge, [{
        key: "render",
        value: function render() {
            try {
                var hpMax = this.props.combatant.hpMax + this.props.combatant.hpTemp;
                var hpBloodied = this.props.combatant.hpMax / 2;
                var hpWidth = 100 * Math.max(this.props.combatant.hp, 0) / hpMax;

                var style = "";
                if (this.props.combatant.hp >= this.props.combatant.hpMax) {
                    style = "bar unhurt";
                } else if (this.props.combatant.hp <= hpBloodied) {
                    style = "bar bloodied";
                } else {
                    style = "bar injured";
                }

                var hpTempBar = null;
                if (this.props.combatant.hpTemp > 0) {
                    var hpTempWidth = 100 * Math.max(this.props.combatant.hpTemp, 0) / hpMax;
                    var hpTempBar = React.createElement("div", { className: "bar temp", style: { width: hpTempWidth + "%" } });
                }

                return React.createElement(
                    "div",
                    { className: "hp-gauge" },
                    React.createElement("div", { className: style, style: { width: hpWidth + "%" } }),
                    hpTempBar
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return HitPointGauge;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Titlebar = function (_React$Component) {
    _inherits(Titlebar, _React$Component);

    function Titlebar() {
        _classCallCheck(this, Titlebar);

        return _possibleConstructorReturn(this, (Titlebar.__proto__ || Object.getPrototypeOf(Titlebar)).apply(this, arguments));
    }

    _createClass(Titlebar, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var partiesStyle = this.props.view === "parties" ? "navigator-item selected" : "navigator-item";
                var libraryStyle = this.props.view === "library" ? "navigator-item selected" : "navigator-item";
                var encounterStyle = this.props.view === "encounter" ? "navigator-item selected" : "navigator-item";
                var combatStyle = this.props.view === "combat" ? "navigator-item selected" : "navigator-item";
                var aboutStyle = this.props.view === "about" ? "navigator-item selected" : "navigator-item";

                var encountersEnabled = this.props.library.length !== 0;
                var combatEnabled = this.props.parties.length !== 0 && this.props.encounters.length !== 0;
                if (!encountersEnabled) {
                    encounterStyle += " disabled";
                }
                if (!combatEnabled) {
                    combatStyle += " disabled";
                }

                var actionSection = null;
                if (this.props.action) {
                    actionSection = React.createElement(
                        "div",
                        { className: "action" },
                        this.props.action
                    );
                };

                return React.createElement(
                    "div",
                    { className: this.props.blur ? "titlebar blur" : "titlebar" },
                    React.createElement(
                        "div",
                        { className: partiesStyle, onClick: function onClick() {
                                return _this2.props.setView("parties");
                            } },
                        "player characters"
                    ),
                    React.createElement(
                        "div",
                        { className: libraryStyle, onClick: function onClick() {
                                return _this2.props.setView("library");
                            } },
                        "monster library"
                    ),
                    React.createElement(
                        "div",
                        { className: encounterStyle, onClick: function onClick() {
                                return encountersEnabled ? _this2.props.setView("encounter") : null;
                            } },
                        "encounter builder"
                    ),
                    React.createElement(
                        "div",
                        { className: combatStyle, onClick: function onClick() {
                                return combatEnabled ? _this2.props.setView("combat") : null;
                            } },
                        "combat manager"
                    ),
                    React.createElement(
                        "div",
                        { className: aboutStyle, onClick: function onClick() {
                                return _this2.props.setView("about");
                            } },
                        "about"
                    ),
                    actionSection
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return Titlebar;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TraitPanel = function (_React$Component) {
    _inherits(TraitPanel, _React$Component);

    function TraitPanel() {
        _classCallCheck(this, TraitPanel);

        var _this = _possibleConstructorReturn(this, (TraitPanel.__proto__ || Object.getPrototypeOf(TraitPanel)).call(this));

        _this.state = {
            showDetails: false,
            dropdownOpen: false
        };
        return _this;
    }

    _createClass(TraitPanel, [{
        key: "toggleDetails",
        value: function toggleDetails() {
            this.setState({
                showDetails: !this.state.showDetails
            });
        }
    }, {
        key: "selectType",
        value: function selectType(type) {
            if (type) {
                this.props.changeTrait(this.props.trait, "type", type);
                this.setState({
                    dropdownOpen: false
                });
            } else {
                this.setState({
                    dropdownOpen: !this.state.dropdownOpen
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var dropdownItems = [];
                var types = ["trait", "action", "legendary", "lair", "regional"];
                for (var n = 0; n !== types.length; ++n) {
                    var type = types[n];
                    dropdownItems.push(React.createElement(DropdownItem, {
                        key: n,
                        text: traitType(type),
                        item: type,
                        selected: this.props.trait.type === type,
                        onSelect: function onSelect(item) {
                            return _this2.selectType(item);
                        } }));
                }

                var details = null;
                if (this.state.showDetails) {
                    details = React.createElement(
                        "div",
                        { className: "mini-card-content" },
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "dropdown" },
                                React.createElement(
                                    "button",
                                    { className: "dropdown-button", onClick: function onClick() {
                                            return _this2.selectType();
                                        } },
                                    React.createElement(
                                        "div",
                                        { className: "title" },
                                        traitType(this.props.trait.type)
                                    ),
                                    React.createElement("img", { className: "image", src: "content/ellipsis.svg" })
                                ),
                                React.createElement(
                                    "div",
                                    { className: this.state.dropdownOpen ? "dropdown-content open" : "dropdown-content" },
                                    dropdownItems
                                )
                            ),
                            React.createElement("input", { type: "text", placeholder: "name", value: this.props.trait.name, onChange: function onChange(event) {
                                    return _this2.props.changeTrait(_this2.props.trait, "name", event.target.value);
                                } }),
                            React.createElement("input", { type: "text", placeholder: "usage", value: this.props.trait.usage, onChange: function onChange(event) {
                                    return _this2.props.changeTrait(_this2.props.trait, "usage", event.target.value);
                                } }),
                            React.createElement("textarea", { placeholder: "details", value: this.props.trait.text, onChange: function onChange(event) {
                                    return _this2.props.changeTrait(_this2.props.trait, "text", event.target.value);
                                } }),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(ConfirmButton, { text: "delete", callback: function callback() {
                                    return _this2.props.removeTrait(_this2.props.trait);
                                } })
                        )
                    );
                }

                var name = this.props.trait.name;
                if (!name) {
                    name = "unnamed trait";
                }

                var imageStyle = this.state.showDetails ? "image rotate" : "image";

                return React.createElement(
                    "div",
                    { className: "mini-card" },
                    React.createElement(
                        "div",
                        { className: "heading", onClick: function onClick() {
                                return _this2.toggleDetails();
                            } },
                        React.createElement(
                            "div",
                            { className: "title" },
                            name
                        ),
                        React.createElement("img", { className: imageStyle, src: "content/down-arrow.svg" })
                    ),
                    details
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return TraitPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TraitsPanel = function (_React$Component) {
    _inherits(TraitsPanel, _React$Component);

    function TraitsPanel() {
        _classCallCheck(this, TraitsPanel);

        return _possibleConstructorReturn(this, (TraitsPanel.__proto__ || Object.getPrototypeOf(TraitsPanel)).apply(this, arguments));
    }

    _createClass(TraitsPanel, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var traits = [];
                var actions = [];
                var legendaryActions = [];
                var lairActions = [];
                var regionalEffects = [];

                for (var n = 0; n != this.props.combatant.traits.length; ++n) {
                    var action = this.props.combatant.traits[n];
                    var heading = action.name;
                    if (!heading) {
                        heading = "unnamed " + traitType(action.type);
                    }
                    if (action.usage) {
                        heading += " (" + action.usage + ")";
                    }

                    var item = null;
                    if (this.props.edit) {
                        item = React.createElement(TraitPanel, {
                            key: action.id,
                            trait: action,
                            changeTrait: function changeTrait(action, type, value) {
                                return _this2.props.changeTrait(action, type, value);
                            },
                            removeTrait: function removeTrait(action) {
                                return _this2.props.removeTrait(action);
                            } });
                    } else {
                        item = React.createElement(
                            "div",
                            { key: action.id, className: "section trait" },
                            React.createElement(
                                "b",
                                null,
                                heading
                            ),
                            " ",
                            action.text
                        );
                    }

                    switch (action.type) {
                        case "trait":
                            traits.push(item);
                            break;
                        case "action":
                            actions.push(item);
                            break;
                        case "legendary":
                            legendaryActions.push(item);
                            break;
                        case "lair":
                            lairActions.push(item);
                            break;
                        case "regional":
                            regionalEffects.push(item);
                            break;
                    }
                }

                if (this.props.edit) {
                    traits.push(React.createElement(
                        "button",
                        { key: "add", onClick: function onClick() {
                                return _this2.props.addTrait("trait");
                            } },
                        "add a new trait"
                    ));
                    actions.push(React.createElement(
                        "button",
                        { key: "add", onClick: function onClick() {
                                return _this2.props.addTrait("action");
                            } },
                        "add a new action"
                    ));
                    legendaryActions.push(React.createElement(
                        "button",
                        { key: "add", onClick: function onClick() {
                                return _this2.props.addTrait("legendary");
                            } },
                        "add a new legendary action"
                    ));
                    lairActions.push(React.createElement(
                        "button",
                        { key: "add", onClick: function onClick() {
                                return _this2.props.addTrait("lair");
                            } },
                        "add a new lair action"
                    ));
                    regionalEffects.push(React.createElement(
                        "button",
                        { key: "add", onClick: function onClick() {
                                return _this2.props.addTrait("regional");
                            } },
                        "add a new regional effect"
                    ));
                }

                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { style: { display: traits.length > 0 ? "" : "none" } },
                        React.createElement(
                            "div",
                            { className: "section subheading" },
                            "traits"
                        ),
                        traits
                    ),
                    React.createElement(
                        "div",
                        { style: { display: actions.length > 0 ? "" : "none" } },
                        React.createElement(
                            "div",
                            { className: "section subheading" },
                            "actions"
                        ),
                        actions
                    ),
                    React.createElement(
                        "div",
                        { style: { display: legendaryActions.length > 0 ? "" : "none" } },
                        React.createElement(
                            "div",
                            { className: "section subheading" },
                            "legendary actions"
                        ),
                        legendaryActions
                    ),
                    React.createElement(
                        "div",
                        { style: { display: lairActions.length > 0 ? "" : "none" } },
                        React.createElement(
                            "div",
                            { className: "section subheading" },
                            "lair actions"
                        ),
                        lairActions
                    ),
                    React.createElement(
                        "div",
                        { style: { display: regionalEffects.length > 0 ? "" : "none" } },
                        React.createElement(
                            "div",
                            { className: "section subheading" },
                            "regional effects"
                        ),
                        regionalEffects
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return TraitsPanel;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AboutScreen = function (_React$Component) {
    _inherits(AboutScreen, _React$Component);

    function AboutScreen() {
        _classCallCheck(this, AboutScreen);

        return _possibleConstructorReturn(this, (AboutScreen.__proto__ || Object.getPrototypeOf(AboutScreen)).apply(this, arguments));
    }

    _createClass(AboutScreen, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                return React.createElement(
                    "div",
                    { className: "about" },
                    React.createElement(
                        "div",
                        { className: "left-pane scrollable" },
                        React.createElement(
                            "div",
                            { className: "group" },
                            React.createElement(
                                "div",
                                { className: "heading" },
                                "about"
                            ),
                            React.createElement(
                                "div",
                                { className: "text" },
                                "dm dojo by ",
                                React.createElement(
                                    "a",
                                    { href: "mailto:andy.aiken@live.co.uk" },
                                    "andy aiken"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "text" },
                                "dungeons and dragons copyright wizards of the coast"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "group" },
                            React.createElement(
                                "div",
                                { className: "heading" },
                                "options"
                            ),
                            React.createElement(ConfirmButton, { text: "clear all data", callback: function callback() {
                                    return _this2.props.resetAll();
                                } }),
                            React.createElement(
                                "div",
                                { className: "checkbox", onClick: function onClick() {
                                        return _this2.props.changeOption("showHelp", !_this2.props.options.showHelp);
                                    } },
                                React.createElement("img", { className: "image", src: this.props.options.showHelp ? "content/checked.svg" : "content/unchecked.svg" }),
                                React.createElement(
                                    "div",
                                    { className: "checkbox-text" },
                                    "show help cards"
                                )
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "right-pane scrollable" },
                        React.createElement(
                            "div",
                            { className: "group" },
                            React.createElement(
                                "div",
                                { className: "heading" },
                                "open game license version 1.0a"
                            ),
                            React.createElement(
                                "div",
                                { className: "text" },
                                "The following text is the property of Wizards of the Coast, Inc. and is Copyright 2000 Wizards of the Coast, Inc (\"Wizards\"). All Rights Reserved."
                            ),
                            React.createElement(
                                "ol",
                                null,
                                React.createElement(
                                    "li",
                                    null,
                                    "Definitions: (a)\"Contributors\" means the copyright and/or trademark owners who have contributed Open Game Content; (b)\"Derivative Material\" means copyrighted material including derivative works and translations (including into other computer languages), potation, modification, correction, addition, extension, upgrade, improvement, compilation, abridgment or other form in which an existing work may be recast, transformed or adapted; (c) \"Distribute\" means to reproduce, license, rent, lease, sell, broadcast, publicly display, transmit or otherwise distribute; (d)\"Open Game Content\" means the game mechanic and includes the methods, procedures, processes and routines to the extent such content does not embody the Product Identity and is an enhancement over the prior art and any additional content clearly identified as Open Game Content by the Contributor, and means any work covered by this License, including translations and derivative works under copyright law, but specifically excludes Product Identity. (e) \"Product Identity\" means product and product line names, logos and identifying marks including trade dress; artifacts; creatures characters; stories, storylines, plots, thematic elements, dialogue, incidents, language, artwork, symbols, designs, depictions, likenesses, formats, poses, concepts, themes and graphic, photographic and other visual or audio representations; names and descriptions of characters, spells, enchantments, personalities, teams, personas, likenesses and special abilities; places, locations, environments, creatures, equipment, magical or supernatural abilities or effects, logos, symbols, or graphic designs; and any other trademark or registered trademark clearly identified as Product identity by the owner of the Product Identity, and which specifically excludes the Open Game Content; (f) \"Trademark\" means the logos, names, mark, sign, motto, designs that are used by a Contributor to identify itself or its products or the associated products contributed to the Open Game License by the Contributor (g) \"Use\", \"Used\" or \"Using\" means to use, Distribute, copy, edit, format, modify, translate and otherwise create Derivative Material of Open Game Content. (h) \"You\" or \"Your\" means the licensee in terms of this agreement."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "The License: This License applies to any Open Game Content that contains a notice indicating that the Open Game Content may only be Used under and in terms of this License. You must affix such a notice to any Open Game Content that you Use. No terms may be added to or subtracted from this License except as described by the License itself. No other terms or conditions may be applied to any Open Game Content distributed using this License."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Offer and Acceptance: By Using the Open Game Content You indicate Your acceptance of the terms of this License."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Grant and Consideration: In consideration for agreeing to use this License, the Contributors grant You a perpetual, worldwide, royalty-free, non-exclusive license with the exact terms of this License to Use, the Open Game Content."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Representation of Authority to Contribute: If You are contributing original material as Open Game Content, You represent that Your Contributions are Your original creation and/or You have sufficient rights to grant the rights conveyed by this License."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Notice of License Copyright: You must update the COPYRIGHT NOTICE portion of this License to include the exact text of the COPYRIGHT NOTICE of any Open Game Content You are copying, modifying or distributing, and You must add the title, the copyright date, and the copyright holder's name to the COPYRIGHT NOTICE of any original Open Game Content you Distribute."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Use of Product Identity: You agree not to Use any Product Identity, including as an indication as to compatibility, except as expressly licensed in another, independent Agreement with the owner of each element of that Product Identity. You agree not to indicate compatibility or co-adaptability with any Trademark or Registered Trademark in conjunction with a work containing Open Game Content except as expressly licensed in another, independent Agreement with the owner of such Trademark or Registered Trademark. The use of any Product Identity in Open Game Content does not constitute a challenge to the ownership of that Product Identity. The owner of any Product Identity used in Open Game Content shall retain all rights, title and interest in and to that Product Identity."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Identification: If you distribute Open Game Content You must clearly indicate which portions of the work that you are distributing are Open Game Content."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Updating the License: Wizards or its designated Agents may publish updated versions of this License. You may use any authorized version of this License to copy, modify and distribute any Open Game Content originally distributed under any version of this License."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Copy of this License: You MUST include a copy of this License with every copy of the Open Game Content You Distribute."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Use of Contributor Credits: You may not market or advertise the Open Game Content using the name of any Contributor unless You have written permission from the Contributor to do so."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Inability to Comply: If it is impossible for You to comply with any of the terms of this License with respect to some or all of the Open Game Content due to statute, judicial order, or governmental regulation then You may not Use any Open Game Material so affected."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Termination: This License will terminate automatically if You fail to comply with all terms herein and fail to cure such breach within 30 days of becoming aware of the breach. All sublicenses shall survive the termination of this License."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "Reformation: If any provision of this License is held to be unenforceable, such provision shall be reformed only to the extent necessary to make it enforceable."
                                ),
                                React.createElement(
                                    "li",
                                    null,
                                    "COPYRIGHT NOTICE Open Game License v 1.0 Copyright 2000, Wizards of the Coast, Inc."
                                )
                            )
                        )
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return AboutScreen;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CombatManagerScreen = function (_React$Component) {
    _inherits(CombatManagerScreen, _React$Component);

    function CombatManagerScreen() {
        _classCallCheck(this, CombatManagerScreen);

        return _possibleConstructorReturn(this, (CombatManagerScreen.__proto__ || Object.getPrototypeOf(CombatManagerScreen)).apply(this, arguments));
    }

    _createClass(CombatManagerScreen, [{
        key: "createCard",
        value: function createCard(index, combatant, isPlaceholder) {
            var _this2 = this;

            if (isPlaceholder && isPlaceholder(combatant)) {
                return React.createElement(InfoCard, {
                    key: combatant.id,
                    getHeading: function getHeading() {
                        return React.createElement(
                            "div",
                            { className: "heading" },
                            combatant.name
                        );
                    },
                    getContent: function getContent() {
                        return React.createElement(
                            "div",
                            { className: "section" },
                            "current turn"
                        );
                    }
                });
            }

            switch (combatant.type) {
                case "pc":
                    return React.createElement(PCCard, {
                        key: combatant.id,
                        combatant: combatant,
                        mode: "combat",
                        changeValue: function changeValue(combatant, type, value) {
                            return _this2.props.changeValue(combatant, type, value);
                        },
                        nudgeValue: function nudgeValue(combatant, type, delta) {
                            return _this2.props.nudgeValue(combatant, type, delta);
                        },
                        makeCurrent: function makeCurrent(combatant) {
                            return _this2.props.makeCurrent(combatant);
                        },
                        makeActive: function makeActive(combatant) {
                            return _this2.props.makeActive(combatant);
                        },
                        makeDefeated: function makeDefeated(combatant) {
                            return _this2.props.makeDefeated(combatant);
                        },
                        removeCombatant: function removeCombatant(combatant) {
                            return _this2.props.removeCombatant(combatant);
                        },
                        endTurn: function endTurn(combatant) {
                            return _this2.props.endTurn(combatant);
                        }
                    });
                case "monster":
                    return React.createElement(MonsterCard, {
                        key: combatant.id,
                        combatant: combatant,
                        mode: "combat",
                        changeValue: function changeValue(combatant, type, value) {
                            return _this2.props.changeValue(combatant, type, value);
                        },
                        nudgeValue: function nudgeValue(combatant, type, delta) {
                            return _this2.props.nudgeValue(combatant, type, delta);
                        },
                        makeCurrent: function makeCurrent(combatant) {
                            return _this2.props.makeCurrent(combatant);
                        },
                        makeActive: function makeActive(combatant) {
                            return _this2.props.makeActive(combatant);
                        },
                        makeDefeated: function makeDefeated(combatant) {
                            return _this2.props.makeDefeated(combatant);
                        },
                        removeCombatant: function removeCombatant(combatant) {
                            return _this2.props.removeCombatant(combatant);
                        },
                        addCondition: function addCondition(combatant, condition) {
                            return _this2.props.addCondition(combatant, condition);
                        },
                        removeCondition: function removeCondition(combatant, condition) {
                            return _this2.props.removeCondition(combatant, condition);
                        },
                        nudgeConditionValue: function nudgeConditionValue(condition, type, delta) {
                            return _this2.props.nudgeValue(condition, type, delta);
                        },
                        endTurn: function endTurn(combatant) {
                            return _this2.props.endTurn(combatant);
                        }
                    });
                default:
                    return null;
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            try {
                var leftPaneContent = null;
                var rightPaneContent = null;

                if (this.props.combat) {
                    var current = [];
                    var active = [];
                    var pending = [];
                    var defeated = [];

                    for (var index = 0; index !== this.props.combat.combatants.length; ++index) {
                        var combatant = this.props.combat.combatants[index];
                        if (combatant.current) {
                            current.push(this.createCard(index, combatant));
                        }
                        if (combatant.pending && !combatant.active && !combatant.defeated) {
                            pending.push(this.createCard(index, combatant, function (combatant) {
                                return combatant.current;
                            }));
                        }
                        if (!combatant.pending && combatant.active && !combatant.defeated) {
                            active.push(this.createCard(index, combatant, function (combatant) {
                                return combatant.current;
                            }));
                        }
                        if (!combatant.pending && !combatant.active && combatant.defeated) {
                            defeated.push(this.createCard(index, combatant, function (combatant) {
                                return combatant.current;
                            }));
                        }
                    }

                    if (this.props.showHelp && pending.length !== 0) {
                        var help = React.createElement(InfoCard, {
                            key: "help",
                            getContent: function getContent() {
                                return React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "div",
                                        { className: "section" },
                                        "these pcs are not yet part of the encounter"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "section" },
                                        "set initiative on each pc, then add them to the encounter"
                                    )
                                );
                            }
                        });
                        pending = [].concat(help, pending);
                    }

                    if (this.props.showHelp && current.length === 0) {
                        var help = React.createElement(InfoCard, {
                            key: "help",
                            getContent: function getContent() {
                                return React.createElement(
                                    "div",
                                    null,
                                    React.createElement(
                                        "div",
                                        { className: "section" },
                                        "to begin the encounter, press ",
                                        React.createElement(
                                            "b",
                                            null,
                                            "start turn"
                                        ),
                                        " on one of the stat blocks in this section"
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "section" },
                                        "that stat block will then be displayed on the left"
                                    )
                                );
                            }
                        });
                        active = [].concat(help, active);
                    }

                    if (current.length === 0) {
                        current.push(React.createElement(InfoCard, {
                            key: "current",
                            getContent: function getContent() {
                                return React.createElement(
                                    "div",
                                    { className: "section" },
                                    "the current initiative holder will be displayed here"
                                );
                            }
                        }));
                    }

                    leftPaneContent = React.createElement(CardGroup, {
                        heading: "current turn",
                        content: current,
                        hidden: current.length === 0
                    });
                    rightPaneContent = React.createElement(
                        "div",
                        null,
                        React.createElement(CardGroup, {
                            heading: "waiting for intiative to be entered",
                            content: pending,
                            hidden: pending.length === 0
                        }),
                        React.createElement(CardGroup, {
                            heading: "active combatants",
                            content: active,
                            hidden: active.length === 0
                        }),
                        React.createElement(CardGroup, {
                            heading: "defeated",
                            content: defeated,
                            hidden: defeated.length === 0
                        })
                    );
                } else {
                    var help = null;
                    if (this.props.showHelp) {
                        help = React.createElement(CombatManagerCard, null);
                    }

                    var combats = [];
                    this.props.combats.forEach(function (combat) {
                        combats.push(React.createElement(CombatListItem, {
                            key: combat.id,
                            combat: combat,
                            setSelection: function setSelection(combat) {
                                return _this3.props.resumeEncounter(combat);
                            }
                        }));
                    });

                    leftPaneContent = React.createElement(
                        "div",
                        null,
                        help,
                        React.createElement(CombatStartPanel, {
                            parties: this.props.parties,
                            encounters: this.props.encounters,
                            startEncounter: function startEncounter(party, encounter) {
                                return _this3.props.startEncounter(party, encounter);
                            }
                        }),
                        combats
                    );
                }

                return React.createElement(
                    "div",
                    { className: "combat-manager" },
                    React.createElement(
                        "div",
                        { className: "left-pane scrollable" },
                        leftPaneContent
                    ),
                    React.createElement(
                        "div",
                        { className: "right-pane scrollable" },
                        rightPaneContent
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return CombatManagerScreen;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EncounterBuilderScreen = function (_React$Component) {
    _inherits(EncounterBuilderScreen, _React$Component);

    function EncounterBuilderScreen() {
        _classCallCheck(this, EncounterBuilderScreen);

        var _this = _possibleConstructorReturn(this, (EncounterBuilderScreen.__proto__ || Object.getPrototypeOf(EncounterBuilderScreen)).call(this));

        _this.state = {
            filter: {
                name: "",
                challengeMin: 0,
                challengeMax: 5,
                category: "all types",
                size: "all sizes"
            }
        };
        return _this;
    }

    _createClass(EncounterBuilderScreen, [{
        key: "inEncounter",
        value: function inEncounter(monster) {
            var result = false;

            var group = getMonsterGroup(monster, this.props.library);

            this.props.selection.slots.forEach(function (slot) {
                if (slot.monsterGroupName === group.name && slot.monsterName === monster.name) {
                    result = true;
                }
            });

            return result;
        }
    }, {
        key: "matchMonster",
        value: function matchMonster(monster) {
            if (monster.challenge < this.state.filter.challengeMin) {
                return false;
            }

            if (monster.challenge > this.state.filter.challengeMax) {
                return false;
            }

            if (this.state.filter.name !== "") {
                if (!match(this.state.filter.name, monster.name)) {
                    return false;
                }
            }

            if (this.state.filter.category !== "all types") {
                if (monster.category !== this.state.filter.category) {
                    return false;
                }
            }

            if (this.state.filter.size !== "all sizes") {
                if (monster.size !== this.state.filter.size) {
                    return false;
                }
            }

            return true;
        }
    }, {
        key: "changeFilterValue",
        value: function changeFilterValue(type, value) {
            this.state.filter[type] = value;
            this.setState({
                filter: this.state.filter
            });
        }
    }, {
        key: "nudgeFilterValue",
        value: function nudgeFilterValue(type, delta) {
            var value = nudgeChallenge(this.state.filter[type], delta);
            this.changeFilterValue(type, value);
        }
    }, {
        key: "resetFilter",
        value: function resetFilter() {
            this.setState({
                filter: {
                    name: "",
                    challengeMin: 0,
                    challengeMax: 5,
                    category: "all types",
                    size: "all sizes"
                }
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var help = null;
                if (this.props.showHelp) {
                    help = React.createElement(EncounterBuilderCard, { encounters: this.props.encounters });
                }

                var encounters = [];
                for (var n = 0; n !== this.props.encounters.length; ++n) {
                    var encounter = this.props.encounters[n];
                    encounters.push(React.createElement(EncounterListItem, {
                        key: encounter.id,
                        encounter: encounter,
                        selected: encounter === this.props.selection,
                        setSelection: function setSelection(encounter) {
                            return _this2.props.selectEncounter(encounter);
                        }
                    }));
                };

                var encounterCards = [];

                if (this.props.selection) {
                    encounterCards.push(React.createElement(EncounterCard, {
                        key: "info",
                        selection: this.props.selection,
                        parties: this.props.parties,
                        changeValue: function changeValue(type, value) {
                            return _this2.props.changeValue(_this2.props.selection, type, value);
                        },
                        removeEncounter: function removeEncounter() {
                            return _this2.props.removeEncounter();
                        },
                        getMonster: function getMonster(monsterName, monsterGroupName) {
                            return _this2.props.getMonster(monsterName, monsterGroupName);
                        }
                    }));

                    this.props.selection.slots.forEach(function (slot) {
                        var monster = _this2.props.getMonster(slot.monsterName, slot.monsterGroupName);
                        if (monster) {
                            encounterCards.push(React.createElement(MonsterCard, {
                                key: monster.id,
                                combatant: monster,
                                slot: slot,
                                mode: "view",
                                nudgeValue: function nudgeValue(slot, type, delta) {
                                    return _this2.props.nudgeValue(slot, type, delta);
                                },
                                removeEncounterSlot: function removeEncounterSlot(slot) {
                                    return _this2.props.removeEncounterSlot(slot);
                                }
                            }));
                        } else {
                            var index = _this2.props.selection.slots.indexOf(slot);
                            var error = "unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName;
                            encounterCards.push(React.createElement(ErrorCard, {
                                key: index,
                                getContent: function getContent() {
                                    return React.createElement(
                                        "div",
                                        { className: "section" },
                                        error
                                    );
                                }
                            }));
                        }
                    });
                    if (this.props.selection.slots.length === 0) {
                        encounterCards.push(React.createElement(InfoCard, {
                            key: "empty",
                            getContent: function getContent() {
                                return React.createElement(
                                    "div",
                                    { className: "section" },
                                    "no monsters"
                                );
                            }
                        }));
                    }
                }

                var libraryCards = [];
                libraryCards.push(React.createElement(FilterCard, {
                    key: "filter",
                    filter: this.state.filter,
                    changeValue: function changeValue(type, value) {
                        return _this2.changeFilterValue(type, value);
                    },
                    nudgeValue: function nudgeValue(type, delta) {
                        return _this2.nudgeFilterValue(type, delta);
                    },
                    resetFilter: function resetFilter() {
                        return _this2.resetFilter();
                    }
                }));

                var monsters = [];
                if (this.props.selection) {
                    this.props.library.forEach(function (group) {
                        group.monsters.forEach(function (monster) {
                            if (_this2.matchMonster(monster)) {
                                monsters.push(monster);
                            }
                        });
                    });
                    monsters.sort(function (a, b) {
                        if (a.name < b.name) return -1;
                        if (a.name > b.name) return 1;
                        return 0;
                    });
                }
                monsters.forEach(function (monster) {
                    if (_this2.inEncounter(monster)) {
                        var title = monster.name;
                        libraryCards.push(React.createElement(InfoCard, {
                            key: monster.id,
                            getHeading: function getHeading() {
                                return React.createElement(
                                    "div",
                                    { className: "heading" },
                                    title
                                );
                            },
                            getContent: function getContent() {
                                return React.createElement(
                                    "div",
                                    { className: "section" },
                                    "already in encounter"
                                );
                            }
                        }));
                    } else {
                        libraryCards.push(React.createElement(MonsterCard, {
                            key: monster.id,
                            combatant: monster,
                            mode: "view",
                            addEncounterSlot: function addEncounterSlot(combatant) {
                                return _this2.props.addEncounterSlot(combatant);
                            }
                        }));
                    }
                });

                var name = null;
                if (this.props.selection) {
                    name = this.props.selection.name;
                    if (!name) {
                        name = "unnamed encounter";
                    }
                }

                return React.createElement(
                    "div",
                    { className: "encounter-builder" },
                    React.createElement(
                        "div",
                        { className: "left-pane scrollable" },
                        help,
                        React.createElement(
                            "div",
                            { className: "group" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.addEncounter("new encounter");
                                    } },
                                "add a new encounter"
                            )
                        ),
                        encounters
                    ),
                    React.createElement(
                        "div",
                        { className: "right-pane scrollable" },
                        React.createElement(CardGroup, {
                            content: encounterCards,
                            heading: name,
                            showClose: this.props.selection !== null,
                            close: function close() {
                                return _this2.props.selectEncounter(null);
                            }
                        }),
                        React.createElement(CardGroup, {
                            heading: "monster library",
                            content: libraryCards,
                            hidden: !this.props.selection,
                            showToggle: true
                        })
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return EncounterBuilderScreen;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HomeScreen = function (_React$Component) {
    _inherits(HomeScreen, _React$Component);

    function HomeScreen() {
        _classCallCheck(this, HomeScreen);

        return _possibleConstructorReturn(this, (HomeScreen.__proto__ || Object.getPrototypeOf(HomeScreen)).apply(this, arguments));
    }

    _createClass(HomeScreen, [{
        key: "render",
        value: function render() {
            try {
                return React.createElement(
                    "div",
                    { className: "home scrollable" },
                    React.createElement(InfoCard, { centered: true, welcome: true, getContent: function getContent() {
                            return React.createElement(
                                "div",
                                null,
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    "welcome to ",
                                    React.createElement(
                                        "b",
                                        null,
                                        "dm dojo"
                                    )
                                ),
                                React.createElement("div", { className: "divider" }),
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "div",
                                        null,
                                        "dm dojo is an encounter manager for dungeons and dragons fifth edition"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "div",
                                        null,
                                        "with dm dojo you can:",
                                        React.createElement(
                                            "ul",
                                            null,
                                            React.createElement(
                                                "li",
                                                null,
                                                "build unique, challenging monsters"
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                "create encounters of just the right difficulty for your players"
                                            ),
                                            React.createElement(
                                                "li",
                                                null,
                                                "run combat without the book-keeping"
                                            )
                                        )
                                    )
                                )
                            );
                        } })
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return HomeScreen;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MonsterLibraryScreen = function (_React$Component) {
    _inherits(MonsterLibraryScreen, _React$Component);

    function MonsterLibraryScreen() {
        _classCallCheck(this, MonsterLibraryScreen);

        var _this = _possibleConstructorReturn(this, (MonsterLibraryScreen.__proto__ || Object.getPrototypeOf(MonsterLibraryScreen)).call(this));

        _this.state = {
            filter: ""
        };
        return _this;
    }

    _createClass(MonsterLibraryScreen, [{
        key: "setFilter",
        value: function setFilter(filter) {
            this.setState({
                filter: filter
            });
        }
    }, {
        key: "showMonsterGroup",
        value: function showMonsterGroup(group) {
            var _this2 = this;

            var result = match(this.state.filter, group.name);

            if (!result) {
                group.monsters.forEach(function (monster) {
                    result = match(_this2.state.filter, monster.name) || result;
                });
            }

            return result;
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            try {
                var help = null;
                if (this.props.showHelp) {
                    help = React.createElement(MonsterLibraryCard, {
                        library: this.props.library,
                        addOpenGameContent: function addOpenGameContent() {
                            return _this3.props.addOpenGameContent();
                        }
                    });
                }

                var listItems = [];
                for (var n = 0; n !== this.props.library.length; ++n) {
                    var group = this.props.library[n];
                    if (this.showMonsterGroup(group)) {
                        listItems.push(React.createElement(MonsterGroupListItem, {
                            key: group.id,
                            group: group,
                            filter: this.state.filter,
                            selected: group === this.props.selection,
                            setSelection: function setSelection(group) {
                                return _this3.props.selectMonsterGroup(group);
                            }
                        }));
                    }
                };

                var cards = [];

                if (this.props.selection) {
                    cards.push(React.createElement(MonsterGroupCard, {
                        key: "info",
                        selection: this.props.selection,
                        filter: this.state.filter,
                        addMonster: function addMonster(name) {
                            return _this3.props.addMonster(name);
                        },
                        sortMonsters: function sortMonsters() {
                            return _this3.props.sortMonsters();
                        },
                        changeValue: function changeValue(type, value) {
                            return _this3.props.changeValue(_this3.props.selection, type, value);
                        },
                        removeMonsterGroup: function removeMonsterGroup() {
                            return _this3.props.removeMonsterGroup();
                        }
                    }));

                    var monsters = this.props.selection.monsters.filter(function (monster) {
                        return match(_this3.state.filter, monster.name);
                    });

                    monsters.forEach(function (monster) {
                        cards.push(React.createElement(MonsterCard, {
                            key: monster.id,
                            combatant: monster,
                            mode: "view editable",
                            library: _this3.props.library,
                            moveToGroup: function moveToGroup(combatant, group) {
                                return _this3.props.moveToGroup(combatant, group);
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this3.props.changeValue(combatant, type, value);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this3.props.nudgeValue(combatant, type, delta);
                            },
                            changeTrait: function changeTrait(trait, type, value) {
                                return _this3.props.changeValue(trait, type, value);
                            },
                            addTrait: function addTrait(combatant, type) {
                                return _this3.props.addTrait(combatant, type);
                            },
                            removeTrait: function removeTrait(combatant, trait) {
                                return _this3.props.removeTrait(combatant, trait);
                            },
                            removeCombatant: function removeCombatant(combatant) {
                                return _this3.props.removeMonster(combatant);
                            },
                            editMonster: function editMonster(combatant) {
                                return _this3.props.editMonster(combatant);
                            },
                            cloneMonster: function cloneMonster(combatant) {
                                return _this3.props.cloneMonster(combatant);
                            }
                        }));
                    });
                    if (monsters.length === 0) {
                        cards.push(React.createElement(InfoCard, {
                            key: "empty",
                            getContent: function getContent() {
                                return React.createElement(
                                    "div",
                                    { className: "section" },
                                    "no monsters"
                                );
                            }
                        }));
                    }
                }

                var name = null;
                if (this.props.selection) {
                    name = this.props.selection.name;
                    if (!name) {
                        name = "unnamed group";
                    }
                }

                return React.createElement(
                    "div",
                    { className: "monster-library" },
                    React.createElement(
                        "div",
                        { className: "left-pane scrollable" },
                        help,
                        React.createElement(
                            "div",
                            { className: "group" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this3.props.addMonsterGroup("new group");
                                    } },
                                "add a new monster group"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "group" },
                            React.createElement("input", { type: "text", placeholder: "filter", value: this.state.filter, onChange: function onChange(event) {
                                    return _this3.setFilter(event.target.value);
                                } })
                        ),
                        listItems
                    ),
                    React.createElement(
                        "div",
                        { className: "right-pane scrollable" },
                        React.createElement(CardGroup, {
                            content: cards,
                            heading: name,
                            showClose: this.props.selection !== null,
                            close: function close() {
                                return _this3.props.selectMonsterGroup(null);
                            }
                        })
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MonsterLibraryScreen;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PartiesScreen = function (_React$Component) {
    _inherits(PartiesScreen, _React$Component);

    function PartiesScreen() {
        _classCallCheck(this, PartiesScreen);

        return _possibleConstructorReturn(this, (PartiesScreen.__proto__ || Object.getPrototypeOf(PartiesScreen)).apply(this, arguments));
    }

    _createClass(PartiesScreen, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var help = null;
                if (this.props.showHelp) {
                    help = React.createElement(PartiesCard, { parties: this.props.parties });
                }

                var parties = [];
                for (var n = 0; n !== this.props.parties.length; ++n) {
                    var party = this.props.parties[n];
                    parties.push(React.createElement(PartyListItem, {
                        key: party.id,
                        party: party,
                        selected: party === this.props.selection,
                        setSelection: function setSelection(party) {
                            return _this2.props.selectParty(party);
                        }
                    }));
                };

                var cards = [];

                if (this.props.selection) {
                    cards.push(React.createElement(PartyCard, {
                        key: "info",
                        selection: this.props.selection,
                        addPC: function addPC(name) {
                            return _this2.props.addPC(name);
                        },
                        sortPCs: function sortPCs() {
                            return _this2.props.sortPCs();
                        },
                        changeValue: function changeValue(type, value) {
                            return _this2.props.changeValue(_this2.props.selection, type, value);
                        },
                        removeParty: function removeParty() {
                            return _this2.props.removeParty();
                        }
                    }));

                    for (var index = 0; index !== this.props.selection.pcs.length; ++index) {
                        var pc = this.props.selection.pcs[index];
                        cards.push(React.createElement(PCCard, {
                            key: pc.id,
                            combatant: pc,
                            mode: "edit",
                            changeValue: function changeValue(combatant, type, value) {
                                return _this2.props.changeValue(combatant, type, value);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this2.props.nudgeValue(combatant, type, delta);
                            },
                            removeCombatant: function removeCombatant(combatant) {
                                return _this2.props.removePC(combatant);
                            }
                        }));
                    }

                    if (this.props.selection.pcs.length === 0) {
                        cards.push(React.createElement(InfoCard, {
                            key: "empty",
                            getContent: function getContent() {
                                return React.createElement(
                                    "div",
                                    { className: "section" },
                                    "no pcs"
                                );
                            }
                        }));
                    }
                }

                var name = null;
                if (this.props.selection) {
                    name = this.props.selection.name;
                    if (!name) {
                        name = "unnamed party";
                    }
                }

                return React.createElement(
                    "div",
                    { className: "parties" },
                    React.createElement(
                        "div",
                        { className: "left-pane scrollable" },
                        help,
                        React.createElement(
                            "div",
                            { className: "group" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.addParty("new party");
                                    } },
                                "add a new party"
                            )
                        ),
                        parties
                    ),
                    React.createElement(
                        "div",
                        { className: "right-pane scrollable" },
                        React.createElement(CardGroup, {
                            content: cards,
                            heading: name,
                            showClose: this.props.selection !== null,
                            close: function close() {
                                return _this2.props.selectParty(null);
                            }
                        })
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return PartiesScreen;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ConfirmButton = function (_React$Component) {
    _inherits(ConfirmButton, _React$Component);

    function ConfirmButton() {
        _classCallCheck(this, ConfirmButton);

        var _this = _possibleConstructorReturn(this, (ConfirmButton.__proto__ || Object.getPrototypeOf(ConfirmButton)).call(this));

        _this.state = {
            pressed: false
        };
        return _this;
    }

    _createClass(ConfirmButton, [{
        key: "toggle",
        value: function toggle() {
            this.setState({
                pressed: !this.state.pressed
            });
        }
    }, {
        key: "perform",
        value: function perform() {
            this.toggle();
            this.props.callback();
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var content = null;
                if (this.state.pressed) {
                    content = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "title" },
                            this.props.text,
                            " - are you sure?"
                        ),
                        React.createElement("img", { className: "image", src: "content/warning.svg" }),
                        React.createElement(
                            "div",
                            { className: "confirmation" },
                            React.createElement(
                                "div",
                                { className: "destructive", onClick: function onClick() {
                                        return _this2.perform();
                                    } },
                                "yes"
                            ),
                            React.createElement(
                                "div",
                                { className: "non-destructive", onClick: function onClick() {
                                        return _this2.toggle();
                                    } },
                                "no"
                            )
                        )
                    );
                } else {
                    content = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "title" },
                            this.props.text
                        ),
                        React.createElement("img", { className: "image", src: "content/warning.svg" })
                    );
                }

                return React.createElement(
                    "button",
                    { onClick: function onClick() {
                            return _this2.toggle();
                        } },
                    content
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return ConfirmButton;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DropdownItem = function (_React$Component) {
    _inherits(DropdownItem, _React$Component);

    function DropdownItem() {
        _classCallCheck(this, DropdownItem);

        return _possibleConstructorReturn(this, (DropdownItem.__proto__ || Object.getPrototypeOf(DropdownItem)).apply(this, arguments));
    }

    _createClass(DropdownItem, [{
        key: "onSelect",
        value: function onSelect(item) {
            this.props.onSelect(item);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var style = this.props.selected ? "dropdown-item selected" : "dropdown-item";
                return React.createElement(
                    "div",
                    { className: style, onClick: function onClick() {
                            return _this2.onSelect(_this2.props.item);
                        } },
                    this.props.text
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return DropdownItem;
}(React.Component);
