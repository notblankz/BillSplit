import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    TableFooter
} from "@/components/ui/table";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { CircleX } from "lucide-react";

function BillDetailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    // retreive the billData and billImage from the location state (coming from /upload-bill)
    const { billData, billImage } = location.state || {};

    if (!billData) {
        alert("No Bill data found");
        navigate("/upload-bill");
    }

    const [participantsInput, setParticipantsInput] = useState("");
    const [participants, setParticipants] = useState([]);

    const handleAddParticipant = (event) => {
        event.preventDefault();
        const participantName = participantsInput.trim();
        // First check if the name being entered is already in the list (done by the .some function), then change the participant list
        // .some function takes a function as an argument and returns true if any of the elements in the array satisfy the condition in the function
        if (participantName && !participants.some(p => p.name === participantName)) {
            setParticipants([
                ...participants,
                { id: participants.length + 1, name: participantName }
            ]);
            // Reset the participant input state variable back to empty string, basically reset it
            setParticipantsInput("");
        }
    };

    const handleRemoveTag = (name) => {
        // Remove the clicked participant from the participant state variable
        setParticipants(participants.filter((participant) => participant.name !== name));
    };

    const handleAssignItemClick = () => {
        // we need atleast 2 people to be able to split a bill
        if (participants.length < 2) {
            alert("There must be atleast 2 participants")
            return;
        }
        navigate("/assign-items", {
            state: {
                billData,
                participants
            }
        });
    };

    return (
        <div className="flex flex-col justify-center items-center gap-10">
            <h1 className="text-5xl">{billData.billName}</h1>
            <div className="flex w-4/5 gap-10">
                <img src={billImage} alt="Bill" style={{ maxWidth: "33%", height: "auto" }} />
                <div className="w-4/5">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {billData.items.map((item) => (
                                <TableRow key={item.itemName}>
                                    <TableCell>{item.itemName}</TableCell>
                                    <TableCell>{item.price}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell className="text-right">{item.total}</TableCell>
                                </TableRow>
                            ))}
                            <TableRow>
                                <TableCell colSpan="3" align="left">CGST 2.5%</TableCell>
                                <TableCell className="text-right">{billData.tax["CGST 2.5%"]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" align="left">SGST 2.5%</TableCell>
                                <TableCell className="text-right">{billData.tax["SGST 2.5%"]}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" align="left">Service Charge</TableCell>
                                <TableCell className="text-right">{billData.serviceCharge}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell colSpan="3" align="left">Grand Total</TableCell>
                                <TableCell className="text-right">{billData.grandTotal}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div className="mt-5">
                        <Label htmlFor="participants" className="text-2xl" >Participant List:</Label>
                        <div className="flex flex-wrap gap-2 mb-4 mt-2">
                            {participants.map((participant) => (
                                <Badge
                                    key={participant.id}
                                    className="flex items-center rounded-lg border-2 justify-center text-sm font-medium"
                                >
                                    {participant.name}
                                    <Button
                                        variant="ghost"
                                        size="10px"
                                        onClick={() => handleRemoveTag(participant.name)}
                                        className="ml-1.5 rounded-full"
                                    >
                                        <CircleX />
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                        <div className="flex gap-2" >
                            <Input
                                id="participants"
                                type="text"
                                placeholder="Enter participant name"
                                value={participantsInput}
                                onChange={(e) => setParticipantsInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {handleAddParticipant(e)};
                                }}
                            />
                            <Button onClick={handleAddParticipant}>Add Participant</Button>
                        </div>
                    </div>

                    <div className="flex items-end gap-1 flex-col mt-10">
                        <Button variant="outline">Edit Bill (WIP)</Button>
                        <Button onClick={handleAssignItemClick}>Assign Items to Each Person</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BillDetailPage;
