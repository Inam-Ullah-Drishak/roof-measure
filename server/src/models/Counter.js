import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // counter name, e.g. "order"
  seq: { type: Number, default: 10000 },
});

counterSchema.statics.getNext = async function (name) {
  const counter = await this.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return counter.seq;
};

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;