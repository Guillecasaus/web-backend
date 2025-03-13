const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        lastname: { type: String },
        age: { type: Number },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        role: { type: String, enum: ["user", "admin"], default: "user" },
        verificationCode: { type: String, required: true },
        attempts: { type: Number, default: 3 },
        status: { type: String, enum: ["pending", "verified"], default: "pending" }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = mongoose.model("users", UserSchema);
