import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next)=>{

    const token = req.headers.authorization;
    console.log("token", token);

    if(!token){
        return res.status(401).json({message:"Token is not available."})
    }

    try{
        const decoded = jwt.verify(token.split(" ")[1], "secret_key");
        req.user = decoded;
        next();

    }

    catch(error){
        console.log("Error", error);
        return res.status(401).json({ message: "Invalid Token" });
    }
}

export {authMiddleware}