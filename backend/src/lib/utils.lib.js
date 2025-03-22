import jwt from "jsonwebtoken"
import fs from "fs";
import path from "path";


const __dirname = path.resolve();
export const GenerateToken = (user, res) => {
    // const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" })

    const { _id: id, FullName: name, ProfilePic: avatar, Email: email } = user;
    const moderator = 'true';
    // todo:set it to something else
    const now = new Date();
    const jwt_token = jwt.sign({
        aud: 'jitsi',
        context: {
            user: {
                id,
                name,
                avatar,
                email,
                moderator,
                "hidden-from-recorder": false,
            },
            features: {
                livestreaming: 'true',
                recording: 'true',
                transcription: 'true',
                "sip-outbound-call": false,
                "outbound-call": 'true'
            }
        },
        iss: 'chat',
        iat: 1742560521,
        room: '*',
        sub: process.env.APPID,
        exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
        nbf: (Math.round((new Date).getTime() / 1000) - 10)
    }, fs.readFileSync(path.join(__dirname, "PrivateKey.pk"), 'utf8'), { algorithm: 'RS256', header: { kid: process.env.KID } })

    res.cookie("jwt", jwt_token, {
        maxAge: 7 * 24 * 3600 * 1000,
        httpOnly: true,
        // prevents cross site scripting attacks
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development"
            // true if in productions
    });
    return jwt_token;
}

// export const
export const formatPrivateKey = (key) => {
    return key.replace(/\\n/g, "\n");
}