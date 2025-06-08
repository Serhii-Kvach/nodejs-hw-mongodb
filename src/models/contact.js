import { model, Schema } from 'mongoose';

const contactSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    photo: {
      type: String,
      require: false,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Contacts = model('contacts', contactSchema);
