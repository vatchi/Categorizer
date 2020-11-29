import mongoose from 'mongoose';
 
const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Sender' },
  },
  { timestamps: true },
);
 
const Message = mongoose.model('Message', messageSchema);
 
export default Message;