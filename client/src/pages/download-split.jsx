import { useLocation } from "react-router-dom";
import SplitImage from "../components/SplitImage.jsx";
import axios from "axios";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

function DownloadSplitImage() {

    const location = useLocation();
    const { participantSplitAmounts, billData } = location.state || {};

    useEffect(() => {
        if (!participantSplitAmounts) {
            alert("No Split data found");
            navigate("/upload-bill");
            return;
        }

        const addBillToDatabase = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const response = await axios.put(
                    `${import.meta.env.VITE_BACKEND_BASE_URL}/db/users/addBill`,
                    {
                        sub: user.sub,
                        storageBillData: { billData, participantSplitAmounts }
                    }
                );
                console.log("Data added to the database:", response.data);
            } catch (error) {
                console.error("Error adding bill to database:", error);
            }
        };

        addBillToDatabase();
    }, []); // empty dependency array to run only once

    return (
        <div className="w-full flex flex-col min-h-screen">
            <Navbar margin="mb-8" />
            <div className="flex flex-col flex-grow items-center justify-center">
                <SplitImage
                    participantSplitAmounts={participantSplitAmounts}
                    billName = {billData.billName}
                    billTotal = {billData.grandTotal}
                />
            </div>
        </div>
    );
}

export default DownloadSplitImage;
