import { useEffect } from 'react';
import { Button } from './ui/button';
import axios from 'axios';
import { useState } from 'react';

function SplitImage({ participantSplitAmounts, billName, billTotal }) {
    // We use the use effect hook because we want all this code to run after the components have been rendered, since some of the
    // elements we are trying to access are not available until the component has been rendered. We also want to run this code whenever
    // the participantSplitAmounts, billName, or billTotal change, so we pass them as dependencies to the useEffect hook.

    const user = JSON.parse(localStorage.getItem("user"));

    const [upiID, setUpiID] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    useEffect(() => {
        // User-provided information
        axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/db/users/getUser?sub=${user.sub}`)
        .then((response) => {
            console.log(response.data.upi)
            console.log(response.data.phone)
            setUpiID(response.data.upi);
            setPhoneNumber(response.data.phone);
        })

        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions (high resolution)
        const width = 500;
        const height = 500;
        canvas.width = width;
        canvas.height = height;

        // Set background and text color
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#333333'; // Dark gray text for better readability

        // Add Bill Name (Heading)
        ctx.font = 'bold 30px "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.fillText(billName, canvas.width / 2, 40);

        // Add Date
        ctx.font = 'italic 18px "Segoe UI"';
        ctx.fillText(`Date: ${new Date().toLocaleDateString()}`, canvas.width / 2, 70);

        // Add UPI ID
        ctx.font = '18px "Segoe UI"';
        ctx.textAlign = 'left';
        ctx.fillText(`UPI ID: ${upiID}`, 20, 110);

        // Add Phone Number
        ctx.fillText(`Phone: +91 ${phoneNumber}`, 20, 140);

        // Add a line separator (more space below)
        ctx.beginPath();
        ctx.moveTo(20, 160);
        ctx.lineTo(canvas.width - 20, 160);
        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add Bill Items (more space between sections)
        let yPosition = 190;
        const itemHeight = 30;
        ctx.font = '18px "Segoe UI"';

        for (const [name, amount] of Object.entries(participantSplitAmounts)) {
            ctx.fillText(`${name}: ₹${amount.toFixed(2)}`, 20, yPosition);
            yPosition += itemHeight;
        }

        // Add Total Section with better formatting (center aligned)
        ctx.font = 'bold 24px "Segoe UI"';
        ctx.textAlign = 'center';
        ctx.fillText(`Total: ₹${billTotal}`, canvas.width / 2, yPosition + 10);

        // Convert canvas to an image (data URL)
        const imageUrl = canvas.toDataURL();

        // Get the image container and display the generated image
        const imageContainer = document.getElementById('image-container');
        const linkContainer = document.getElementById('link-container');
        if (imageContainer && linkContainer) {
            imageContainer.innerHTML = ''; // Clear any previous images
            linkContainer.innerHTML = ''; // Clear any previous links

            // Create an image element to display the generated image
            const img = new Image();
            img.src = imageUrl;
            img.alt = "Generated Bill Image";
            imageContainer.appendChild(img);

            // Create a download link
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = 'bill-split.png';
            link.textContent = 'Download Bill Image';
            linkContainer.appendChild(link);
        }
    }, [upiID, phoneNumber]); // useEffect runs only once after the component is mounted

    return (
        <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Generated Bill Image</h2>
            <div id="image-container" className="mb-4"></div>
            <Button asChild>
                <div id='link-container'></div>
            </Button>
        </div>
    );
}

export default SplitImage;
