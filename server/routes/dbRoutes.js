import express from "express";
import { getDatabase } from "../config/dbConfig.js  ";

const router = express.Router();

// when a user logs in with google auth we will store their details in the database
// when they create a new when they finally generate the image of the bill we will store the billData and participant split in the database
// when they open profile page we will retrieve the user info and maybe display splits of all the bills
// implement delete user account button
// implement delete bill button (optional)

// Schema would look something like this
// Inside the users collection
// {
//     "sub": "this will come from google oauth, this will be our unique ID",
//     "name": "test",
//     "email": "test@gmail.com",
//     "picture": "url",
//     "bills": [
//         {
//             "billName": "bill1",
//             "billData": {
//                 "items": [
//                     {
//                         "itemName": "Item 1",
//                         "price": "100",
//                         "quantity": "2",
//                         "total": "200"
//                     },
//                     {
//                         "itemName": "Item 2",
//                         "price": "50",
//                         "quantity": "1",
//                         "total": "50"
//                     }
//                 ],
//                 "tax": {
//                     "CGST": "10",
//                     "SGST": "10"
//                 },
//                 "grandTotal": "260"
//             },
//             "participants": [
//                 user1: 130,
//                 user2: 130
//             ]
//         }, ...
//     ]
// }

router.put("/addBill", async (req, res) => {
    const db = getDatabase();
    const bill = req.body.storageBillData;
    const sub = req.body.sub;

    bill.date = new Date();

    // find user by the sub and then add the bill to the bills array
    try {
        const user = await db.collection("users").findOne({ sub: sub });

        if (user) {
            user.bills.push(bill);
            const result = await db.collection("users").updateOne({ sub: sub }, { $set: { bills: user.bills } });
            console.log("Bill added to user");
            res.status(201).send(result);
        } else {
            res.status(404).send({ error: "User not found" });
        }

    } catch (error) {
        console.error("Error inserting bill into database:", error);
        res.status(500).send({ error: "Failed to add bill to the database" });
    }
}
);

router.post("/addUPI", async (req, res) => {
    const db = getDatabase();
    const sub = req.query.sub;
    const upi = req.query.upi;
    const phone = req.query.phone;

    try {
        const user = await db.collection("users").findOne({ sub: sub });

        if (user) {
            const result = await db.collection("users").updateOne({ sub: sub }, { $set: { upi: upi, phone: phone } });
            console.log("UPI and Phone added to user");
            res.status(201).send(result);
        } else {
            res.status(404).send({ error: "User not found" });
        }

    } catch (error) {
        console.error("Error inserting UPI into database:", error);
        res.status(500).send({ error: "Failed to add UPI to the database" });
    }
});

router.get("/getUser", async (req, res) => {
    const db = getDatabase();
    const sub = req.query.sub;

    try {
        const user = await db.collection("users").findOne({ sub: sub });

        console.log("\nUser Requested")

        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send({ error: "User not found" });
        }

    } catch (error) {
        console.error("Error fetching user from database:", error);
        res.status(500).send({ error: "Failed to fetch user from the database" });
    }
}
);

router.delete("/deleteUser", (req, res) => {
    const db = getDatabase();
    const sub = req.query.sub;

    try {
        const result = db.collection("users").deleteOne({ sub: sub });

        if (result) {
            res.status(200).send({ message: "User deleted successfully" });
        } else {
            res.status(404).send({ error: "User not found" });
        }
    } catch (e) {
        res.status(500).send({ error: "Failed to delete user from the database" });
        throw e;
    }
})

router.get("/", async (req, res) => {
    const db = getDatabase();
    const users = await db.collection("users").find({}).toArray();
    console.log(users);
    res.send(users);
});

router.post("/", async (req, res) => {
    const db = getDatabase();
    const user = req.body;
    let finalUser = {
        sub: user.sub,
        name: user.name,
        email: user.email,
        picture: user.picture,
        bills: []
    };

    try {

        // check if user exists by doing .find on the sub only if they do not exist add the user
        const userExists = await db.collection("users").find({ sub: user.sub }).toArray();

        if (userExists.length > 0) {
            console.log("User already exists");
            res.status(200).send({ message: "User already exists" });
            return;
        } else {
            const result = await db.collection("users").insertOne(finalUser);
            res.status(201).send(result);
        }

    } catch (error) {
        console.error("Error inserting user into database:", error);
        res.status(500).send({ error: "Failed to add user to the database" });
    }
}
);

export default router;
