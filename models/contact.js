import { Schema, model } from "mongoose";
import { handleSaveError, handleUpdateValideta } from "./hooks/contactHook.js";
export const contactShema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timeseries: true }
);
contactShema.pre("findOneAndUpdate", handleUpdateValideta);
contactShema.post("save", handleSaveError);
contactShema.post("findOneAndUpdate", handleSaveError);
export const Contact = model("contact", contactShema);
