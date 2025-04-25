import mongoose, { Document, Schema } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  expiresAt: Date;
}

const TokenSchema = new Schema<IToken>({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    // Automatically remove token when expired
    expires: 0,
  },
});

// Create indexes for faster queries
TokenSchema.index({ token: 1 });
TokenSchema.index({ user: 1 });
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model<IToken>("Token", TokenSchema);

export default Token;
