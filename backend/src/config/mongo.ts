import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

export const connectDB = async (uri: string = MONGO_URI): Promise<boolean> => {
  try {
    const protocolEnd = uri.indexOf('://');
    let finalUri = uri;
    if (protocolEnd !== -1) {
      const authHostSep = uri.lastIndexOf('@');
      if (authHostSep > protocolEnd) {
        const auth = uri.substring(protocolEnd + 3, authHostSep);
        if (auth.includes(':')) {
          const [user, ...passParts] = auth.split(':');
          const pass = passParts.join(':');
          const encodedPass = encodeURIComponent(pass);
          const rest = uri.substring(authHostSep + 1);
          finalUri = uri.substring(0, protocolEnd + 3) + user + ':' + encodedPass + '@' + rest;
        }
      }
    }

    await mongoose.connect(finalUri, {} as mongoose.ConnectOptions);
    console.log("MongoDB connected");
    return true;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    return false;
  }
};

export default mongoose;
