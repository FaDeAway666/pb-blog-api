import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, '请输入类目名称'],
      trim: true,
    },
    parent: String,
    createUser: String,
  },
  {
    timestamps: true,
    collection: 'category',
  }
);

export default mongoose.model('Category', CategorySchema);
