import mongoose from "mongoose";

const outcomeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
      unique: true, // one outcome per appointment
    },
    disease: {
      type: String,
      required: true,
    },
    improved: {
      type: Boolean, // true = yes, false = no
      required: true,
    },
    daysToRecover: {
      type: Number, // how many days it took
      required: false,
    },
    sideEffects: {
      type: String, // patient text
      default: "",
    },
  },
  { timestamps: true }
);

const Outcome = mongoose.model("Outcome", outcomeSchema);

export default Outcome;
