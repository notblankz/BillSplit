import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Phone, IndianRupee, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";

function ProfilePage() {
    const navigate = useNavigate();

    // State variables
    const [user, setUser] = useState(null); // Initially null to indicate loading
    const [userBills, setUserBills] = useState([]);
    const [loading, setLoading] = useState(true); // Loading indicator
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
        console.log("User not logged in");
        navigate("/"); // Redirect if no user is stored
    }
    const userJSON = JSON.parse(storedUser);

    const handleUPIChange = async () => {
        const upiId = document.querySelector('input[placeholder="Enter your UPI ID"]').value;
        const phone = document.querySelector('input[placeholder="Enter your Phone Number"]').value;
        console.log(upiId, phone);

        try {
            setIsLoading(true);
            await axios.post(`${import.meta.env.VITE_BACKEND_BASE_URL}/db/users/addUPI?upi=${upiId}&phone=${phone}&sub=${userJSON.sub}`)
            .then((response) => {
                console.log(response.data);
            });
        }
        catch (error) {
            console.error("Error updating UPI ID:", error);
        } finally {
            setIsOpen(false);
        }

    }

    // Fetch user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("Fetching user data...");
                const response = await axios.get(
                    `${import.meta.env.VITE_BACKEND_BASE_URL}/db/users/getUser?sub=${userJSON.sub}`
                );
                console.log(response.data);

                // Set user and bills data
                setUser(response.data);
                setUserBills(response.data.bills || []);

            } catch (error) {
                console.error("Error retrieving user data:", error);
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        };

        fetchUserData();
    }, [userJSON.sub, isLoading]);

    // Render loading state
    if (loading) {
        return <h1 className="text-center text-2xl">Loading Profile...</h1>;
    }

    // Render profile page
    return (
        <div className="min-h-screen bg-background w-full pb-8">
            <Navbar margin="mb-8" />
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Profile Section */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.picture} />
                                <AvatarFallback>
                                    {/* If the user does not have a pfp generate a pfp with their first two letters */}
                                    {user.name
                                        .split(' ')
                                        .map((n) => n[0])
                                        .join('') || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{user.name || 'Unnamed User'}</CardTitle>
                                <p className="text-muted-foreground">{user.email || 'No email'}</p>
                            </div>
                        </div>
                        <Dialog open={isOpen} onOpenChange={setIsOpen} >
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add Details</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Phone Number</Label>
                                        <Input placeholder="Enter your Phone Number" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>UPI ID</Label>
                                        <Input placeholder="Enter your UPI ID" />
                                    </div>
                                </div>
                                {
                                    isLoading ? (
                                        <div className="flex justify-center items-center" disabled={isLoading}>
                                            <Loader2 className="animate-spin" />
                                            <p>Updating...</p>
                                        </div>
                                    ) : (
                                        <Button onClick={handleUPIChange} >Save</Button>
                                    )
                                }
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4" />
                                <span>{user.phone || 'No phone number'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <IndianRupee className="h-4 w-4" />
                                <span>{user.upi || 'No UPI ID'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bills Section */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold">Recent Bills</h2>
                    {userBills.length > 0 ? (
                        userBills.map((bill, index) => (
                            <Card key={index}>
                                <CardHeader>
                                    <CardTitle className="text-xl">{bill.billData.billName || 'Unnamed Bill'}</CardTitle>
                                    <p className="text-muted-foreground">
                                        {bill.date ? format(new Date(bill.date), 'PPP') : 'No Date'}
                                    </p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {Object.keys(bill.participantSplitAmounts).map((participantName, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center"
                                            >
                                                <span>{participantName || 'Unknown'}</span>
                                                <span>₹{bill.participantSplitAmounts[participantName].toFixed(2) || "Could Not Fetch"}</span>
                                            </div>
                                        ))}
                                        <Separator className="my-4" />
                                        <div className="flex justify-between items-center font-bold">
                                            <span>Total</span>
                                            <span>
                                                ₹
                                                {bill.billData.grandTotal || "Error Calculating Total"}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground">No bills found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
