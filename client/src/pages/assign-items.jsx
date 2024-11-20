import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

function AssignItemsPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve the billData and participants from the route state
    const { billData, participants } = location.state || {};

    // If billData or participants are missing, navigate back to the upload page
    if (!billData || !participants) {
        alert("No Bill data found");
        navigate("/upload-bill");
    }

    // State to keep track of which participants are assigned to each item
    const [selectedParticipants, setSelectedParticipants] = useState(
        billData.items.map(() => new Set())  // Initializes an array of empty Sets for each item
    );

    // State to track whether select all button is checked for each item
    const [selectAllStates, setSelectAllStates] = useState(
        billData.items.map(() => false) // generate an array of false values for each item
    );

    // Variable to store the final split amounts for each participant
    let participantSplitAmounts = {};

    // useEffect to calculate total amounts whenever selected participants change
    useEffect(() => {
        calculateTotals();  // Calculate split totals whenever selected participants change
    }, [selectedParticipants]);

    // Handles "Select All" toggle for a given item
    const handleSelectAll = (index, checked) => {
        const updatedSelectAllStates = [...selectAllStates];
        updatedSelectAllStates[index] = checked;
        setSelectAllStates(updatedSelectAllStates);

        // Update selected participants for this item to include all or none, based on "Select All" status
        const updatedSelectedParticipants = [...selectedParticipants];
        updatedSelectedParticipants[index] = checked
            ? new Set(participants.map((p) => p.id))
            : new Set();
        setSelectedParticipants(updatedSelectedParticipants);
    };

    // Toggles individual participant selection for a given item
    const handleParticipantToggle = (itemIndex, participantId) => {
        const updatedSelectedParticipants = [...selectedParticipants];
        const newSet = new Set(updatedSelectedParticipants[itemIndex]);

        if (newSet.has(participantId)) {
            newSet.delete(participantId);
        } else {
            newSet.add(participantId);
        }

        updatedSelectedParticipants[itemIndex] = newSet;
        setSelectedParticipants(updatedSelectedParticipants);

        // Update the "Select All" state if all participants are selected for this item
        const allSelected = newSet.size === participants.length;
        const updatedSelectAllStates = [...selectAllStates];
        updatedSelectAllStates[itemIndex] = allSelected;
        setSelectAllStates(updatedSelectAllStates);
    };

    // Calculates the total split amounts for each participant, including taxes
    const calculateTotals = () => {
        const totals = participants.reduce((accumulator, participant) => ({
            ...accumulator, [participant.name]: 0
        }), {});  // Initializes an object with participant names and zeroed totals

        // Basically, participants come in somewhat like this
        // const participants = [
        //     { id: 1, name: 'Aahan' },
        //     { id: 2, name: 'Aarsh' },
        //     { id: 3, name: 'Aayush' }
        // ];
        // After runnning the recuse function this is what we get
        // const totals = {
        //     Aahan: 0,
        //     Aarsh: 0,
        //     Aayush: 0
        // };


        // Calculate item costs and assign per-participant amounts
        billData.items.forEach((item, index) => {
            // Calculate per-person amount for this item based on selected participants
            const perPersonAmount = parseFloat(item.total) / selectedParticipants[index].size || 0;
            selectedParticipants[index].forEach((participantId) => {
                // Find the participant's name based on their ID
                const participant = participants.find(p => p.id === participantId);
                if (participant) {
                    totals[participant.name] += perPersonAmount;
                }
            });
        });

        // billData.items is a list of objects so we iterate over it
        // we calculate perPersonAmount by dividing the item.total by the length of selectedParticipants[index]
        // remember selected participant is a list of sets so we can get the exact item by using the index
        // we iterate over the selectedParticipants[index] and find the participant name by using the id
        // we add the perPersonAmount to the totals object

        // Calculate total taxes and distribute them evenly among participants
        const totalTaxes = Object.values(billData.tax).reduce((sum, tax) => sum + parseFloat(tax), 0);
        const taxPerParticipant = totalTaxes / participants.length;

        // Add tax share to each participant's total
        Object.keys(totals).forEach((name) => {
            totals[name] += taxPerParticipant;
        });

        // we do the somewhat the same thing for the taxes
        // we calculate the total taxes by iterating over the values of the tax object and adding them using the .reduce method
        // we calculate the taxPerParticipant by dividing the totalTaxes by the length of the participants
        // we iterate over the keys of the totals object and add the taxPerParticipant to each participant's total

        // We then finally store the totals in the participantSplitAmounts variable
        // so that we can send it ahead to the download-split page in order to render the image
        participantSplitAmounts = totals;
    };

    const handleGenerateSplit = () => {
        navigate("/download-split", { state: { participantSplitAmounts, billData } });
    }

    // Run calculateTotals once to ensure totals are calculated on initial render
    calculateTotals();

    return (
        <div className="min-h-screen bg-black w-full">
            <div className="max-w-[1600px] mx-auto p-6">
                <Card className="mt-8">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl">Assign Items</CardTitle>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Users width={"18px"} /> {participants.length} people
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            {billData.items.map((item, index) => (
                                <Card key={index}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{item.itemName} x {item.quantity}</CardTitle>
                                        <div className="flex justify-between items-center">
                                            <p className="text-primary">₹{item.total}</p>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Split amount</p>
                                                <p className="font-bold">
                                                    ₹{selectedParticipants[index].size > 0
                                                        ? (parseFloat(item.total) / selectedParticipants[index].size).toFixed(2)
                                                        : "0.00"}
                                                    /person
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`selectAll-${index}`}
                                                    checked={selectAllStates[index]}
                                                    onCheckedChange={(checked) => handleSelectAll(index, checked)}
                                                />
                                                <Label htmlFor={`selectAll-${index}`}>Select All</Label>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                {participants.map((participant) => (
                                                    <div key={participant.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`participant-${index}-${participant.id}`}
                                                            checked={selectedParticipants[index].has(participant.id)}
                                                            onCheckedChange={() => handleParticipantToggle(index, participant.id)}
                                                        />
                                                        <Label htmlFor={`participant-${index}-${participant.id}`}>
                                                            {participant.name}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Button className="mt-8 self-end" onClick={handleGenerateSplit} >Generate Split Image</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AssignItemsPage;
