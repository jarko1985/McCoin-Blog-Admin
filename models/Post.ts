import { Schema, models, model, Model } from 'mongoose';

const PostSchema = new Schema({
  id: { type: Number, required: true, unique: true }, // simple incremental id we compute
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, default: '' },
  author: { type: String, default: 'McCoin Editorial Team' },
  publishDate: { type: String, required: true }, // keep your existing string format
  category: { type: String, required: true },
  image: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
},{ timestamps:true });

export type PostDoc = {
  id:number; title:string; description:string; content?:string;
  author?:string; publishDate:string; category:string; image:string; slug:string;
  likes?:number; dislikes?:number; featured?:boolean;
}

export default (models.Post as Model<PostDoc>) || model<PostDoc>('Post', PostSchema);
