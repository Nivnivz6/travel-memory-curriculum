const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// =============================================================
// Define the User Schema
// =============================================================
// Create a new mongoose.Schema
// =============================================================
const userSchema = new mongoose.Schema(
  {
    // Define username field here
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true
    },
    // We handle duplicates manually in the controller.

    // Define email field here 
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    // We handle duplicates manually in the controller.

    // Define password field here
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // This hides the password from queries by default for security!
    }
  },
  // Automatically track createdAt/updatedAt
  {
    timestamps: true,
  }
);

// =============================================================
// Pre-Save Middleware — Password Hashing
// =============================================================
// Before saving a user to the database, we need to hash their password.
// =============================================================
userSchema.pre('save', async function (next) {
  // Check if the password field was modified
  if (!this.isModified('password')) {
    return next();
  }
  // Generate a salt
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
})

// =============================================================
// Instance Method — matchPassword
// =============================================================
// Add a method to the schema that compares an entered password with the stored hash.
// =============================================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);
