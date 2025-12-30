// changes in the file
____________________________________________________________________
auth.utils.js
isme // { userId: user._id, role: "seller" },
    { userId: user._id, role: user.role },
____________________________________________________________________


____________________________________________________________________
auth.middleware.js => no changes (all changes undo)
____________________________________________________________________


____________________________________________________________________
user.model.js -> role: {
      type: [String],
      // enum: ["admin", "user", "seller"], //real one
      enum: ["superadmin", "user", "seller"], // new one buyer is the user itself
      default: "user",
    },
____________________________________________________________________


registerSeller and loginSeller => 
