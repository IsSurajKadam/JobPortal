import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    jobTitle: { type: String, required: true },
    companyName: { type: String, required: true },
    reason: { type: String, required: true },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "Reviewed", "Action Taken"], default: "Pending" },
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", reportSchema);
export default Report;
