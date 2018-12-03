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
                        "here you can run a combat encounter by specifying a party and an encounter"
                    ),
                    React.createElement("div", { className: "divider" }),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "below you will see a list of encounters that you have paused"
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "you can resume a paused combat by selecting it"
                    )
                );

                return React.createElement(InfoCard, { getContent: function getContent() {
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

                return React.createElement(InfoCard, { getContent: function getContent() {
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
            partyID: null
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
        value: function selectParty(partyID) {
            this.setState({
                partyID: partyID
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var heading = null;
                var content = null;

                if (this.props.selection) {
                    var partyOptions = [];
                    if (this.props.parties) {
                        for (var n = 0; n !== this.props.parties.length; ++n) {
                            var party = this.props.parties[n];
                            partyOptions.push({
                                id: party.id,
                                text: party.name
                            });
                        }
                    }

                    var difficultySection = React.createElement(
                        "div",
                        null,
                        React.createElement(Dropdown, {
                            options: partyOptions,
                            placeholder: "select party...",
                            selectedID: this.state.partyID,
                            select: function select(optionID) {
                                return _this2.selectParty(optionID);
                            }
                        }),
                        React.createElement(DifficultyChartPanel, {
                            partyID: this.state.partyID,
                            encounterID: this.props.selection.id,
                            parties: this.props.parties,
                            encounters: this.props.encounters,
                            getMonster: function getMonster(monsterName, monsterGroupName) {
                                return _this2.props.getMonster(monsterName, monsterGroupName);
                            }
                        })
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
                        React.createElement("img", { className: imageStyle, src: "resources/images/down-arrow.svg", onClick: function onClick() {
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
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.addWave();
                                    } },
                                "add a new wave"
                            ),
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
                        React.createElement(
                            "div",
                            { className: "title" },
                            this.props.title
                        )
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
            showAll: false
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
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var sizes = ["all sizes"].concat(SIZE_TYPES);
                var sizeOptions = sizes.map(function (size) {
                    return { id: size, text: size };
                });

                var categories = ["all types"].concat(CATEGORY_TYPES);
                var catOptions = categories.map(function (cat) {
                    return { id: cat, text: cat };
                });

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
                        React.createElement(Spin, {
                            source: this.props.filter,
                            name: "challengeMin",
                            label: "min cr",
                            display: function display(value) {
                                return challenge(value);
                            },
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.props.nudgeValue("challengeMin", delta);
                            }
                        }),
                        React.createElement(Spin, {
                            source: this.props.filter,
                            name: "challengeMax",
                            label: "max cr",
                            display: function display(value) {
                                return challenge(value);
                            },
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.props.nudgeValue("challengeMax", delta);
                            }
                        }),
                        React.createElement(Dropdown, {
                            options: sizeOptions,
                            placeholder: "filter by size...",
                            selectedID: this.props.filter.size,
                            select: function select(optionID) {
                                return _this2.props.changeValue("size", optionID);
                            }
                        }),
                        React.createElement(Dropdown, {
                            options: catOptions,
                            placeholder: "filter by type...",
                            selectedID: this.props.filter.category,
                            select: function select(optionID) {
                                return _this2.props.changeValue("category", optionID);
                            }
                        }),
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
                        React.createElement("img", { className: this.state.showAll ? "image rotate" : "image", src: "resources/images/down-arrow.svg", onClick: function onClick() {
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
                    { className: "card" },
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

var MapBuilderCard = function (_React$Component) {
    _inherits(MapBuilderCard, _React$Component);

    function MapBuilderCard() {
        _classCallCheck(this, MapBuilderCard);

        return _possibleConstructorReturn(this, (MapBuilderCard.__proto__ || Object.getPrototypeOf(MapBuilderCard)).apply(this, arguments));
    }

    _createClass(MapBuilderCard, [{
        key: "render",
        value: function render() {
            try {
                var action = null;
                if (this.props.maps.length === 0) {
                    action = React.createElement(
                        "div",
                        { className: "section" },
                        "to start building a map, press the button below"
                    );
                } else {
                    action = React.createElement(
                        "div",
                        { className: "section" },
                        "select a map from the list to edit it"
                    );
                }

                var content = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "section" },
                        "on this page you can set up tactical maps"
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "when you have created a map you can use it in encounters"
                    ),
                    React.createElement("div", { className: "divider" }),
                    action
                );

                return React.createElement(InfoCard, { getContent: function getContent() {
                        return content;
                    } });
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MapBuilderCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapCard = function (_React$Component) {
    _inherits(MapCard, _React$Component);

    function MapCard() {
        _classCallCheck(this, MapCard);

        return _possibleConstructorReturn(this, (MapCard.__proto__ || Object.getPrototypeOf(MapCard)).apply(this, arguments));
    }

    _createClass(MapCard, [{
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
                        React.createElement(
                            "div",
                            { className: "title" },
                            "map"
                        )
                    );

                    content = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement("input", { type: "text", placeholder: "map name", value: this.props.selection.name, onChange: function onChange(event) {
                                    return _this2.props.changeValue("name", event.target.value);
                                } })
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(ConfirmButton, { text: "delete map", callback: function callback() {
                                    return _this2.props.removeMap();
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

    return MapCard;
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
            showInit: false,
            showHP: false,
            showDetails: false
        };
        return _this;
    }

    _createClass(MonsterCard, [{
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
            description += ", cr " + challenge(this.props.combatant.challenge);
            return description.toLowerCase();
        }
    }, {
        key: "monsterIsInWave",
        value: function monsterIsInWave(wave) {
            var _this2 = this;

            return wave.slots.some(function (s) {
                var group = null;
                _this2.props.library.forEach(function (g) {
                    if (g.monsters.indexOf(_this2.props.combatant) !== -1) {
                        group = g;
                    }
                });

                return s.monsterGroupName === group.name && s.monsterName === _this2.props.combatant.name;
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            try {
                var options = [];
                if (this.props.mode.indexOf("no-buttons") === -1) {
                    if (this.props.mode.indexOf("view") !== -1) {
                        if (this.props.mode.indexOf("editable") !== -1) {
                            options.push(React.createElement(
                                "button",
                                { key: "edit", onClick: function onClick() {
                                        return _this3.props.editMonster(_this3.props.combatant);
                                    } },
                                "edit monster"
                            ));
                            options.push(React.createElement(
                                "button",
                                { key: "clone", onClick: function onClick() {
                                        return _this3.props.cloneMonster(_this3.props.combatant);
                                    } },
                                "create a copy"
                            ));

                            var groupOptions = [];
                            this.props.library.forEach(function (group) {
                                if (group.monsters.indexOf(_this3.props.combatant) === -1) {
                                    groupOptions.push({
                                        id: group.id,
                                        text: group.name
                                    });
                                }
                            });
                            options.push(React.createElement(Dropdown, {
                                key: "move",
                                options: groupOptions,
                                placeholder: "move to group...",
                                select: function select(optionID) {
                                    return _this3.props.moveToGroup(_this3.props.combatant, optionID);
                                }
                            }));

                            options.push(React.createElement(ConfirmButton, { key: "remove", text: "delete monster", callback: function callback() {
                                    return _this3.props.removeCombatant(_this3.props.combatant);
                                } }));
                        }
                        if (this.props.mode.indexOf("encounter") !== -1) {
                            if (this.props.slot) {
                                // This card is in an encounter or a wave
                                options.push(React.createElement(
                                    "button",
                                    { key: "remove", onClick: function onClick() {
                                            return _this3.props.removeEncounterSlot(_this3.props.slot);
                                        } },
                                    "remove from encounter"
                                ));
                            } else {
                                var canAdd = false;
                                // This card is in the library list
                                if (!this.monsterIsInWave(this.props.encounter)) {
                                    options.push(React.createElement(
                                        "button",
                                        { key: "add encounter", onClick: function onClick() {
                                                return _this3.props.addEncounterSlot(_this3.props.combatant, null);
                                            } },
                                        "add to encounter"
                                    ));
                                    canAdd = true;
                                }
                                this.props.encounter.waves.forEach(function (wave) {
                                    if (!_this3.monsterIsInWave(wave)) {
                                        options.push(React.createElement(
                                            "button",
                                            { key: "add " + wave.id, onClick: function onClick() {
                                                    return _this3.props.addEncounterSlot(_this3.props.combatant, wave.id);
                                                } },
                                            "add to ",
                                            wave.name
                                        ));
                                        canAdd = true;
                                    }
                                });
                                // If we can't add it anywhere, don't show it
                                if (!canAdd) {
                                    return React.createElement(InfoCard, {
                                        getHeading: function getHeading() {
                                            return React.createElement(
                                                "div",
                                                { className: "heading" },
                                                React.createElement(
                                                    "div",
                                                    { className: "title" },
                                                    _this3.props.combatant.name
                                                )
                                            );
                                        },
                                        getContent: function getContent() {
                                            return React.createElement(
                                                "div",
                                                { className: "section centered" },
                                                React.createElement(
                                                    "i",
                                                    null,
                                                    "this monster is already part of this encounter"
                                                )
                                            );
                                        }
                                    });
                                }
                            }
                        }
                    }
                    if (this.props.mode.indexOf("combat") !== -1) {
                        options.push(React.createElement(ConditionsPanel, {
                            combatant: this.props.combatant,
                            combat: this.props.combat,
                            addCondition: function addCondition(condition) {
                                return _this3.props.addCondition(_this3.props.combatant, condition);
                            },
                            removeCondition: function removeCondition(conditionID) {
                                return _this3.props.removeCondition(_this3.props.combatant, conditionID);
                            },
                            nudgeConditionValue: function nudgeConditionValue(condition, type, delta) {
                                return _this3.props.nudgeConditionValue(condition, type, delta);
                            },
                            changeConditionValue: function changeConditionValue(condition, type, value) {
                                return _this3.props.changeConditionValue(condition, type, value);
                            }
                        }));
                        options.push(React.createElement(Expander, {
                            key: "rename",
                            text: "change name",
                            content: React.createElement(
                                "div",
                                null,
                                React.createElement("input", { type: "text", value: this.props.combatant.displayName, onChange: function onChange(event) {
                                        return _this3.props.changeValue(_this3.props.combatant, "displayName", event.target.value);
                                    } })
                            )
                        }));
                        options.push(React.createElement("div", { key: "div", className: "divider" }));
                        if (this.props.combatant.pending && !this.props.combatant.active && !this.props.combatant.defeated) {
                            options.push(React.createElement(
                                "button",
                                { key: "makeAdd", onClick: function onClick() {
                                        return _this3.props.makeActive(_this3.props.combatant);
                                    } },
                                "add to encounter"
                            ));
                            options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                    return _this3.props.removeCombatant(_this3.props.combatant);
                                } }));
                        }
                        if (!this.props.combatant.pending && this.props.combatant.active && !this.props.combatant.defeated) {
                            if (this.props.combatant.current) {
                                options.push(React.createElement(
                                    "button",
                                    { key: "endTurn", onClick: function onClick() {
                                            return _this3.props.endTurn(_this3.props.combatant);
                                        } },
                                    "end turn"
                                ));
                                options.push(React.createElement(
                                    "button",
                                    { key: "makeDefeated", onClick: function onClick() {
                                            return _this3.props.makeDefeated(_this3.props.combatant);
                                        } },
                                    "mark as defeated and end turn"
                                ));
                            } else {
                                options.push(React.createElement(
                                    "button",
                                    { key: "makeCurrent", onClick: function onClick() {
                                            return _this3.props.makeCurrent(_this3.props.combatant);
                                        } },
                                    "start turn"
                                ));
                                options.push(React.createElement(
                                    "button",
                                    { key: "makeDefeated", onClick: function onClick() {
                                            return _this3.props.makeDefeated(_this3.props.combatant);
                                        } },
                                    "mark as defeated"
                                ));
                                options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                        return _this3.props.removeCombatant(_this3.props.combatant);
                                    } }));
                            }
                        }
                        if (!this.props.combatant.pending && !this.props.combatant.active && this.props.combatant.defeated) {
                            options.push(React.createElement(
                                "button",
                                { key: "makeActive", onClick: function onClick() {
                                        return _this3.props.makeActive(_this3.props.combatant);
                                    } },
                                "mark as active"
                            ));
                            options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                    return _this3.props.removeCombatant(_this3.props.combatant);
                                } }));
                        }
                    }
                    if (this.props.mode.indexOf("template") !== -1) {
                        // None
                    }
                }

                var stats = null;
                if (this.props.mode.indexOf("view") !== -1) {
                    var slotSection = null;
                    if (this.props.slot) {
                        slotSection = React.createElement(
                            "div",
                            null,
                            React.createElement("div", { className: "divider" }),
                            React.createElement(Spin, {
                                source: this.props.slot,
                                name: "count",
                                label: "count",
                                nudgeValue: function nudgeValue(delta) {
                                    return _this3.props.nudgeValue(_this3.props.slot, "count", delta);
                                }
                            })
                        );
                    }

                    var details = null;
                    if (this.state.showDetails) {
                        details = React.createElement(
                            "div",
                            null,
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "ac"
                                ),
                                " ",
                                this.props.combatant.ac
                            ),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.hpMax !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.speed !== "" ? "" : "none" } },
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
                                { className: "section" },
                                React.createElement(AbilityScorePanel, { combatant: this.props.combatant })
                            ),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.savingThrows !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.skills !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.damage.resist !== "" ? "" : "none" } },
                                React.createElement(
                                    "b",
                                    null,
                                    "damage resistances"
                                ),
                                " ",
                                this.props.combatant.damage.resist
                            ),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" } },
                                React.createElement(
                                    "b",
                                    null,
                                    "damage vulnerabilities"
                                ),
                                " ",
                                this.props.combatant.damage.vulnerable
                            ),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.damage.immune !== "" ? "" : "none" } },
                                React.createElement(
                                    "b",
                                    null,
                                    "damage immunities"
                                ),
                                " ",
                                this.props.combatant.damage.immune
                            ),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.conditionImmunities !== "" ? "" : "none" } },
                                React.createElement(
                                    "b",
                                    null,
                                    "condition immunities"
                                ),
                                " ",
                                this.props.combatant.conditionImmunities
                            ),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.senses !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.languages !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.equipment !== "" ? "" : "none" } },
                                React.createElement(
                                    "b",
                                    null,
                                    "equipment"
                                ),
                                " ",
                                this.props.combatant.equipment
                            ),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(TraitsPanel, { combatant: this.props.combatant })
                        );
                    }

                    stats = React.createElement(
                        "div",
                        { className: "stats" },
                        React.createElement(
                            "div",
                            { className: "section centered" },
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
                        !this.props.combatant.pending ? React.createElement(HitPointGauge, { combatant: this.props.combatant }) : null,
                        React.createElement(
                            "div",
                            { className: "section key-stats" },
                            React.createElement(
                                "div",
                                { className: "key-stat editable", onClick: function onClick() {
                                        return _this3.toggleInit();
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
                                { className: "key-stat editable", onClick: function onClick() {
                                        return _this3.toggleHP();
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
                        React.createElement(
                            "div",
                            { style: { display: this.state.showInit ? "" : "none" } },
                            React.createElement(Spin, {
                                source: this.props.combatant,
                                name: "initiative",
                                label: "initiative",
                                factors: [1, 5, 10],
                                nudgeValue: function nudgeValue(delta) {
                                    return _this3.props.nudgeValue(_this3.props.combatant, "initiative", delta);
                                }
                            })
                        ),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showHP ? "" : "none" } },
                            React.createElement(Spin, {
                                source: this.props.combatant,
                                name: "hp",
                                label: "hit points",
                                factors: [1, 5, 10],
                                nudgeValue: function nudgeValue(delta) {
                                    return _this3.props.nudgeValue(_this3.props.combatant, "hp", delta);
                                }
                            }),
                            React.createElement(Spin, {
                                source: this.props.combatant,
                                name: "hpTemp",
                                label: "temp hp",
                                factors: [1, 5, 10],
                                nudgeValue: function nudgeValue(delta) {
                                    return _this3.props.nudgeValue(_this3.props.combatant, "hpTemp", delta);
                                }
                            }),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.damage.resist !== "" ? "" : "none" } },
                                React.createElement(
                                    "b",
                                    null,
                                    "damage resistances"
                                ),
                                " ",
                                this.props.combatant.damage.resist
                            ),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" } },
                                React.createElement(
                                    "b",
                                    null,
                                    "damage vulnerabilities"
                                ),
                                " ",
                                this.props.combatant.damage.vulnerable
                            ),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.damage.immune !== "" ? "" : "none" } },
                                React.createElement(
                                    "b",
                                    null,
                                    "damage immunities"
                                ),
                                " ",
                                this.props.combatant.damage.immune
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section", style: { display: this.props.combatant.conditionImmunities !== "" ? "" : "none" } },
                            React.createElement(
                                "b",
                                null,
                                "condition immunities"
                            ),
                            " ",
                            this.props.combatant.conditionImmunities
                        ),
                        React.createElement(
                            "div",
                            { style: { display: this.state.showDetails || this.props.combatant.current ? "" : "none" } },
                            React.createElement("div", { className: "divider" }),
                            React.createElement(
                                "div",
                                { className: "section centered" },
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
                                React.createElement(AbilityScorePanel, { combatant: this.props.combatant })
                            ),
                            React.createElement(
                                "div",
                                { className: "section", style: { display: this.props.combatant.savingThrows !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.skills !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.speed !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.senses !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.languages !== "" ? "" : "none" } },
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
                                { className: "section", style: { display: this.props.combatant.equipment !== "" ? "" : "none" } },
                                React.createElement(
                                    "b",
                                    null,
                                    "equipment"
                                ),
                                " ",
                                this.props.combatant.equipment
                            ),
                            React.createElement("div", { className: "divider" }),
                            React.createElement(TraitsPanel, { combatant: this.props.combatant })
                        )
                    );
                }
                if (this.props.mode.indexOf("template") !== -1) {
                    if (this.props.mode.indexOf("overview") !== -1) {
                        stats = React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    null,
                                    this.description()
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "speed"
                                ),
                                " ",
                                this.props.combatant.speed || "-"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "senses"
                                ),
                                " ",
                                this.props.combatant.senses || "-"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "languages"
                                ),
                                " ",
                                this.props.combatant.languages || "-"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "equipment"
                                ),
                                " ",
                                this.props.combatant.equipment || "-"
                            )
                        );
                    }
                    if (this.props.mode.indexOf("abilities") !== -1) {
                        stats = React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(AbilityScorePanel, { combatant: this.props.combatant })
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "saving throws"
                                ),
                                " ",
                                this.props.combatant.savingThrows || "-"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "skills"
                                ),
                                " ",
                                this.props.combatant.skills || "-"
                            )
                        );
                    }
                    if (this.props.mode.indexOf("combat") !== -1) {
                        stats = React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "ac"
                                ),
                                " ",
                                this.props.combatant.ac
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
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
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "damage immunity"
                                ),
                                " ",
                                this.props.combatant.damage.immune || "-"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "damage resistance"
                                ),
                                " ",
                                this.props.combatant.damage.resist || "-"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "damage vulnerability"
                                ),
                                " ",
                                this.props.combatant.damage.vulnerable || "-"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "b",
                                    null,
                                    "condition immunities"
                                ),
                                " ",
                                this.props.combatant.conditionImmunities || "-"
                            )
                        );
                    }
                    if (this.props.mode.indexOf("actions") !== -1) {
                        stats = React.createElement(TraitsPanel, {
                            combatant: this.props.combatant,
                            template: true,
                            copyTrait: function copyTrait(trait) {
                                return _this3.props.copyTrait(trait);
                            }
                        });
                    }
                }

                var toggle = null;
                if (this.props.mode.indexOf("combat") !== -1 && this.props.combatant.current) {
                    // Don't show toggle button for current combatant
                } else if (this.props.mode.indexOf("template") !== -1) {
                    // Don't show toggle button for template
                } else {
                    var imageStyle = this.state.showDetails ? "image rotate" : "image";
                    toggle = React.createElement("img", { className: imageStyle, src: "resources/images/down-arrow.svg", onClick: function onClick() {
                            return _this3.toggleDetails();
                        } });
                }

                return React.createElement(
                    "div",
                    { className: "card monster" },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            this.props.combatant.displayName || this.props.combatant.name || "unnamed monster"
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
                        React.createElement(
                            "div",
                            { className: "title" },
                            "monster group"
                        )
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
            try {
                return React.createElement(InfoCard, {
                    getContent: function getContent() {
                        return React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "div",
                                { className: "section" },
                                "you can maintain your menagerie of monsters here"
                            ),
                            React.createElement("div", { className: "divider" }),
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
                });
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

                return React.createElement(InfoCard, { getContent: function getContent() {
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
                        React.createElement(
                            "div",
                            { className: "title" },
                            "party"
                        )
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
                                        "invest."
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "cell three" },
                                    React.createElement(
                                        "b",
                                        null,
                                        "percep."
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
                    if (this.props.combatant.active) {
                        options.push(React.createElement(
                            "button",
                            { key: "toggle-active", onClick: function onClick() {
                                    return _this2.props.changeValue(_this2.props.combatant, "active", false);
                                } },
                            "mark inactive"
                        ));
                    } else {
                        options.push(React.createElement(
                            "button",
                            { key: "toggle-active", onClick: function onClick() {
                                    return _this2.props.changeValue(_this2.props.combatant, "active", true);
                                } },
                            "mark active"
                        ));
                    }
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
                        options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                return _this2.props.removeCombatant(_this2.props.combatant);
                            } }));
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
                        options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                return _this2.props.removeCombatant(_this2.props.combatant);
                            } }));
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
                                    { className: "lowercase" },
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
                                        "d&d beyond sheet"
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
                            React.createElement(Spin, {
                                source: this.props.combatant,
                                name: "level",
                                label: "level",
                                nudgeValue: function nudgeValue(delta) {
                                    return _this2.props.nudgeValue(_this2.props.combatant, "level", delta);
                                }
                            }),
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
                            React.createElement(Spin, {
                                source: this.props.combatant,
                                name: "passiveInsight",
                                label: "insight",
                                nudgeValue: function nudgeValue(delta) {
                                    return _this2.props.nudgeValue(_this2.props.combatant, "passiveInsight", delta);
                                }
                            }),
                            React.createElement(Spin, {
                                source: this.props.combatant,
                                name: "passiveInvestigation",
                                label: "investigation",
                                nudgeValue: function nudgeValue(delta) {
                                    return _this2.props.nudgeValue(_this2.props.combatant, "passiveInvestigation", delta);
                                }
                            }),
                            React.createElement(Spin, {
                                source: this.props.combatant,
                                name: "passivePerception",
                                label: "perception",
                                nudgeValue: function nudgeValue(delta) {
                                    return _this2.props.nudgeValue(_this2.props.combatant, "passivePerception", delta);
                                }
                            })
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
                                { className: "key-stat editable", onClick: function onClick() {
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
                            React.createElement(Spin, {
                                source: this.props.combatant,
                                name: "initiative",
                                label: "initiative",
                                factors: [1, 5, 10],
                                nudgeValue: function nudgeValue(delta) {
                                    return _this2.props.nudgeValue(_this2.props.combatant, "initiative", delta);
                                }
                            })
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section centered" },
                            React.createElement(
                                "div",
                                { className: "lowercase" },
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
                                    "d&d beyond sheet"
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
                                this.props.combatant.languages || "-"
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
                                            "invest."
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "cell three" },
                                        React.createElement(
                                            "b",
                                            null,
                                            "percep."
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

                var toggle = null;
                if (!this.props.combatant.current) {
                    var imageStyle = this.state.showDetails ? "image rotate" : "image";
                    toggle = React.createElement("img", { className: imageStyle, src: "resources/images/down-arrow.svg", onClick: function onClick() {
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
                            this.props.combatant.displayName || this.props.combatant.name || "unnamed pc"
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

var WaveCard = function (_React$Component) {
    _inherits(WaveCard, _React$Component);

    function WaveCard() {
        _classCallCheck(this, WaveCard);

        return _possibleConstructorReturn(this, (WaveCard.__proto__ || Object.getPrototypeOf(WaveCard)).apply(this, arguments));
    }

    _createClass(WaveCard, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var heading = React.createElement(
                    "div",
                    { className: "heading" },
                    React.createElement(
                        "div",
                        { className: "title" },
                        "wave"
                    )
                );

                var content = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "section" },
                        React.createElement("input", { type: "text", placeholder: "wave name", value: this.props.wave.name, onChange: function onChange(event) {
                                return _this2.props.changeValue(_this2.props.wave, "name", event.target.value);
                            } })
                    ),
                    React.createElement("div", { className: "divider" }),
                    React.createElement(
                        "div",
                        { className: "section" },
                        React.createElement(ConfirmButton, { text: "delete wave", callback: function callback() {
                                return _this2.props.removeWave(_this2.props.wave);
                            } })
                    )
                );

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

    return WaveCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
<Checkbox
    label="LABEL"
    checked={BOOLEAN}
    disabled={BOOLEAN}
    changeValue={value => this.changeValue(SOURCEOBJECT, FIELDNAME, value)}
/>
*/

var Checkbox = function (_React$Component) {
    _inherits(Checkbox, _React$Component);

    function Checkbox() {
        _classCallCheck(this, Checkbox);

        return _possibleConstructorReturn(this, (Checkbox.__proto__ || Object.getPrototypeOf(Checkbox)).apply(this, arguments));
    }

    _createClass(Checkbox, [{
        key: "click",
        value: function click(e) {
            e.stopPropagation();
            this.props.changeValue(!this.props.checked);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                return React.createElement(
                    "div",
                    { className: this.props.disabled ? "checkbox disabled" : "checkbox", onClick: function onClick(e) {
                            return _this2.click(e);
                        } },
                    React.createElement("img", { className: "image", src: this.props.checked ? "resources/images/checked.svg" : "resources/images/unchecked.svg" }),
                    React.createElement(
                        "div",
                        { className: "checkbox-label" },
                        this.props.label
                    )
                );
            } catch (ex) {
                console.error(ex);
                return null;
            }
        }
    }]);

    return Checkbox;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
<ConfirmButton
    text="TEXT"
    details="TEXT"
    disabled={BOOLEAN}
    callback={() => CALLBACK_FUNCTION}
/>
*/

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
                        React.createElement("img", { className: "image", src: "resources/images/warning.svg" }),
                        this.props.details ? React.createElement(
                            "div",
                            { className: "details" },
                            this.props.details
                        ) : null,
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
                        React.createElement("img", { className: "image", src: "resources/images/warning.svg" })
                    );
                }

                return React.createElement(
                    "button",
                    { className: this.props.disabled ? "disabled" : "", onClick: function onClick() {
                            return _this2.toggle();
                        } },
                    content
                );
            } catch (ex) {
                console.error(ex);
                return null;
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

var Dropdown = function (_React$Component) {
    _inherits(Dropdown, _React$Component);

    function Dropdown() {
        _classCallCheck(this, Dropdown);

        var _this = _possibleConstructorReturn(this, (Dropdown.__proto__ || Object.getPrototypeOf(Dropdown)).call(this));

        _this.state = {
            open: false
        };
        return _this;
    }

    _createClass(Dropdown, [{
        key: "toggleOpen",
        value: function toggleOpen(e) {
            e.stopPropagation();
            this.setState({
                open: !this.state.open
            });
        }
    }, {
        key: "select",
        value: function select(optionID) {
            this.setState({
                open: false
            });
            this.props.select(optionID);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var style = this.props.disabled ? "dropdown disabled" : "dropdown";
                var content = [];

                var selectedText = null;
                var title = null;
                if (this.props.selectedID) {
                    var option = null;
                    this.props.options.forEach(function (o) {
                        if (o.id === _this2.props.selectedID) {
                            option = o;
                        }
                    });

                    if (option) {
                        selectedText = option.text;
                        title = option.text;
                    }
                } else {
                    selectedText = this.props.text || this.props.placeholder || "select...";
                }

                content.push(React.createElement(
                    "div",
                    { key: "selection", className: "dropdown-top", title: title },
                    React.createElement(
                        "div",
                        { className: "item-text" },
                        selectedText
                    ),
                    React.createElement("img", { className: "arrow", src: "resources/images/ellipsis.svg" })
                ));

                if (this.state.open) {
                    style += " open";

                    var items = this.props.options.map(function (option) {
                        if (option.text === null) {
                            return React.createElement("div", { key: option.id, className: "divider" });
                        } else {
                            return React.createElement(DropdownOption, {
                                key: option.id,
                                option: option,
                                selected: option.id === _this2.props.selectedID,
                                select: function select(optionID) {
                                    return _this2.select(optionID);
                                }
                            });
                        }
                    });

                    content.push(React.createElement(
                        "div",
                        { key: "options", className: "dropdown-options" },
                        items
                    ));
                }

                return React.createElement(
                    "div",
                    { className: style, onClick: function onClick(e) {
                            return _this2.toggleOpen(e);
                        } },
                    content
                );
            } catch (ex) {
                console.error(ex);
                return null;
            }
        }
    }]);

    return Dropdown;
}(React.Component);

var DropdownOption = function (_React$Component2) {
    _inherits(DropdownOption, _React$Component2);

    function DropdownOption() {
        _classCallCheck(this, DropdownOption);

        return _possibleConstructorReturn(this, (DropdownOption.__proto__ || Object.getPrototypeOf(DropdownOption)).apply(this, arguments));
    }

    _createClass(DropdownOption, [{
        key: "click",
        value: function click(e) {
            e.stopPropagation();
            if (!this.props.option.disabled) {
                this.props.select(this.props.option.id);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            try {
                var style = "dropdown-option";
                if (this.props.selected) {
                    style += " selected";
                }
                if (this.props.option.disabled) {
                    style += " disabled";
                }

                return React.createElement(
                    "div",
                    { className: style, title: this.props.option.text, onClick: function onClick(e) {
                            return _this4.click(e);
                        } },
                    this.props.option.text
                );
            } catch (ex) {
                console.error(ex);
                return null;
            }
        }
    }]);

    return DropdownOption;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
<Expander
    text="TEXT"
    content={<div>ANY CONTENT</div>}
    disabled={BOOLEAN}
/>
*/

var Expander = function (_React$Component) {
    _inherits(Expander, _React$Component);

    function Expander() {
        _classCallCheck(this, Expander);

        var _this = _possibleConstructorReturn(this, (Expander.__proto__ || Object.getPrototypeOf(Expander)).call(this));

        _this.state = {
            expanded: false
        };
        return _this;
    }

    _createClass(Expander, [{
        key: "toggle",
        value: function toggle() {
            this.setState({
                expanded: !this.state.expanded
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var style = this.props.disabled ? "expander disabled" : "expander";
                if (this.state.expanded) {
                    style += " expanded";
                }

                var content = null;
                if (this.state.expanded) {
                    content = React.createElement(
                        "div",
                        { className: "expander-content" },
                        this.props.content
                    );
                }

                var text = text;

                return React.createElement(
                    "div",
                    { className: style },
                    React.createElement(
                        "div",
                        { className: "expander-header", onClick: function onClick() {
                                return _this2.toggle();
                            } },
                        React.createElement(
                            "div",
                            { className: "expander-text" },
                            this.props.text
                        ),
                        React.createElement("img", { className: "expander-button", src: "resources/images/down-arrow-black.svg" })
                    ),
                    content
                );
            } catch (ex) {
                console.error(ex);
                return null;
            }
        }
    }]);

    return Expander;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Navbar = function (_React$Component) {
    _inherits(Navbar, _React$Component);

    function Navbar() {
        _classCallCheck(this, Navbar);

        return _possibleConstructorReturn(this, (Navbar.__proto__ || Object.getPrototypeOf(Navbar)).apply(this, arguments));
    }

    _createClass(Navbar, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var partiesStyle = this.props.view === "parties" ? "navigator-item selected" : "navigator-item";
                var libraryStyle = this.props.view === "library" ? "navigator-item selected" : "navigator-item";
                var encounterStyle = this.props.view === "encounter" ? "navigator-item selected" : "navigator-item";
                var mapStyle = this.props.view === "maps" ? "navigator-item selected" : "navigator-item";
                var combatStyle = this.props.view === "combat" ? "navigator-item selected" : "navigator-item";

                var encountersEnabled = this.props.library.length !== 0;
                var combatEnabled = this.props.parties.length !== 0 && this.props.encounters.length !== 0;
                if (!encountersEnabled) {
                    encounterStyle += " disabled";
                }
                if (!combatEnabled) {
                    combatStyle += " disabled";
                }

                return React.createElement(
                    "div",
                    { className: this.props.blur ? "navbar blur" : "navbar" },
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
                        { className: mapStyle, onClick: function onClick() {
                                return _this2.props.setView("maps");
                            } },
                        "map builder"
                    ),
                    React.createElement(
                        "div",
                        { className: combatStyle, onClick: function onClick() {
                                return combatEnabled ? _this2.props.setView("combat") : null;
                            } },
                        "combat manager"
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return Navbar;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var Selector = function (_React$Component) {
    _inherits(Selector, _React$Component);

    function Selector() {
        _classCallCheck(this, Selector);

        return _possibleConstructorReturn(this, (Selector.__proto__ || Object.getPrototypeOf(Selector)).apply(this, arguments));
    }

    _createClass(Selector, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var style = this.props.tabs ? "selector tabs" : "selector radio";
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

                this.props.options.forEach(function (option) {
                    var index = _this2.props.options.indexOf(option);
                    var rowIndex = Math.floor(index / itemsPerRow);
                    var row = rowContents[rowIndex];
                    row.push(React.createElement(SelectorOption, {
                        key: option.id,
                        option: option,
                        selected: option.id === _this2.props.selectedID,
                        count: itemsPerRow,
                        select: function select(optionID) {
                            return _this2.props.select(optionID);
                        }
                    }));
                });

                var rowSections = rowContents.map(function (row) {
                    var index = rowContents.indexOf(row);
                    return React.createElement(
                        "div",
                        { key: index },
                        row
                    );
                });

                return React.createElement(
                    "div",
                    { className: style },
                    rowSections
                );
            } catch (ex) {
                console.error(ex);
                return null;
            }
        }
    }]);

    return Selector;
}(React.Component);

var SelectorOption = function (_React$Component2) {
    _inherits(SelectorOption, _React$Component2);

    function SelectorOption() {
        _classCallCheck(this, SelectorOption);

        return _possibleConstructorReturn(this, (SelectorOption.__proto__ || Object.getPrototypeOf(SelectorOption)).apply(this, arguments));
    }

    _createClass(SelectorOption, [{
        key: "click",
        value: function click(e) {
            e.stopPropagation();
            if (!this.props.option.disabled) {
                this.props.select(this.props.option.id);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            try {
                var width = "calc(((100% - 1px) / " + this.props.count + ") - 2px )";

                var style = "option";
                if (this.props.selected) {
                    style += " selected";
                }
                if (this.props.option.disabled) {
                    style += " disabled";
                }

                return React.createElement(
                    "div",
                    { key: this.props.option.id, className: style, style: { width: width }, title: this.props.option.text, onClick: function onClick(e) {
                            return _this4.click(e);
                        } },
                    this.props.option.text
                );
            } catch (ex) {
                console.error(ex);
                return null;
            }
        }
    }]);

    return SelectorOption;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
<Spin
    source={SOURCEOBJECT}
    name="FIELDNAME"
    label="LABEL"
    factors={[1, 10, 100]}
    disabled={BOOLEAN}
    display={value => this.displayValue(value)}
    nudgeValue={delta => this.nudgeValue(SOURCEOBJECT, FIELDNAME, delta)}
/>
*/

var Spin = function (_React$Component) {
    _inherits(Spin, _React$Component);

    function Spin() {
        _classCallCheck(this, Spin);

        var _this = _possibleConstructorReturn(this, (Spin.__proto__ || Object.getPrototypeOf(Spin)).call(this));

        _this.state = {
            expanded: false,
            factor: 1
        };
        return _this;
    }

    _createClass(Spin, [{
        key: "toggleExpanded",
        value: function toggleExpanded() {
            this.setState({
                expanded: !this.state.expanded
            });
        }
    }, {
        key: "click",
        value: function click(e, delta) {
            e.stopPropagation();
            this.props.nudgeValue(delta * this.state.factor);
        }
    }, {
        key: "touchEnd",
        value: function touchEnd(e, delta) {
            e.preventDefault();
            e.stopPropagation();
            this.props.nudgeValue(delta * this.state.factor);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var expander = null;
                if (this.props.factors) {
                    expander = React.createElement(
                        "div",
                        { className: "spin-expander", onClick: function onClick() {
                                return _this2.toggleExpanded();
                            } },
                        "\u2022 \u2022 \u2022"
                    );
                }

                var factorSelector = null;
                if (this.props.factors && this.state.expanded) {
                    var options = this.props.factors.map(function (factor) {
                        return {
                            id: factor,
                            text: factor
                        };
                    });

                    factorSelector = React.createElement(
                        "div",
                        { className: "factor-selector" },
                        React.createElement(Selector, {
                            options: options,
                            noBorder: true,
                            selectedID: this.state.factor,
                            select: function select(optionID) {
                                return _this2.setState({ factor: optionID });
                            }
                        })
                    );
                }

                var style = "info-value";
                var value = this.props.source[this.props.name];
                if (value === 0) {
                    style += " dimmed";
                }

                if (this.props.display) {
                    value = this.props.display(value);
                }

                return React.createElement(
                    "div",
                    { className: this.props.disabled ? "spin disabled" : "spin" },
                    React.createElement(
                        "div",
                        { className: "spin-button", onTouchEnd: function onTouchEnd(e) {
                                return _this2.touchEnd(e, -1);
                            }, onClick: function onClick(e) {
                                return _this2.click(e, -1);
                            } },
                        React.createElement("img", { className: "image", src: "resources/images/minus.svg" })
                    ),
                    React.createElement(
                        "div",
                        { className: "info" },
                        React.createElement(
                            "div",
                            { className: "info-label" },
                            this.props.label
                        ),
                        React.createElement(
                            "div",
                            { className: style },
                            value
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "spin-button", onTouchEnd: function onTouchEnd(e) {
                                return _this2.touchEnd(e, +1);
                            }, onClick: function onClick(e) {
                                return _this2.click(e, +1);
                            } },
                        React.createElement("img", { className: "image", src: "resources/images/plus.svg" })
                    ),
                    expander,
                    factorSelector
                );
            } catch (ex) {
                console.error(ex);
                return null;
            }
        }
    }]);

    return Spin;
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
                return React.createElement(
                    "div",
                    { className: this.props.blur ? "titlebar blur" : "titlebar" },
                    React.createElement(
                        "div",
                        { className: "app-name", onClick: function onClick() {
                                return _this2.props.openHome();
                            } },
                        "dojo"
                    ),
                    this.props.actions,
                    React.createElement("img", { className: "settings-icon", src: "resources/images/settings.svg", title: "about", onClick: function onClick() {
                            return _this2.props.openAbout();
                        } })
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
            maps: [],
            combats: [],
            selectedPartyID: null,
            selectedMonsterGroupID: null,
            selectedEncounterID: null,
            selectedMapID: null,
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
                if (!data.maps) {
                    data.maps = [];
                    data.selectedMapID = null;
                }

                data.encounters.forEach(function (enc) {
                    if (!enc.waves) {
                        enc.waves = [];
                    }
                });

                data.combats.forEach(function (c) {
                    if (!c.notifications) {
                        c.notifications = [];
                    }
                });

                _this.state = data;
                _this.state.view = "home";
                _this.state.modal = null;
            }
        } catch (ex) {
            console.error(ex);
            _this.state.parties = [];
            _this.state.library = [];
            _this.state.encounters = [];
            _this.state.maps = [];
            _this.state.combats = [];
            _this.state.selectedPartyID = null;
            _this.state.selectedMonsterGroupID = null;
            _this.state.selectedEncounterID = null;
            _this.state.selectedMapID = null;
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
                id: guid(),
                name: name,
                pcs: []
            };
            var parties = [].concat(this.state.parties, [party]);
            sort(parties);
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
                id: guid(),
                type: "pc",
                active: true,
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
            sort(party.pcs);
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
                id: guid(),
                name: name,
                monsters: []
            };
            var library = [].concat(this.state.library, [group]);
            sort(library);
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
                id: guid(),
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
                hpMax: 4,
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
            sort(group.monsters);
            this.setState({
                library: this.state.library
            });
        }
    }, {
        key: "moveToGroup",
        value: function moveToGroup(monster, groupID) {
            var sourceGroup = this.findMonster(monster);
            var index = sourceGroup.monsters.indexOf(monster);

            sourceGroup.monsters.splice(index, 1);
            var group = this.getMonsterGroup(groupID);
            group.monsters.push(monster);
            sort(group.monsters);

            this.setState({
                library: this.state.library
            });
        }
    }, {
        key: "editMonster",
        value: function editMonster(monster) {
            var copy = JSON.parse(JSON.stringify(monster));
            this.setState({
                modal: {
                    type: "monster",
                    monster: copy,
                    showMonsters: false
                }
            });
        }
    }, {
        key: "saveMonster",
        value: function saveMonster() {
            var _this2 = this;

            var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
            var original = group.monsters.find(function (m) {
                return m.id === _this2.state.modal.monster.id;
            });
            var index = group.monsters.indexOf(original);
            group.monsters[index] = this.state.modal.monster;
            this.setState({
                library: this.state.library,
                modal: null
            });
        }
    }, {
        key: "toggleShowSimilarMonsters",
        value: function toggleShowSimilarMonsters() {
            this.state.modal.showMonsters = !this.state.modal.showMonsters;
            this.setState({
                modal: this.state.modal
            });
        }
    }, {
        key: "openDemographics",
        value: function openDemographics() {
            this.setState({
                modal: {
                    type: "demographics"
                }
            });
        }
    }, {
        key: "cloneMonster",
        value: function cloneMonster(monster) {
            var group = this.findMonster(monster);

            var clone = {
                id: guid(),
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
                        id: guid(),
                        name: trait.name,
                        usage: trait.usage,
                        type: trait.type,
                        text: trait.text
                    };
                }),
                conditionImmunities: monster.conditionImmunities
            };

            group.monsters.push(clone);
            sort(group.monsters);

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
            request.open('GET', 'resources/data/monsters.json', true);
            request.onreadystatechange = function () {
                if (request.readyState === 4 && request.status === 200) {
                    var monsters = JSON.parse(request.responseText);
                    monsters.forEach(function (data) {
                        try {
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
                                        id: guid(),
                                        name: groupName,
                                        monsters: []
                                    };
                                    _this3.state.library.push(group);
                                }
                                group.monsters.push(monster);
                            }
                        } catch (e) {
                            console.log(e);
                        }
                    });

                    sort(_this3.state.library);

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
                id: guid(),
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
                id: guid(),
                name: name,
                slots: [],
                waves: []
            };
            var encounters = [].concat(this.state.encounters, [encounter]);
            sort(encounters);

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
        value: function addEncounterSlot(monster, waveID) {
            var group = this.findMonster(monster);
            var slot = {
                id: guid(),
                monsterGroupName: group.name,
                monsterName: monster.name,
                count: 1
            };
            var encounter = this.getEncounter(this.state.selectedEncounterID);
            if (waveID !== null) {
                var wave = encounter.waves.find(function (w) {
                    return w.id === waveID;
                });
                wave.slots.push(slot);
                this.sortEncounterSlots(wave);
            } else {
                encounter.slots.push(slot);
                this.sortEncounterSlots(encounter);
            }

            this.setState({
                encounters: this.state.encounters
            });

            return slot;
        }
    }, {
        key: "removeEncounterSlot",
        value: function removeEncounterSlot(slot, waveID) {
            var encounter = this.getEncounter(this.state.selectedEncounterID);
            if (waveID) {
                var wave = encounter.waves.find(function (w) {
                    return w.id === waveID;
                });
                var index = wave.slots.indexOf(slot);
                wave.slots.splice(index, 1);
            } else {
                var index = encounter.slots.indexOf(slot);
                encounter.slots.splice(index, 1);
            }

            this.setState({
                encounters: this.state.encounters
            });
        }
    }, {
        key: "sortEncounterSlots",
        value: function sortEncounterSlots(slotContaimer) {
            slotContaimer.slots.sort(function (a, b) {
                var aName = a.monsterName.toLowerCase();
                var bName = b.monsterName.toLowerCase();
                if (aName < bName) return -1;
                if (aName > bName) return 1;
                return 0;
            });
        }
    }, {
        key: "addWaveToEncounter",
        value: function addWaveToEncounter() {
            var encounter = this.getEncounter(this.state.selectedEncounterID);
            var waveNumber = encounter.waves.length + 2;
            var waveName = "wave " + waveNumber;

            encounter.waves.push({
                id: guid(),
                name: waveName,
                slots: []
            });

            this.setState({
                encounters: this.state.encounters
            });
        }
    }, {
        key: "removeWave",
        value: function removeWave(wave) {
            var encounter = this.getEncounter(this.state.selectedEncounterID);
            var index = encounter.waves.indexOf(wave);
            encounter.waves.splice(index, 1);

            this.setState({
                encounters: this.state.encounters
            });
        }

        /////////////////////////////////////////////////////////////////////////////
        // Map screen

    }, {
        key: "addMap",
        value: function addMap(name) {
            var map = {
                id: guid(),
                name: name
            };
            var maps = [].concat(this.state.maps, [map]);
            sort(maps);

            this.setState({
                maps: maps,
                selectedMapID: map.id
            });
        }
    }, {
        key: "removeMap",
        value: function removeMap() {
            var map = this.getEncounter(this.state.selectedMapID);
            var index = this.state.maps.indexOf(map);
            this.state.maps.splice(index, 1);

            this.setState({
                maps: this.state.maps,
                selectedMapID: null
            });
        }

        /////////////////////////////////////////////////////////////////////////////
        // Combat screen

    }, {
        key: "createCombat",
        value: function createCombat() {
            var party = this.state.parties.length === 1 ? this.state.parties[0] : null;
            var encounter = this.state.encounters.length === 1 ? this.state.encounters[0] : null;

            this.setState({
                modal: {
                    type: "combat-start",
                    combat: {
                        partyID: party ? party.id : null,
                        encounterID: encounter ? encounter.id : null,
                        encounterInitMode: "group",
                        monsterNames: getMonsterNames(encounter)
                    }
                }
            });
        }
    }, {
        key: "startCombat",
        value: function startCombat() {
            var _this4 = this;

            var party = this.getParty(this.state.modal.combat.partyID);
            var partyName = party.name || "unnamed party";

            var encounter = this.getEncounter(this.state.modal.combat.encounterID);
            var encounterName = encounter.name || "unnamed encounter";

            var combat = {
                id: guid(),
                encounterID: encounter.id,
                name: partyName + " vs " + encounterName,
                combatants: [],
                round: 1,
                notifications: [],
                issues: []
            };

            // Add a copy of each PC to the encounter
            party.pcs.filter(function (pc) {
                return pc.active;
            }).forEach(function (pc) {
                var combatant = JSON.parse(JSON.stringify(pc));

                combatant.current = false;
                combatant.pending = true;
                combatant.active = false;
                combatant.defeated = false;

                combat.combatants.push(combatant);
            });

            encounter.slots.forEach(function (slot) {
                var group = _this4.getMonsterGroupByName(slot.monsterGroupName);
                var monster = _this4.getMonster(slot.monsterName, group);

                if (monster) {
                    var init = parseInt(modifier(monster.abilityScores.dex));
                    var groupRoll = dieRoll();

                    for (var n = 0; n !== slot.count; ++n) {
                        var singleRoll = dieRoll();

                        var combatant = JSON.parse(JSON.stringify(monster));
                        combatant.id = guid();

                        combatant.displayName = null;
                        if (_this4.state.modal.combat.monsterNames) {
                            var slotNames = _this4.state.modal.combat.monsterNames.find(function (names) {
                                return names.id === slot.id;
                            });
                            if (slotNames) {
                                combatant.displayName = slotNames.names[n];
                            }
                        }

                        switch (_this4.state.modal.combat.encounterInitMode) {
                            case "manual":
                                combatant.initiative = 10;
                                break;
                            case "group":
                                combatant.initiative = init + groupRoll;
                                break;
                            case "individual":
                                combatant.initiative = init + singleRoll;
                                break;
                        }

                        combatant.current = false;
                        combatant.pending = _this4.state.modal.combat.encounterInitMode === "manual";
                        combatant.active = _this4.state.modal.combat.encounterInitMode !== "manual";
                        combatant.defeated = false;

                        combatant.hp = combatant.hpMax;
                        combatant.conditions = [];
                        combat.combatants.push(combatant);
                    }
                } else {
                    combat.issues.push("unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName);
                }
            });

            this.sortCombatants(combat);

            this.setState({
                combats: [].concat(this.state.combats, [combat]),
                selectedCombatID: combat.id,
                modal: null
            });
        }
    }, {
        key: "openWaveModal",
        value: function openWaveModal() {
            var combat = this.getCombat(this.state.selectedCombatID);
            var encounter = this.getEncounter(combat.encounterID);

            this.setState({
                modal: {
                    type: "combat-wave",
                    combat: {
                        encounterID: combat.encounterID,
                        encounterInitMode: "group",
                        waveID: null,
                        monsterNames: getMonsterNames(encounter)
                    }
                }
            });
        }
    }, {
        key: "pauseCombat",
        value: function pauseCombat() {
            var combat = this.getCombat(this.state.selectedCombatID);
            combat.timestamp = new Date().toLocaleString();
            this.setState({
                combats: this.state.combats,
                selectedCombatID: null
            });
        }
    }, {
        key: "resumeCombat",
        value: function resumeCombat(combat) {
            this.setState({
                selectedCombatID: combat.id
            });
        }
    }, {
        key: "endCombat",
        value: function endCombat() {
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

            // Handle start-of-turn conditions
            combat.combatants.filter(function (actor) {
                return actor.conditions;
            }).forEach(function (actor) {
                actor.conditions.filter(function (c) {
                    return c.duration !== null;
                }).forEach(function (c) {
                    switch (c.duration.type) {
                        case "saves":
                            // If it's my condition, and point is START, notify the user
                            if (actor.id === combatant.id && c.duration.point === "start") {
                                combat.notifications.push({
                                    id: guid(),
                                    type: "condition-save",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                        case "combatant":
                            // If this refers to me, and point is START, remove it
                            if (c.duration.combatantID === combatant.id && c.duration.point === "start") {
                                var index = actor.conditions.indexOf(c);
                                actor.conditions.splice(index, 1);
                                // Notify the user
                                combat.notifications.push({
                                    id: guid(),
                                    type: "condition-end",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                        case "rounds":
                            // If it's my condition, decrement the condition
                            if (actor.id === combatant.id) {
                                c.duration.count -= 1;
                            }
                            // If it's now at 0, remove it
                            if (c.duration.count === 0) {
                                var index = actor.conditions.indexOf(c);
                                actor.conditions.splice(index, 1);
                                // Notify the user
                                combat.notifications.push({
                                    id: guid(),
                                    type: "condition-end",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                    }
                });
            });

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
        key: "addWaveToCombat",
        value: function addWaveToCombat() {
            var _this5 = this;

            var encounter = this.getEncounter(this.state.modal.combat.encounterID);
            var combat = this.getCombat(this.state.selectedCombatID);
            var wave = encounter.waves.find(function (w) {
                return w.id === _this5.state.modal.combat.waveID;
            });

            wave.slots.forEach(function (slot) {
                var group = _this5.getMonsterGroupByName(slot.monsterGroupName);
                var monster = _this5.getMonster(slot.monsterName, group);

                if (monster) {
                    var init = parseInt(modifier(monster.abilityScores.dex));
                    var groupRoll = dieRoll();

                    for (var n = 0; n !== slot.count; ++n) {
                        var singleRoll = dieRoll();

                        var combatant = JSON.parse(JSON.stringify(monster));
                        combatant.id = guid();

                        combatant.displayName = null;
                        if (_this5.state.modal.combat.monsterNames) {
                            var slotNames = _this5.state.modal.combat.monsterNames.find(function (names) {
                                return names.id === slot.id;
                            });
                            if (slotNames) {
                                combatant.displayName = slotNames.names[n];
                            }
                        }

                        switch (_this5.state.modal.combat.encounterInitMode) {
                            case "manual":
                                combatant.initiative = 10;
                                break;
                            case "group":
                                combatant.initiative = init + groupRoll;
                                break;
                            case "individual":
                                combatant.initiative = init + singleRoll;
                                break;
                        }

                        combatant.current = false;
                        combatant.pending = _this5.state.modal.combat.encounterInitMode === "manual";
                        combatant.active = _this5.state.modal.combat.encounterInitMode !== "manual";
                        combatant.defeated = false;

                        combatant.hp = combatant.hpMax;
                        combatant.conditions = [];
                        combat.combatants.push(combatant);
                    }
                } else {
                    combat.issues.push("unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName);
                }
            });

            this.sortCombatants(combat);

            this.setState({
                combats: this.state.combats,
                modal: null
            });
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

            // Handle end-of-turn conditions
            combat.combatants.forEach(function (actor) {
                actor.conditions.filter(function (c) {
                    return c.duration !== null;
                }).forEach(function (c) {
                    switch (c.duration.type) {
                        case "saves":
                            // If it's my condition, and point is END, notify the user
                            if (actor.id === combatant.id && c.duration.point === "end") {
                                combat.notifications.push({
                                    id: guid(),
                                    type: "condition-save",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                        case "combatant":
                            // If this refers to me, and point is END, remove it
                            if (c.duration.combatantID === combatant.id && c.duration.point === "end") {
                                var index = actor.conditions.indexOf(c);
                                actor.conditions.splice(index, 1);
                                // Notify the user
                                combat.notifications.push({
                                    id: guid(),
                                    type: "condition-end",
                                    condition: c,
                                    combatant: combatant
                                });
                            }
                            break;
                        case "rounds":
                            // We check this at the beginning of each turn, not at the end
                            break;
                    }
                });
            });

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
        value: function removeCondition(combatant, conditionID) {
            var condition = combatant.conditions.find(function (c) {
                return c.id === conditionID;
            });
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
    }, {
        key: "closeNotification",
        value: function closeNotification(notification, removeCondition) {
            var combat = this.getCombat(this.state.selectedCombatID);
            var index = combat.notifications.indexOf(notification);
            combat.notifications.splice(index, 1);

            if (removeCondition) {
                var conditionIndex = notification.combatant.conditions.indexOf(notification.condition);
                notification.combatant.conditions.splice(conditionIndex, 1);
            }

            this.setState({
                combats: this.state.combats
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
        key: "openAbout",
        value: function openAbout() {
            this.setState({
                modal: {
                    type: "about"
                }
            });
        }
    }, {
        key: "closeModal",
        value: function closeModal() {
            this.setState({
                modal: null
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
        key: "selectMap",
        value: function selectMap(map) {
            this.setState({
                selectedMapID: map ? map.id : null
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
        key: "getMap",
        value: function getMap(id) {
            var result = null;
            this.state.maps.forEach(function (map) {
                if (map.id === id) {
                    result = map;
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
        key: "resetAll",
        value: function resetAll() {
            this.setState({
                parties: [],
                selectedPartyID: null,
                library: [],
                selectedMonsterGroupID: null,
                encounters: [],
                selectedEncounterID: null,
                maps: [],
                selectedMapID: null,
                combats: [],
                selectedCombatID: null
            });
        }
    }, {
        key: "changeValue",
        value: function changeValue(combatant, type, value) {
            switch (type) {
                case "hp":
                    value = Math.min(value, combatant.hpMax);
                    value = Math.max(value, 0);
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

            sort(this.state.parties);
            sort(this.state.library);
            sort(this.state.encounters);

            this.setState({
                parties: this.state.parties,
                library: this.state.library,
                encounters: this.state.encounters,
                combats: this.state.combats,
                selectedPartyID: this.state.selectedPartyID,
                selectedMonsterGroupID: this.state.selectedMonsterGroupID,
                selectedEncounterID: this.state.selectedEncounterID,
                selectedCombatID: this.state.selectedCombatID,
                options: this.state.options,
                modal: this.state.modal
            });
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

        /////////////////////////////////////////////////////////////////////////////

    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            try {
                var content = null;
                var actions = null;
                switch (this.state.view) {
                    case "home":
                        content = React.createElement(HomeScreen, {
                            library: this.state.library,
                            addOpenGameContent: function addOpenGameContent() {
                                return _this6.addOpenGameContent();
                            }
                        });
                        break;
                    case "parties":
                        content = React.createElement(PartiesScreen, {
                            parties: this.state.parties,
                            selection: this.getParty(this.state.selectedPartyID),
                            showHelp: this.state.options.showHelp,
                            selectParty: function selectParty(party) {
                                return _this6.selectParty(party);
                            },
                            addParty: function addParty(name) {
                                return _this6.addParty(name);
                            },
                            removeParty: function removeParty() {
                                return _this6.removeParty();
                            },
                            addPC: function addPC(name) {
                                return _this6.addPC(name);
                            },
                            removePC: function removePC(pc) {
                                return _this6.removePC(pc);
                            },
                            sortPCs: function sortPCs() {
                                return _this6.sortPCs();
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this6.changeValue(combatant, type, value);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this6.nudgeValue(combatant, type, delta);
                            }
                        });
                        break;
                    case "library":
                        content = React.createElement(MonsterLibraryScreen, {
                            library: this.state.library,
                            selection: this.getMonsterGroup(this.state.selectedMonsterGroupID),
                            filter: this.state.libraryFilter,
                            showHelp: this.state.options.showHelp,
                            selectMonsterGroup: function selectMonsterGroup(group) {
                                return _this6.selectMonsterGroup(group);
                            },
                            addMonsterGroup: function addMonsterGroup(name) {
                                return _this6.addMonsterGroup(name);
                            },
                            removeMonsterGroup: function removeMonsterGroup() {
                                return _this6.removeMonsterGroup();
                            },
                            addMonster: function addMonster(name) {
                                return _this6.addMonster(name);
                            },
                            removeMonster: function removeMonster(monster) {
                                return _this6.removeMonster(monster);
                            },
                            sortMonsters: function sortMonsters() {
                                return _this6.sortMonsters();
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this6.changeValue(combatant, type, value);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this6.nudgeValue(combatant, type, delta);
                            },
                            editMonster: function editMonster(combatant) {
                                return _this6.editMonster(combatant);
                            },
                            cloneMonster: function cloneMonster(combatant) {
                                return _this6.cloneMonster(combatant);
                            },
                            moveToGroup: function moveToGroup(combatant, groupID) {
                                return _this6.moveToGroup(combatant, groupID);
                            },
                            addOpenGameContent: function addOpenGameContent() {
                                return _this6.addOpenGameContent();
                            }
                        });
                        var count = 0;
                        this.state.library.forEach(function (group) {
                            count += group.monsters.length;
                        });
                        if (count > 0) {
                            actions = React.createElement(
                                "div",
                                { className: "actions" },
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement("input", { type: "text", placeholder: "filter", value: this.state.libraryFilter, onChange: function onChange(event) {
                                            return _this6.changeValue(_this6.state, "libraryFilter", event.target.value);
                                        } })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "button",
                                        { onClick: function onClick() {
                                                return _this6.openDemographics();
                                            } },
                                        "demographics"
                                    )
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
                                return _this6.selectEncounter(encounter);
                            },
                            addEncounter: function addEncounter(name) {
                                return _this6.addEncounter(name);
                            },
                            removeEncounter: function removeEncounter(encounter) {
                                return _this6.removeEncounter(encounter);
                            },
                            addWave: function addWave() {
                                return _this6.addWaveToEncounter();
                            },
                            removeWave: function removeWave(wave) {
                                return _this6.removeWave(wave);
                            },
                            getMonster: function getMonster(monsterName, monsterGroupName) {
                                return _this6.getMonster(monsterName, _this6.getMonsterGroupByName(monsterGroupName));
                            },
                            addEncounterSlot: function addEncounterSlot(monster, waveID) {
                                return _this6.addEncounterSlot(monster, waveID);
                            },
                            removeEncounterSlot: function removeEncounterSlot(slot, waveID) {
                                return _this6.removeEncounterSlot(slot, waveID);
                            },
                            nudgeValue: function nudgeValue(slot, type, delta) {
                                return _this6.nudgeValue(slot, type, delta);
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this6.changeValue(combatant, type, value);
                            }
                        });
                        break;
                    case "maps":
                        content = React.createElement(MapBuilderScreen, {
                            maps: this.state.maps,
                            selection: this.getMap(this.state.selectedMapID),
                            showHelp: this.state.options.showHelp,
                            selectMap: function selectMap(map) {
                                return _this6.selectMap(map);
                            },
                            addMap: function addMap(name) {
                                return _this6.addMap(name);
                            },
                            removeMap: function removeMap(map) {
                                return _this6.removeMap(map);
                            },
                            nudgeValue: function nudgeValue(source, type, delta) {
                                return _this6.nudgeValue(source, type, delta);
                            },
                            changeValue: function changeValue(source, type, value) {
                                return _this6.changeValue(source, type, value);
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
                            createCombat: function createCombat() {
                                return _this6.createCombat();
                            },
                            resumeEncounter: function resumeEncounter(combat) {
                                return _this6.resumeCombat(combat);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this6.nudgeValue(combatant, type, delta);
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this6.changeValue(combatant, type, value);
                            },
                            makeCurrent: function makeCurrent(combatant) {
                                return _this6.makeCurrent(combatant);
                            },
                            makeActive: function makeActive(combatant) {
                                return _this6.makeActive(combatant);
                            },
                            makeDefeated: function makeDefeated(combatant) {
                                return _this6.makeDefeated(combatant);
                            },
                            removeCombatant: function removeCombatant(combatant) {
                                return _this6.removeCombatant(combatant);
                            },
                            addCondition: function addCondition(combatant, condition) {
                                return _this6.addCondition(combatant, condition);
                            },
                            removeCondition: function removeCondition(combatant, conditionID) {
                                return _this6.removeCondition(combatant, conditionID);
                            },
                            endTurn: function endTurn(combatant) {
                                return _this6.endTurn(combatant);
                            },
                            close: function close(notification, removeCondition) {
                                return _this6.closeNotification(notification, removeCondition);
                            }
                        });
                        if (combat) {
                            var xp = 0;
                            combat.combatants.filter(function (c) {
                                return c.type === "monster";
                            }).forEach(function (combatant) {
                                xp += experience(combatant.challenge);
                            });

                            var encounter = this.getEncounter(combat.encounterID);

                            actions = React.createElement(
                                "div",
                                { className: "actions" },
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "div",
                                        null,
                                        "round: ",
                                        combat.round
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "div",
                                        null,
                                        "xp: ",
                                        xp
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "section", style: { display: encounter.waves.length === 0 ? "none" : "" } },
                                    React.createElement(
                                        "button",
                                        { onClick: function onClick() {
                                                return _this6.openWaveModal();
                                            } },
                                        "add wave"
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "button",
                                        { onClick: function onClick() {
                                                return _this6.pauseCombat();
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
                                                return _this6.endCombat();
                                            } },
                                        "end encounter"
                                    )
                                )
                            );
                        }
                        break;
                }

                var modal = null;
                if (this.state.modal) {
                    var modalTitle = null;
                    var modalContent = null;
                    var modalAllowClose = true;
                    var modalAllowScroll = true;
                    var modalButtons = {
                        left: [],
                        right: []
                    };

                    switch (this.state.modal.type) {
                        case "about":
                            modalContent = React.createElement(AboutModal, {
                                options: this.state.options,
                                resetAll: function resetAll() {
                                    return _this6.resetAll();
                                },
                                changeValue: function changeValue(source, type, value) {
                                    return _this6.changeValue(source, type, value);
                                }
                            });
                            break;
                        case "demographics":
                            modalTitle = "demographics";
                            modalContent = React.createElement(DemographicsModal, {
                                library: this.state.library
                            });
                            break;
                        case "monster":
                            modalTitle = "monster editor";
                            modalContent = React.createElement(MonsterEditorModal, {
                                monster: this.state.modal.monster,
                                library: this.state.library,
                                showMonsters: this.state.modal.showMonsters
                            });
                            modalAllowClose = false;
                            modalAllowScroll = false;
                            modalButtons.left = [React.createElement(Checkbox, {
                                key: "similar",
                                label: "similar monsters",
                                checked: this.state.modal.showMonsters,
                                changeValue: function changeValue() {
                                    return _this6.toggleShowSimilarMonsters();
                                }
                            })];
                            modalButtons.right = [React.createElement(
                                "button",
                                { key: "save", onClick: function onClick() {
                                        return _this6.saveMonster();
                                    } },
                                "save"
                            ), React.createElement(
                                "button",
                                { key: "cancel", onClick: function onClick() {
                                        return _this6.closeModal();
                                    } },
                                "cancel"
                            )];
                            break;
                        case "combat-start":
                            modalTitle = "start a new encounter";
                            modalContent = React.createElement(CombatStartModal, {
                                combat: this.state.modal.combat,
                                parties: this.state.parties,
                                encounters: this.state.encounters,
                                getMonster: function getMonster(monsterName, monsterGroupName) {
                                    return _this6.getMonster(monsterName, _this6.getMonsterGroupByName(monsterGroupName));
                                },
                                notify: function notify() {
                                    return _this6.setState({ modal: _this6.state.modal });
                                }
                            });
                            modalAllowClose = false;
                            modalAllowScroll = false;
                            var canClose = this.state.modal.combat.partyID && this.state.modal.combat.encounterID;
                            modalButtons.right = [React.createElement(
                                "button",
                                { key: "start encounter", className: canClose ? "" : "disabled", onClick: function onClick() {
                                        return _this6.startCombat();
                                    } },
                                "start encounter"
                            ), React.createElement(
                                "button",
                                { key: "cancel", onClick: function onClick() {
                                        return _this6.closeModal();
                                    } },
                                "cancel"
                            )];
                            break;
                        case "combat-wave":
                            modalTitle = "encounter waves";
                            modalContent = React.createElement(CombatStartModal, {
                                combat: this.state.modal.combat,
                                encounters: this.state.encounters,
                                getMonster: function getMonster(monsterName, monsterGroupName) {
                                    return _this6.getMonster(monsterName, _this6.getMonsterGroupByName(monsterGroupName));
                                },
                                notify: function notify() {
                                    return _this6.setState({ modal: _this6.state.modal });
                                }
                            });
                            modalAllowClose = false;
                            modalAllowScroll = false;
                            var canClose = this.state.modal.combat.waveID !== null;
                            modalButtons.right = [React.createElement(
                                "button",
                                { key: "add wave", className: canClose ? "" : "disabled", onClick: function onClick() {
                                        return _this6.addWaveToCombat();
                                    } },
                                "add wave"
                            ), React.createElement(
                                "button",
                                { key: "cancel", onClick: function onClick() {
                                        return _this6.closeModal();
                                    } },
                                "cancel"
                            )];
                            break;
                    }

                    modal = React.createElement(
                        "div",
                        { className: "overlay" },
                        React.createElement(
                            "div",
                            { className: "modal" },
                            React.createElement(
                                "div",
                                { className: "modal-header" },
                                React.createElement(
                                    "div",
                                    { className: "title" },
                                    modalTitle
                                ),
                                modalAllowClose ? React.createElement("img", { className: "image", src: "resources/images/close-black.svg", onClick: function onClick() {
                                        return _this6.closeModal();
                                    } }) : null
                            ),
                            React.createElement(
                                "div",
                                { className: modalAllowScroll ? "modal-content scrollable" : "modal-content" },
                                modalContent
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-footer" },
                                React.createElement(
                                    "div",
                                    { className: "left" },
                                    modalButtons.left
                                ),
                                React.createElement(
                                    "div",
                                    { className: "right" },
                                    modalButtons.right
                                )
                            )
                        )
                    );
                }

                return React.createElement(
                    "div",
                    { className: "dojo" },
                    React.createElement(Titlebar, {
                        actions: actions,
                        blur: modal !== null,
                        openHome: function openHome() {
                            return _this6.setView("home");
                        },
                        openAbout: function openAbout() {
                            return _this6.openAbout();
                        }
                    }),
                    React.createElement(
                        "div",
                        { className: modal === null ? "page-content" : "page-content blur" },
                        content
                    ),
                    React.createElement(Navbar, {
                        view: this.state.view,
                        parties: this.state.parties,
                        library: this.state.library,
                        encounters: this.state.encounters,
                        blur: modal !== null,
                        setView: function setView(view) {
                            return _this6.setView(view);
                        }
                    }),
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

                return React.createElement(
                    "div",
                    { className: this.props.selected ? "list-item selected" : "list-item", onClick: function onClick() {
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
                this.props.encounter.slots.forEach(function (slot) {
                    var text = slot.monsterName || "unnamed monster";
                    if (slot.count > 1) {
                        text += " x" + slot.count;
                    }
                    slots.push(React.createElement(
                        "div",
                        { key: slot.id, className: "text" },
                        text
                    ));
                });
                if (slots.length === 0) {
                    slots.push(React.createElement(
                        "div",
                        { key: "empty", className: "text" },
                        "no monsters"
                    ));
                }
                this.props.encounter.waves.forEach(function (wave) {
                    slots.push(React.createElement(
                        "div",
                        { key: "name " + wave.id, className: "text subheading" },
                        wave.name || "unnamed wave"
                    ));
                    wave.slots.forEach(function (slot) {
                        var text = slot.monsterName || "unnamed monster";
                        if (slot.count > 1) {
                            text += " x" + slot.count;
                        }
                        slots.push(React.createElement(
                            "div",
                            { key: slot.id, className: "text" },
                            text
                        ));
                    });
                    if (slots.length === 0) {
                        slots.push(React.createElement(
                            "div",
                            { key: "empty " + wave.id, className: "text" },
                            "no monsters"
                        ));
                    }
                });

                return React.createElement(
                    "div",
                    { className: this.props.selected ? "list-item selected" : "list-item", onClick: function onClick() {
                            return _this2.props.setSelection(_this2.props.encounter);
                        } },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        encounterName
                    ),
                    slots
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

var MapListItem = function (_React$Component) {
    _inherits(MapListItem, _React$Component);

    function MapListItem() {
        _classCallCheck(this, MapListItem);

        return _possibleConstructorReturn(this, (MapListItem.__proto__ || Object.getPrototypeOf(MapListItem)).apply(this, arguments));
    }

    _createClass(MapListItem, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                return React.createElement(
                    "div",
                    { className: this.props.selected ? "list-item selected" : "list-item", onClick: function onClick() {
                            return _this2.props.setSelection(_this2.props.map);
                        } },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        this.props.map.name || "unnamed map"
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MapListItem;
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

                return React.createElement(
                    "div",
                    { className: this.props.selected ? "list-item selected" : "list-item", onClick: function onClick() {
                            return _this2.props.setSelection(_this2.props.group);
                        } },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        groupName
                    ),
                    monsters
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

                return React.createElement(
                    "div",
                    { className: this.props.selected ? "list-item selected" : "list-item", onClick: function onClick() {
                            return _this2.props.setSelection(_this2.props.party);
                        } },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        partyName
                    ),
                    pcs
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

var AboutModal = function (_React$Component) {
    _inherits(AboutModal, _React$Component);

    function AboutModal() {
        _classCallCheck(this, AboutModal);

        var _this = _possibleConstructorReturn(this, (AboutModal.__proto__ || Object.getPrototypeOf(AboutModal)).call(this));

        _this.state = {
            showDev: false,
            optionID: "abc",
            value: 0,
            selected: false
        };
        return _this;
    }

    _createClass(AboutModal, [{
        key: "setOption",
        value: function setOption(optionID) {
            this.setState({
                optionID: optionID
            });
        }
    }, {
        key: "setValue",
        value: function setValue(value) {
            this.setState({
                value: value
            });
        }
    }, {
        key: "setSelected",
        value: function setSelected(selected) {
            this.setState({
                selected: selected
            });
        }
    }, {
        key: "getDevSection",
        value: function getDevSection() {
            var _this2 = this;

            if (this.state.showDev) {
                var devOptions = ["abc", "def", "ghi", "jkl"].map(function (x) {
                    return {
                        id: x,
                        text: x
                    };
                });

                return React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-6 large-6 end" },
                        React.createElement(
                            "div",
                            { className: "heading" },
                            "dev"
                        ),
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this2.setSelected(!_this2.state.selected);
                                } },
                            "button"
                        ),
                        React.createElement(ConfirmButton, {
                            text: "confirm",
                            callback: function callback() {
                                return _this2.setSelected(!_this2.state.selected);
                            }
                        }),
                        React.createElement(Dropdown, {
                            options: devOptions,
                            selectedID: this.state.optionID,
                            select: function select(optionID) {
                                return _this2.setOption(optionID);
                            }
                        }),
                        React.createElement(Expander, {
                            text: "expander",
                            content: React.createElement(
                                "div",
                                null,
                                "content"
                            )
                        }),
                        React.createElement(Spin, {
                            source: this.state,
                            name: "value",
                            label: "value",
                            factors: [1, 10, 100],
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.setValue(_this2.state.value + delta);
                            }
                        }),
                        React.createElement(Checkbox, {
                            label: "checkbox",
                            checked: this.state.selected,
                            changeValue: function changeValue(value) {
                                return _this2.setSelected(value);
                            }
                        }),
                        React.createElement(Selector, {
                            tabs: true,
                            options: devOptions,
                            selectedID: this.state.optionID,
                            select: function select(optionID) {
                                return _this2.setOption(optionID);
                            }
                        }),
                        React.createElement(Selector, {
                            tabs: false,
                            options: devOptions,
                            selectedID: this.state.optionID,
                            select: function select(optionID) {
                                return _this2.setOption(optionID);
                            }
                        })
                    )
                );
            }

            return null;
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            try {
                return React.createElement(
                    "div",
                    { className: "about" },
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "columns small-6 medium-6 large-6 list-column" },
                            React.createElement(
                                "div",
                                { className: "heading" },
                                "about"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                "dojo by ",
                                React.createElement(
                                    "a",
                                    { href: "mailto:andy.aiken@live.co.uk" },
                                    "andy aiken"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                "if you would like to contribut to this project, you can do so ",
                                React.createElement(
                                    "a",
                                    { href: "https://github.com/andyaiken/dojo", target: "_blank" },
                                    "here"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                "dungeons and dragons copyright wizards of the coast"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "columns small-6 medium-6 large-6 list-column" },
                            React.createElement(
                                "div",
                                { className: "heading" },
                                "options"
                            ),
                            React.createElement(ConfirmButton, { text: "clear all data", callback: function callback() {
                                    return _this3.props.resetAll();
                                } }),
                            React.createElement(Checkbox, {
                                label: "show help cards",
                                checked: this.props.options.showHelp,
                                changeValue: function changeValue(value) {
                                    return _this3.props.changeValue(_this3.props.options, "showHelp", value);
                                }
                            })
                        )
                    ),
                    this.getDevSection(),
                    React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "columns small-12 medium-12 large-12 list-column" },
                            React.createElement(
                                "div",
                                { className: "heading" },
                                "open game license"
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
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

    return AboutModal;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CombatStartModal = function (_React$Component) {
    _inherits(CombatStartModal, _React$Component);

    function CombatStartModal(props) {
        _classCallCheck(this, CombatStartModal);

        var _this = _possibleConstructorReturn(this, (CombatStartModal.__proto__ || Object.getPrototypeOf(CombatStartModal)).call(this));

        _this.state = {
            combat: props.combat
        };
        return _this;
    }

    _createClass(CombatStartModal, [{
        key: "setParty",
        value: function setParty(partyID) {
            var _this2 = this;

            this.state.combat.partyID = partyID;
            this.setState({
                combat: this.state.combat
            }, function () {
                return _this2.props.notify();
            });
        }
    }, {
        key: "setEncounter",
        value: function setEncounter(encounterID) {
            var _this3 = this;

            this.state.combat.encounterID = encounterID;
            var enc = this.props.encounters.find(function (enc) {
                return enc.id === encounterID;
            });
            this.state.combat.monsterNames = getMonsterNames(enc);
            this.setState({
                combat: this.state.combat
            }, function () {
                return _this3.props.notify();
            });
        }
    }, {
        key: "setWave",
        value: function setWave(waveID) {
            var _this4 = this;

            this.state.combat.waveID = waveID;
            var enc = this.props.encounters.find(function (enc) {
                return enc.id === _this4.state.combat.encounterID;
            });
            var wave = enc.waves.find(function (w) {
                return w.id === waveID;
            });
            this.state.combat.monsterNames = getMonsterNames(wave);
            this.setState({
                combat: this.state.combat
            }, function () {
                return _this4.props.notify();
            });
        }
    }, {
        key: "setEncounterInitMode",
        value: function setEncounterInitMode(mode) {
            this.state.combat.encounterInitMode = mode;
            this.setState({
                combat: this.state.combat
            });
        }
    }, {
        key: "changeName",
        value: function changeName(slotID, index, name) {
            var slot = this.state.combat.monsterNames.find(function (s) {
                return s.id === slotID;
            });
            if (slot) {
                slot.names[index] = name;
                this.setState({
                    combat: this.state.combat
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }, {
        key: "getPartySection",
        value: function getPartySection() {
            var _this5 = this;

            if (this.props.parties.length === 0) {
                return React.createElement(
                    "div",
                    { className: "section" },
                    "you have not defined any parties"
                );
            }

            var partyOptions = this.props.parties.map(function (party) {
                return {
                    id: party.id,
                    text: party.name || "unnamed party"
                };
            });

            var partyContent = null;
            if (this.state.combat.partyID) {
                var selectedParty = this.props.parties.find(function (p) {
                    return p.id === _this5.state.combat.partyID;
                });
                var pcs = selectedParty.pcs.filter(function (pc) {
                    return pc.active;
                });

                var pcSections = pcs.map(function (pc) {
                    return React.createElement(
                        "li",
                        { key: pc.id },
                        pc.name || "unnamed pc",
                        " (level ",
                        pc.level,
                        ")"
                    );
                });

                if (pcSections.length === 0) {
                    pcSections.push(React.createElement(
                        "li",
                        { key: "empty" },
                        "no pcs"
                    ));
                }

                partyContent = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "subheading" },
                        "pcs"
                    ),
                    React.createElement(
                        "ul",
                        null,
                        pcSections
                    )
                );
            }

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "heading" },
                    "party"
                ),
                React.createElement(Dropdown, {
                    options: partyOptions,
                    placeholder: "select party...",
                    selectedID: this.state.combat.partyID,
                    select: function select(optionID) {
                        return _this5.setParty(optionID);
                    }
                }),
                partyContent
            );
        }
    }, {
        key: "getEncounterSection",
        value: function getEncounterSection() {
            var _this6 = this;

            if (this.props.encounters.length === 0) {
                return React.createElement(
                    "div",
                    { className: "section" },
                    "you have not built any encounters"
                );
            }

            var encounterOptions = this.props.encounters.map(function (encounter) {
                return {
                    id: encounter.id,
                    text: encounter.name || "unnamed encounter"
                };
            });

            var encounterContent = null;
            if (this.state.combat.encounterID) {
                var selectedEncounter = this.props.encounters.find(function (e) {
                    return e.id === _this6.state.combat.encounterID;
                });
                var monsterSections = selectedEncounter.slots.map(function (slot) {
                    var name = slot.monsterName || "unnamed monster";
                    if (slot.count > 1) {
                        name += " (x" + slot.count + ")";
                    }
                    return React.createElement(
                        "li",
                        { key: slot.id },
                        name
                    );
                });

                if (monsterSections.length === 0) {
                    monsterSections.push(React.createElement(
                        "li",
                        { key: "empty" },
                        "no monsters"
                    ));
                }

                var waves = selectedEncounter.waves.map(function (wave) {
                    if (wave.slots.length === 0) {
                        return null;
                    }

                    var waveMonsters = wave.slots.map(function (slot) {
                        var name = slot.monsterName || "unnamed monster";
                        if (slot.count > 1) {
                            name += " x" + slot.count;
                        }
                        return React.createElement(
                            "li",
                            { key: slot.id },
                            name
                        );
                    });

                    return React.createElement(
                        "div",
                        { key: wave.id },
                        React.createElement(
                            "div",
                            { className: "subheading" },
                            wave.name || "unnamed wave"
                        ),
                        React.createElement(
                            "ul",
                            null,
                            waveMonsters
                        )
                    );
                });

                encounterContent = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "subheading" },
                        "monsters"
                    ),
                    React.createElement(
                        "ul",
                        null,
                        monsterSections
                    ),
                    waves
                );
            }

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "heading" },
                    "encounter"
                ),
                React.createElement(Dropdown, {
                    options: encounterOptions,
                    placeholder: "select encounter...",
                    selectedID: this.state.combat.encounterID,
                    select: function select(optionID) {
                        return _this6.setEncounter(optionID);
                    }
                }),
                encounterContent
            );
        }
    }, {
        key: "getWaveSection",
        value: function getWaveSection() {
            var _this7 = this;

            if (this.state.combat.encounterID === null) {
                return React.createElement(
                    "div",
                    { className: "section" },
                    "you have not selected an encounter"
                );
            }

            var selectedEncounter = this.props.encounters.find(function (e) {
                return e.id === _this7.state.combat.encounterID;
            });
            if (selectedEncounter.waves.length === 0) {
                return React.createElement(
                    "div",
                    { className: "section" },
                    "you have not defined any waves"
                );
            }

            var waveOptions = selectedEncounter.waves.map(function (wave) {
                return {
                    id: wave.id,
                    text: wave.name || "unnamed wave"
                };
            });

            var waveContent = null;
            if (this.state.combat.waveID) {
                var selectedWave = selectedEncounter.waves.find(function (w) {
                    return w.id === _this7.state.combat.waveID;
                });

                var monsterSections = selectedWave.slots.map(function (slot) {
                    var name = slot.monsterName || "unnamed monster";
                    if (slot.count > 1) {
                        name += " (x" + slot.count + ")";
                    }
                    return React.createElement(
                        "li",
                        { key: slot.id },
                        name
                    );
                });

                if (monsterSections.length === 0) {
                    monsterSections.push(React.createElement(
                        "li",
                        { key: "empty" },
                        "no monsters"
                    ));
                }

                waveContent = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "subheading" },
                        "monsters"
                    ),
                    React.createElement(
                        "ul",
                        null,
                        monsterSections
                    )
                );
            }

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "heading" },
                    "wave"
                ),
                React.createElement(Dropdown, {
                    options: waveOptions,
                    placeholder: "select wave...",
                    selectedID: this.state.combat.waveID,
                    select: function select(optionID) {
                        return _this7.setWave(optionID);
                    }
                }),
                waveContent
            );
        }
    }, {
        key: "getDifficultySection",
        value: function getDifficultySection() {
            var _this8 = this;

            if (!this.state.combat.partyID || !this.state.combat.encounterID) {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "heading" },
                        "encounter difficulty"
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "select a party and an encounter on the left to see difficulty information."
                    )
                );
            }

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "heading" },
                    "encounter difficulty"
                ),
                React.createElement(DifficultyChartPanel, {
                    partyID: this.state.combat.partyID,
                    encounterID: this.state.combat.encounterID,
                    parties: this.props.parties,
                    encounters: this.props.encounters,
                    getMonster: function getMonster(monsterName, monsterGroupName) {
                        return _this8.props.getMonster(monsterName, monsterGroupName);
                    }
                })
            );
        }
    }, {
        key: "getMonsterSection",
        value: function getMonsterSection() {
            var _this9 = this;

            if (this.state.combat.encounterID === null) {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "heading" },
                        "monsters"
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "select an encounter to see monster options here."
                    )
                );
            }

            if (!this.props.parties && this.state.combat.waveID === null) {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "heading" },
                        "monsters"
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "select a wave to see monster options here."
                    )
                );
            }

            var selectedEncounter = this.props.encounters.find(function (e) {
                return e.id === _this9.state.combat.encounterID;
            });
            if (this.state.combat.waveID) {
                selectedEncounter = selectedEncounter.waves.find(function (w) {
                    return w.id === _this9.state.combat.waveID;
                });
            }

            if (selectedEncounter.slots.length === 0) {
                return null;
            }

            var initOptions = [{
                id: "manual",
                text: "enter manually"
            }, {
                id: "individual",
                text: "roll individually"
            }, {
                id: "group",
                text: "roll in groups"
            }];

            var names = this.state.combat.monsterNames.map(function (slotNames) {
                var slot = selectedEncounter.slots.find(function (s) {
                    return s.id === slotNames.id;
                });
                var inputs = [];
                for (var n = 0; n !== slotNames.names.length; ++n) {
                    inputs.push(React.createElement(
                        "div",
                        { key: n },
                        React.createElement(MonsterName, {
                            value: slotNames.names[n],
                            slotID: slot.id,
                            index: n,
                            changeName: function changeName(slotID, index, value) {
                                return _this9.changeName(slotID, index, value);
                            }
                        })
                    ));
                }
                return React.createElement(
                    "div",
                    { key: slotNames.id, className: "name-row" },
                    React.createElement(
                        "div",
                        { className: "name-label" },
                        slot.monsterName
                    ),
                    React.createElement(
                        "div",
                        { className: "name-inputs" },
                        inputs
                    )
                );
            });

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "heading" },
                    "monsters"
                ),
                React.createElement(
                    "div",
                    { className: "subheading" },
                    "initiative"
                ),
                React.createElement(Selector, {
                    options: initOptions,
                    selectedID: this.state.combat.encounterInitMode,
                    select: function select(optionID) {
                        return _this9.setEncounterInitMode(optionID);
                    }
                }),
                React.createElement(
                    "div",
                    { className: "subheading" },
                    "names"
                ),
                React.createElement(
                    "div",
                    null,
                    names
                )
            );
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }, {
        key: "render",
        value: function render() {
            try {
                var leftSection = null;
                var rightSection = null;

                if (this.props.parties) {
                    leftSection = React.createElement(
                        "div",
                        null,
                        this.getPartySection(),
                        this.getEncounterSection()
                    );

                    rightSection = React.createElement(
                        "div",
                        null,
                        this.getDifficultySection(),
                        this.getMonsterSection()
                    );
                } else {
                    leftSection = React.createElement(
                        "div",
                        null,
                        this.getWaveSection()
                    );

                    rightSection = React.createElement(
                        "div",
                        null,
                        this.getMonsterSection()
                    );
                }

                return React.createElement(
                    "div",
                    { className: "row", style: { height: "100%", margin: "0 -15px" } },
                    React.createElement(
                        "div",
                        { className: "column small-6 medium-6 large-6 scrollable" },
                        leftSection
                    ),
                    React.createElement(
                        "div",
                        { className: "column small-6 medium-6 large-6 scrollable" },
                        rightSection
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return CombatStartModal;
}(React.Component);

var MonsterName = function (_React$Component2) {
    _inherits(MonsterName, _React$Component2);

    function MonsterName() {
        _classCallCheck(this, MonsterName);

        return _possibleConstructorReturn(this, (MonsterName.__proto__ || Object.getPrototypeOf(MonsterName)).apply(this, arguments));
    }

    _createClass(MonsterName, [{
        key: "render",
        value: function render() {
            var _this11 = this;

            return React.createElement("input", { type: "text", value: this.props.value, onChange: function onChange(event) {
                    return _this11.props.changeName(_this11.props.slotID, _this11.props.index, event.target.value);
                } });
        }
    }]);

    return MonsterName;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DemographicsModal = function (_React$Component) {
    _inherits(DemographicsModal, _React$Component);

    function DemographicsModal() {
        _classCallCheck(this, DemographicsModal);

        var _this = _possibleConstructorReturn(this, (DemographicsModal.__proto__ || Object.getPrototypeOf(DemographicsModal)).call(this));

        _this.state = {
            chart: "challenge"
        };
        return _this;
    }

    _createClass(DemographicsModal, [{
        key: "selectChart",
        value: function selectChart(chart) {
            this.setState({
                chart: chart
            });
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
                                SIZE_TYPES.forEach(function (size) {
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
                    for (var index = 0; index !== buckets.length; ++index) {
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

                    var chartOptions = [{
                        id: "challenge",
                        text: "challenge rating"
                    }, {
                        id: "size",
                        text: "size"
                    }, {
                        id: "type",
                        text: "type"
                    }];

                    demographics = React.createElement(
                        "div",
                        null,
                        React.createElement(Selector, {
                            options: chartOptions,
                            selectedID: this.state.chart,
                            select: function select(optionID) {
                                return _this2.selectChart(optionID);
                            }
                        }),
                        React.createElement(
                            "div",
                            { className: "chart" },
                            React.createElement(
                                "div",
                                { className: "plot" },
                                bars
                            )
                        )
                    );
                }

                return demographics;
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return DemographicsModal;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MonsterEditorModal = function (_React$Component) {
    _inherits(MonsterEditorModal, _React$Component);

    function MonsterEditorModal(props) {
        _classCallCheck(this, MonsterEditorModal);

        var _this = _possibleConstructorReturn(this, (MonsterEditorModal.__proto__ || Object.getPrototypeOf(MonsterEditorModal)).call(this));

        _this.state = {
            monster: props.monster,
            page: "overview",
            showFilter: false,
            helpSection: "speed",
            filter: {
                size: true,
                type: true,
                subtype: false,
                alignment: false,
                challenge: true
            }
        };
        return _this;
    }

    _createClass(MonsterEditorModal, [{
        key: "setPage",
        value: function setPage(page) {
            var sections = this.getHelpOptionsForPage(page);
            this.setState({
                page: page,
                helpSection: sections[0]
            });
        }
    }, {
        key: "toggleFilter",
        value: function toggleFilter() {
            this.setState({
                showFilter: !this.state.showFilter
            });
        }
    }, {
        key: "setHelpSection",
        value: function setHelpSection(section) {
            this.setState({
                helpSection: section
            });
        }
    }, {
        key: "toggleMatch",
        value: function toggleMatch(type) {
            this.state.filter[type] = !this.state.filter[type];
            this.setState({
                filter: this.state.filter
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Helper methods

    }, {
        key: "getHelpOptionsForPage",
        value: function getHelpOptionsForPage(page) {
            switch (page) {
                case "overview":
                    return ["speed", "senses", "languages", "equipment"];
                case "abilities":
                    return ["str", "dex", "con", "int", "wis", "cha", "saves", "skills"];
                case "combat":
                    return ["armor class", "hit dice", "resistances", "vulnerabilities", "immunities", "conditions"];
                case "actions":
                    return ["actions"];
            }

            return null;
        }
    }, {
        key: "getMonsters",
        value: function getMonsters() {
            var _this2 = this;

            var monsters = [];
            this.props.library.forEach(function (group) {
                group.monsters.forEach(function (monster) {
                    var match = true;

                    if (_this2.state.monster.id === monster.id) {
                        match = false;
                    }

                    if (_this2.state.filter.size && _this2.state.monster.size !== monster.size) {
                        match = false;
                    }

                    if (_this2.state.filter.type && _this2.state.monster.category !== monster.category) {
                        match = false;
                    }

                    if (_this2.state.filter.subtype && _this2.state.monster.tag !== monster.tag) {
                        match = false;
                    }

                    if (_this2.state.filter.alignment && _this2.state.monster.alignment !== monster.alignment) {
                        match = false;
                    }

                    if (_this2.state.filter.challenge && _this2.state.monster.challenge !== monster.challenge) {
                        match = false;
                    }

                    if (match) {
                        monsters.push(monster);
                    }
                });
            });

            return monsters;
        }
    }, {
        key: "setRandomValue",
        value: function setRandomValue(field, monsters, notify) {
            var index = Math.floor(Math.random() * monsters.length);
            var m = monsters[index];

            var source = m;
            var value = null;
            var tokens = field.split(".");
            tokens.forEach(function (token) {
                if (token === tokens[tokens.length - 1]) {
                    value = source[token];
                } else {
                    source = source[token];
                }
            });

            this.changeValue(field, value, notify);
        }
    }, {
        key: "geneSplice",
        value: function geneSplice(monsters) {
            var _this3 = this;

            ["speed", "senses", "languages", "equipment", "abilityScores.str", "abilityScores.dex", "abilityScores.con", "abilityScores.int", "abilityScores.wis", "abilityScores.cha", "savingThrows", "skills", "ac", "hitDice", "damage.resist", "damage.vulnerable", "damage.immune", "conditionImmunities"].forEach(function (field) {
                _this3.setRandomValue(field, monsters, false);
            });

            TRAIT_TYPES.forEach(function (type) {
                // Clear current traits of this type
                var current = _this3.state.monster.traits.filter(function (t) {
                    return t.type === type;
                });
                current.forEach(function (c) {
                    var index = _this3.state.monster.traits.findIndex(function (t) {
                        return t === c;
                    });
                    _this3.state.monster.traits.splice(index, 1);
                });

                // Get all traits of this type
                var traits = [];
                monsters.forEach(function (m) {
                    m.traits.filter(function (t) {
                        return t.type === type;
                    }).forEach(function (t) {
                        return traits.push(t);
                    });
                });

                // Collate by name
                var distinct = [];
                traits.forEach(function (t) {
                    var current = distinct.find(function (d) {
                        return d.trait.name === t.name;
                    });
                    if (current) {
                        current.count += 1;
                    } else {
                        distinct.push({
                            trait: t,
                            count: 1
                        });
                    }
                });

                // If any are common to all monsters, copy them and remove from the candidates
                var addedIDs = [];
                distinct.filter(function (d) {
                    return d.count === monsters.length;
                }).forEach(function (d) {
                    _this3.copyTrait(d.trait);
                    addedIDs.push(d.trait.id);
                });
                addedIDs.forEach(function (id) {
                    var index = distinct.findIndex(function (d) {
                        return d.trait.id === id;
                    });
                    distinct.splice(index, 1);
                });

                var avg = traits.length / monsters.length;
                while (_this3.state.monster.traits.filter(function (t) {
                    return t.type === type;
                }).length < avg) {
                    var index = Math.floor(Math.random() * distinct.length);
                    var t = distinct[index].trait;
                    _this3.copyTrait(t);
                    distinct.splice(index, 1);
                }
            });

            this.setState({
                monster: this.state.monster
            });
        }
    }, {
        key: "addTrait",
        value: function addTrait(type) {
            var trait = {
                id: guid(),
                name: "New " + this.getActionTypeName(type, false).toLowerCase(),
                usage: "",
                type: type,
                text: ""
            };
            this.state.monster.traits.push(trait);
            this.setState({
                monster: this.state.monster
            });
        }
    }, {
        key: "sortTraits",
        value: function sortTraits(type) {
            var _this4 = this;

            // Take out traits of this type
            var traits = this.state.monster.traits.filter(function (t) {
                return t.type === type;
            });
            traits.forEach(function (t) {
                var index = _this4.state.monster.traits.indexOf(t);
                _this4.state.monster.traits.splice(index, 1);
            });

            // Re-add multiattack
            var multi = traits.find(function (t) {
                var options = ["multiattack", "multi-attack", "multi attack"];
                return options.indexOf(t.name.toLowerCase()) !== -1;
            });
            if (multi) {
                var index = traits.indexOf(multi);
                traits.splice(index, 1);
                this.state.monster.traits.push(multi);
            }

            // Sort the rest and re-add them
            traits = sort(traits);
            traits.forEach(function (t) {
                return _this4.state.monster.traits.push(t);
            });

            this.setState({
                monster: this.state.monster
            });
        }
    }, {
        key: "addRandomTrait",
        value: function addRandomTrait(type, monsters) {
            var traits = [];
            monsters.forEach(function (m) {
                m.traits.filter(function (t) {
                    return t.type === type;
                }).forEach(function (t) {
                    traits.push(t);
                });
            });

            var index = Math.floor(Math.random() * traits.length);
            var trait = traits[index];

            this.copyTrait(trait);
        }
    }, {
        key: "removeTrait",
        value: function removeTrait(trait) {
            var index = this.state.monster.traits.indexOf(trait);
            this.state.monster.traits.splice(index, 1);
            this.setState({
                monster: this.state.monster
            });
        }
    }, {
        key: "getActionTypeName",
        value: function getActionTypeName(type, plural) {
            var name = traitType(type);
            if (plural) {
                name += "s";
            }
            return name;
        }
    }, {
        key: "copyTrait",
        value: function copyTrait(trait) {
            var copy = JSON.parse(JSON.stringify(trait));
            copy.id = guid();
            this.state.monster.traits.push(copy);
            this.setState({
                monster: this.state.monster
            });
        }
    }, {
        key: "changeTrait",
        value: function changeTrait(trait, field, value) {
            trait[field] = value;
            this.setState({
                monster: this.state.monster
            });
        }
    }, {
        key: "nudgeValue",
        value: function nudgeValue(field, delta) {
            var source = this.state.monster;
            var value = null;
            var tokens = field.split(".");
            tokens.forEach(function (token) {
                if (token === tokens[tokens.length - 1]) {
                    value = source[token];
                } else {
                    source = source[token];
                }
            });

            var newValue = null;
            if (field === "challenge") {
                newValue = nudgeChallenge(value, delta);
            } else {
                newValue = value + delta;
            }

            this.changeValue(field, newValue);
        }
    }, {
        key: "changeValue",
        value: function changeValue(field, value) {
            var _this5 = this;

            var notify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var source = this.state.monster;
            var tokens = field.split(".");
            tokens.forEach(function (token) {
                if (token === tokens[tokens.length - 1]) {
                    source[token] = value;

                    if (field === "abilityScores.con" || field === "size" || field === "hitDice") {
                        var sides = hitDieType(_this5.state.monster.size);
                        var conMod = Math.floor((_this5.state.monster.abilityScores.con - 10) / 2);
                        var hpPerDie = (sides + 1) / 2 + conMod;
                        var hp = Math.floor(_this5.state.monster.hitDice * hpPerDie);
                        _this5.state.monster.hpMax = hp;
                    }

                    if (notify) {
                        _this5.setState({
                            monster: _this5.state.monster
                        });
                    }
                } else {
                    source = source[token];
                }
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // HTML render methods

    }, {
        key: "getHelpSection",
        value: function getHelpSection(monsters) {
            switch (this.state.helpSection) {
                case "speed":
                    return this.getValueSection("speed", "text", monsters);
                case "senses":
                    return this.getValueSection("senses", "text", monsters);
                case "languages":
                    return this.getValueSection("languages", "text", monsters);
                case "equipment":
                    return this.getValueSection("equipment", "text", monsters);
                case "str":
                    return this.getValueSection("abilityScores.str", "number", monsters);
                case "dex":
                    return this.getValueSection("abilityScores.dex", "number", monsters);
                case "con":
                    return this.getValueSection("abilityScores.con", "number", monsters);
                case "int":
                    return this.getValueSection("abilityScores.int", "number", monsters);
                case "wis":
                    return this.getValueSection("abilityScores.wis", "number", monsters);
                case "cha":
                    return this.getValueSection("abilityScores.cha", "number", monsters);
                case "saves":
                    return this.getValueSection("savingThrows", "text", monsters);
                case "skills":
                    return this.getValueSection("skills", "text", monsters);
                case "armor class":
                    return this.getValueSection("ac", "number", monsters);
                case "hit dice":
                    return this.getValueSection("hitDice", "number", monsters);
                case "resistances":
                    return this.getValueSection("damage.resist", "text", monsters);
                case "vulnerabilities":
                    return this.getValueSection("damage.vulnerable", "text", monsters);
                case "immunities":
                    return this.getValueSection("damage.immune", "text", monsters);
                case "conditions":
                    return this.getValueSection("conditionImmunities", "text", monsters);
                case "actions":
                    return this.getActionsSection(monsters);
            }

            return null;
        }
    }, {
        key: "getValueSection",
        value: function getValueSection(field, dataType, monsters) {
            var _this6 = this;

            var values = monsters.map(function (m) {
                var tokens = field.split(".");
                var source = m;
                var value = null;
                tokens.forEach(function (token) {
                    if (token === tokens[tokens.length - 1]) {
                        value = source[token];
                    } else {
                        source = source[token];
                    }
                });
                if (dataType === "text" && value === "") {
                    value = null;
                }
                return value;
            }).filter(function (v) {
                return v !== null;
            });

            var distinct = [];
            if (dataType === "number") {
                var min = null,
                    max = null;
                values.forEach(function (v) {
                    if (min === null || v < min) {
                        min = v;
                    }
                    if (max === null || v > max) {
                        max = v;
                    }
                });
                if (min !== null && max !== null) {
                    for (var n = min; n <= max; ++n) {
                        distinct.push({
                            value: n,
                            count: 0
                        });
                    }
                }
            }
            values.forEach(function (v) {
                var current = distinct.find(function (d) {
                    return d.value === v;
                });
                if (current) {
                    current.count += 1;
                } else {
                    distinct.push({
                        value: v,
                        count: 1
                    });
                }
            });

            switch (dataType) {
                case "number":
                    sortByValue(distinct);
                    break;
                case "text":
                    sortByCount(distinct);
                    break;
            }

            if (dataType === "text") {
                var count = monsters.length - values.length;
                if (count !== 0) {
                    distinct.push({
                        value: "",
                        count: monsters.length - values.length
                    });
                }
            }

            var valueSections = distinct.map(function (d) {
                var width = 100 * d.count / monsters.length;
                return React.createElement(
                    "div",
                    { className: "row small-up-3 medium-up-3 large-up-3 value-list", key: distinct.indexOf(d) },
                    React.createElement(
                        "div",
                        { className: "column" },
                        React.createElement(
                            "div",
                            { className: "text-container" },
                            d.value || "(none specified)"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "column" },
                        React.createElement(
                            "div",
                            { className: "bar-container" },
                            React.createElement("div", { className: "bar", style: { width: width + "%" } })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "column" },
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this6.changeValue(field, d.value);
                                } },
                            "use this value"
                        )
                    )
                );
            });

            return React.createElement(
                "div",
                null,
                valueSections,
                React.createElement(
                    "button",
                    { onClick: function onClick() {
                            return _this6.setRandomValue(field, monsters, true);
                        } },
                    "select random value"
                )
            );
        }
    }, {
        key: "getActionsSection",
        value: function getActionsSection(monsters) {
            var _this7 = this;

            var rows = [];
            rows.push(React.createElement(
                "div",
                { className: "row small-up-3 medium-up-3 large-up-3 value-list", key: "header" },
                React.createElement(
                    "div",
                    { className: "column" },
                    React.createElement(
                        "div",
                        { className: "text-container" },
                        React.createElement(
                            "b",
                            null,
                            "type"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "column" },
                    React.createElement(
                        "div",
                        { className: "text-container number" },
                        React.createElement(
                            "b",
                            null,
                            "average number"
                        )
                    )
                ),
                React.createElement(
                    "div",
                    { className: "column" },
                    React.createElement(
                        "div",
                        { className: "text-container number" },
                        React.createElement(
                            "b",
                            null,
                            "min - max"
                        )
                    )
                )
            ));

            TRAIT_TYPES.forEach(function (type) {
                var min = null,
                    max = null,
                    count = null;
                monsters.forEach(function (m) {
                    var n = m.traits.filter(function (t) {
                        return t.type === type;
                    }).length;
                    if (min === null || n < min) {
                        min = n;
                    }
                    if (max === null || n > max) {
                        max = n;
                    }
                    count += n;
                });
                var avg = Math.round(count / monsters.length);

                rows.push(React.createElement(
                    "div",
                    { className: "row small-up-4 medium-up-4 large-up-4 value-list", key: type },
                    React.createElement(
                        "div",
                        { className: "column" },
                        React.createElement(
                            "div",
                            { className: count === 0 ? "text-container disabled" : "text-container" },
                            _this7.getActionTypeName(type, true)
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "column" },
                        React.createElement(
                            "div",
                            { className: count === 0 ? "text-container number disabled" : "text-container number" },
                            avg
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "column" },
                        React.createElement(
                            "div",
                            { className: count === 0 ? "text-container number disabled" : "text-container number" },
                            min,
                            " - ",
                            max
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "column" },
                        React.createElement(
                            "button",
                            { className: count === 0 ? "disabled" : "", onClick: function onClick() {
                                    return _this7.addRandomTrait(type, monsters);
                                } },
                            "add random"
                        )
                    )
                ));
            });

            return React.createElement(
                "div",
                null,
                rows
            );
        }
    }, {
        key: "getFilterCard",
        value: function getFilterCard(monsters) {
            var _this8 = this;

            var similar = React.createElement(
                "div",
                { className: "section" },
                monsters.length,
                " similar monsters"
            );

            var filterContent = null;
            if (this.state.showFilter) {
                filterContent = React.createElement(
                    "div",
                    null,
                    React.createElement(Checkbox, {
                        label: "size " + this.state.monster.size,
                        checked: this.state.filter.size,
                        changeValue: function changeValue(value) {
                            return _this8.toggleMatch("size");
                        }
                    }),
                    React.createElement(Checkbox, {
                        label: "type " + this.state.monster.category,
                        checked: this.state.filter.type,
                        changeValue: function changeValue(value) {
                            return _this8.toggleMatch("type");
                        }
                    }),
                    React.createElement(Checkbox, {
                        label: this.state.monster.tag ? "subtype " + this.state.monster.tag : "subtype",
                        checked: this.state.filter.subtype,
                        disabled: !this.state.monster.tag,
                        changeValue: function changeValue(value) {
                            return _this8.toggleMatch("subtype");
                        }
                    }),
                    React.createElement(Checkbox, {
                        label: this.state.monster.alignment ? "alignment " + this.state.monster.alignment : "alignment",
                        checked: this.state.filter.alignment,
                        disabled: !this.state.monster.alignment,
                        changeValue: function changeValue(value) {
                            return _this8.toggleMatch("alignment");
                        }
                    }),
                    React.createElement(Checkbox, {
                        label: "challenge rating " + challenge(this.state.monster.challenge),
                        checked: this.state.filter.challenge,
                        changeValue: function changeValue(value) {
                            return _this8.toggleMatch("challenge");
                        }
                    }),
                    React.createElement("div", { className: "divider" }),
                    React.createElement(
                        "button",
                        { className: monsters.length < 2 ? "disabled" : "", onClick: function onClick() {
                                return _this8.geneSplice(monsters);
                            } },
                        "build random monster"
                    ),
                    React.createElement("div", { className: "divider" }),
                    similar
                );
            } else {
                filterContent = React.createElement(
                    "div",
                    null,
                    similar
                );
            }

            return React.createElement(
                "div",
                { className: "section" },
                React.createElement(
                    "div",
                    { className: "card" },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            "similar monsters"
                        ),
                        React.createElement("img", { className: this.state.showFilter ? "image rotate" : "image", src: "resources/images/down-arrow.svg", onClick: function onClick() {
                                return _this8.toggleFilter();
                            } })
                    ),
                    React.createElement(
                        "div",
                        { className: "card-content" },
                        filterContent
                    )
                )
            );
        }
    }, {
        key: "getMonsterCards",
        value: function getMonsterCards(monsters) {
            var _this9 = this;

            var monsters = sort(monsters);
            var monsterCards = monsters.map(function (m) {
                return React.createElement(
                    "div",
                    { className: "section", key: m.id },
                    React.createElement(MonsterCard, {
                        combatant: m,
                        mode: "template " + _this9.state.page,
                        copyTrait: function copyTrait(trait) {
                            return _this9.copyTrait(trait);
                        }
                    })
                );
            });

            return monsterCards;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    }, {
        key: "render",
        value: function render() {
            var _this10 = this;

            try {
                var pages = [{
                    id: 'overview',
                    text: 'overview'
                }, {
                    id: 'abilities',
                    text: 'abilities'
                }, {
                    id: 'combat',
                    text: 'combat'
                }, {
                    id: 'actions',
                    text: 'actions'
                }];

                var monsters = [];
                if (this.props.showMonsters) {
                    monsters = this.getMonsters();
                }

                var content = null;
                var help = null;
                switch (this.state.page) {
                    case 'overview':
                        var catOptions = CATEGORY_TYPES.map(function (cat) {
                            return { id: cat, text: cat };
                        });
                        var sizeOptions = SIZE_TYPES.map(function (size) {
                            return { id: size, text: size };
                        });

                        content = React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "columns small-6 medium-6 large-6" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "name"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.name, onChange: function onChange(event) {
                                        return _this10.changeValue("name", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "size"
                                ),
                                React.createElement(Dropdown, {
                                    options: sizeOptions,
                                    selectedID: this.state.monster.size,
                                    select: function select(optionID) {
                                        return _this10.changeValue("size", optionID);
                                    }
                                }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "type"
                                ),
                                React.createElement(Dropdown, {
                                    options: catOptions,
                                    selectedID: this.state.monster.category,
                                    select: function select(optionID) {
                                        return _this10.changeValue("category", optionID);
                                    }
                                }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "subtype"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.tag, onChange: function onChange(event) {
                                        return _this10.changeValue("tag", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "alignment"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.alignment, onChange: function onChange(event) {
                                        return _this10.changeValue("alignment", event.target.value);
                                    } })
                            ),
                            React.createElement(
                                "div",
                                { className: "columns small-6 medium-6 large-6" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "challenge rating"
                                ),
                                React.createElement(Spin, {
                                    source: this.state.monster,
                                    name: "challenge",
                                    display: function display(value) {
                                        return challenge(value);
                                    },
                                    nudgeValue: function nudgeValue(delta) {
                                        return _this10.nudgeValue("challenge", delta);
                                    }
                                }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "speed"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.speed, onChange: function onChange(event) {
                                        return _this10.changeValue("speed", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "senses"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.senses, onChange: function onChange(event) {
                                        return _this10.changeValue("senses", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "languages"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.languages, onChange: function onChange(event) {
                                        return _this10.changeValue("languages", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "equipment"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.equipment, onChange: function onChange(event) {
                                        return _this10.changeValue("equipment", event.target.value);
                                    } })
                            )
                        );
                        break;
                    case 'abilities':
                        content = React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "columns small-6 medium-6 large-6" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "ability scores"
                                ),
                                React.createElement(AbilityScorePanel, {
                                    edit: true,
                                    combatant: this.state.monster,
                                    nudgeValue: function nudgeValue(source, type, delta) {
                                        return _this10.nudgeValue(type, delta);
                                    }
                                })
                            ),
                            React.createElement(
                                "div",
                                { className: "columns small-6 medium-6 large-6" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "saving throws"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.savingThrows, onChange: function onChange(event) {
                                        return _this10.changeValue("savingThrows", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "skills"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.skills, onChange: function onChange(event) {
                                        return _this10.changeValue("skills", event.target.value);
                                    } })
                            )
                        );
                        break;
                    case 'combat':
                        content = React.createElement(
                            "div",
                            { className: "row" },
                            React.createElement(
                                "div",
                                { className: "columns small-6 medium-6 large-6" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "armor class"
                                ),
                                React.createElement(Spin, {
                                    source: this.state.monster,
                                    name: "ac",
                                    nudgeValue: function nudgeValue(delta) {
                                        return _this10.nudgeValue("ac", delta);
                                    }
                                }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "hit dice"
                                ),
                                React.createElement(Spin, {
                                    source: this.state.monster,
                                    name: "hitDice",
                                    display: function display(value) {
                                        return value + "d" + hitDieType(_this10.state.monster.size);
                                    },
                                    nudgeValue: function nudgeValue(delta) {
                                        return _this10.nudgeValue("hitDice", delta);
                                    }
                                }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "hit points"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "hp-value" },
                                    this.state.monster.hpMax,
                                    " hp"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "columns small-6 medium-6 large-6" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "damage resistances"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.damage.resist, onChange: function onChange(event) {
                                        return _this10.changeValue("damage.resist", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "damage vulnerabilities"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.damage.vulnerable, onChange: function onChange(event) {
                                        return _this10.changeValue("damage.vulnerable", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "damage immunities"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.damage.immune, onChange: function onChange(event) {
                                        return _this10.changeValue("damage.immune", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "condition immunities"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.conditionImmunities, onChange: function onChange(event) {
                                        return _this10.changeValue("conditionImmunities", event.target.value);
                                    } })
                            )
                        );
                        break;
                    case 'actions':
                        content = React.createElement(TraitsPanel, {
                            combatant: this.state.monster,
                            edit: true,
                            addTrait: function addTrait(type) {
                                return _this10.addTrait(type);
                            },
                            sortTraits: function sortTraits(type) {
                                return _this10.sortTraits(type);
                            },
                            removeTrait: function removeTrait(trait) {
                                return _this10.removeTrait(trait);
                            },
                            changeTrait: function changeTrait(trait, type, value) {
                                return _this10.changeTrait(trait, type, value);
                            }
                        });
                        break;
                }

                var help = null;
                if (this.props.showMonsters && monsters.length > 1) {
                    var selector = null;
                    if (this.getHelpOptionsForPage(this.state.page).length > 1) {
                        var options = this.getHelpOptionsForPage(this.state.page).map(function (s) {
                            return {
                                id: s,
                                text: s
                            };
                        });
                        selector = React.createElement(Selector, {
                            tabs: false,
                            options: options,
                            selectedID: this.state.helpSection,
                            select: function select(optionID) {
                                return _this10.setHelpSection(optionID);
                            }
                        });
                    }

                    help = React.createElement(
                        "div",
                        { className: "monster-help" },
                        React.createElement(
                            "div",
                            { className: "subheading" },
                            "information from similar monsters"
                        ),
                        selector,
                        this.getHelpSection(monsters)
                    );
                }

                var monsterList = null;
                if (this.props.showMonsters) {
                    monsterList = React.createElement(
                        "div",
                        { className: "columns small-4 medium-4 large-4 scrollable" },
                        this.getFilterCard(monsters),
                        this.getMonsterCards(monsters)
                    );
                }

                return React.createElement(
                    "div",
                    { className: "row", style: { height: "100%", margin: "0 -15px" } },
                    React.createElement(
                        "div",
                        { className: this.props.showMonsters ? "columns small-8 medium-8 large-8 scrollable" : "columns small-12 medium-12 large-12 scrollable", style: { transition: "none" } },
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(Selector, {
                                tabs: true,
                                options: pages,
                                selectedID: this.state.page,
                                select: function select(optionID) {
                                    return _this10.setPage(optionID);
                                }
                            }),
                            content,
                            help
                        )
                    ),
                    monsterList
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MonsterEditorModal;
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
                        null,
                        React.createElement(Spin, {
                            source: this.props.combatant.abilityScores,
                            name: "str",
                            label: "strength",
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.props.nudgeValue(_this2.props.combatant, "abilityScores.str", delta);
                            }
                        }),
                        React.createElement(Spin, {
                            source: this.props.combatant.abilityScores,
                            name: "dex",
                            label: "dexterity",
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.props.nudgeValue(_this2.props.combatant, "abilityScores.dex", delta);
                            }
                        }),
                        React.createElement(Spin, {
                            source: this.props.combatant.abilityScores,
                            name: "con",
                            label: "constitution",
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.props.nudgeValue(_this2.props.combatant, "abilityScores.con", delta);
                            }
                        }),
                        React.createElement(Spin, {
                            source: this.props.combatant.abilityScores,
                            name: "int",
                            label: "intelligence",
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.props.nudgeValue(_this2.props.combatant, "abilityScores.int", delta);
                            }
                        }),
                        React.createElement(Spin, {
                            source: this.props.combatant.abilityScores,
                            name: "wis",
                            label: "wisdom",
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.props.nudgeValue(_this2.props.combatant, "abilityScores.wis", delta);
                            }
                        }),
                        React.createElement(Spin, {
                            source: this.props.combatant.abilityScores,
                            name: "cha",
                            label: "charisma",
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.props.nudgeValue(_this2.props.combatant, "abilityScores.cha", delta);
                            }
                        })
                    );
                } else {
                    result = React.createElement(
                        "div",
                        { className: "ability-scores", onClick: function onClick() {
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
                        close = React.createElement("img", { className: "image", src: "resources/images/close-black.svg", onClick: function onClick() {
                                return _this2.props.close();
                            } });
                    }

                    var toggle = null;
                    if (this.props.showToggle) {
                        var style = this.state.showCards ? "image rotate" : "image";
                        toggle = React.createElement("img", { className: style, src: "resources/images/down-arrow-black.svg", onClick: function onClick() {
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
                    React.createElement(
                        "div",
                        { className: "row small-up-1 medium-up-2 large-up-4 collapse" },
                        cards
                    )
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

var ConditionPanel = function (_React$Component) {
    _inherits(ConditionPanel, _React$Component);

    function ConditionPanel() {
        _classCallCheck(this, ConditionPanel);

        return _possibleConstructorReturn(this, (ConditionPanel.__proto__ || Object.getPrototypeOf(ConditionPanel)).apply(this, arguments));
    }

    _createClass(ConditionPanel, [{
        key: "setDurationType",
        value: function setDurationType(type) {
            var duration = null;
            switch (type) {
                case "none":
                    duration = null;
                    break;
                case "saves":
                    duration = {
                        type: type,
                        count: 1,
                        saveType: "str",
                        saveDC: 10,
                        point: "start"
                    };
                    break;
                case "combatant":
                    duration = {
                        type: type,
                        point: "start",
                        combatantID: null
                    };
                    break;
                case "rounds":
                    duration = {
                        type: type,
                        count: 1
                    };
                    break;
            }

            this.props.changeConditionValue(this.props.condition, "duration", duration);
        }
    }, {
        key: "getConditionContent",
        value: function getConditionContent() {
            var _this2 = this;

            var content = [];

            var typeOptions = [{
                id: "standard",
                text: "standard"
            }, {
                id: "custom",
                text: "custom"
            }];
            content.push(React.createElement(
                "div",
                { key: "type", className: "section" },
                React.createElement(
                    "div",
                    { className: "subheading" },
                    "condition type"
                ),
                React.createElement(Selector, {
                    options: typeOptions,
                    selectedID: this.props.condition.type,
                    select: function select(optionID) {
                        return _this2.props.changeConditionValue(_this2.props.condition, "type", optionID);
                    }
                })
            ));

            if (this.props.condition.type === "standard") {
                var options = CONDITION_TYPES.map(function (c) {
                    return { id: c, text: c };
                });
                content.push(React.createElement(
                    "div",
                    { key: "standard", className: "section" },
                    React.createElement(
                        "div",
                        { className: "subheading" },
                        "standard conditions"
                    ),
                    React.createElement(Dropdown, {
                        options: options,
                        selectedID: this.props.condition.name,
                        select: function select(optionID) {
                            return _this2.props.changeConditionValue(_this2.props.condition, "name", optionID);
                        }
                    })
                ));
            }

            if (this.props.condition.type === "custom") {
                content.push(React.createElement(
                    "div",
                    { key: "name", className: "section" },
                    React.createElement(
                        "div",
                        { className: "subheading" },
                        "custom condition text"
                    ),
                    React.createElement("input", { type: "text", placeholder: "name", value: this.props.condition.name, onChange: function onChange(event) {
                            return _this2.props.changeConditionValue(_this2.props.condition, "name", event.target.value);
                        } })
                ));
            }

            return content;
        }
    }, {
        key: "getDurationContent",
        value: function getDurationContent() {
            var _this3 = this;

            var content = [];

            var options = [{
                id: "none",
                text: "until removed (default)"
            }, {
                id: "saves",
                text: "until a successful save"
            }, {
                id: "combatant",
                text: "until someone's next turn"
            }, {
                id: "rounds",
                text: "for a number of rounds"
            }];
            var duration = null;
            if (this.props.condition.duration) {
                switch (this.props.condition.duration.type) {
                    case "saves":
                        var saveOptions = ["str", "dex", "con", "int", "wis", "cha", "death"].map(function (c) {
                            return { id: c, text: c };
                        });
                        var pointOptions = ["start", "end"].map(function (c) {
                            return { id: c, text: c };
                        });
                        duration = React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "number of saves required"
                                ),
                                React.createElement(Spin, {
                                    source: this.props.condition.duration,
                                    name: "count",
                                    nudgeValue: function nudgeValue(delta) {
                                        return _this3.props.nudgeConditionValue(_this3.props.condition.duration, "count", delta);
                                    }
                                })
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "type of save"
                                ),
                                React.createElement(Dropdown, {
                                    options: saveOptions,
                                    selectedID: this.props.condition.duration.saveType,
                                    select: function select(optionID) {
                                        return _this3.props.changeConditionValue(_this3.props.condition.duration, "saveType", optionID);
                                    }
                                })
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "save dc"
                                ),
                                React.createElement(Spin, {
                                    source: this.props.condition.duration,
                                    name: "saveDC",
                                    nudgeValue: function nudgeValue(delta) {
                                        return _this3.props.nudgeConditionValue(_this3.props.condition.duration, "saveDC", delta);
                                    }
                                })
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "start or end"
                                ),
                                React.createElement(Selector, {
                                    options: pointOptions,
                                    selectedID: this.props.condition.duration.point,
                                    select: function select(optionID) {
                                        return _this3.props.changeConditionValue(_this3.props.condition.duration, "point", optionID);
                                    }
                                })
                            )
                        );
                        break;
                    case "combatant":
                        var pointOptions = ["start", "end"].map(function (c) {
                            return { id: c, text: c };
                        });
                        var combatantOptions = this.props.combat.combatants.map(function (c) {
                            return { id: c.id, text: c.displayName || c.name || "unnamed monster" };
                        });
                        duration = React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "start or end"
                                ),
                                React.createElement(Selector, {
                                    options: pointOptions,
                                    selectedID: this.props.condition.duration.point,
                                    select: function select(optionID) {
                                        return _this3.props.changeConditionValue(_this3.props.condition.duration, "point", optionID);
                                    }
                                })
                            ),
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "combatant"
                                ),
                                React.createElement(Dropdown, {
                                    options: combatantOptions,
                                    selectedID: this.props.condition.duration.combatantID,
                                    select: function select(optionID) {
                                        return _this3.props.changeConditionValue(_this3.props.condition.duration, "combatantID", optionID);
                                    }
                                })
                            )
                        );
                        break;
                    case "rounds":
                        duration = React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "div",
                                { className: "section" },
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "number of rounds"
                                ),
                                React.createElement(Spin, {
                                    source: this.props.condition.duration,
                                    name: "count",
                                    nudgeValue: function nudgeValue(delta) {
                                        return _this3.props.nudgeConditionValue(_this3.props.condition.duration, "count", delta);
                                    }
                                })
                            )
                        );
                        break;
                };
            }
            content.push(React.createElement(
                "div",
                { key: "duration", className: "section" },
                React.createElement(
                    "div",
                    { className: "subheading" },
                    "duration type"
                ),
                React.createElement(Dropdown, {
                    options: options,
                    selectedID: this.props.condition.duration ? this.props.condition.duration.type : "none",
                    select: function select(optionID) {
                        return _this3.setDurationType(optionID);
                    }
                }),
                duration
            ));

            return content;
        }
    }, {
        key: "getDetails",
        value: function getDetails() {
            var _this4 = this;

            var details = [];

            if (this.props.condition.type === "standard") {
                if (this.props.condition.name === "exhausted") {
                    details.push(React.createElement(
                        "div",
                        { key: "level", className: "section" },
                        React.createElement(Spin, {
                            source: this.props.condition,
                            name: "level",
                            label: "level",
                            nudgeValue: function nudgeValue(delta) {
                                return _this4.props.nudgeConditionValue(_this4.props.condition, "level", delta);
                            }
                        })
                    ));
                }
            }

            return React.createElement(
                "div",
                null,
                details,
                React.createElement(Expander, { text: "edit condition", content: this.getConditionContent() }),
                React.createElement(Expander, { text: "edit duration", content: this.getDurationContent() }),
                React.createElement(ConfirmButton, { key: "remove", text: "remove condition", callback: function callback() {
                        return _this4.props.removeCondition(_this4.props.condition.id);
                    } })
            );
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            try {
                var name = this.props.condition.name || "condition";
                if (this.props.condition.type === "standard" && this.props.condition.name === "exhausted") {
                    name += " (" + this.props.condition.level + ")";
                }

                if (this.props.condition.duration !== null) {
                    switch (this.props.condition.duration.type) {
                        case "saves":
                            name += " until you make " + this.props.condition.duration.count + " " + this.props.condition.duration.saveType + " save(s) at dc " + this.props.condition.duration.saveDC;
                            break;
                        case "combatant":
                            var point = this.props.condition.duration.point;
                            var c = this.props.combat.combatants.find(function (c) {
                                return c.id == _this5.props.condition.duration.combatantID;
                            });
                            var combatant = c ? (c.displayName || c.name || "unnamed monster") + "'s" : "someone's";
                            name += " until the " + point + " of " + combatant + " next turn";
                            break;
                        case "rounds":
                            name += " for " + this.props.condition.duration.count + " round(s)";
                            break;
                    }
                }

                var description = [];
                if (this.props.condition.type === "standard") {
                    var text = conditionText(this.props.condition);
                    for (var n = 0; n !== text.length; ++n) {
                        description.push(React.createElement(
                            "div",
                            { key: n, className: "section small-text" },
                            text[n]
                        ));
                    }
                }

                var header = React.createElement(
                    "div",
                    null,
                    name,
                    description
                );

                return React.createElement(Expander, {
                    text: header,
                    content: this.getDetails()
                });
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

        return _possibleConstructorReturn(this, (ConditionsPanel.__proto__ || Object.getPrototypeOf(ConditionsPanel)).apply(this, arguments));
    }

    _createClass(ConditionsPanel, [{
        key: "addCondition",
        value: function addCondition(condition) {
            this.props.addCondition({
                id: guid(),
                type: condition ? "standard" : "custom",
                name: condition || "custom condition",
                level: 1,
                duration: null
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var conditions = [];
                for (var n = 0; n !== this.props.combatant.conditions.length; ++n) {
                    var condition = this.props.combatant.conditions[n];
                    conditions.push(React.createElement(ConditionPanel, {
                        key: n,
                        condition: condition,
                        combat: this.props.combat,
                        nudgeConditionValue: function nudgeConditionValue(condition, type, delta) {
                            return _this2.props.nudgeConditionValue(condition, type, delta);
                        },
                        changeConditionValue: function changeConditionValue(condition, type, value) {
                            return _this2.props.changeConditionValue(condition, type, value);
                        },
                        removeCondition: function removeCondition(conditionID) {
                            return _this2.props.removeCondition(conditionID);
                        }
                    }));
                }

                var conditionOptions = [{
                    id: null,
                    text: "custom condition"
                }, {
                    id: "div",
                    text: null,
                    disabled: true
                }].concat(CONDITION_TYPES.map(function (c) {
                    return { id: c, text: c };
                }));

                return React.createElement(
                    "div",
                    { className: "section" },
                    conditions,
                    React.createElement(Dropdown, {
                        options: conditionOptions,
                        placeholder: "add a condition",
                        select: function select(optionID) {
                            return _this2.addCondition(optionID);
                        }
                    })
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

var DifficultyChartPanel = function (_React$Component) {
    _inherits(DifficultyChartPanel, _React$Component);

    function DifficultyChartPanel() {
        _classCallCheck(this, DifficultyChartPanel);

        return _possibleConstructorReturn(this, (DifficultyChartPanel.__proto__ || Object.getPrototypeOf(DifficultyChartPanel)).apply(this, arguments));
    }

    _createClass(DifficultyChartPanel, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            var encounter = this.props.encounters.find(function (e) {
                return e.id === _this2.props.encounterID;
            });
            var party = this.props.parties.find(function (p) {
                return p.id === _this2.props.partyID;
            });

            var monsterCount = 0;
            var monsterXp = 0;
            var slots = [].concat(encounter.slots);
            encounter.waves.forEach(function (wave) {
                slots = slots.concat(wave.slots);
            });
            slots.forEach(function (slot) {
                monsterCount += slot.count;
                var monster = _this2.props.getMonster(slot.monsterName, slot.monsterGroupName);
                if (monster) {
                    monsterXp += experience(monster.challenge) * slot.count;
                }
            });

            var adjustedXp = monsterXp * experienceFactor(monsterCount);

            var xpThresholds;
            var difficulty;
            if (party) {
                var xpEasy = 0;
                var xpMedium = 0;
                var xpHard = 0;
                var xpDeadly = 0;

                var pcs = party.pcs.filter(function (pc) {
                    return pc.active;
                });
                pcs.forEach(function (pc) {
                    xpEasy += pcExperience(pc.level, "easy");
                    xpMedium += pcExperience(pc.level, "medium");
                    xpHard += pcExperience(pc.level, "hard");
                    xpDeadly += pcExperience(pc.level, "deadly");
                });

                var difficulty = null;
                var adjustedDifficulty = null;
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
                    adjustedDifficulty = difficulty;

                    if (pcs.length < 3 || pcs.length > 5) {
                        var small = pcs.length < 3;
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

                xpThresholds = React.createElement(
                    "div",
                    { className: "table" },
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
                            xpEasy,
                            " xp"
                        ),
                        React.createElement(
                            "div",
                            { className: "cell four" },
                            xpMedium,
                            " xp"
                        ),
                        React.createElement(
                            "div",
                            { className: "cell four" },
                            xpHard,
                            " xp"
                        ),
                        React.createElement(
                            "div",
                            { className: "cell four" },
                            xpDeadly,
                            " xp"
                        )
                    )
                );

                var getLeft = function getLeft(xp) {
                    var max = Math.max(adjustedXp, xpDeadly * 1.2);
                    return 100 * xp / max;
                };

                var getRight = function getRight(xp) {
                    return 100 - getLeft(xp);
                };

                difficulty = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "difficulty-gauge" },
                        React.createElement(
                            "div",
                            { className: "bar-container" },
                            React.createElement("div", { className: "bar trivial", style: { left: "0", right: getRight(xpEasy) + "%" } })
                        ),
                        React.createElement(
                            "div",
                            { className: "bar-container" },
                            React.createElement("div", { className: "bar easy", style: { left: getLeft(xpEasy) + "%", right: getRight(xpMedium) + "%" } })
                        ),
                        React.createElement(
                            "div",
                            { className: "bar-container" },
                            React.createElement("div", { className: "bar medium", style: { left: getLeft(xpMedium) + "%", right: getRight(xpHard) + "%" } })
                        ),
                        React.createElement(
                            "div",
                            { className: "bar-container" },
                            React.createElement("div", { className: "bar hard", style: { left: getLeft(xpHard) + "%", right: getRight(xpDeadly) + "%" } })
                        ),
                        React.createElement(
                            "div",
                            { className: "bar-container" },
                            React.createElement("div", { className: "bar deadly", style: { left: getLeft(xpDeadly) + "%", right: "0" } })
                        ),
                        React.createElement(
                            "div",
                            { className: "encounter-container" },
                            React.createElement("div", { className: "encounter", style: { left: getLeft(adjustedXp) - 0.5 + "%" } })
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "subheading" },
                        "difficulty"
                    ),
                    React.createElement(
                        "div",
                        { className: "section" },
                        "difficulty for this party",
                        React.createElement(
                            "div",
                            { className: "right" },
                            difficulty
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "section", style: { display: adjustedDifficulty === difficulty ? "none" : "" } },
                        "effective difficulty for ",
                        pcs.length,
                        " pc(s)",
                        React.createElement(
                            "div",
                            { className: "right" },
                            React.createElement(
                                "b",
                                null,
                                adjustedDifficulty
                            )
                        )
                    )
                );
            }

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "subheading" },
                    "xp value"
                ),
                React.createElement(
                    "div",
                    { className: "section" },
                    "xp for this encounter",
                    React.createElement(
                        "div",
                        { className: "right" },
                        monsterXp,
                        " xp"
                    )
                ),
                React.createElement(
                    "div",
                    { className: "section", style: { display: adjustedXp === monsterXp ? "none" : "" } },
                    "effective xp for ",
                    monsterCount,
                    " monster(s)",
                    React.createElement(
                        "div",
                        { className: "right" },
                        adjustedXp,
                        " xp"
                    )
                ),
                xpThresholds,
                difficulty
            );
        }
    }]);

    return DifficultyChartPanel;
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

var TraitPanel = function (_React$Component) {
    _inherits(TraitPanel, _React$Component);

    function TraitPanel() {
        _classCallCheck(this, TraitPanel);

        return _possibleConstructorReturn(this, (TraitPanel.__proto__ || Object.getPrototypeOf(TraitPanel)).apply(this, arguments));
    }

    _createClass(TraitPanel, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var heading = this.props.trait.name || "unnamed " + traitType(this.props.trait.type);
                if (this.props.trait.usage) {
                    heading += " (" + this.props.trait.usage + ")";
                }

                if (this.props.edit) {
                    var details = React.createElement(
                        "div",
                        { className: "section" },
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
                    );

                    return React.createElement(Expander, {
                        text: this.props.trait.name || "unnamed " + traitType(this.props.trait.type),
                        content: details
                    });
                } else if (this.props.template) {
                    return React.createElement(
                        "div",
                        { key: this.props.trait.id, className: "section trait" },
                        React.createElement(
                            "b",
                            null,
                            heading
                        ),
                        " ",
                        this.props.trait.text,
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this2.props.copyTrait(_this2.props.trait);
                                } },
                            "copy"
                        )
                    );
                } else {
                    return React.createElement(
                        "div",
                        { key: this.props.trait.id, className: "section trait" },
                        React.createElement(
                            "b",
                            null,
                            heading
                        ),
                        " ",
                        this.props.trait.text
                    );
                }
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

                for (var n = 0; n !== this.props.combatant.traits.length; ++n) {
                    var action = this.props.combatant.traits[n];
                    var item = React.createElement(TraitPanel, {
                        key: action.id,
                        trait: action,
                        edit: this.props.edit,
                        template: this.props.template,
                        changeTrait: function changeTrait(action, type, value) {
                            return _this2.props.changeTrait(action, type, value);
                        },
                        removeTrait: function removeTrait(action) {
                            return _this2.props.removeTrait(action);
                        },
                        copyTrait: function copyTrait(action) {
                            return _this2.props.copyTrait(action);
                        }
                    });

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

                    if (traits.length > 2) {
                        traits.push(React.createElement(
                            "button",
                            { key: "sort", onClick: function onClick() {
                                    return _this2.props.sortTraits("trait");
                                } },
                            "sort traits"
                        ));
                    }
                    if (actions.length > 2) {
                        actions.push(React.createElement(
                            "button",
                            { key: "sort", onClick: function onClick() {
                                    return _this2.props.sortTraits("action");
                                } },
                            "sort actions"
                        ));
                    }
                    if (legendaryActions.length > 2) {
                        legendaryActions.push(React.createElement(
                            "button",
                            { key: "sort", onClick: function onClick() {
                                    return _this2.props.sortTraits("legendary");
                                } },
                            "sort legendary actions"
                        ));
                    }
                    if (lairActions.length > 2) {
                        lairActions.push(React.createElement(
                            "button",
                            { key: "sort", onClick: function onClick() {
                                    return _this2.props.sortTraits("lair");
                                } },
                            "sort lair actions"
                        ));
                    }
                    if (regionalEffects.length > 2) {
                        regionalEffects.push(React.createElement(
                            "button",
                            { key: "sort", onClick: function onClick() {
                                    return _this2.props.sortTraits("regional");
                                } },
                            "sort regional effects"
                        ));
                    }

                    return React.createElement(
                        "div",
                        { className: "row" },
                        React.createElement(
                            "div",
                            { className: "columns small-6 medium-6 large-6" },
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "traits"
                            ),
                            traits,
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "actions"
                            ),
                            actions
                        ),
                        React.createElement(
                            "div",
                            { className: "columns small-6 medium-6 large-6" },
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "legendary actions"
                            ),
                            legendaryActions,
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "lair actions"
                            ),
                            lairActions,
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "regional effects"
                            ),
                            regionalEffects
                        )
                    );
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

var CombatManagerScreen = function (_React$Component) {
    _inherits(CombatManagerScreen, _React$Component);

    function CombatManagerScreen() {
        _classCallCheck(this, CombatManagerScreen);

        return _possibleConstructorReturn(this, (CombatManagerScreen.__proto__ || Object.getPrototypeOf(CombatManagerScreen)).apply(this, arguments));
    }

    _createClass(CombatManagerScreen, [{
        key: "createCard",
        value: function createCard(combatant, isPlaceholder) {
            var _this2 = this;

            if (isPlaceholder && isPlaceholder(combatant)) {
                return React.createElement(InfoCard, {
                    key: combatant.id,
                    getHeading: function getHeading() {
                        return React.createElement(
                            "div",
                            { className: "heading" },
                            combatant.displayName || combatant.name
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
                        combatant: combatant,
                        mode: "combat",
                        combat: this.props.combat,
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
                        removeCondition: function removeCondition(combatant, conditionID) {
                            return _this2.props.removeCondition(combatant, conditionID);
                        },
                        nudgeConditionValue: function nudgeConditionValue(condition, type, delta) {
                            return _this2.props.nudgeValue(condition, type, delta);
                        },
                        changeConditionValue: function changeConditionValue(condition, type, value) {
                            return _this2.props.changeValue(condition, type, value);
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

                    this.props.combat.combatants.forEach(function (combatant) {
                        if (combatant.current) {
                            current.push(React.createElement(
                                "div",
                                { key: combatant.id },
                                _this3.createCard(combatant)
                            ));
                        }
                        if (combatant.pending && !combatant.active && !combatant.defeated) {
                            pending.push(React.createElement(
                                "div",
                                { className: "column", key: combatant.id },
                                _this3.createCard(combatant, function (combatant) {
                                    return combatant.current;
                                })
                            ));
                        }
                        if (!combatant.pending && combatant.active && !combatant.defeated) {
                            active.push(React.createElement(
                                "div",
                                { className: "column", key: combatant.id },
                                _this3.createCard(combatant, function (combatant) {
                                    return combatant.current;
                                })
                            ));
                        }
                        if (!combatant.pending && !combatant.active && combatant.defeated) {
                            defeated.push(React.createElement(
                                "div",
                                { className: "column", key: combatant.id },
                                _this3.createCard(combatant, function (combatant) {
                                    return combatant.current;
                                })
                            ));
                        }
                    });

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

                    leftPaneContent = React.createElement(
                        "div",
                        null,
                        current
                    );

                    if (this.props.showHelp && pending.length !== 0) {
                        var help = React.createElement(
                            "div",
                            { className: "column", key: "help" },
                            React.createElement(InfoCard, {
                                getContent: function getContent() {
                                    return React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "section" },
                                            "these combatants are not yet part of the encounter"
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "section" },
                                            "set initiative on each of them, then add them to the encounter"
                                        )
                                    );
                                }
                            })
                        );
                        pending = [].concat(help, pending);
                    }

                    if (this.props.showHelp && current.length === 0) {
                        var help = React.createElement(
                            "div",
                            { className: "column", key: "help" },
                            React.createElement(InfoCard, {
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
                            })
                        );
                        active = [].concat(help, active);
                    }

                    var notifications = this.props.combat.notifications.map(function (n) {
                        return React.createElement(Notification, {
                            id: n.id,
                            notification: n,
                            close: function close(notification, removeCondition) {
                                return _this3.props.close(notification, removeCondition);
                            }
                        });
                    });

                    rightPaneContent = React.createElement(
                        "div",
                        null,
                        notifications,
                        React.createElement(CardGroup, {
                            heading: "waiting for intiative to be entered",
                            content: pending,
                            hidden: pending.length === 0,
                            showToggle: true
                        }),
                        React.createElement(CardGroup, {
                            heading: "active combatants",
                            content: active,
                            hidden: active.length === 0
                        }),
                        React.createElement(CardGroup, {
                            heading: "defeated",
                            content: defeated,
                            hidden: defeated.length === 0,
                            showToggle: true
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
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this3.props.createCombat();
                                } },
                            "start a new combat"
                        ),
                        combats
                    );
                }

                return React.createElement(
                    "div",
                    { className: "combat-manager row collapse" },
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-4 large-3 scrollable list-column" },
                        leftPaneContent
                    ),
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-8 large-9 scrollable" },
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

var Notification = function (_React$Component2) {
    _inherits(Notification, _React$Component2);

    function Notification() {
        _classCallCheck(this, Notification);

        return _possibleConstructorReturn(this, (Notification.__proto__ || Object.getPrototypeOf(Notification)).apply(this, arguments));
    }

    _createClass(Notification, [{
        key: "saveSuccess",
        value: function saveSuccess(notification) {
            // Reduce save by 1
            this.props.notification.condition.duration.count -= 1;
            if (this.props.notification.condition.duration.count === 0) {
                // Remove the condition
                this.close(notification, true);
            } else {
                this.close(notification);
            }
        }
    }, {
        key: "close",
        value: function close(notification) {
            var removeCondition = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

            this.props.close(notification, removeCondition);
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            var name = this.props.notification.combatant.displayName || this.props.notification.combatant.name || "unnamed monster";
            switch (this.props.notification.type) {
                case "condition-save":
                    return React.createElement(
                        "div",
                        { key: this.props.notification.id, className: "notification" },
                        React.createElement(
                            "div",
                            { className: "text" },
                            name,
                            " must make a ",
                            this.props.notification.condition.duration.saveType,
                            " save against dc ",
                            this.props.notification.condition.duration.saveDC
                        ),
                        React.createElement(
                            "div",
                            { className: "buttons" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this5.saveSuccess(_this5.props.notification);
                                    } },
                                "success"
                            ),
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this5.close(_this5.props.notification);
                                    } },
                                "ok"
                            )
                        )
                    );
                case "condition-end":
                    return React.createElement(
                        "div",
                        { key: this.props.notification.id, className: "notification" },
                        React.createElement(
                            "div",
                            { className: "text" },
                            name,
                            " is no longer affected by condition ",
                            this.props.notification.condition.name
                        ),
                        React.createElement(
                            "div",
                            { className: "buttons" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this5.close(_this5.props.notification);
                                    } },
                                "ok"
                            )
                        )
                    );
            }
        }
    }]);

    return Notification;
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
        key: "getMonsterCards",
        value: function getMonsterCards(slots, waveID) {
            var _this2 = this;

            var cards = [];

            slots.forEach(function (slot) {
                var monster = _this2.props.getMonster(slot.monsterName, slot.monsterGroupName);
                if (monster) {
                    cards.push(React.createElement(
                        "div",
                        { className: "column", key: monster.id },
                        React.createElement(MonsterCard, {
                            combatant: monster,
                            slot: slot,
                            encounter: _this2.props.selection,
                            mode: "view encounter",
                            nudgeValue: function nudgeValue(slot, type, delta) {
                                return _this2.props.nudgeValue(slot, type, delta);
                            },
                            removeEncounterSlot: function removeEncounterSlot(slot) {
                                return _this2.props.removeEncounterSlot(slot, waveID);
                            }
                        })
                    ));
                } else {
                    var index = slots.indexOf(slot);
                    var error = "unknown monster: " + slot.monsterName + " in group " + slot.monsterGroupName;
                    cards.push(React.createElement(
                        "div",
                        { className: "column", key: index },
                        React.createElement(ErrorCard, {
                            getContent: function getContent() {
                                return React.createElement(
                                    "div",
                                    { className: "section" },
                                    error
                                );
                            }
                        })
                    ));
                }
            });

            if (slots.length === 0) {
                cards.push(React.createElement(
                    "div",
                    { className: "column", key: "empty" },
                    React.createElement(InfoCard, { getContent: function getContent() {
                            return React.createElement(
                                "div",
                                { className: "section" },
                                "no monsters"
                            );
                        } })
                ));
            }

            return cards;
        }
    }, {
        key: "getLibrarySection",
        value: function getLibrarySection() {
            var _this3 = this;

            if (!this.props.selection) {
                return null;
            }

            var libraryCards = [];
            libraryCards.push(React.createElement(
                "div",
                { className: "column", key: "filter" },
                React.createElement(FilterCard, {
                    filter: this.state.filter,
                    changeValue: function changeValue(type, value) {
                        return _this3.changeFilterValue(type, value);
                    },
                    nudgeValue: function nudgeValue(type, delta) {
                        return _this3.nudgeFilterValue(type, delta);
                    },
                    resetFilter: function resetFilter() {
                        return _this3.resetFilter();
                    }
                })
            ));

            var monsters = [];
            if (this.props.selection) {
                this.props.library.forEach(function (group) {
                    group.monsters.forEach(function (monster) {
                        if (_this3.matchMonster(monster)) {
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
                libraryCards.push(React.createElement(
                    "div",
                    { className: "column", key: monster.id },
                    React.createElement(MonsterCard, {
                        key: monster.id,
                        combatant: monster,
                        encounter: _this3.props.selection,
                        library: _this3.props.library,
                        mode: "view encounter",
                        addEncounterSlot: function addEncounterSlot(combatant, waveID) {
                            return _this3.props.addEncounterSlot(combatant, waveID);
                        }
                    })
                ));
            });

            return React.createElement(CardGroup, {
                heading: "monster library",
                content: libraryCards,
                showToggle: true
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

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
                            return _this4.props.selectEncounter(encounter);
                        }
                    }));
                };

                var encounterName = null;
                var encounterCards = [];
                var waves = [];

                if (this.props.selection) {
                    encounterName = this.props.selection.name || "unnamed encounter";

                    encounterCards.push(React.createElement(
                        "div",
                        { className: "column", key: "info" },
                        React.createElement(EncounterCard, {
                            selection: this.props.selection,
                            parties: this.props.parties,
                            encounters: this.props.encounters,
                            changeValue: function changeValue(type, value) {
                                return _this4.props.changeValue(_this4.props.selection, type, value);
                            },
                            addWave: function addWave() {
                                return _this4.props.addWave();
                            },
                            removeEncounter: function removeEncounter() {
                                return _this4.props.removeEncounter();
                            },
                            getMonster: function getMonster(monsterName, monsterGroupName) {
                                return _this4.props.getMonster(monsterName, monsterGroupName);
                            }
                        })
                    ));

                    this.getMonsterCards(this.props.selection.slots, null).forEach(function (card) {
                        return encounterCards.push(card);
                    });

                    waves = this.props.selection.waves.map(function (wave) {
                        var waveCards = [];
                        waveCards.push(React.createElement(
                            "div",
                            { className: "column", key: "info" },
                            React.createElement(WaveCard, {
                                wave: wave,
                                removeWave: function removeWave(wave) {
                                    return _this4.props.removeWave(wave);
                                },
                                changeValue: function changeValue(wave, field, value) {
                                    return _this4.props.changeValue(wave, field, value);
                                }
                            })
                        ));

                        _this4.getMonsterCards(wave.slots, wave.id).forEach(function (card) {
                            return waveCards.push(card);
                        });

                        return React.createElement(CardGroup, {
                            key: wave.id,
                            heading: wave.name || "unnamed wave",
                            content: waveCards,
                            showToggle: true
                        });
                    });
                }

                return React.createElement(
                    "div",
                    { className: "encounter-builder row collapse" },
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-4 large-3 scrollable list-column" },
                        help,
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this4.props.addEncounter("new encounter");
                                } },
                            "add a new encounter"
                        ),
                        encounters
                    ),
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-8 large-9 scrollable" },
                        React.createElement(CardGroup, {
                            content: encounterCards,
                            heading: encounterName,
                            showClose: this.props.selection !== null,
                            close: function close() {
                                return _this4.props.selectEncounter(null);
                            }
                        }),
                        waves,
                        this.getLibrarySection()
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
            var _this2 = this;

            try {
                var monsters = null;
                if (this.props.library.length === 0) {
                    monsters = React.createElement(
                        "div",
                        null,
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "text" },
                            React.createElement(
                                "div",
                                null,
                                "since your collection of monsters is empty, you might want to start by pressing the button below to add monsters from the ",
                                React.createElement(
                                    "a",
                                    { href: "http://dnd.wizards.com/articles/features/systems-reference-document-srd", target: "_blank" },
                                    "system reference document"
                                )
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "text" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.addOpenGameContent();
                                    } },
                                "add monsters"
                            )
                        )
                    );
                }

                return React.createElement(
                    "div",
                    { className: "home scrollable" },
                    React.createElement(
                        "div",
                        { className: "vertical-center-outer" },
                        React.createElement(
                            "div",
                            { className: "vertical-center-middle" },
                            React.createElement(
                                "div",
                                { className: "vertical-center-inner" },
                                React.createElement(
                                    "div",
                                    { className: "welcome-panel" },
                                    React.createElement(
                                        "div",
                                        { className: "heading" },
                                        "welcome to ",
                                        React.createElement(
                                            "b",
                                            null,
                                            "dojo"
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "text" },
                                        React.createElement(
                                            "div",
                                            null,
                                            React.createElement(
                                                "b",
                                                null,
                                                "dojo"
                                            ),
                                            " is an app for dms of dungeons and dragons fifth edition"
                                        )
                                    ),
                                    React.createElement(
                                        "div",
                                        { className: "text" },
                                        React.createElement(
                                            "div",
                                            null,
                                            "with ",
                                            React.createElement(
                                                "b",
                                                null,
                                                "dojo"
                                            ),
                                            " you can:",
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
                                    ),
                                    monsters,
                                    React.createElement("div", { className: "divider" }),
                                    React.createElement(
                                        "div",
                                        { className: "text" },
                                        React.createElement(
                                            "div",
                                            null,
                                            "use the buttons at the bottom of the screen to access the app's features"
                                        )
                                    )
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

    return HomeScreen;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapBuilderScreen = function (_React$Component) {
    _inherits(MapBuilderScreen, _React$Component);

    function MapBuilderScreen() {
        _classCallCheck(this, MapBuilderScreen);

        return _possibleConstructorReturn(this, (MapBuilderScreen.__proto__ || Object.getPrototypeOf(MapBuilderScreen)).apply(this, arguments));
    }

    _createClass(MapBuilderScreen, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var help = null;
                if (this.props.showHelp) {
                    help = React.createElement(MapBuilderCard, { maps: this.props.maps });
                }

                var maps = [];
                for (var n = 0; n !== this.props.maps.length; ++n) {
                    var map = this.props.maps[n];
                    maps.push(React.createElement(MapListItem, {
                        key: map.id,
                        map: map,
                        selected: map === this.props.selection,
                        setSelection: function setSelection(map) {
                            return _this2.props.selectMap(map);
                        }
                    }));
                };

                var map = null;
                if (this.props.selection) {
                    var mapCard = React.createElement(
                        "div",
                        { className: "column" },
                        React.createElement(MapCard, {
                            selection: this.props.selection,
                            changeValue: function changeValue(type, value) {
                                return _this2.props.changeValue(_this2.props.selection, type, value);
                            },
                            removeMap: function removeMap() {
                                return _this2.props.removeMap();
                            }
                        })
                    );

                    map = React.createElement(CardGroup, {
                        content: [mapCard],
                        heading: this.props.selection.name || "unnamed map",
                        showClose: this.props.selection !== null,
                        close: function close() {
                            return _this2.props.selectMap(null);
                        }
                    });
                }

                return React.createElement(
                    "div",
                    { className: "map-builder row collapse" },
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-4 large-3 scrollable list-column" },
                        help,
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this2.props.addMap("new map");
                                } },
                            "add a new map"
                        ),
                        maps
                    ),
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-8 large-9 scrollable" },
                        map
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MapBuilderScreen;
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

        return _possibleConstructorReturn(this, (MonsterLibraryScreen.__proto__ || Object.getPrototypeOf(MonsterLibraryScreen)).apply(this, arguments));
    }

    _createClass(MonsterLibraryScreen, [{
        key: "showMonsterGroup",
        value: function showMonsterGroup(group) {
            var _this2 = this;

            var result = match(this.props.filter, group.name);

            if (!result) {
                group.monsters.forEach(function (monster) {
                    result = match(_this2.props.filter, monster.name) || result;
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
                    help = React.createElement(MonsterLibraryCard, null);
                }

                var listItems = [];
                for (var n = 0; n !== this.props.library.length; ++n) {
                    var group = this.props.library[n];
                    if (this.showMonsterGroup(group)) {
                        listItems.push(React.createElement(MonsterGroupListItem, {
                            key: group.id,
                            group: group,
                            filter: this.props.filter,
                            selected: group === this.props.selection,
                            setSelection: function setSelection(group) {
                                return _this3.props.selectMonsterGroup(group);
                            }
                        }));
                    }
                };

                var cards = [];

                if (this.props.selection) {
                    cards.push(React.createElement(
                        "div",
                        { className: "column", key: "info" },
                        React.createElement(MonsterGroupCard, {
                            selection: this.props.selection,
                            filter: this.props.filter,
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
                        })
                    ));

                    var monsters = this.props.selection.monsters.filter(function (monster) {
                        return match(_this3.props.filter, monster.name);
                    });

                    if (monsters.length !== 0) {
                        monsters.forEach(function (monster) {
                            cards.push(React.createElement(
                                "div",
                                { className: "column", key: monster.id },
                                React.createElement(MonsterCard, {
                                    combatant: monster,
                                    mode: "view editable",
                                    library: _this3.props.library,
                                    moveToGroup: function moveToGroup(combatant, groupID) {
                                        return _this3.props.moveToGroup(combatant, groupID);
                                    },
                                    changeValue: function changeValue(combatant, type, value) {
                                        return _this3.props.changeValue(combatant, type, value);
                                    },
                                    nudgeValue: function nudgeValue(combatant, type, delta) {
                                        return _this3.props.nudgeValue(combatant, type, delta);
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
                                })
                            ));
                        });
                    } else {
                        cards.push(React.createElement(
                            "div",
                            { className: "column", key: "empty" },
                            React.createElement(InfoCard, { getContent: function getContent() {
                                    return React.createElement(
                                        "div",
                                        { className: "section" },
                                        "no monsters"
                                    );
                                } })
                        ));
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
                    { className: "monster-library row collapse" },
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-4 large-3 scrollable list-column" },
                        help,
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this3.props.addMonsterGroup("new group");
                                } },
                            "add a new monster group"
                        ),
                        listItems
                    ),
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-8 large-9 scrollable" },
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

                var activeCards = [];
                var inactiveCards = [];

                if (this.props.selection) {
                    activeCards.push(React.createElement(
                        "div",
                        { className: "column", key: "info" },
                        React.createElement(PartyCard, {
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
                        })
                    ));

                    var activePCs = this.props.selection.pcs.filter(function (pc) {
                        return pc.active;
                    });
                    activePCs.forEach(function (pc) {
                        activeCards.push(React.createElement(
                            "div",
                            { className: "column", key: pc.id },
                            React.createElement(PCCard, {
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
                            })
                        ));
                    });

                    var inactivePCs = this.props.selection.pcs.filter(function (pc) {
                        return !pc.active;
                    });
                    inactivePCs.forEach(function (pc) {
                        inactiveCards.push(React.createElement(
                            "div",
                            { className: "column", key: pc.id },
                            React.createElement(PCCard, {
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
                            })
                        ));
                    });

                    if (activePCs.length === 0) {
                        activeCards.push(React.createElement(
                            "div",
                            { className: "column", key: "empty" },
                            React.createElement(InfoCard, { getContent: function getContent() {
                                    return React.createElement(
                                        "div",
                                        { className: "section" },
                                        "no pcs"
                                    );
                                } })
                        ));
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
                    { className: "parties row collapse" },
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-4 large-3 scrollable list-column" },
                        help,
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this2.props.addParty("new party");
                                } },
                            "add a new party"
                        ),
                        parties
                    ),
                    React.createElement(
                        "div",
                        { className: "columns small-6 medium-8 large-9 scrollable" },
                        React.createElement(CardGroup, {
                            content: activeCards,
                            heading: name,
                            showClose: this.props.selection !== null,
                            close: function close() {
                                return _this2.props.selectParty(null);
                            }
                        }),
                        React.createElement(CardGroup, {
                            content: inactiveCards,
                            heading: "inactive pcs",
                            showClose: false,
                            hidden: inactiveCards.length === 0
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
