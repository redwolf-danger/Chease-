import { getFirestore } from "firebase-admin/firestore"

export const test1 = async(req, res) => {
    console.log("test function called");
    try {
        const firestore = getFirestore();
        const answer = await firestore.collection("messages").get();
        answer.forEach(doc => {
            console.log(`Document ID: ${doc.id}`, doc.data());
        });
        return res.status(200).json({
            message: "everything worked fine",
            data: answer
        })
    } catch (error) {
        console.log("Some Error Occured in Test function", error);
        return res.status(500).json({ message: "Internal server error" });
    }

}

export const test2 = async(req, res) => {

}
export const test3 = async(req, res) => {

}
export const test4 = async(req, res) => {

}