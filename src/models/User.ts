import mongoose, { SchemaType } from 'mongoose';
import crypto from 'crypto';
import EnvVars from '@src/constants/EnvVars';
// TODO: import RSA

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, '请填写用户名'],
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: [true, '请填写密码'],
    },
    role: Number,
  },
  {
    timestamps: true,
    collection: 'user',
    methods: {
      // 密码加密
      encryptPassword: function (password: string) {
        if (!password) return '';
        try {
          return crypto
            .createHmac('sha1', EnvVars.SALT)
            .update(password)
            .digest('hex');
        } catch (err) {
          return '';
        }
      },
      // 验证密码
      authenticate: function (plainText: string) {
        // @ts-ignore
        // eslint-disable-next-line
        return this.hashedPassword === this.encryptPassword(plainText);
      },
    },
  }
);

UserSchema.virtual('password').set(function (password: string) {
  this.hashedPassword = this.encryptPassword(password);
});

export default mongoose.model('User', UserSchema);
