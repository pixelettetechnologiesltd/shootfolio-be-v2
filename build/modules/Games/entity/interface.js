"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerRoles = exports.ModeType = exports.GameStatus = exports.PortfolioSelect = exports.GameModes = void 0;
var GameModes;
(function (GameModes) {
    GameModes["IDLEP2M"] = "Idle (Player vs Machine)";
    GameModes["IDLEP2P"] = "Idle (Player vs Player)";
    GameModes["REALP2P"] = "Realtime (Player vs Player)";
    GameModes["MULTP2P"] = "Multiplayer Realtime (5 Player vs 5 Player)";
})(GameModes = exports.GameModes || (exports.GameModes = {}));
var PortfolioSelect;
(function (PortfolioSelect) {
    PortfolioSelect["RivalPortfolio"] = "rivalProtfolios";
    PortfolioSelect["ChallengerPortfolio"] = "challengerProtfolios";
})(PortfolioSelect = exports.PortfolioSelect || (exports.PortfolioSelect = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["Play"] = "Play";
    GameStatus["Over"] = "Over";
    GameStatus["Pending"] = "Pending";
    GameStatus["Cancelled"] = "Cancelled";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
var ModeType;
(function (ModeType) {
    ModeType["Days"] = "days";
    ModeType["Minute"] = "Minutes";
})(ModeType = exports.ModeType || (exports.ModeType = {}));
var PlayerRoles;
(function (PlayerRoles) {
    PlayerRoles["FW"] = "FW";
    PlayerRoles["MD"] = "MD";
    PlayerRoles["DF"] = "DF";
    PlayerRoles["GK"] = "GK";
    PlayerRoles["Extra"] = "Extra";
})(PlayerRoles = exports.PlayerRoles || (exports.PlayerRoles = {}));
