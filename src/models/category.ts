import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: [true, '请输入类目名称'],
      trim: true,
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
    parent: String,
    createUser: String,
    hasChildren: {
      type: Boolean,
      default: false,
    },
    private: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'category',
  }
);

export default mongoose.model('Category', CategorySchema);
