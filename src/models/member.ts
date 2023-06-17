import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const MemberSchema = new Schema({
    id: String,
    xp: Number,
    level: Number
});

export = mongoose.model('Member', MemberSchema);