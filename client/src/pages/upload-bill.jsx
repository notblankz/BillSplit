import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react"
import Navbar from "@/components/Navbar";

// implement isLoggedIn here also

export default function ExportPage() {
    const { register, handleSubmit, setValue } = useForm();
    const [billFile, setBillFile] = useState(null);
    const [base64BillImage, setBase64BillImage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem("user") !== null

    useEffect(() => {
        if (!isLoggedIn) {
            console.log("User not logged in");
            navigate("/");
        }
    }, [])

    const handleFileChange = (event) => {
        const selectedBillFile = event.target.files[0];
        if (!selectedBillFile) {
            alert("No Bill Selected");
            return;
        }
        setBillFile(selectedBillFile); // set the billFile state to the selected file
        setValue("billImage", selectedBillFile); // set the value of the billImage input field to the selected file

        const reader = new FileReader();
        reader.onloadend = () => {
            setBase64BillImage(reader.result);
        };
        reader.readAsDataURL(selectedBillFile);
    };

    const onSubmit = async (data) => {
        if (!billFile) {
            alert("No Bill Selected");
            return;
        } else if (!data.billName) {
            alert("Please provide a name for the bill");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData(); // make a new FormData object to store the bill data and then send it to the backend
            formData.append("billName", data.billName);
            formData.append("billImage", billFile);

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/parse`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            navigate("/bill-details", {
                state: { // this state is passed to the next stage which can then be accessed using the useLocation hook
                    billData: response.data,
                    billImage: base64BillImage
                }
            });
        } catch (error) {
            console.log("Error while uploading bill:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full flex flex-col min-h-dvh">
            <Navbar />
            <div className="flex justify-center items-center flex-grow" >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Upload Bill</CardTitle>
                        <CardDescription>Upload your bill image and get detailed information instantly</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardContent className="flex flex-col gap-5">
                            <div className="flex flex-col gap-0.5">
                                <Label htmlFor="billName">Bill Name:</Label>
                                <Input
                                    id="billName"
                                    type="text"
                                    placeholder="Give a name to your bill"
                                    {...register("billName")}
                                />
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <Label htmlFor="file">Bill Image:</Label>
                                <Input id="file" type="file" onChange={handleFileChange} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col">
                            <Button className="w-full" disabled={loading}>
                                {
                                    loading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Processing your Bill
                                    </>
                                    ) : (
                                    <>
                                        Upload and Process Bill
                                    </>
                                    )
                                }
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
