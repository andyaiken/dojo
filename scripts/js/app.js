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

var MapFoliosCard = function (_React$Component) {
    _inherits(MapFoliosCard, _React$Component);

    function MapFoliosCard() {
        _classCallCheck(this, MapFoliosCard);

        return _possibleConstructorReturn(this, (MapFoliosCard.__proto__ || Object.getPrototypeOf(MapFoliosCard)).apply(this, arguments));
    }

    _createClass(MapFoliosCard, [{
        key: "render",
        value: function render() {
            try {
                var action = null;
                if (this.props.mapFolios.length === 0) {
                    action = React.createElement(
                        "div",
                        { className: "section" },
                        "to start a new folio, press the button below"
                    );
                } else {
                    action = React.createElement(
                        "div",
                        { className: "section" },
                        "select a map folio from the list to see the maps it contains"
                    );
                }

                var content = React.createElement(
                    "div",
                    null,
                    React.createElement(
                        "div",
                        { className: "section" },
                        "on this page you can set up folios containing tactical maps"
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

    return MapFoliosCard;
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
                return React.createElement(
                    "div",
                    { className: "card map" },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            this.props.map.name || "unnamed map"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "card-content" },
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement("input", { type: "text", placeholder: "map name", value: this.props.map.name, onChange: function onChange(event) {
                                    return _this2.props.changeValue(_this2.props.map, "name", event.target.value);
                                } })
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section centered" },
                            React.createElement(MapPanel, {
                                map: this.props.map,
                                mode: "thumbnail"
                            })
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.editMap(_this2.props.map);
                                    } },
                                "edit map"
                            ),
                            React.createElement(ConfirmButton, { text: "delete map", callback: function callback() {
                                    return _this2.props.removeMap(_this2.props.map);
                                } })
                        )
                    )
                );
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

var MapFolioCard = function (_React$Component) {
    _inherits(MapFolioCard, _React$Component);

    function MapFolioCard() {
        _classCallCheck(this, MapFolioCard);

        return _possibleConstructorReturn(this, (MapFolioCard.__proto__ || Object.getPrototypeOf(MapFolioCard)).apply(this, arguments));
    }

    _createClass(MapFolioCard, [{
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
                            "map folio"
                        )
                    );

                    content = React.createElement(
                        "div",
                        null,
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement("input", { type: "text", placeholder: "folio name", value: this.props.selection.name, onChange: function onChange(event) {
                                    return _this2.props.changeValue(_this2.props.selection, "name", event.target.value);
                                } })
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.addMap();
                                    } },
                                "add a new map"
                            ),
                            React.createElement(ConfirmButton, { text: "delete folio", callback: function callback() {
                                    return _this2.props.removeMapFolio();
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

    return MapFolioCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MapTileCard = function (_React$Component) {
    _inherits(MapTileCard, _React$Component);

    function MapTileCard() {
        _classCallCheck(this, MapTileCard);

        return _possibleConstructorReturn(this, (MapTileCard.__proto__ || Object.getPrototypeOf(MapTileCard)).apply(this, arguments));
    }

    _createClass(MapTileCard, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var terrainOptions = TERRAIN_TYPES.map(function (t) {
                    return { id: t, text: t };
                });

                return React.createElement(
                    "div",
                    { className: "card map-tile" },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        React.createElement(
                            "div",
                            { className: "title" },
                            "map tile"
                        )
                    ),
                    React.createElement(
                        "div",
                        { className: "card-content" },
                        React.createElement(
                            "div",
                            { className: "subheading" },
                            "size"
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            this.props.tile.width,
                            " sq x ",
                            this.props.tile.height,
                            " sq"
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            this.props.tile.width * 5,
                            " ft x ",
                            this.props.tile.height * 5,
                            " ft"
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "subheading" },
                            "terrain"
                        ),
                        React.createElement(Dropdown, {
                            options: terrainOptions,
                            placeholder: "select terrain",
                            selectedID: this.props.tile.terrain,
                            select: function select(optionID) {
                                return _this2.props.changeValue(_this2.props.tile, "terrain", optionID);
                            }
                        }),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "subheading" },
                            "move"
                        ),
                        React.createElement(
                            "div",
                            { className: "section centered" },
                            React.createElement(Radial, { direction: "out", click: function click(dir) {
                                    return _this2.props.moveMapItem(_this2.props.tile, dir);
                                } })
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "subheading" },
                            "resize"
                        ),
                        React.createElement(
                            "div",
                            { className: "section centered" },
                            React.createElement(Radial, { direction: "both", click: function click(dir, dir2) {
                                    return _this2.props.resizeMapItem(_this2.props.tile, dir, dir2);
                                } })
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.cloneMapItem(_this2.props.tile);
                                    } },
                                "clone tile"
                            ),
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this2.props.removeMapItem(_this2.props.tile);
                                    } },
                                "remove tile"
                            )
                        )
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MapTileCard;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MonsterCard = function (_React$Component) {
    _inherits(MonsterCard, _React$Component);

    function MonsterCard(props) {
        _classCallCheck(this, MonsterCard);

        var _this = _possibleConstructorReturn(this, (MonsterCard.__proto__ || Object.getPrototypeOf(MonsterCard)).call(this));

        _this.state = {
            cloneName: props.combatant.name + " copy",
            showHP: false,
            showDetails: false,
            damage: 0
        };
        return _this;
    }

    _createClass(MonsterCard, [{
        key: "setCloneName",
        value: function setCloneName(cloneName) {
            this.setState({
                cloneName: cloneName
            });
        }
    }, {
        key: "toggleHP",
        value: function toggleHP() {
            this.setState({
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
        key: "setDamage",
        value: function setDamage(damage) {
            this.setState({
                damage: damage
            });
        }
    }, {
        key: "nudgeDamage",
        value: function nudgeDamage(delta) {
            var damage = this.state.damage + delta;
            damage = Math.max(damage, 0);

            this.setState({
                damage: damage
            });
        }
    }, {
        key: "heal",
        value: function heal() {
            var _this2 = this;

            var hp = this.props.combatant.hp + this.state.damage;
            hp = Math.min(hp, this.props.combatant.hpMax);

            this.setState({
                damage: 0
            }, function () {
                _this2.props.changeHP(_this2.props.combatant, hp, _this2.props.combatant.hpTemp);
            });
        }
    }, {
        key: "damage",
        value: function damage() {
            var _this3 = this;

            var hp = this.props.combatant.hp;
            var temp = this.props.combatant.hpTemp;

            var damage = this.state.damage;

            // Take damage off temp HP first
            var val = Math.min(damage, temp);
            damage -= val;
            temp -= val;

            // Take the rest off HP
            hp -= damage;
            hp = Math.max(hp, 0);

            this.setState({
                damage: 0
            }, function () {
                _this3.props.changeHP(_this3.props.combatant, hp, temp);
            });
        }
    }, {
        key: "description",
        value: function description() {
            var sizeAndType = (this.props.combatant.size + " " + this.props.combatant.category).toLowerCase();
            if (this.props.combatant.tag) {
                sizeAndType += " (" + this.props.combatant.tag.toLowerCase() + ")";
            }
            sizeAndType += ", ";

            var align = "";
            if (this.props.combatant.alignment) {
                align = this.props.combatant.alignment.toLowerCase() + ", ";
            }

            var cr = "cr " + challenge(this.props.combatant.challenge);

            return sizeAndType + align + cr;
        }
    }, {
        key: "monsterIsInWave",
        value: function monsterIsInWave(wave) {
            var _this4 = this;

            return wave.slots.some(function (s) {
                var group = null;
                _this4.props.library.forEach(function (g) {
                    if (g.monsters.indexOf(_this4.props.combatant) !== -1) {
                        group = g;
                    }
                });

                return s.monsterGroupName === group.name && s.monsterName === _this4.props.combatant.name;
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            try {
                var options = [];
                if (this.props.mode.indexOf("no-buttons") === -1) {
                    if (this.props.mode.indexOf("view") !== -1) {
                        if (this.props.mode.indexOf("editable") !== -1) {
                            options.push(React.createElement(
                                "button",
                                { key: "edit", onClick: function onClick() {
                                        return _this5.props.editMonster(_this5.props.combatant);
                                    } },
                                "edit monster"
                            ));

                            options.push(React.createElement(Expander, {
                                key: "clone",
                                text: "clone monster",
                                content: React.createElement(
                                    "div",
                                    null,
                                    React.createElement("input", { type: "text", placeholder: "monster name", value: this.state.cloneName, onChange: function onChange(event) {
                                            return _this5.setCloneName(event.target.value);
                                        } }),
                                    React.createElement(
                                        "button",
                                        { onClick: function onClick() {
                                                return _this5.props.cloneMonster(_this5.props.combatant, _this5.state.cloneName);
                                            } },
                                        "create copy"
                                    )
                                )
                            }));

                            var groupOptions = [];
                            this.props.library.forEach(function (group) {
                                if (group.monsters.indexOf(_this5.props.combatant) === -1) {
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
                                    return _this5.props.moveToGroup(_this5.props.combatant, optionID);
                                }
                            }));

                            options.push(React.createElement(ConfirmButton, { key: "remove", text: "delete monster", callback: function callback() {
                                    return _this5.props.removeCombatant(_this5.props.combatant);
                                } }));
                        }
                        if (this.props.mode.indexOf("encounter") !== -1) {
                            if (this.props.slot) {
                                // This card is in an encounter or a wave
                                options.push(React.createElement(
                                    "button",
                                    { key: "remove", onClick: function onClick() {
                                            return _this5.props.removeEncounterSlot(_this5.props.slot);
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
                                                return _this5.props.addEncounterSlot(_this5.props.combatant, null);
                                            } },
                                        "add to encounter"
                                    ));
                                    canAdd = true;
                                }
                                this.props.encounter.waves.forEach(function (wave) {
                                    if (!_this5.monsterIsInWave(wave)) {
                                        options.push(React.createElement(
                                            "button",
                                            { key: "add " + wave.id, onClick: function onClick() {
                                                    return _this5.props.addEncounterSlot(_this5.props.combatant, wave.id);
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
                                                    _this5.props.combatant.name
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
                        if (this.props.mode.indexOf("tactical") !== -1) {
                            if (this.props.mode.indexOf("on-map") !== -1) {
                                options.push(React.createElement(
                                    "div",
                                    { key: "mapMove", className: "section centered" },
                                    React.createElement(Radial, {
                                        direction: "eight",
                                        click: function click(dir) {
                                            return _this5.props.mapMove(_this5.props.combatant, dir);
                                        }
                                    })
                                ));
                                var altitudeText = "altitude";
                                if (this.props.combatant.altitude !== 0) {
                                    altitudeText += " " + this.props.combatant.altitude + " ft.";
                                }
                                options.push(React.createElement(Spin, {
                                    key: "altitude",
                                    source: this.props.combatant,
                                    name: "altitude",
                                    label: "altitude",
                                    display: function display(value) {
                                        return value + " ft.";
                                    },
                                    nudgeValue: function nudgeValue(delta) {
                                        return _this5.props.nudgeValue(_this5.props.combatant, "altitude", delta * 5);
                                    }
                                }));
                                options.push(React.createElement(
                                    "button",
                                    { key: "mapRemove", onClick: function onClick() {
                                            return _this5.props.mapRemove(_this5.props.combatant);
                                        } },
                                    "remove from map"
                                ));
                            }
                            if (this.props.mode.indexOf("off-map") !== -1) {
                                options.push(React.createElement(
                                    "button",
                                    { key: "mapAdd", onClick: function onClick() {
                                            return _this5.props.mapAdd(_this5.props.combatant);
                                        } },
                                    "add to map"
                                ));
                            }
                            options.push(React.createElement("div", { key: "tactical-div", className: "divider" }));
                        }
                        if (this.props.combatant.pending && !this.props.combatant.active && !this.props.combatant.defeated) {
                            options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                    return _this5.props.removeCombatant(_this5.props.combatant);
                                } }));
                        }
                        if (!this.props.combatant.pending && this.props.combatant.active && !this.props.combatant.defeated) {
                            if (this.props.combatant.current) {
                                options.push(React.createElement(
                                    "button",
                                    { key: "endTurn", onClick: function onClick() {
                                            return _this5.props.endTurn(_this5.props.combatant);
                                        } },
                                    "end turn"
                                ));
                                options.push(React.createElement(
                                    "button",
                                    { key: "makeDefeated", onClick: function onClick() {
                                            return _this5.props.makeDefeated(_this5.props.combatant);
                                        } },
                                    "mark as defeated and end turn"
                                ));
                            } else {
                                options.push(React.createElement(
                                    "button",
                                    { key: "makeCurrent", onClick: function onClick() {
                                            return _this5.props.makeCurrent(_this5.props.combatant);
                                        } },
                                    "start turn"
                                ));
                                options.push(React.createElement(
                                    "button",
                                    { key: "makeDefeated", onClick: function onClick() {
                                            return _this5.props.makeDefeated(_this5.props.combatant);
                                        } },
                                    "mark as defeated"
                                ));
                                options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                        return _this5.props.removeCombatant(_this5.props.combatant);
                                    } }));
                            }
                        }
                        if (!this.props.combatant.pending && !this.props.combatant.active && this.props.combatant.defeated) {
                            options.push(React.createElement(
                                "button",
                                { key: "makeActive", onClick: function onClick() {
                                        return _this5.props.makeActive(_this5.props.combatant);
                                    } },
                                "mark as active"
                            ));
                            options.push(React.createElement(ConfirmButton, { key: "remove", text: "remove from encounter", callback: function callback() {
                                    return _this5.props.removeCombatant(_this5.props.combatant);
                                } }));
                        }
                        options.push(React.createElement(Expander, {
                            key: "rename",
                            text: "change name",
                            content: React.createElement(
                                "div",
                                null,
                                React.createElement("input", { type: "text", value: this.props.combatant.displayName, onChange: function onChange(event) {
                                        return _this5.props.changeValue(_this5.props.combatant, "displayName", event.target.value);
                                    } })
                            )
                        }));
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
                                    return _this5.props.nudgeValue(_this5.props.slot, "count", delta);
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
                                "i",
                                null,
                                this.description()
                            )
                        ),
                        slotSection,
                        details
                    );
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    stats = React.createElement(
                        "div",
                        { className: "stats" },
                        React.createElement(
                            "div",
                            { className: "section centered" },
                            React.createElement(
                                "i",
                                null,
                                this.description()
                            )
                        ),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(Spin, {
                            source: this.props.combatant,
                            name: "hp",
                            label: "hit points",
                            factors: [1, 10],
                            nudgeValue: function nudgeValue(delta) {
                                return _this5.props.nudgeValue(_this5.props.combatant, "hp", delta);
                            }
                        }),
                        React.createElement(Spin, {
                            source: this.props.combatant,
                            name: "hpTemp",
                            label: "temp hp",
                            factors: [1, 10],
                            nudgeValue: function nudgeValue(delta) {
                                return _this5.props.nudgeValue(_this5.props.combatant, "hpTemp", delta);
                            }
                        }),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(Spin, {
                            source: this.state,
                            name: "damage",
                            factors: [1, 10],
                            nudgeValue: function nudgeValue(delta) {
                                return _this5.nudgeDamage(delta);
                            }
                        }),
                        React.createElement(
                            "div",
                            { className: this.state.damage > 0 ? "" : "disabled" },
                            React.createElement(
                                "button",
                                { className: "damage-btn", onClick: function onClick() {
                                        return _this5.heal();
                                    } },
                                "heal"
                            ),
                            React.createElement(
                                "button",
                                { className: "damage-btn", onClick: function onClick() {
                                        return _this5.setDamage(0);
                                    } },
                                "reset"
                            ),
                            React.createElement(
                                "button",
                                { className: "damage-btn", onClick: function onClick() {
                                        return _this5.damage();
                                    } },
                                "damage"
                            )
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
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(AbilityScorePanel, { combatant: this.props.combatant })
                        ),
                        React.createElement(
                            "div",
                            { className: "section", style: { display: this.props.combatant.ac !== "" ? "" : "none" } },
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
                        React.createElement(TraitsPanel, { combatant: this.props.combatant }),
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "div",
                            { className: "section subheading" },
                            "conditions"
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
                        React.createElement(ConditionsPanel, {
                            combatant: this.props.combatant,
                            combat: this.props.combat,
                            addCondition: function addCondition() {
                                return _this5.props.addCondition(_this5.props.combatant);
                            },
                            editCondition: function editCondition(condition) {
                                return _this5.props.editCondition(_this5.props.combatant, condition);
                            },
                            removeCondition: function removeCondition(conditionID) {
                                return _this5.props.removeCondition(_this5.props.combatant, conditionID);
                            },
                            nudgeConditionValue: function nudgeConditionValue(condition, type, delta) {
                                return _this5.props.nudgeConditionValue(condition, type, delta);
                            },
                            changeConditionValue: function changeConditionValue(condition, type, value) {
                                return _this5.props.changeConditionValue(condition, type, value);
                            }
                        })
                    );
                }
                if (this.props.mode.indexOf("template") !== -1) {
                    if (this.props.mode.indexOf("overview") !== -1) {
                        stats = React.createElement(
                            "div",
                            null,
                            React.createElement(
                                "div",
                                { className: "section centered" },
                                React.createElement(
                                    "i",
                                    null,
                                    this.description()
                                )
                            ),
                            React.createElement("div", { className: "divider" }),
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
                                return _this5.props.copyTrait(trait);
                            }
                        });
                    }
                }

                var toggle = null;
                if (this.props.mode.indexOf("combat") !== -1) {
                    // Don't show toggle button for combatant
                } else if (this.props.mode.indexOf("template") !== -1) {
                    // Don't show toggle button for template
                } else {
                    var imageStyle = this.state.showDetails ? "image rotate" : "image";
                    toggle = React.createElement("img", { className: imageStyle, src: "resources/images/down-arrow.svg", onClick: function onClick() {
                            return _this5.toggleDetails();
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
                    var activePCs = this.props.selection.pcs.filter(function (pc) {
                        return pc.active;
                    });

                    var languages = activePCs.map(function (pc) {
                        return pc.languages;
                    }).join(", ").split(/[ ,;]+/).reduce(function (array, value) {
                        if (array.indexOf(value) === -1) {
                            array.push(value);
                        }
                        return array;
                    }, []).sort(function (a, b) {
                        if (a === "Common") {
                            return -1;
                        }
                        if (b === "Common") {
                            return 1;
                        }
                        return a.localeCompare(b);
                    }).join(", ");

                    var insightSummary = "-";
                    var investigationSummary = "-";
                    var perceptionSummary = "-";

                    if (activePCs.length !== 0) {
                        var insight = { min: null, max: null };
                        var investigation = { min: null, max: null };
                        var perception = { min: null, max: null };

                        activePCs.forEach(function (pc) {
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
                                "languages"
                            )
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            languages
                        ),
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
            showDetails: false
        };
        return _this;
    }

    _createClass(PCCard, [{
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
                    if (this.props.mode.indexOf("tactical") !== -1) {
                        if (this.props.mode.indexOf("on-map") !== -1) {
                            options.push(React.createElement(
                                "div",
                                { key: "mapMove", className: "section centered" },
                                React.createElement(Radial, {
                                    direction: "eight",
                                    click: function click(dir) {
                                        return _this2.props.mapMove(_this2.props.combatant, dir);
                                    }
                                })
                            ));
                            var altitudeText = "altitude";
                            if (this.props.combatant.altitude !== 0) {
                                altitudeText += " " + this.props.combatant.altitude + " ft.";
                            }
                            options.push(React.createElement(Spin, {
                                key: "altitude",
                                source: this.props.combatant,
                                name: "altitude",
                                label: "altitude",
                                display: function display(value) {
                                    return value + " ft.";
                                },
                                nudgeValue: function nudgeValue(delta) {
                                    return _this2.props.nudgeValue(_this2.props.combatant, "altitude", delta * 5);
                                }
                            }));
                            options.push(React.createElement(
                                "button",
                                { key: "mapRemove", onClick: function onClick() {
                                        return _this2.props.mapRemove(_this2.props.combatant);
                                    } },
                                "remove from map"
                            ));
                        }
                        if (this.props.mode.indexOf("off-map") !== -1) {
                            options.push(React.createElement(
                                "button",
                                { key: "mapAdd", onClick: function onClick() {
                                        return _this2.props.mapAdd(_this2.props.combatant);
                                    } },
                                "add to map"
                            ));
                        }
                        options.push(React.createElement("div", { key: "tactical-div", className: "divider" }));
                    }
                    if (this.props.combatant.pending && !this.props.combatant.active && !this.props.combatant.defeated) {
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

                var commonStatBlock = React.createElement(
                    "div",
                    { className: "stats" },
                    React.createElement(
                        "div",
                        { className: "section centered" },
                        React.createElement(
                            "div",
                            { className: "lowercase" },
                            React.createElement(
                                "i",
                                null,
                                React.createElement(
                                    "span",
                                    null,
                                    this.props.combatant.race || 'race',
                                    " ",
                                    this.props.combatant.classes || 'class'
                                ),
                                ",",
                                React.createElement(
                                    "span",
                                    null,
                                    "level ",
                                    this.props.combatant.level
                                )
                            )
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
                );

                var stats = null;
                if (this.props.mode.indexOf("edit") !== -1) {
                    if (this.state.showDetails) {
                        stats = React.createElement(
                            "div",
                            { className: "edit" },
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
                                    } }),
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
                                    "level:"
                                ),
                                React.createElement(Spin, {
                                    source: this.props.combatant,
                                    name: "level",
                                    nudgeValue: function nudgeValue(delta) {
                                        return _this2.props.nudgeValue(_this2.props.combatant, "level", delta);
                                    }
                                }),
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
                        );
                    } else {
                        stats = commonStatBlock;
                    }
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    stats = commonStatBlock;
                }

                var toggle = null;
                if (this.props.mode.indexOf("combat") !== -1) {
                    // Don't show toggle button for combatant
                } else {
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
                if (this.props.options.length === 0) {
                    return null;
                }

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
                        "map folios"
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
<Radial
    direction="out" "in" "both" "eight"
    disabled=BOOLEAN
    click={(dir, in|out => null}
/>
*/

var Radial = function (_React$Component) {
    _inherits(Radial, _React$Component);

    function Radial() {
        _classCallCheck(this, Radial);

        return _possibleConstructorReturn(this, (Radial.__proto__ || Object.getPrototypeOf(Radial)).apply(this, arguments));
    }

    _createClass(Radial, [{
        key: "click",
        value: function click(e, dir, dir2) {
            e.stopPropagation();
            this.props.click(dir, dir2);
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var style = "radial " + (this.props.direction || "out");
                if (this.props.disabled) {
                    style += " disabled";
                }

                var showOut = this.props.direction === "out" | this.props.direction === "both" | this.props.direction === "eight";
                var showIn = this.props.direction === "in" | this.props.direction === "both";
                var showDiag = this.props.direction === "eight";

                return React.createElement(
                    "div",
                    { className: style },
                    React.createElement("div", { className: "empty", style: { display: showDiag ? "none" : "inline-block" } }),
                    React.createElement(
                        "div",
                        { className: "btn diag", style: { display: showDiag ? "inline-block" : "none" } },
                        React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showOut ? "inline-block" : "none", transform: "rotate(135deg)" }, onClick: function onClick(e) {
                                return _this2.click(e, "NW");
                            } })
                    ),
                    React.createElement(
                        "div",
                        { className: "btn" },
                        React.createElement(
                            "div",
                            null,
                            React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showOut ? "inline-block" : "none", transform: "rotate(180deg)" }, onClick: function onClick(e) {
                                    return _this2.click(e, "N", "out");
                                } })
                        ),
                        React.createElement(
                            "div",
                            null,
                            React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showIn ? "inline-block" : "none" }, onClick: function onClick(e) {
                                    return _this2.click(e, "N", "in");
                                } })
                        )
                    ),
                    React.createElement("div", { className: "empty", style: { display: showDiag ? "none" : "inline-block" } }),
                    React.createElement(
                        "div",
                        { className: "btn diag", style: { display: showDiag ? "inline-block" : "none" } },
                        React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showOut ? "inline-block" : "none", transform: "rotate(-135deg)" }, onClick: function onClick(e) {
                                return _this2.click(e, "NE");
                            } })
                    ),
                    React.createElement(
                        "div",
                        { className: "btn", style: { padding: showIn && showOut ? "10px 0" : "0" } },
                        React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showOut ? "inline-block" : "none", transform: "rotate(90deg)" }, onClick: function onClick(e) {
                                return _this2.click(e, "W", "out");
                            } }),
                        React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showIn ? "inline-block" : "none", transform: "rotate(-90deg)" }, onClick: function onClick(e) {
                                return _this2.click(e, "W", "in");
                            } })
                    ),
                    React.createElement("div", { className: "empty" }),
                    React.createElement(
                        "div",
                        { className: "btn", style: { padding: showIn && showOut ? "10px 0" : "0" } },
                        React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showIn ? "inline-block" : "none", transform: "rotate(90deg)" }, onClick: function onClick(e) {
                                return _this2.click(e, "E", "in");
                            } }),
                        React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showOut ? "inline-block" : "none", transform: "rotate(-90deg)" }, onClick: function onClick(e) {
                                return _this2.click(e, "E", "out");
                            } })
                    ),
                    React.createElement("div", { className: "empty", style: { display: showDiag ? "none" : "inline-block" } }),
                    React.createElement(
                        "div",
                        { className: "btn diag", style: { display: showDiag ? "inline-block" : "none" } },
                        React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showOut ? "inline-block" : "none", transform: "rotate(45deg)" }, onClick: function onClick(e) {
                                return _this2.click(e, "SW");
                            } })
                    ),
                    React.createElement(
                        "div",
                        { className: "btn" },
                        React.createElement(
                            "div",
                            null,
                            React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showIn ? "inline-block" : "none", transform: "rotate(180deg)" }, onClick: function onClick(e) {
                                    return _this2.click(e, "S", "in");
                                } })
                        ),
                        React.createElement(
                            "div",
                            null,
                            React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showOut ? "inline-block" : "none" }, onClick: function onClick(e) {
                                    return _this2.click(e, "S", "out");
                                } })
                        )
                    ),
                    React.createElement("div", { className: "empty", style: { display: showDiag ? "none" : "inline-block" } }),
                    React.createElement(
                        "div",
                        { className: "btn diag", style: { display: showDiag ? "inline-block" : "none" } },
                        React.createElement("img", { src: "resources/images/down-arrow-black.svg", style: { display: showOut ? "inline-block" : "none", transform: "rotate(-45deg)" }, onClick: function onClick(e) {
                                return _this2.click(e, "SE");
                            } })
                    )
                );
            } catch (ex) {
                console.error(ex);
                return null;
            }
        }
    }]);

    return Radial;
}(React.Component);
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
<RadioGroup
    items={[{id, text, details, disabled}]}
    selectedItemID="0"
    select={itemID => null}
