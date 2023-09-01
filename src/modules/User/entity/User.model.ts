import mongoose from 'mongoose';
import paginate from '../../../common/plugins/paginate';
import { Password } from '../../../common/services/password';
import config from '../../../config/config';
import { BadRequestError } from '../../../errors/badRequest.error';
import { UserAttrs, UserDoc, UserModel } from './user.interface';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      // required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photoPath: {
      type: String,
      default: null,
    },
    walletAddress: {
      type: String,
    },
    role: {
      type: String,
      default: 'User',
    },
    rolePrivileges: {
      type: [String],
      default: [],
    },
    deviceToken: [String],
    OTP: {
      key: {
        type: Number,
        default: null,
      },
    },
    status: {
      type: String,
      default: null,
    },
    subscription: {
      type: mongoose.Types.ObjectId,
      ref: 'Subscription',
    },
    subId: {
      type: String,
    },
    verificationToken: String,
    isVerified: { type: Boolean, default: false },
    subscriptionDate: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        // delete ret.createdAt;
        // delete ret.updatedAt;
        delete ret.rolePrivileges;
        delete ret.OTP;
        delete ret.verificationToken;
        if (ret.photoPath) {
          ret.photoPath = config.rootPath + ret.photoPath;
        }
        if (ret.suspend) {
          throw new BadRequestError(
            'Your account has been suspended, Please contact adminstrator!'
          );
        }
      },
    },
    timestamps: true,
  }
);

userSchema.plugin(paginate);

userSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  this.rolePrivileges = ['subscribe'];
  done();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

userSchema.statics.isUserNameTaken = async function (userName) {
  const user = await this.findOne({ userName });
  return !!user;
};

userSchema.pre(['find', 'findOne'], async function (done) {
  this.populate('subscription');
  done();
});

userSchema.statics.isEmailTaken = async function (email: string) {
  const user = await this.findOne({ email });
  return !!user;
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export default User;
