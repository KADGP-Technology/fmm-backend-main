import express from "express";
import { artistDashboardBusinessLeads } from '../../controllers';
const router = express.Router();



//------------------------------- Business Leads Routes -----------------------------------//
router.post("/getLeads" , artistDashboardBusinessLeads.get_business_leads);
router.put("/updateBusinessLeads" , artistDashboardBusinessLeads.update_business_leads);




export const artistBusinessLeads = router;