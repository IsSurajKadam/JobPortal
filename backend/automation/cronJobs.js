import cron from "node-cron";
import { deleteExpiredJobs } from "../controllers/jobController.js";

export const scheduleJobDeletion = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running job expiration check...");
    await deleteExpiredJobs();
  });
};

