import mongoose from "mongoose";
import mongooseAggregatePaginate from
    "mongoose-aggregate-paginate-v2"
const VideoSchema = new mongoose.Schema(
    {
        VideoFile: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
        Views: {
            type: Number,
            default: 0,
        },
        isPublish: {
            type: Boolean,
            default: true,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    { timestamps: true })

VideoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", VideoSchema)