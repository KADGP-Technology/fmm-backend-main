"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.artistBusinessLeads = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../controllers");
const router = express_1.default.Router();
//------------------------------- Business Leads Routes -----------------------------------//
router.post("/getLeads", controllers_1.artistDashboardBusinessLeads.get_business_leads);
router.put("/updateBusinessLeads", controllers_1.artistDashboardBusinessLeads.update_business_leads);
exports.artistBusinessLeads = router;
//# sourceMappingURL=businessLeads.js.map