import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '请输入文章标题'],
      trim: true,
    },
    // 类目id数组路径，[父，子，孙]
    categoryId: {
      type: Array<string>,
      required: [true, '请传入所属类目ID'],
    },
    coverImg: String,
    tags: Array<string>,
    path: {
      type: String,
      required: [true, '请传入文章存储路径'],
      trim: true,
    },
    createUser: String,
  },
  {
    timestamps: true,
    collection: 'article',
  }
);

export default mongoose.model('Article', ArticleSchema);
