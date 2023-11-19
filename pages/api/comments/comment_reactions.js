// pages/api/comments/comment-like-dislike.js
import { connectDb } from '../../../utils/db';
import Comment from '../../../models/commentModel';

export default async function handler(req, res) {
  const { commentId, action } = req.body; // action should be 'like' or 'dislike'

  if (req.method !== 'POST') {
    return res.status(405).end();  // Method Not Allowed
  }

  if (!commentId || !['like', 'dislike'].includes(action)) {
    return res.status(400).json({ message: 'Comment ID and valid action are required' }); 
  }

  await connectDb();

  try {
    const update = action === 'like' ? { $inc: { likes: 1 } } : { $inc: { dislikes: 1 } };
    const comment = await Comment.findByIdAndUpdate(commentId, update, { new: true });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: `An error occurred while updating the ${action} count.`, error });
  }
}
