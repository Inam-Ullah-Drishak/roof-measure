import mongoose from "mongoose";

const START_AT = 10000;

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // counter name, e.g. "order"
  seq: { type: Number, default: 0 },
});

counterSchema.statics.getNext = async function (name) {
  const counter = await this.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return START_AT + counter.seq;
};

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;