import mongoose from 'mongoose';
 
const senderSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true },
);

senderSchema.statics.findByLogin = async function (login) {
    let sender = await this.findOne({
      username: login,
    });
   
    if (!sender) {
      sender = await this.findOne({ email: login });
    }
   
    return sender;
  };

  senderSchema.pre('remove', function(next) {
    this.model('Message').deleteMany({ sender: this._id }, next);
  });
 
const Sender = mongoose.model('Sender', senderSchema);
 
export default Sender;