/>
*/

var RadioGroup = function (_React$Component) {
    _inherits(RadioGroup, _React$Component);

    function RadioGroup() {
        _classCallCheck(this, RadioGroup);

        return _possibleConstructorReturn(this, (RadioGroup.__proto__ || Object.getPrototypeOf(RadioGroup)).apply(this, arguments));
    }

    _createClass(RadioGroup, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var content = this.props.items.map(function (item) {
                    return React.createElement(RadioGroupItem, {
                        item: item,
                        selected: _this2.props.selectedItemID === item.id,
                        select: function select(itemID) {
                            return _this2.props.select(itemID);
                        }
                    });
                });

                return React.createElement(
                    "div",
                    { className: "radio-group" },
                    content
                );
            } catch (ex) {
                console.error(ex);
                return null;
            }
        }
    }]);

    return RadioGroup;
}(React.Component);

var RadioGroupItem = function (_React$Component2) {
    _inherits(RadioGroupItem, _React$Component2);

    function RadioGroupItem() {
        _classCallCheck(this, RadioGroupItem);

        return _possibleConstructorReturn(this, (RadioGroupItem.__proto__ || Object.getPrototypeOf(RadioGroupItem)).apply(this, arguments));
    }

    _createClass(RadioGroupItem, [{
        key: "render",
        value: function render() {
            var _this4 = this;

            var style = "radio-item";
            var details = null;

            if (this.props.selected) {
                style += " selected";
                details = React.createElement(
                    "div",
                    { className: "radio-item-details" },
                    this.props.item.details
                );
            }

            if (this.props.item.disabled) {
                style += " disabled";
            }

            return React.createElement(
                "div",
                { className: style, onClick: function onClick() {
                        return _this4.props.select(_this4.props.item.id);
                    } },
                React.createElement(
                    "div",
                    { className: "radio-item-text" },
                    this.props.item.text
                ),
                details
            );
        }
    }]);

    return RadioGroupItem;
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
                var style = "info-value";
                var value = this.props.source[this.props.name];
                if (value === 0) {
                    style += " dimmed";
                }

                if (this.props.display) {
                    value = this.props.display(value);
                }

                var minus = [];
                var plus = [];

                if (this.props.factors) {
                    this.props.factors.forEach(function (factor) {
                        minus.push(React.createElement(
                            "div",
                            { key: "minus" + factor, className: "spin-button factor", onTouchEnd: function onTouchEnd(e) {
                                    return _this2.touchEnd(e, -1);
                                }, onClick: function onClick(e) {
                                    return _this2.click(e, -1 * factor);
                                } },
                            "-" + factor
                        ));

                        plus.push(React.createElement(
                            "div",
                            { key: "plus" + factor, className: "spin-button factor", onTouchEnd: function onTouchEnd(e) {
                                    return _this2.touchEnd(e, +1);
                                }, onClick: function onClick(e) {
                                    return _this2.click(e, +1 * factor);
                                } },
                            "+" + factor
                        ));
                    });

                    minus.reverse();
                } else {
                    minus.push(React.createElement(
                        "div",
                        { key: "minus1", className: "spin-button", onTouchEnd: function onTouchEnd(e) {
                                return _this2.touchEnd(e, -1);
                            }, onClick: function onClick(e) {
                                return _this2.click(e, -1);
                            } },
                        React.createElement("img", { className: "image", src: "resources/images/minus.svg" })
                    ));

                    plus.push(React.createElement(
                        "div",
                        { key: "plus1", className: "spin-button", onTouchEnd: function onTouchEnd(e) {
                                return _this2.touchEnd(e, +1);
                            }, onClick: function onClick(e) {
                                return _this2.click(e, +1);
                            } },
                        React.createElement("img", { className: "image", src: "resources/images/plus.svg" })
                    ));
                }

                var infoWidth = 80 * (this.props.factors ? this.props.factors.length : 1);

                return React.createElement(
                    "div",
                    { className: this.props.disabled ? "spin disabled" : "spin" },
                    React.createElement(
                        "div",
                        { className: "minus" },
                        minus
                    ),
                    React.createElement(
                        "div",
                        { className: "info", style: { width: "calc(100% - " + infoWidth + "px)" } },
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
                        { className: "plus" },
                        plus
                    )
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
            mapFolios: [],
            combats: [],
            selectedPartyID: null,
            selectedMonsterGroupID: null,
            selectedEncounterID: null,
            selectedMapFolioID: null,
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
                if (!data.mapFolios) {
                    data.mapFolios = [];
                    data.selectedMapFolioID = null;
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
                    c.combatants.forEach(function (c) {
                        if (c.altitude === undefined) {
                            c.altitude = 0;
                        }
                    });
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
            _this.state.mapFolios = [];
            _this.state.combats = [];
            _this.state.selectedPartyID = null;
            _this.state.selectedMonsterGroupID = null;
            _this.state.selectedEncounterID = null;
            _this.state.selectedMapFolioID = null;
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
            var party = createParty();
            party.name = name;
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
            var pc = createPC();
            pc.name = name;
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
            var group = createMonsterGroup();
            group.name = name;
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
            var monster = createMonster();
            monster.name = name;
            var group = this.getMonsterGroup(this.state.selectedMonsterGroupID);
            group.monsters.push(monster);
            this.setState({
                library: this.state.library
            });
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
        value: function cloneMonster(monster, name) {
            var group = this.findMonster(monster);

            var clone = {
                id: guid(),
                type: "monster",
                name: name || monster.name + " copy",
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
                                var monster = createMonster();

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
            var encounter = createEncounter();
            encounter.name = name;
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

            var slot = createEncounterSlot();
            slot.monsterGroupName = group.name;
            slot.monsterName = monster.name;
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

            var wave = createEncounterWave();
            wave.name = "wave " + (encounter.waves.length + 2);
            encounter.waves.push(wave);

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
        key: "addMapFolio",
        value: function addMapFolio(name) {
            var folio = createMapFolio();
            folio.name = name;
            var folios = [].concat(this.state.mapFolios, [folio]);
            sort(folios);

            this.setState({
                mapFolios: folios,
                selectedMapFolioID: folio.id
            });
        }
    }, {
        key: "removeMapFolio",
        value: function removeMapFolio() {
            var folio = this.getMapFolio(this.state.selectedMapFolioID);
            var index = this.state.mapFolios.indexOf(folio);
            this.state.mapFolios.splice(index, 1);

            this.setState({
                mapFolios: this.state.mapFolios,
                selectedMapFolioID: null
            });
        }
    }, {
        key: "addMap",
        value: function addMap(name) {
            var map = createMap();
            map.name = name;

            var folio = this.getMapFolio(this.state.selectedMapFolioID);
            folio.maps.push(map);

            this.setState({
                mapFolios: this.state.mapFolios
            });
        }
    }, {
        key: "editMap",
        value: function editMap(map) {
            var copy = JSON.parse(JSON.stringify(map));
            this.setState({
                modal: {
                    type: "map",
                    map: copy
                }
            });
        }
    }, {
        key: "saveMap",
        value: function saveMap() {
            var _this4 = this;

            var folio = this.getMapFolio(this.state.selectedMapFolioID);
            var original = folio.maps.find(function (m) {
                return m.id === _this4.state.modal.map.id;
            });
            var index = folio.maps.indexOf(original);
            folio.maps[index] = this.state.modal.map;
            this.setState({
                mapFolios: this.state.mapFolios,
                modal: null
            });
        }
    }, {
        key: "removeMap",
        value: function removeMap(map) {
            var folio = this.getMapFolio(this.state.selectedMapFolioID);
            var index = folio.maps.indexOf(map);
            folio.maps.splice(index, 1);
            this.setState({
                mapFolios: this.state.mapFolios
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
                        folioID: null,
                        mapID: null,
                        encounterInitMode: "group",
                        monsterNames: getMonsterNames(encounter),
                        map: null
                    }
                }
            });
        }
    }, {
        key: "startCombat",
        value: function startCombat() {
            var _this5 = this;

            var party = this.getParty(this.state.modal.combat.partyID);
            var partyName = party.name || "unnamed party";

            var encounter = this.getEncounter(this.state.modal.combat.encounterID);
            var encounterName = encounter.name || "unnamed encounter";

            var combat = createCombat();
            combat.name = partyName + " vs " + encounterName;
            combat.encounterID = encounter.id;

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

            combat.combatants.forEach(function (c) {
                return c.altitude = 0;
            });

            this.sortCombatants(combat);

            if (this.state.modal.combat.folioID && this.state.modal.combat.mapID) {
                var folio = this.getMapFolio(this.state.modal.combat.folioID);
                var map = folio.maps.find(function (m) {
                    return m.id === _this5.state.modal.combat.mapID;
                });
                combat.map = JSON.parse(JSON.stringify(map));
            }

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
            var _this6 = this;

            var encounter = this.getEncounter(this.state.modal.combat.encounterID);
            var combat = this.getCombat(this.state.selectedCombatID);
            var wave = encounter.waves.find(function (w) {
                return w.id === _this6.state.modal.combat.waveID;
            });

            wave.slots.forEach(function (slot) {
                var group = _this6.getMonsterGroupByName(slot.monsterGroupName);
                var monster = _this6.getMonster(slot.monsterName, group);

                if (monster) {
                    var init = parseInt(modifier(monster.abilityScores.dex));
                    var groupRoll = dieRoll();

                    for (var n = 0; n !== slot.count; ++n) {
                        var singleRoll = dieRoll();

                        var combatant = JSON.parse(JSON.stringify(monster));
                        combatant.id = guid();

                        combatant.displayName = null;
                        if (_this6.state.modal.combat.monsterNames) {
                            var slotNames = _this6.state.modal.combat.monsterNames.find(function (names) {
                                return names.id === slot.id;
                            });
                            if (slotNames) {
                                combatant.displayName = slotNames.names[n];
                            }
                        }

                        switch (_this6.state.modal.combat.encounterInitMode) {
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
                        combatant.pending = _this6.state.modal.combat.encounterInitMode === "manual";
                        combatant.active = _this6.state.modal.combat.encounterInitMode !== "manual";
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
        key: "mapAdd",
        value: function mapAdd(combatant, x, y) {
            var item = createMapItem();
            item.id = combatant.id;
            item.type = combatant.type;
            item.x = x;
            item.y = y;
            var size = 1;
            if (combatant.type === 'monster') {
                size = miniSize(combatant.size);
            }
            item.height = size;
            item.width = size;

            var combat = this.getCombat(this.state.selectedCombatID);
            combat.map.items.push(item);

            this.setState({
                combats: this.state.combats
            });
        }
    }, {
        key: "mapMove",
        value: function mapMove(combatant, dir) {
            var combat = this.getCombat(this.state.selectedCombatID);
            var item = combat.map.items.find(function (i) {
                return i.id === combatant.id;
            });
            switch (dir) {
                case 'N':
                    item.y -= 1;
                    break;
                case 'NE':
                    item.x += 1;
                    item.y -= 1;
                    break;
                case 'E':
                    item.x += 1;
                    break;
                case 'SE':
                    item.x += 1;
                    item.y += 1;
                    break;
                case 'S':
                    item.y += 1;
                    break;
                case 'SW':
                    item.x -= 1;
                    item.y += 1;
                    break;
                case 'W':
                    item.x -= 1;
                    break;
                case 'NW':
                    item.x -= 1;
                    item.y -= 1;
                    break;
            }

            this.setState({
                combats: this.state.combats
            });
        }
    }, {
        key: "mapRemove",
        value: function mapRemove(combatant) {
            var combat = this.getCombat(this.state.selectedCombatID);
            var item = combat.map.items.find(function (i) {
                return i.id === combatant.id;
            });
            var index = combat.map.items.indexOf(item);
            combat.map.items.splice(index, 1);

            this.setState({
                combats: this.state.combats
            });
        }
    }, {
        key: "endTurn",
        value: function endTurn(combatant) {
            var combat = this.getCombat(this.state.selectedCombatID);

            // Handle end-of-turn conditions
            combat.combatants.filter(function (actor) {
                return actor.conditions;
            }).forEach(function (actor) {
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
        key: "changeHP",
        value: function changeHP(combatant, hp, temp) {
            combatant.hp = hp;
            combatant.hpTemp = temp;

            this.setState({
                combats: this.state.combats
            });
        }
    }, {
        key: "addCondition",
        value: function addCondition(combatant) {
            var condition = {
                id: guid(),
                name: "blinded",
                level: 1,
                text: null,
                duration: null
            };

            var combat = this.getCombat(this.state.selectedCombatID);

            this.setState({
                modal: {
                    type: "condition-add",
                    condition: condition,
                    combatant: combatant,
                    combat: combat
                }
            });
        }
    }, {
        key: "addConditionFromModal",
        value: function addConditionFromModal() {
            this.state.modal.combatant.conditions.push(this.state.modal.condition);

            this.setState({
                combats: this.state.combats,
                modal: null
            });
        }
    }, {
        key: "editCondition",
        value: function editCondition(combatant, condition) {
            var combat = this.getCombat(this.state.selectedCombatID);

            this.setState({
                modal: {
                    type: "condition-edit",
                    condition: condition,
                    combatant: combatant,
                    combat: combat
                }
            });
        }
    }, {
        key: "editConditionFromModal",
        value: function editConditionFromModal() {
            var _this7 = this;

            var original = this.state.modal.combatant.conditions.find(function (c) {
                return c.id === _this7.state.modal.condition.id;
            });
            var index = this.state.modal.combatant.conditions.indexOf(original);
            this.state.modal.combatant.conditions[index] = this.state.modal.condition;

            this.setState({
                combats: this.state.combats,
                modal: null
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
        key: "selectMapFolio",
        value: function selectMapFolio(mapFolio) {
            this.setState({
                selectedMapFolioID: mapFolio ? mapFolio.id : null
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
        key: "getMapFolio",
        value: function getMapFolio(id) {
            var result = null;
            this.state.mapFolios.forEach(function (folio) {
                if (folio.id === id) {
                    result = folio;
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
                mapFolios: [],
                selectedMapFolioID: null,
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
            var _this8 = this;

            try {
                var content = null;
                var actions = null;
                switch (this.state.view) {
                    case "home":
                        content = React.createElement(HomeScreen, {
                            library: this.state.library,
                            addOpenGameContent: function addOpenGameContent() {
                                return _this8.addOpenGameContent();
                            }
                        });
                        break;
                    case "parties":
                        content = React.createElement(PartiesScreen, {
                            parties: this.state.parties,
                            selection: this.getParty(this.state.selectedPartyID),
                            showHelp: this.state.options.showHelp,
                            selectParty: function selectParty(party) {
                                return _this8.selectParty(party);
                            },
                            addParty: function addParty(name) {
                                return _this8.addParty(name);
                            },
                            removeParty: function removeParty() {
                                return _this8.removeParty();
                            },
                            addPC: function addPC(name) {
                                return _this8.addPC(name);
                            },
                            removePC: function removePC(pc) {
                                return _this8.removePC(pc);
                            },
                            sortPCs: function sortPCs() {
                                return _this8.sortPCs();
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this8.changeValue(combatant, type, value);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this8.nudgeValue(combatant, type, delta);
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
                                return _this8.selectMonsterGroup(group);
                            },
                            addMonsterGroup: function addMonsterGroup(name) {
                                return _this8.addMonsterGroup(name);
                            },
                            removeMonsterGroup: function removeMonsterGroup() {
                                return _this8.removeMonsterGroup();
                            },
                            addMonster: function addMonster(name) {
                                return _this8.addMonster(name);
                            },
                            removeMonster: function removeMonster(monster) {
                                return _this8.removeMonster(monster);
                            },
                            sortMonsters: function sortMonsters() {
                                return _this8.sortMonsters();
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this8.changeValue(combatant, type, value);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this8.nudgeValue(combatant, type, delta);
                            },
                            editMonster: function editMonster(combatant) {
                                return _this8.editMonster(combatant);
                            },
                            cloneMonster: function cloneMonster(combatant, name) {
                                return _this8.cloneMonster(combatant, name);
                            },
                            moveToGroup: function moveToGroup(combatant, groupID) {
                                return _this8.moveToGroup(combatant, groupID);
                            },
                            addOpenGameContent: function addOpenGameContent() {
                                return _this8.addOpenGameContent();
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
                                            return _this8.changeValue(_this8.state, "libraryFilter", event.target.value);
                                        } })
                                ),
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "button",
                                        { onClick: function onClick() {
                                                return _this8.openDemographics();
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
                                return _this8.selectEncounter(encounter);
                            },
                            addEncounter: function addEncounter(name) {
                                return _this8.addEncounter(name);
                            },
                            removeEncounter: function removeEncounter(encounter) {
                                return _this8.removeEncounter(encounter);
                            },
                            addWave: function addWave() {
                                return _this8.addWaveToEncounter();
                            },
                            removeWave: function removeWave(wave) {
                                return _this8.removeWave(wave);
                            },
                            getMonster: function getMonster(monsterName, monsterGroupName) {
                                return _this8.getMonster(monsterName, _this8.getMonsterGroupByName(monsterGroupName));
                            },
                            addEncounterSlot: function addEncounterSlot(monster, waveID) {
                                return _this8.addEncounterSlot(monster, waveID);
                            },
                            removeEncounterSlot: function removeEncounterSlot(slot, waveID) {
                                return _this8.removeEncounterSlot(slot, waveID);
                            },
                            nudgeValue: function nudgeValue(slot, type, delta) {
                                return _this8.nudgeValue(slot, type, delta);
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this8.changeValue(combatant, type, value);
                            }
                        });
                        break;
                    case "maps":
                        content = React.createElement(MapFoliosScreen, {
                            mapFolios: this.state.mapFolios,
                            selection: this.getMapFolio(this.state.selectedMapFolioID),
                            showHelp: this.state.options.showHelp,
                            selectMapFolio: function selectMapFolio(folio) {
                                return _this8.selectMapFolio(folio);
                            },
                            addMapFolio: function addMapFolio(name) {
                                return _this8.addMapFolio(name);
                            },
                            removeMapFolio: function removeMapFolio() {
                                return _this8.removeMapFolio();
                            },
                            addMap: function addMap(name) {
                                return _this8.addMap(name);
                            },
                            editMap: function editMap(map) {
                                return _this8.editMap(map);
                            },
                            removeMap: function removeMap(map) {
                                return _this8.removeMap(map);
                            },
                            nudgeValue: function nudgeValue(source, type, delta) {
                                return _this8.nudgeValue(source, type, delta);
                            },
                            changeValue: function changeValue(source, type, value) {
                                return _this8.changeValue(source, type, value);
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
                                return _this8.createCombat();
                            },
                            resumeEncounter: function resumeEncounter(combat) {
                                return _this8.resumeCombat(combat);
                            },
                            nudgeValue: function nudgeValue(combatant, type, delta) {
                                return _this8.nudgeValue(combatant, type, delta);
                            },
                            changeValue: function changeValue(combatant, type, value) {
                                return _this8.changeValue(combatant, type, value);
                            },
                            makeCurrent: function makeCurrent(combatant) {
                                return _this8.makeCurrent(combatant);
                            },
                            makeActive: function makeActive(combatant) {
                                return _this8.makeActive(combatant);
                            },
                            makeDefeated: function makeDefeated(combatant) {
                                return _this8.makeDefeated(combatant);
                            },
                            removeCombatant: function removeCombatant(combatant) {
                                return _this8.removeCombatant(combatant);
                            },
                            addCondition: function addCondition(combatant) {
                                return _this8.addCondition(combatant);
                            },
                            editCondition: function editCondition(combatant, condition) {
                                return _this8.editCondition(combatant, condition);
                            },
                            removeCondition: function removeCondition(combatant, conditionID) {
                                return _this8.removeCondition(combatant, conditionID);
                            },
                            mapAdd: function mapAdd(combatant, x, y) {
                                return _this8.mapAdd(combatant, x, y);
                            },
                            mapMove: function mapMove(combatant, dir) {
                                return _this8.mapMove(combatant, dir);
                            },
                            mapRemove: function mapRemove(combatant) {
                                return _this8.mapRemove(combatant);
                            },
                            endTurn: function endTurn(combatant) {
                                return _this8.endTurn(combatant);
                            },
                            changeHP: function changeHP(combatant, hp, temp) {
                                return _this8.changeHP(combatant, hp, temp);
                            },
                            close: function close(notification, removeCondition) {
                                return _this8.closeNotification(notification, removeCondition);
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
                                        { className: "text" },
                                        "round: ",
                                        combat.round
                                    )
                                ),
                                React.createElement(
                                    "div",
                                    { className: "section" },
                                    React.createElement(
                                        "div",
                                        { className: "text" },
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
                                                return _this8.openWaveModal();
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
                                                return _this8.pauseCombat();
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
                                                return _this8.endCombat();
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
                                    return _this8.resetAll();
                                },
                                changeValue: function changeValue(source, type, value) {
                                    return _this8.changeValue(source, type, value);
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
                                    return _this8.toggleShowSimilarMonsters();
                                }
                            })];
                            modalButtons.right = [React.createElement(
                                "button",
                                { key: "save", onClick: function onClick() {
                                        return _this8.saveMonster();
                                    } },
                                "save"
                            ), React.createElement(
                                "button",
                                { key: "cancel", onClick: function onClick() {
                                        return _this8.closeModal();
                                    } },
                                "cancel"
                            )];
                            break;
                        case "map":
                            modalTitle = "map editor";
                            modalContent = React.createElement(MapEditorModal, {
                                map: this.state.modal.map
                            });
                            modalAllowClose = false;
                            modalAllowScroll = false;
                            modalButtons.right = [React.createElement(
                                "button",
                                { key: "save", onClick: function onClick() {
                                        return _this8.saveMap();
                                    } },
                                "save"
                            ), React.createElement(
                                "button",
                                { key: "cancel", onClick: function onClick() {
                                        return _this8.closeModal();
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
                                mapFolios: this.state.mapFolios,
                                getMonster: function getMonster(monsterName, monsterGroupName) {
                                    return _this8.getMonster(monsterName, _this8.getMonsterGroupByName(monsterGroupName));
                                },
                                notify: function notify() {
                                    return _this8.setState({ modal: _this8.state.modal });
                                }
                            });
                            modalAllowClose = false;
                            modalAllowScroll = false;
                            var canClose = this.state.modal.combat.partyID && this.state.modal.combat.encounterID;
                            modalButtons.right = [React.createElement(
                                "button",
                                { key: "start encounter", className: canClose ? "" : "disabled", onClick: function onClick() {
                                        return _this8.startCombat();
                                    } },
                                "start encounter"
                            ), React.createElement(
                                "button",
                                { key: "cancel", onClick: function onClick() {
                                        return _this8.closeModal();
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
                                    return _this8.getMonster(monsterName, _this8.getMonsterGroupByName(monsterGroupName));
                                },
                                notify: function notify() {
                                    return _this8.setState({ modal: _this8.state.modal });
                                }
                            });
                            modalAllowClose = false;
                            modalAllowScroll = false;
                            var canClose = this.state.modal.combat.waveID !== null;
                            modalButtons.right = [React.createElement(
                                "button",
                                { key: "add wave", className: canClose ? "" : "disabled", onClick: function onClick() {
                                        return _this8.addWaveToCombat();
                                    } },
                                "add wave"
                            ), React.createElement(
                                "button",
                                { key: "cancel", onClick: function onClick() {
                                        return _this8.closeModal();
                                    } },
                                "cancel"
                            )];
                            break;
                        case "condition-add":
                            modalTitle = "add a condition";
                            modalContent = React.createElement(ConditionModal, {
                                condition: this.state.modal.condition,
                                combatant: this.state.modal.combatant,
                                combat: this.state.modal.combat
                            });
                            modalAllowClose = false;
                            modalAllowScroll = false;
                            modalButtons.right = [React.createElement(
                                "button",
                                { key: "add", onClick: function onClick() {
                                        return _this8.addConditionFromModal();
                                    } },
                                "add"
                            ), React.createElement(
                                "button",
                                { key: "cancel", onClick: function onClick() {
                                        return _this8.closeModal();
                                    } },
                                "cancel"
                            )];
                            break;
                        case "condition-edit":
                            modalTitle = "edit condition";
                            modalContent = React.createElement(ConditionModal, {
                                condition: this.state.modal.condition,
                                combatant: this.state.modal.combatant,
                                combat: this.state.modal.combat
                            });
                            modalAllowClose = false;
                            modalButtons.right = [React.createElement(
                                "button",
                                { key: "save", onClick: function onClick() {
                                        return _this8.editConditionFromModal();
                                    } },
                                "save"
                            ), React.createElement(
                                "button",
                                { key: "cancel", onClick: function onClick() {
                                        return _this8.closeModal();
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
                                        return _this8.closeModal();
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
                            return _this8.setView("home");
                        },
                        openAbout: function openAbout() {
                            return _this8.openAbout();
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
                            return _this8.setView(view);
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

                var map = null;
                if (this.props.combat.map) {
                    map = React.createElement(MapPanel, {
                        map: this.props.combat.map,
                        mode: "thumbnail",
                        combatants: this.props.combat.combatants
                    });
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
                        "paused at ",
                        this.props.combat.timestamp
                    ),
                    map
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

var MapFolioListItem = function (_React$Component) {
    _inherits(MapFolioListItem, _React$Component);

    function MapFolioListItem() {
        _classCallCheck(this, MapFolioListItem);

        return _possibleConstructorReturn(this, (MapFolioListItem.__proto__ || Object.getPrototypeOf(MapFolioListItem)).apply(this, arguments));
    }

    _createClass(MapFolioListItem, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var maps = [];
                for (var n = 0; n !== this.props.mapFolio.maps.length; ++n) {
                    var map = this.props.mapFolio.maps[n];
                    var name = map.name || "unnamed map";
                    maps.push(React.createElement(
                        "div",
                        { key: map.id, className: "text" },
                        name
                    ));
                }
                if (maps.length === 0) {
                    maps.push(React.createElement(
                        "div",
                        { key: "empty", className: "text" },
                        "no maps"
                    ));
                }

                return React.createElement(
                    "div",
                    { className: this.props.selected ? "list-item selected" : "list-item", onClick: function onClick() {
                            return _this2.props.setSelection(_this2.props.mapFolio);
                        } },
                    React.createElement(
                        "div",
                        { className: "heading" },
                        this.props.mapFolio.name || "unnamed folio"
                    ),
                    maps
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MapFolioListItem;
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
                        React.createElement(Checkbox, {
                            label: "checkbox",
                            checked: this.state.selected,
                            changeValue: function changeValue(value) {
                                return _this2.setSelected(value);
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
        key: "setFolioID",
        value: function setFolioID(id) {
            if (id) {
                var folio = this.props.mapFolios.find(function (f) {
                    return f.id === id;
                });
                this.state.combat.folioID = folio.id;
                this.state.combat.mapID = folio.maps.length === 1 ? folio.maps[0].id : null;
            } else {
                this.state.combat.folioID = null;
                this.state.combat.mapID = null;
            }
            this.setState({
                combat: this.state.combat
            });
        }
    }, {
        key: "setMapID",
        value: function setMapID(id) {
            this.state.combat.mapID = id;
            this.setState({
                combat: this.state.combat
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
        key: "getMapSection",
        value: function getMapSection() {
            var _this7 = this;

            var folios = this.props.mapFolios.filter(function (folio) {
                return folio.maps.length > 0;
            });
            if (folios.length === 0) {
                return null;
            }

            var folioOptions = folios.map(function (folio) {
                return {
                    id: folio.id,
                    text: folio.name || "unnamed folio"
                };
            });
            folioOptions = [{ id: null, text: "none" }].concat(folioOptions);

            var selectMapSection = null;
            var thumbnailSection = null;

            if (this.state.combat.folioID) {
                var folio = this.props.mapFolios.find(function (f) {
                    return f.id === _this7.state.combat.folioID;
                });
                var mapOptions = folio.maps.map(function (m) {
                    return {
                        id: m.id,
                        text: m.name || "unnamed map"
                    };
                });

                if (mapOptions.length !== 1) {
                    selectMapSection = React.createElement(Selector, {
                        options: mapOptions,
                        placeholder: "select map...",
                        selectedID: this.state.combatmapID,
                        select: function select(optionID) {
                            return _this7.setMapID(optionID);
                        }
                    });
                }

                if (this.state.combat.mapID) {
                    var map = folio.maps.find(function (m) {
                        return m.id === _this7.state.combat.mapID;
                    });
                    thumbnailSection = React.createElement(MapPanel, {
                        map: map,
                        mode: "thumbnail"
                    });
                }
            }

            return React.createElement(
                "div",
                null,
                React.createElement(
                    "div",
                    { className: "heading" },
                    "map"
                ),
                React.createElement(Dropdown, {
                    options: folioOptions,
                    placeholder: "select map folio...",
                    selectedID: this.state.combat.folioID,
                    select: function select(optionID) {
                        return _this7.setFolioID(optionID);
                    }
                }),
                selectMapSection,
                thumbnailSection
            );
        }
    }, {
        key: "getWaveSection",
        value: function getWaveSection() {
            var _this8 = this;

            if (this.state.combat.encounterID === null) {
                return React.createElement(
                    "div",
                    { className: "section" },
                    "you have not selected an encounter"
                );
            }

            var selectedEncounter = this.props.encounters.find(function (e) {
                return e.id === _this8.state.combat.encounterID;
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
                    return w.id === _this8.state.combat.waveID;
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
                        return _this8.setWave(optionID);
                    }
                }),
                waveContent
            );
        }
    }, {
        key: "getDifficultySection",
        value: function getDifficultySection() {
            var _this9 = this;

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
                        return _this9.props.getMonster(monsterName, monsterGroupName);
                    }
                })
            );
        }
    }, {
        key: "getMonsterSection",
        value: function getMonsterSection() {
            var _this10 = this;

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
                return e.id === _this10.state.combat.encounterID;
            });
            if (this.state.combat.waveID) {
                selectedEncounter = selectedEncounter.waves.find(function (w) {
                    return w.id === _this10.state.combat.waveID;
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
                                return _this10.changeName(slotID, index, value);
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
                        return _this10.setEncounterInitMode(optionID);
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
                        this.getEncounterSection(),
                        this.getMapSection()
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
            var _this12 = this;

            return React.createElement("input", { type: "text", value: this.props.value, onChange: function onChange(event) {
                    return _this12.props.changeName(_this12.props.slotID, _this12.props.index, event.target.value);
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

var ConditionModal = function (_React$Component) {
    _inherits(ConditionModal, _React$Component);

    function ConditionModal(props) {
        _classCallCheck(this, ConditionModal);

        var _this = _possibleConstructorReturn(this, (ConditionModal.__proto__ || Object.getPrototypeOf(ConditionModal)).call(this));

        _this.state = {
            condition: props.condition
        };
        return _this;
    }

    _createClass(ConditionModal, [{
        key: "setCondition",
        value: function setCondition(conditionName) {
            this.state.condition.name = conditionName;
            this.state.condition.level = 1;
            this.state.condition.text = conditionName === "custom" ? "custom condition" : null;

            this.setState({
                condition: this.state.condition
            });
        }
    }, {
        key: "setDuration",
        value: function setDuration(durationType) {
            var duration = null;

            switch (durationType) {
                case "saves":
                    duration = {
                        type: "saves",
                        count: 1,
                        saveType: "str",
                        saveDC: 10,
                        point: "start"
                    };
                    break;
                case "combatant":
                    duration = {
                        type: "combatant",
                        point: "start",
                        combatantID: null
                    };
                    break;
                case "rounds":
                    duration = {
                        type: "rounds",
                        count: 1
                    };
                    break;
            }

            this.state.condition.duration = duration;
            this.setState({
                condition: this.state.condition
            });
        }
    }, {
        key: "changeValue",
        value: function changeValue(object, field, value) {
            object[field] = value;

            this.setState({
                condition: this.state.condition
            });
        }
    }, {
        key: "nudgeValue",
        value: function nudgeValue(object, field, delta) {
            var value = object[field] + delta;
            if (field === "level") {
                value = Math.max(value, 1);
                value = Math.min(value, 6);
            }
            if (field === "count") {
                value = Math.max(value, 1);
            }
            if (field === "saveDC") {
                value = Math.max(value, 0);
            }
            object[field] = value;

            this.setState({
                condition: this.state.condition
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var conditions = CONDITION_TYPES.map(function (condition) {
                    var controls = [];
                    var description = [];
                    if (condition === _this2.state.condition.name) {
                        if (condition === "custom") {
                            controls.push(React.createElement("input", { type: "text", placeholder: "custom condition", value: _this2.state.condition.text, onChange: function onChange(event) {
                                    return _this2.changeValue(_this2.state.condition, "text", event.target.value);
                                } }));
                        }
                        if (condition === "exhaustion") {
                            controls.push(React.createElement(Spin, {
                                source: _this2.props.condition,
                                name: "level",
                                label: "exhaustion",
                                nudgeValue: function nudgeValue(delta) {
                                    return _this2.nudgeValue(_this2.props.condition, "level", delta);
                                }
                            }));
                        }
                        var text = conditionText(_this2.state.condition);
                        for (var n = 0; n !== text.length; ++n) {
                            description.push(React.createElement(
                                "li",
                                { key: n, className: "section" },
                                text[n]
                            ));
                        }
                    }

                    return {
                        id: condition,
                        text: condition,
                        details: React.createElement(
                            "div",
                            { key: condition },
                            controls,
                            React.createElement(
                                "ul",
                                null,
                                description
                            )
                        ),
                        disabled: _this2.props.combatant.conditionImmunities ? _this2.props.combatant.conditionImmunities.indexOf(condition) !== -1 : false
                    };
                });

                var saveOptions = ["str", "dex", "con", "int", "wis", "cha", "death"].map(function (c) {
                    return { id: c, text: c };
                });
                var pointOptions = [{
                    id: "start",
                    text: "start of turn"
                }, {
                    id: "end",
                    text: "end of turn"
                }];
                var combatantOptions = this.props.combat.combatants.map(function (c) {
                    return { id: c.id, text: c.displayName || c.name || "unnamed monster" };
                });

                var durations = [{
                    id: "none",
                    text: "until removed (default)",
                    details: React.createElement(
                        "div",
                        { className: "section" },
                        React.createElement(
                            "div",
                            null,
                            "the condition persists until it is manually removed"
                        )
                    )
                }, {
                    id: "saves",
                    text: "until a successful save",
                    details: React.createElement(
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
                                    return _this2.nudgeValue(_this2.props.condition.duration, "count", delta);
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
                                    return _this2.nudgeValue(_this2.props.condition.duration, "saveDC", delta);
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
                            React.createElement(Selector, {
                                options: saveOptions,
                                selectedID: this.props.condition.duration ? this.props.condition.duration.saveType : null,
                                select: function select(optionID) {
                                    return _this2.changeValue(_this2.props.condition.duration, "saveType", optionID);
                                }
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "subheading" },
                                "make the save at the start or end of the turn"
                            ),
                            React.createElement(Selector, {
                                options: pointOptions,
                                selectedID: this.props.condition.duration ? this.props.condition.duration.point : null,
                                select: function select(optionID) {
                                    return _this2.changeValue(_this2.props.condition.duration, "point", optionID);
                                }
                            })
                        )
                    )
                }, {
                    id: "combatant",
                    text: "until someone's next turn",
                    details: React.createElement(
                        "div",
                        null,
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
                                selectedID: this.props.condition.duration ? this.props.condition.duration.combatantID : null,
                                select: function select(optionID) {
                                    return _this2.changeValue(_this2.props.condition.duration, "combatantID", optionID);
                                }
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "section" },
                            React.createElement(
                                "div",
                                { className: "subheading" },
                                "start or end of the turn"
                            ),
                            React.createElement(Selector, {
                                options: pointOptions,
                                selectedID: this.props.condition.duration ? this.props.condition.duration.point : null,
                                select: function select(optionID) {
                                    return _this2.changeValue(_this2.props.condition.duration, "point", optionID);
                                }
                            })
                        )
                    )
                }, {
                    id: "rounds",
                    text: "for a number of rounds",
                    details: React.createElement(
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
                                    return _this2.nudgeValue(_this2.props.condition.duration, "count", delta);
                                }
                            })
                        )
                    )
                }];

                return React.createElement(
                    "div",
                    { className: "condition-modal" },
                    React.createElement(
                        "div",
                        { className: "row", style: { height: "100%" } },
                        React.createElement(
                            "div",
                            { className: "columns small-6 medium-6 large-6 scrollable" },
                            React.createElement(
                                "div",
                                { className: "heading" },
                                "condition"
                            ),
                            React.createElement(RadioGroup, {
                                items: conditions,
                                selectedItemID: this.state.condition.name,
                                select: function select(itemID) {
                                    return _this2.setCondition(itemID);
                                }
                            })
                        ),
                        React.createElement(
                            "div",
                            { className: "columns small-6 medium-6 large-6 scrollable" },
                            React.createElement(
                                "div",
                                { className: "heading" },
                                "duration"
                            ),
                            React.createElement(RadioGroup, {
                                items: durations,
                                selectedItemID: this.state.condition.duration ? this.state.condition.duration.type : "none",
                                select: function select(itemID) {
                                    return _this2.setDuration(itemID);
                                }
                            })
                        )
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return ConditionModal;
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

var MapEditorModal = function (_React$Component) {
    _inherits(MapEditorModal, _React$Component);

    function MapEditorModal(props) {
        _classCallCheck(this, MapEditorModal);

        var _this = _possibleConstructorReturn(this, (MapEditorModal.__proto__ || Object.getPrototypeOf(MapEditorModal)).call(this));

        _this.state = {
            map: props.map,
            selectedTileID: null
        };
        return _this;
    }

    _createClass(MapEditorModal, [{
        key: "setSelectedTileID",
        value: function setSelectedTileID(id) {
            this.setState({
                selectedTileID: id
            });
        }
    }, {
        key: "addMapTile",
        value: function addMapTile(x, y) {
            var tile = createMapItem();
            tile.x = x;
            tile.y = y;
            this.state.map.items.push(tile);

            this.setState({
                map: this.state.map,
                selectedTileID: tile.id
            });
        }
    }, {
        key: "moveMapItem",
        value: function moveMapItem(item, dir) {
            switch (dir) {
                case "N":
                    item.y -= 1;
                    break;
                case "E":
                    item.x += 1;
                    break;
                case "S":
                    item.y += 1;
                    break;
                case "W":
                    item.x -= 1;
                    break;
            }

            this.setState({
                map: this.state.map
            });
        }
    }, {
        key: "bigMapItem",
        value: function bigMapItem(item, dir) {
            switch (dir) {
                case "N":
                    item.y -= 1;
                    item.height += 1;
                    break;
                case "E":
                    item.width += 1;
                    break;
                case "S":
                    item.height += 1;
                    break;
                case "W":
                    item.x -= 1;
                    item.width += 1;
                    break;
            }

            this.setState({
                map: this.state.map
            });
        }
    }, {
        key: "smallMapItem",
        value: function smallMapItem(item, dir) {
            switch (dir) {
                case "N":
                    if (item.height > 1) {
                        item.y += 1;
                        item.height -= 1;
                    }
                    break;
                case "E":
                    if (item.width > 1) {
                        item.width -= 1;
                    }
                    break;
                case "S":
                    if (item.height > 1) {
                        item.height -= 1;
                    }
                    break;
                case "W":
                    if (item.width > 1) {
                        item.x += 1;
                        item.width -= 1;
                    }
                    break;
            }

            this.setState({
                map: this.state.map
            });
        }
    }, {
        key: "resizeMapItem",
        value: function resizeMapItem(item, dir, dir2) {
            switch (dir2) {
                case "in":
                    this.smallMapItem(item, dir);
                    break;
                case "out":
                    this.bigMapItem(item, dir);
                    break;
            }
        }
    }, {
        key: "cloneMapItem",
        value: function cloneMapItem(item) {
            var copy = JSON.parse(JSON.stringify(item));
            copy.id = guid();
            copy.x += 1;
            copy.y += 1;
            this.state.map.items.push(copy);

            this.setState({
                map: this.state.map,
                selectedTileID: copy.id
            });
        }
    }, {
        key: "removeMapItem",
        value: function removeMapItem(item) {
            var index = this.state.map.items.indexOf(item);
            this.state.map.items.splice(index, 1);

            this.setState({
                map: this.state.map,
                selectedTileID: null
            });
        }
    }, {
        key: "changeValue",
        value: function changeValue(source, field, value) {
            source[field] = value;

            this.setState({
                map: this.state.map
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var tools = null;
                if (this.state.selectedTileID) {
                    var item = this.state.map.items.find(function (i) {
                        return i.id === _this2.state.selectedTileID;
                    });
                    tools = React.createElement(
                        "div",
                        { className: "tools" },
                        React.createElement(MapTileCard, {
                            tile: item,
                            moveMapItem: function moveMapItem(item, dir) {
                                return _this2.moveMapItem(item, dir);
                            },
                            resizeMapItem: function resizeMapItem(item, dir, dir2) {
                                return _this2.resizeMapItem(item, dir, dir2);
                            },
                            cloneMapItem: function cloneMapItem(item) {
                                return _this2.cloneMapItem(item);
                            },
                            removeMapItem: function removeMapItem(item) {
                                return _this2.removeMapItem(item);
                            },
                            changeValue: function changeValue(source, field, value) {
                                return _this2.changeValue(source, field, value);
                            }
                        })
                    );
                } else {
                    tools = React.createElement(
                        "div",
                        { className: "tools" },
                        React.createElement(
                            "p",
                            null,
                            "to add a new tile to the map, double-click on an empty grid square"
                        ),
                        React.createElement(
                            "p",
                            null,
                            "to edit an existing tile, click on it once to select it"
                        )
                    );
                }

                return React.createElement(
                    "div",
                    { className: "map-editor" },
                    tools,
                    React.createElement(MapPanel, {
                        map: this.state.map,
                        mode: "edit",
                        selectedItemID: this.state.selectedTileID,
                        setSelectedItemID: function setSelectedItemID(id) {
                            return _this2.setSelectedTileID(id);
                        },
                        addMapTile: function addMapTile(x, y) {
                            return _this2.addMapTile(x, y);
                        }
                    })
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MapEditorModal;
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
            var trait = createTrait();
            trait.type = type;
            trait.name = "New " + this.getActionTypeName(type, false).toLowerCase();
            this.state.monster.traits.push(trait);
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
            var _this4 = this;

            var notify = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var source = this.state.monster;
            var tokens = field.split(".");
            tokens.forEach(function (token) {
                if (token === tokens[tokens.length - 1]) {
                    source[token] = value;

                    if (field === "abilityScores.con" || field === "size" || field === "hitDice") {
                        var sides = hitDieType(_this4.state.monster.size);
                        var conMod = Math.floor((_this4.state.monster.abilityScores.con - 10) / 2);
                        var hpPerDie = (sides + 1) / 2 + conMod;
                        var hp = Math.floor(_this4.state.monster.hitDice * hpPerDie);
                        _this4.state.monster.hpMax = hp;
                    }

                    if (notify) {
                        _this4.setState({
                            monster: _this4.state.monster
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
            var _this5 = this;

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
                                    return _this5.changeValue(field, d.value);
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
                            return _this5.setRandomValue(field, monsters, true);
                        } },
                    "select random value"
                )
            );
        }
    }, {
        key: "getActionsSection",
        value: function getActionsSection(monsters) {
            var _this6 = this;

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
                            _this6.getActionTypeName(type, true)
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
                                    return _this6.addRandomTrait(type, monsters);
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
            var _this7 = this;

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
                            return _this7.toggleMatch("size");
                        }
                    }),
                    React.createElement(Checkbox, {
                        label: "type " + this.state.monster.category,
                        checked: this.state.filter.type,
                        changeValue: function changeValue(value) {
                            return _this7.toggleMatch("type");
                        }
                    }),
                    React.createElement(Checkbox, {
                        label: this.state.monster.tag ? "subtype " + this.state.monster.tag : "subtype",
                        checked: this.state.filter.subtype,
                        disabled: !this.state.monster.tag,
                        changeValue: function changeValue(value) {
                            return _this7.toggleMatch("subtype");
                        }
                    }),
                    React.createElement(Checkbox, {
                        label: this.state.monster.alignment ? "alignment " + this.state.monster.alignment : "alignment",
                        checked: this.state.filter.alignment,
                        disabled: !this.state.monster.alignment,
                        changeValue: function changeValue(value) {
                            return _this7.toggleMatch("alignment");
                        }
                    }),
                    React.createElement(Checkbox, {
                        label: "challenge rating " + challenge(this.state.monster.challenge),
                        checked: this.state.filter.challenge,
                        changeValue: function changeValue(value) {
                            return _this7.toggleMatch("challenge");
                        }
                    }),
                    React.createElement("div", { className: "divider" }),
                    React.createElement(
                        "button",
                        { className: monsters.length < 2 ? "disabled" : "", onClick: function onClick() {
                                return _this7.geneSplice(monsters);
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
                                return _this7.toggleFilter();
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
            var _this8 = this;

            var monsters = sort(monsters);
            var monsterCards = monsters.map(function (m) {
                return React.createElement(
                    "div",
                    { className: "section", key: m.id },
                    React.createElement(MonsterCard, {
                        combatant: m,
                        mode: "template " + _this8.state.page,
                        copyTrait: function copyTrait(trait) {
                            return _this8.copyTrait(trait);
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
            var _this9 = this;

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
                                        return _this9.changeValue("name", event.target.value);
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
                                        return _this9.changeValue("size", optionID);
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
                                        return _this9.changeValue("category", optionID);
                                    }
                                }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "subtype"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.tag, onChange: function onChange(event) {
                                        return _this9.changeValue("tag", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "alignment"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.alignment, onChange: function onChange(event) {
                                        return _this9.changeValue("alignment", event.target.value);
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
                                        return _this9.nudgeValue("challenge", delta);
                                    }
                                }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "speed"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.speed, onChange: function onChange(event) {
                                        return _this9.changeValue("speed", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "senses"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.senses, onChange: function onChange(event) {
                                        return _this9.changeValue("senses", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "languages"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.languages, onChange: function onChange(event) {
                                        return _this9.changeValue("languages", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "equipment"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.equipment, onChange: function onChange(event) {
                                        return _this9.changeValue("equipment", event.target.value);
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
                                        return _this9.nudgeValue(type, delta);
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
                                        return _this9.changeValue("savingThrows", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "skills"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.skills, onChange: function onChange(event) {
                                        return _this9.changeValue("skills", event.target.value);
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
                                        return _this9.nudgeValue("ac", delta);
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
                                        return value + "d" + hitDieType(_this9.state.monster.size);
                                    },
                                    nudgeValue: function nudgeValue(delta) {
                                        return _this9.nudgeValue("hitDice", delta);
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
                                        return _this9.changeValue("damage.resist", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "damage vulnerabilities"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.damage.vulnerable, onChange: function onChange(event) {
                                        return _this9.changeValue("damage.vulnerable", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "damage immunities"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.damage.immune, onChange: function onChange(event) {
                                        return _this9.changeValue("damage.immune", event.target.value);
                                    } }),
                                React.createElement(
                                    "div",
                                    { className: "subheading" },
                                    "condition immunities"
                                ),
                                React.createElement("input", { type: "text", value: this.state.monster.conditionImmunities, onChange: function onChange(event) {
                                        return _this9.changeValue("conditionImmunities", event.target.value);
                                    } })
                            )
                        );
                        break;
                    case 'actions':
                        content = React.createElement(TraitsPanel, {
                            combatant: this.state.monster,
                            edit: true,
                            addTrait: function addTrait(type) {
                                return _this9.addTrait(type);
                            },
                            removeTrait: function removeTrait(trait) {
                                return _this9.removeTrait(trait);
                            },
                            changeTrait: function changeTrait(trait, type, value) {
                                return _this9.changeTrait(trait, type, value);
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
                                return _this9.setHelpSection(optionID);
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
                                    return _this9.setPage(optionID);
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
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var name = this.props.condition.name || "condition";
                if (this.props.condition.name === "exhaustion") {
                    name += " (" + this.props.condition.level + ")";
                }
                if (this.props.condition.name === "custom") {
                    name = this.props.condition.text;
                }

                if (this.props.condition.duration !== null) {
                    name += " " + conditionDurationText(this.props.condition, this.props.combat);
                }

                var description = [];
                if (this.props.condition.name === "exhaustion") {
                    description.push(React.createElement(
                        "div",
                        { key: "level", className: "section" },
                        React.createElement(Spin, {
                            source: this.props.condition,
                            name: "level",
                            label: "level",
                            nudgeValue: function nudgeValue(delta) {
                                return _this2.props.nudgeConditionValue(_this2.props.condition, "level", delta);
                            }
                        })
                    ));
                }
                var text = conditionText(this.props.condition);
                for (var n = 0; n !== text.length; ++n) {
                    description.push(React.createElement(
                        "div",
                        { key: n, className: "section" },
                        text[n]
                    ));
                }

                return React.createElement(Expander, {
                    text: name,
                    content: React.createElement(
                        "div",
                        null,
                        description,
                        React.createElement("div", { className: "divider" }),
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this2.props.editCondition(_this2.props.condition);
                                } },
                            "edit"
                        ),
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this2.props.removeCondition(_this2.props.condition.id);
                                } },
                            "remove"
                        )
                    )
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
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var conditions = [];
                if (this.props.combatant.conditions) {
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
                            editCondition: function editCondition(condition) {
                                return _this2.props.editCondition(condition);
                            },
                            removeCondition: function removeCondition(conditionID) {
                                return _this2.props.removeCondition(conditionID);
                            }
                        }));
                    }
                }

                return React.createElement(
                    "div",
                    { className: "section" },
                    conditions,
                    React.createElement(
                        "button",
                        { onClick: function onClick() {
                                return _this2.props.addCondition();
                            } },
                        "add a condition"
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

var MapPanel = function (_React$Component) {
    _inherits(MapPanel, _React$Component);

    function MapPanel() {
        _classCallCheck(this, MapPanel);

        return _possibleConstructorReturn(this, (MapPanel.__proto__ || Object.getPrototypeOf(MapPanel)).apply(this, arguments));
    }

    _createClass(MapPanel, [{
        key: "getMapDimensions",
        value: function getMapDimensions() {
            var _this2 = this;

            var border = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;

            var dimensions = null;

            this.props.map.items.filter(function (i) {
                if (_this2.props.mode === "edit") {
                    return i.type === "tile";
                }
                return true;
            }).forEach(function (i) {
                if (!dimensions) {
                    dimensions = {
                        minX: i.x,
                        maxX: i.x + i.width - 1,
                        minY: i.y,
                        maxY: i.y + i.height - 1
                    };
                } else {
                    dimensions.minX = Math.min(dimensions.minX, i.x);
                    dimensions.maxX = Math.max(dimensions.maxX, i.x + i.width - 1);
                    dimensions.minY = Math.min(dimensions.minY, i.y);
                    dimensions.maxY = Math.max(dimensions.maxY, i.y + i.height - 1);
                }
            });

            if (!dimensions) {
                // The map is blank
                if (this.props.mode === 'thumbnail') {
                    return null;
                }

                dimensions = {
                    minX: 0,
                    maxX: 0,
                    minY: 0,
                    maxY: 0
                };
            }

            // Apply the border
            dimensions.minX -= border;
            dimensions.maxX += border;
            dimensions.minY -= border;
            dimensions.maxY += border;

            dimensions.width = 1 + dimensions.maxX - dimensions.minX;
            dimensions.height = 1 + dimensions.maxY - dimensions.minY;

            return dimensions;
        }
    }, {
        key: "getSideLength",
        value: function getSideLength() {
            switch (this.props.mode) {
                case "thumbnail":
                    return 5;
                case "edit":
                case "combat":
                    return 25;
            }

            return 0;
        }
    }, {
        key: "getPosition",
        value: function getPosition(x, y, width, height, mapDimensions) {
            var sideLength = this.getSideLength();

            return {
                left: "calc(" + sideLength + "px * " + (x - mapDimensions.minX) + ")",
                top: "calc(" + sideLength + "px * " + (y - mapDimensions.minY) + ")",
                width: "calc((" + sideLength + "px * " + width + ") + 1px)",
                height: "calc((" + sideLength + "px * " + height + ") + 1px)"
            };
        }
    }, {
        key: "render",
        value: function render() {
            var _this3 = this;

            try {
                var border = this.props.mode === "edit" ? 2 : 0;
                var mapDimensions = this.getMapDimensions(border);
                if (!mapDimensions) {
                    return React.createElement(
                        "div",
                        null,
                        "(blank map)"
                    );
                }

                // Draw the grid squares
                var grid = [];
                if (this.props.mode === "edit") {
                    for (var y = mapDimensions.minY; y !== mapDimensions.maxY + 1; ++y) {
                        for (var x = mapDimensions.minX; x !== mapDimensions.maxX + 1; ++x) {
                            var pos = this.getPosition(x, y, 1, 1, mapDimensions);
                            grid.push(React.createElement(GridSquare, {
                                key: x + "," + y,
                                x: x,
                                y: y,
                                position: pos,
                                onClick: function onClick() {
                                    return _this3.props.setSelectedItemID(null);
                                },
                                onDoubleClick: function onDoubleClick(x, y) {
                                    return _this3.props.addMapTile(x, y);
                                }
                            }));
                        }
                    }
                }

                // Draw the map tiles
                var tiles = this.props.map.items.filter(function (i) {
                    return i.type === "tile";
                }).map(function (i) {
                    var pos = _this3.getPosition(i.x, i.y, i.width, i.height, mapDimensions);
                    return React.createElement(MapTile, {
                        key: i.id,
                        tile: i,
                        position: pos,
                        selectable: _this3.props.mode === "edit",
                        selected: _this3.props.selectedItemID === i.id,
                        thumbnail: _this3.props.mode === "thumbnail",
                        select: function select(id) {
                            return _this3.props.mode === "edit" ? _this3.props.setSelectedItemID(id) : null;
                        }
                    });
                });

                // Draw the tokens
                var tokens = [];
                if (this.props.mode !== "edit") {
                    tokens = this.props.map.items.filter(function (i) {
                        return i.type === "monster" || i.type === "pc";
                    }).map(function (i) {
                        var pos = _this3.getPosition(i.x, i.y, i.width, i.height, mapDimensions);
                        var combatant = _this3.props.combatants.find(function (c) {
                            return c.id === i.id;
                        });
                        return React.createElement(MapToken, {
                            key: i.id,
                            token: i,
                            position: pos,
                            combatant: combatant,
                            selectable: _this3.props.mode === "combat",
                            simple: _this3.props.mode === "thumbnail",
                            selected: _this3.props.selectedItemID === i.id,
                            select: function select(id) {
                                return _this3.props.setSelectedItemID(id);
                            }
                        });
                    });
                }

                // Draw the drag overlay
                var dragOverlay = [];
                if (this.props.showOverlay) {
                    for (var y = mapDimensions.minY; y !== mapDimensions.maxY + 1; ++y) {
                        for (var x = mapDimensions.minX; x !== mapDimensions.maxX + 1; ++x) {
                            var pos = this.getPosition(x, y, 1, 1, mapDimensions);
                            dragOverlay.push(React.createElement(GridSquare, {
                                key: x + "," + y,
                                x: x,
                                y: y,
                                position: pos,
                                overlay: true,
                                onClick: function onClick(x, y) {
                                    return _this3.props.gridSquareClicked(x, y);
                                }
                            }));
                        }
                    }
                }

                var style = "map-panel " + this.props.mode;
                return React.createElement(
                    "div",
                    { className: style, onClick: function onClick() {
                            return _this3.props.setSelectedItemID(null);
                        } },
                    React.createElement(
                        "div",
                        { className: "grid", style: { height: this.getSideLength() * mapDimensions.height + 1 + "px" } },
                        grid,
                        tiles,
                        tokens,
                        dragOverlay
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MapPanel;
}(React.Component);

var GridSquare = function (_React$Component2) {
    _inherits(GridSquare, _React$Component2);

    function GridSquare() {
        _classCallCheck(this, GridSquare);

        return _possibleConstructorReturn(this, (GridSquare.__proto__ || Object.getPrototypeOf(GridSquare)).apply(this, arguments));
    }

    _createClass(GridSquare, [{
        key: "click",
        value: function click(e) {
            e.stopPropagation();
            if (this.props.onClick) {
                this.props.onClick(this.props.x, this.props.y);
            }
        }
    }, {
        key: "doubleClick",
        value: function doubleClick(e) {
            e.stopPropagation();
            if (this.props.onDoubleClick) {
                this.props.onDoubleClick(this.props.x, this.props.y);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            var style = "grid-square";
            if (this.props.overlay) {
                style += " grid-overlay";
            }

            return React.createElement("div", {
                className: style,
                style: this.props.position,
                onClick: function onClick(e) {
                    return _this5.click(e);
                },
                onDoubleClick: function onDoubleClick(e) {
                    return _this5.doubleClick(e);
                }
            });
        }
    }]);

    return GridSquare;
}(React.Component);

var MapTile = function (_React$Component3) {
    _inherits(MapTile, _React$Component3);

    function MapTile() {
        _classCallCheck(this, MapTile);

        return _possibleConstructorReturn(this, (MapTile.__proto__ || Object.getPrototypeOf(MapTile)).apply(this, arguments));
    }

    _createClass(MapTile, [{
        key: "select",
        value: function select(e) {
            if (this.props.selectable) {
                e.stopPropagation();
                this.props.select(this.props.tile.id);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this7 = this;

            var style = "tile " + this.props.tile.terrain;
            if (this.props.selected) {
                style += " selected";
            }
            if (this.props.thumbnail) {
                style += " thumbnail";
            }

            return React.createElement("div", {
                className: style,
                style: this.props.position,
                onClick: function onClick(e) {
                    return _this7.select(e);
                } });
        }
    }]);

    return MapTile;
}(React.Component);

var MapToken = function (_React$Component4) {
    _inherits(MapToken, _React$Component4);

    function MapToken() {
        _classCallCheck(this, MapToken);

        return _possibleConstructorReturn(this, (MapToken.__proto__ || Object.getPrototypeOf(MapToken)).apply(this, arguments));
    }

    _createClass(MapToken, [{
        key: "select",
        value: function select(e) {
            if (this.props.selectable) {
                e.stopPropagation();
                this.props.select(this.props.token.id);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this9 = this;

            var style = "token " + this.props.token.type;
            if (this.props.selected) {
                style += " selected";
            }
            if (this.props.combatant.current) {
                style += " current";
            }

            if (!this.props.position) {
                this.props.position = {
                    width: this.props.token.width * 25 + "px",
                    height: this.props.token.height * 25 + "px"
                };
            }

            var initials = null;
            var hpGauge = null;
            var altitudeBadge = null;
            var conditionsBadge = null;
            if (!this.props.simple) {
                var name = this.props.combatant.displayName || this.props.combatant.name;
                initials = React.createElement(
                    "div",
                    { className: "initials" },
                    name.split(' ').map(function (s) {
                        return s[0];
                    })
                );

                if (this.props.combatant.type === "monster") {
                    hpGauge = React.createElement(HitPointGauge, { combatant: this.props.combatant });
                }

                if (this.props.combatant.altitude > 0) {
                    altitudeBadge = React.createElement(
                        "div",
                        { className: "badge altitude" },
                        "\u23F6"
                    );
                }

                if (this.props.combatant.altitude < 0) {
                    altitudeBadge = React.createElement(
                        "div",
                        { className: "badge altitude" },
                        "\u23F7"
                    );
                }

                if (this.props.combatant.conditions && this.props.combatant.conditions.length > 0) {
                    conditionsBadge = React.createElement(
                        "div",
                        { className: "badge" },
                        "\u25C6"
                    );
                }
            }

            return React.createElement(
                "div",
                {
                    title: this.props.combatant.displayName || this.props.combatant.name,
                    className: style,
                    style: this.props.position,
                    onClick: function onClick(e) {
                        return _this9.select(e);
                    }
                },
                initials,
                hpGauge,
                altitudeBadge,
                conditionsBadge
            );
        }
    }]);

    return MapToken;
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

                    return React.createElement(
                        "div",
                        { className: "row collapse" },
                        React.createElement(
                            "div",
                            { className: "columns small-4 medium-4 large-4 list-column" },
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "traits"
                            ),
                            traits
                        ),
                        React.createElement(
                            "div",
                            { className: "columns small-4 medium-4 large-4 list-column" },
                            React.createElement(
                                "div",
                                { className: "section subheading" },
                                "actions"
                            ),
                            actions
                        ),
                        React.createElement(
                            "div",
                            { className: "columns small-4 medium-4 large-4 list-column" },
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

        var _this = _possibleConstructorReturn(this, (CombatManagerScreen.__proto__ || Object.getPrototypeOf(CombatManagerScreen)).call(this));

        _this.state = {
            selectedTokenID: null, // The ID of the combatant that's selected
            addingToMapID: null // The ID of the combatant we're adding to the map
        };
        return _this;
    }

    _createClass(CombatManagerScreen, [{
        key: "setSelectedTokenID",
        value: function setSelectedTokenID(id) {
            this.setState({
                selectedTokenID: id
            });
        }
    }, {
        key: "setAddingToMapID",
        value: function setAddingToMapID(id) {
            this.setState({
                addingToMapID: id
            });
        }
    }, {
        key: "createCard",
        value: function createCard(combatant) {
            var _this2 = this;

            var mode = "combat";
            if (this.props.combat.map) {
                mode += " tactical";
                var onMap = this.props.combat.map.items.find(function (i) {
                    return i.id === combatant.id;
                });
                mode += onMap ? " on-map" : " off-map";
            }

            switch (combatant.type) {
                case "pc":
                    return React.createElement(PCCard, {
                        combatant: combatant,
                        mode: mode,
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
                        mapAdd: function mapAdd(combatant) {
                            return _this2.setAddingToMapID(combatant.id);
                        },
                        mapMove: function mapMove(combatant, dir) {
                            return _this2.props.mapMove(combatant, dir);
                        },
                        mapRemove: function mapRemove(combatant) {
                            return _this2.props.mapRemove(combatant);
                        },
                        endTurn: function endTurn(combatant) {
                            return _this2.props.endTurn(combatant);
                        }
                    });
                case "monster":
                    return React.createElement(MonsterCard, {
                        combatant: combatant,
                        mode: mode,
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
                        addCondition: function addCondition(combatant) {
                            return _this2.props.addCondition(combatant);
                        },
                        editCondition: function editCondition(combatant, condition) {
                            return _this2.props.editCondition(combatant, condition);
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
                        mapAdd: function mapAdd(combatant) {
                            return _this2.setAddingToMapID(combatant.id);
                        },
                        mapMove: function mapMove(combatant, dir) {
                            return _this2.props.mapMove(combatant, dir);
                        },
                        mapRemove: function mapRemove(combatant) {
                            return _this2.props.mapRemove(combatant);
                        },
                        endTurn: function endTurn(combatant) {
                            return _this2.props.endTurn(combatant);
                        },
                        changeHP: function changeHP(combatant, hp, temp) {
                            return _this2.props.changeHP(combatant, hp, temp);
                        }
                    });
                default:
                    return null;
            }
        }
    }, {
        key: "addCombatantToMap",
        value: function addCombatantToMap(x, y) {
            var _this3 = this;

            var combatant = this.props.combat.combatants.find(function (c) {
                return c.id === _this3.state.addingToMapID;
            });
            this.props.mapAdd(combatant, x, y);
            this.setAddingToMapID(null);
        }
    }, {
        key: "render",
        value: function render() {
            var _this4 = this;

            try {
                var leftPaneContent = null;
                var centrePaneContent = null;
                var rightPaneContent = null;

                if (this.props.combat) {
                    var current = [];
                    var pending = [];
                    var active = [];
                    var defeated = [];

                    this.props.combat.combatants.forEach(function (combatant) {
                        if (combatant.current) {
                            current.push(React.createElement(
                                "div",
                                { key: combatant.id },
                                _this4.createCard(combatant)
                            ));
                        }
                        if (combatant.pending && !combatant.active && !combatant.defeated) {
                            pending.push(React.createElement(PendingCombatantRow, {
                                key: combatant.id,
                                combatant: combatant,
                                combat: _this4.props.combat,
                                select: function select(combatant) {
                                    return _this4.setSelectedTokenID(combatant.id);
                                },
                                selected: combatant.id === _this4.state.selectedTokenID,
                                nudgeValue: function nudgeValue(combatant, type, delta) {
                                    return _this4.props.nudgeValue(combatant, type, delta);
                                },
                                makeActive: function makeActive(combatant) {
                                    return _this4.props.makeActive(combatant);
                                }
                            }));
                        }
                        if (!combatant.pending && combatant.active && !combatant.defeated) {
                            active.push(React.createElement(CombatantRow, {
                                key: combatant.id,
                                combatant: combatant,
                                combat: _this4.props.combat,
                                select: function select(combatant) {
                                    return _this4.setSelectedTokenID(combatant.id);
                                },
                                selected: combatant.id === _this4.state.selectedTokenID
                            }));
                        }
                        if (!combatant.pending && !combatant.active && combatant.defeated) {
                            defeated.push(React.createElement(CombatantRow, {
                                key: combatant.id,
                                combatant: combatant,
                                combat: _this4.props.combat,
                                select: function select(combatant) {
                                    return _this4.setSelectedTokenID(combatant.id);
                                },
                                selected: combatant.id === _this4.state.selectedTokenID
                            }));
                        }
                    });

                    if (this.props.showHelp && pending.length !== 0) {
                        var pendingHelp = React.createElement(
                            "div",
                            { key: "pending-help" },
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
                        pending = [].concat(pendingHelp, pending);
                    }

                    if (this.props.showHelp && current.length === 0) {
                        var activeHelp = React.createElement(
                            "div",
                            { key: "active-help" },
                            React.createElement(InfoCard, {
                                getContent: function getContent() {
                                    return React.createElement(
                                        "div",
                                        null,
                                        React.createElement(
                                            "div",
                                            { className: "section" },
                                            "these are the combatants taking part in this encounter; you can select them to see their stat blocks (on the right)"
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "section" },
                                            "to begin the encounter, select the first combatant and press the ",
                                            React.createElement(
                                                "b",
                                                null,
                                                "start turn"
                                            ),
                                            " button on their stat block"
                                        )
                                    );
                                }
                            })
                        );
                        active = [].concat(activeHelp, active);
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

                    var notifications = this.props.combat.notifications.map(function (n) {
                        return React.createElement(Notification, {
                            id: n.id,
                            notification: n,
                            close: function close(notification, removeCondition) {
                                return _this4.props.close(notification, removeCondition);
                            }
                        });
                    });

                    var mapSection = null;
                    if (this.props.combat.map) {
                        mapSection = React.createElement(MapPanel, {
                            map: this.props.combat.map,
                            mode: "combat",
                            showOverlay: this.state.addingToMapID !== null,
                            combatants: this.props.combat.combatants,
                            selectedItemID: this.state.selectedTokenID,
                            setSelectedItemID: function setSelectedItemID(id) {
                                if (id) {
                                    _this4.setSelectedTokenID(id);
                                }
                            },
                            gridSquareClicked: function gridSquareClicked(x, y) {
                                return _this4.addCombatantToMap(x, y);
                            }
                        });
                    }

                    var selectedCombatant = null;
                    if (this.state.selectedTokenID) {
                        var combatant = this.props.combat.combatants.find(function (c) {
                            return c.id === _this4.state.selectedTokenID;
                        });
                        if (combatant && !combatant.current) {
                            selectedCombatant = this.createCard(combatant);
                        }
                    }
                    if (!selectedCombatant) {
                        selectedCombatant = React.createElement(InfoCard, {
                            key: "selected",
                            getContent: function getContent() {
                                return React.createElement(
                                    "div",
                                    { className: "section" },
                                    "select a pc or monster to see its details here"
                                );
                            }
                        });
                    }

                    leftPaneContent = React.createElement(
                        "div",
                        { className: "combat-left" },
                        React.createElement(CardGroup, {
                            heading: "initiative holder",
                            content: current
                        })
                    );

                    centrePaneContent = React.createElement(
                        "div",
                        { className: "combat-centre" },
                        notifications,
                        React.createElement(CardGroup, {
                            heading: "waiting for intiative to be entered",
                            content: pending,
                            hidden: pending.length === 0,
                            showToggle: true
                        }),
                        mapSection,
                        React.createElement(CardGroup, {
                            heading: "combatants in the encounter",
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

                    rightPaneContent = React.createElement(
                        "div",
                        { className: "combat-right" },
                        React.createElement(CardGroup, {
                            heading: "selected combatant",
                            content: [selectedCombatant]
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
                                return _this4.props.resumeEncounter(combat);
                            }
                        }));
                    });

                    leftPaneContent = React.createElement(
                        "div",
                        { className: "combat-left" },
                        help,
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this4.props.createCombat();
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
                        { className: "columns small-4 medium-4 large-3 scrollable list-column" },
                        leftPaneContent
                    ),
                    React.createElement(
                        "div",
                        { className: "columns small-4 medium-4 large-6 scrollable list-column" },
                        centrePaneContent
                    ),
                    React.createElement(
                        "div",
                        { className: "columns small-4 medium-4 large-3 scrollable list-column" },
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
            var _this6 = this;

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
                                        return _this6.saveSuccess(_this6.props.notification);
                                    } },
                                "success"
                            ),
                            React.createElement(
                                "button",
                                { onClick: function onClick() {
                                        return _this6.close(_this6.props.notification);
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
                                        return _this6.close(_this6.props.notification);
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

var PendingCombatantRow = function (_React$Component3) {
    _inherits(PendingCombatantRow, _React$Component3);

    function PendingCombatantRow() {
        _classCallCheck(this, PendingCombatantRow);

        return _possibleConstructorReturn(this, (PendingCombatantRow.__proto__ || Object.getPrototypeOf(PendingCombatantRow)).apply(this, arguments));
    }

    _createClass(PendingCombatantRow, [{
        key: "getInformationText",
        value: function getInformationText() {
            if (this.props.selected) {
                return "selected";
            }

            return null;
        }
    }, {
        key: "onClick",
        value: function onClick(e) {
            e.stopPropagation();
            if (this.props.select) {
                this.props.select(this.props.combatant);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this8 = this;

            var style = "combatant-row " + this.props.combatant.type;
            if (this.props.combatant.current || this.props.selected) {
                style += " highlight";
            }

            return React.createElement(
                "div",
                { className: style, onClick: function onClick(e) {
                        return _this8.onClick(e);
                    } },
                React.createElement(
                    "div",
                    { className: "name" },
                    this.props.combatant.displayName || this.props.combatant.name || "combatant",
                    React.createElement(
                        "span",
                        { className: "info" },
                        this.getInformationText()
                    )
                ),
                React.createElement(
                    "div",
                    { className: "content" },
                    React.createElement(Spin, {
                        source: this.props.combatant,
                        name: "initiative",
                        label: "initiative",
                        nudgeValue: function nudgeValue(delta) {
                            return _this8.props.nudgeValue(_this8.props.combatant, "initiative", delta);
                        }
                    }),
                    React.createElement(
                        "button",
                        { onClick: function onClick(e) {
                                e.stopPropagation();_this8.props.makeActive(_this8.props.combatant);
                            } },
                        "add to encounter"
                    )
                )
            );
        }
    }]);

    return PendingCombatantRow;
}(React.Component);

var CombatantRow = function (_React$Component4) {
    _inherits(CombatantRow, _React$Component4);

    function CombatantRow() {
        _classCallCheck(this, CombatantRow);

        return _possibleConstructorReturn(this, (CombatantRow.__proto__ || Object.getPrototypeOf(CombatantRow)).apply(this, arguments));
    }

    _createClass(CombatantRow, [{
        key: "getInformationText",
        value: function getInformationText() {
            if (this.props.combatant.current) {
                return "current turn";
            }

            if (this.props.selected) {
                return "selected";
            }

            return null;
        }
    }, {
        key: "onClick",
        value: function onClick(e) {
            e.stopPropagation();
            if (this.props.select) {
                this.props.select(this.props.combatant);
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this10 = this;

            var notes = [];
            if (this.props.combat.map) {
                if (!this.props.combatant.pending && !this.props.combat.map.items.find(function (i) {
                    return i.id === _this10.props.combatant.id;
                })) {
                    notes.push(React.createElement(
                        "div",
                        { key: "not-on-map", className: "note" },
                        "not on the map"
                    ));
                }
            }

            var content = null;

            switch (this.props.combatant.type) {
                case "pc":
                    content = React.createElement(
                        "div",
                        { className: "content" },
                        React.createElement(
                            "div",
                            { className: "section key-stats" },
                            React.createElement(
                                "div",
                                { className: "key-stat" },
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    this.props.combatant.initiative
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-label" },
                                    "init"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "key-stat wide" },
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    this.props.combatant.player ? this.props.combatant.player : "-"
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-label" },
                                    "player"
                                )
                            )
                        ),
                        notes
                    );
                    break;
                case "monster":
                    var hp = this.props.combatant.hp;
                    if (this.props.combatant.hpTemp > 0) {
                        hp += "+" + this.props.combatant.hpTemp;
                    }
                    var gauge = null;
                    if (!this.props.combatant.pending) {
                        gauge = React.createElement(HitPointGauge, { combatant: this.props.combatant });
                    }
                    var conditions = null;
                    if (this.props.combatant.conditions) {
                        conditions = this.props.combatant.conditions.map(function (c) {
                            var name = c.name;
                            if (c.name === "exhaustion") {
                                name += " (" + c.level + ")";
                            }
                            if (c.name === "custom") {
                                name = c.text;
                            }
                            if (c.duration) {
                                name += " " + conditionDurationText(c, _this10.props.combat);
                            }
                            var description = [];
                            var text = conditionText(c);
                            for (var n = 0; n !== text.length; ++n) {
                                description.push(React.createElement(
                                    "li",
                                    { key: n, className: "condition-text" },
                                    text[n]
                                ));
                            }
                            return React.createElement(
                                "div",
                                { key: c.id, className: "condition" },
                                React.createElement(
                                    "div",
                                    { className: "condition-name" },
                                    name
                                ),
                                React.createElement(
                                    "ul",
                                    null,
                                    description
                                )
                            );
                        });
                    }
                    content = React.createElement(
                        "div",
                        { className: "content" },
                        React.createElement(
                            "div",
                            { className: "section key-stats" },
                            React.createElement(
                                "div",
                                { className: "key-stat" },
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    this.props.combatant.initiative
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-label" },
                                    "init"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "key-stat" },
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    this.props.combatant.ac
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-label" },
                                    "ac"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "key-stat" },
                                React.createElement(
                                    "div",
                                    { className: "stat-value" },
                                    hp
                                ),
                                React.createElement(
                                    "div",
                                    { className: "stat-label" },
                                    "hp"
                                )
                            )
                        ),
                        gauge,
                        conditions,
                        notes
                    );
                    break;
            }

            var style = "combatant-row " + this.props.combatant.type;
            if (this.props.combatant.current || this.props.selected) {
                style += " highlight";
            }

            return React.createElement(
                "div",
                { className: style, onClick: function onClick(e) {
                        return _this10.onClick(e);
                    } },
                React.createElement(
                    "div",
                    { className: "name" },
                    this.props.combatant.displayName || this.props.combatant.name || "combatant",
                    React.createElement(
                        "span",
                        { className: "info" },
                        this.getInformationText()
                    )
                ),
                content
            );
        }
    }]);

    return CombatantRow;
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
                        { className: "columns small-4 medium-4 large-3 scrollable list-column" },
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
                        { className: "columns small-8 medium-8 large-9 scrollable" },
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
                                                    "design intricate tactical maps"
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

var MapFoliosScreen = function (_React$Component) {
    _inherits(MapFoliosScreen, _React$Component);

    function MapFoliosScreen() {
        _classCallCheck(this, MapFoliosScreen);

        return _possibleConstructorReturn(this, (MapFoliosScreen.__proto__ || Object.getPrototypeOf(MapFoliosScreen)).apply(this, arguments));
    }

    _createClass(MapFoliosScreen, [{
        key: "render",
        value: function render() {
            var _this2 = this;

            try {
                var help = null;
                if (this.props.showHelp) {
                    help = React.createElement(MapFoliosCard, { mapFolios: this.props.mapFolios });
                }

                var folios = [];
                for (var n = 0; n !== this.props.mapFolios.length; ++n) {
                    var mapFolio = this.props.mapFolios[n];
                    folios.push(React.createElement(MapFolioListItem, {
                        key: mapFolio.id,
                        mapFolio: mapFolio,
                        selected: mapFolio === this.props.selection,
                        setSelection: function setSelection(mapFolio) {
                            return _this2.props.selectMapFolio(mapFolio);
                        }
                    }));
                };

                var folio = null;
                if (this.props.selection) {
                    var folioCards = [];

                    folioCards.push(React.createElement(
                        "div",
                        { className: "column", key: "info" },
                        React.createElement(MapFolioCard, {
                            selection: this.props.selection,
                            addMap: function addMap() {
                                return _this2.props.addMap("new map");
                            },
                            removeMapFolio: function removeMapFolio() {
                                return _this2.props.removeMapFolio();
                            },
                            changeValue: function changeValue(source, field, value) {
                                return _this2.props.changeValue(source, field, value);
                            }
                        })
                    ));

                    this.props.selection.maps.forEach(function (map) {
                        folioCards.push(React.createElement(
                            "div",
                            { className: "column", key: map.id },
                            React.createElement(MapCard, {
                                map: map,
                                editMap: function editMap(map) {
                                    return _this2.props.editMap(map);
                                },
                                removeMap: function removeMap(map) {
                                    return _this2.props.removeMap(map);
                                },
                                changeValue: function changeValue(source, type, value) {
                                    return _this2.props.changeValue(source, type, value);
                                }
                            })
                        ));
                    });

                    if (this.props.selection.maps.length === 0) {
                        folioCards.push(React.createElement(
                            "div",
                            { className: "column", key: "empty" },
                            React.createElement(InfoCard, { getContent: function getContent() {
                                    return React.createElement(
                                        "div",
                                        { className: "section" },
                                        "no maps"
                                    );
                                } })
                        ));
                    }

                    folio = React.createElement(
                        "div",
                        null,
                        React.createElement(CardGroup, {
                            content: folioCards,
                            heading: this.props.selection.name || "unnamed folio",
                            showClose: this.props.selection !== null,
                            close: function close() {
                                return _this2.props.selectMapFolio(null);
                            }
                        })
                    );
                }

                return React.createElement(
                    "div",
                    { className: "map-builder row collapse" },
                    React.createElement(
                        "div",
                        { className: "columns small-4 medium-4 large-3 scrollable list-column" },
                        help,
                        React.createElement(
                            "button",
                            { onClick: function onClick() {
                                    return _this2.props.addMapFolio("new map folio");
                                } },
                            "add a new map folio"
                        ),
                        folios
                    ),
                    React.createElement(
                        "div",
                        { className: "columns small-8 medium-8 large-9 scrollable" },
                        folio
                    )
                );
            } catch (e) {
                console.error(e);
            }
        }
    }]);

    return MapFoliosScreen;
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
                                    cloneMonster: function cloneMonster(combatant, name) {
                                        return _this3.props.cloneMonster(combatant, name);
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
                        { className: "columns small-4 medium-4 large-3 scrollable list-column" },
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
                        { className: "columns small-8 medium-8 large-9 scrollable" },
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
                    name = this.props.selection.name || "unnamed party";
                }

                return React.createElement(
                    "div",
                    { className: "parties row collapse" },
                    React.createElement(
                        "div",
                        { className: "columns small-4 medium-4 large-3 scrollable list-column" },
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
                        { className: "columns small-8 medium-8 large-9 scrollable" },
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
