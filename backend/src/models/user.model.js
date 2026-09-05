const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Demonstrating the 'Embedded Documents' pattern for addresses
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true, default: 'US' }
}, { _id: false }); // We don't need a separate ObjectId for embedded addresses

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true, // This creates a Unique Index in MongoDB
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Automatically excludes the password from query results by default
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer'
    },
    addresses: [addressSchema]
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Mongoose Pre-save middleware to hash the password before saving to MongoDB
userSchema.pre('save', async function () {
  // Only run this function if the password was modified (or is newly created)
  if (!this.isModified('password')) return;

  // Hash the password securely
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare an incoming password with the hashed password in the DB
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);