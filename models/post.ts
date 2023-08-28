import { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
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

const Post = models.Post || model('Post', PostSchema);

export default Post;