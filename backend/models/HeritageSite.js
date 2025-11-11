import mongoose from 'mongoose';

const heritageSiteSchema = new mongoose.Schema({
    siteName: {
        type: String,
        required: true,
        unique: true
    },
    location: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true,
        default: 'Tamil Nadu'
    },
    district: {
        type: String
    },
    description: {
        type: String,
        required: true
    },
    emotionalTags: {
        type: [String],
        enum: ['romantic', 'spiritual', 'war', 'heroic', 'history', 'architecture', 'nature', 'cultural'],
        required: true
    },
    highlights: [String],
    period: String,
    significance: String,
    imageUrl: String,
    urlPath: String,
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const HeritageSite = mongoose.model('HeritageSite', heritageSiteSchema);

export default HeritageSite;
