import { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'UserAccount',
  },
  prompt: {
    type: String,
    required: [true, 'Prompt is required.'],
  },
  tag: {
    type: String,
    required: [true, 'Tag is required.'],
  },
  timeStamp: {
    type: Date,
    default: Date.now()
  }
});

const Post = models.Posts || model('Posts', PostSchema);

export default Post;