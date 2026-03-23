const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// =============================================================
// Define the User Schema
// =============================================================
// Create a new mongoose.Schema with the following fields:
//
// 1. username:
//    - type: String
//    - required: [true, 'Username is required']
//    - trim: true
//    NOTE: Do NOT add `unique: true`. We handle duplicates manually in the controller.
//
// 2. email:
//    - type: String
//    - required: [true, 'Email is required']
//    - trim: true
//    - lowercase: true
//    NOTE: Do NOT add `unique: true`. We handle duplicates manually in the controller.
//
// 3. password:
//    - type: String
//    - required: [true, 'Password is required']
//    - minlength: 6
//    - select: false   (This hides the password from queries by default for security!)
//
// Add { timestamps: true } as the second argument to automatically track createdAt/updatedAt.
// =============================================================
const userSchema = new mongoose.Schema(
  {
    // Define username field here
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true
    },

    // Define email field here 
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },

    // Define password field here
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // This hides the password from queries by default for security!
    }
  },
  {
    timestamps: true,
  }
);

// =============================================================
// Pre-Save Middleware — Password Hashing
// =============================================================
// Before saving a user to the database, we need to hash their password.
// Use: userSchema.pre('save', async function(next) { ... })
//
// Inside the function:
// 1. Check if the password field was modified: if (!this.isModified('password')) return next();
// 2. Generate a salt: const salt = await bcrypt.genSalt(10);
// 3. Hash the password: this.password = await bcrypt.hash(this.password, salt);
// =============================================================
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

// =============================================================
// Instance Method — matchPassword
// =============================================================
// Add a method to the schema that compares an entered password with the stored hash.
// Use: userSchema.methods.matchPassword = async function(enteredPassword) { ... }
//
// Inside the function:
// return await bcrypt.compare(enteredPassword, this.password);
// =============================================================
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);
