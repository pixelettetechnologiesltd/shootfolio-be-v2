import mongoose from 'mongoose';
import paginate from '../../../common/plugins/paginate';
import { Password } from '../../../common/services/password';
import { AdminAttrs, AdminDoc, AdminModel } from './admin.interface';

const adminSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'Admin',
    },
    rolePrivileges: {
      type: [String],
      default: [],
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.rolePrivileges;
      },
    },
    timestamps: true,
  }
);
adminSchema.plugin(paginate);

adminSchema.pre('save', async function (done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'));
    this.set('password', hashed);
  }
  this.rolePrivileges = [
    'manageGameTypes',
    'manageAdmins',
    'manageUsers',
    'manageGameLeauges',
    'manageGameModes',
    'manageGameClubs',
    'manageSubscription',
    'manageQuiz',
    'manageCoins',
  ];
  done();
});

adminSchema.statics.build = (attrs: AdminAttrs) => {
  return new Admin(attrs);
};

adminSchema.statics.isEmailTaken = async function (email: string) {
  const admin = await this.findOne({ email });
  return !!admin;
};

const Admin = mongoose.model<AdminDoc, AdminModel>('Admin', adminSchema);

export default Admin;
