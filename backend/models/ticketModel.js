import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  issueType: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Resolved', 'In Progress'], // Restricting to these avoids typos
    default: 'Open' 
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  description: {
    type: String,
    required: true
  },
  // Unified Chat System
 chats: [{
    sender: { 
        type: String, 
        enum: ['user', 'admin', 'ai'], // <-- ADD 'ai' HERE
        required: true 
    }, 
    message: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
  }],
  assignedAgent: {
    type: String,
    default: null
  },
  resolvedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Middleware: Auto-set resolvedAt when status changes to 'Resolved'
ticketSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'Resolved') {
        this.resolvedAt = Date.now();
    }
    next();
});

const ticketModel = mongoose.models.ticket || mongoose.model('ticket', ticketSchema);

export default ticketModel;