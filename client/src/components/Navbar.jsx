import { Receipt } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function Navbar({margin}) {
    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem("user") !== null;

    const handleNewBillClick = () => {
        if (isLoggedIn) navigate("/upload-bill");
        else navigate("/login");
    };

    return (
        <nav className={`border-b border-neutral-800 px-4 h-14 w-full sticky top-0 flex items-center backdrop-blur ${margin}`}>
            <div className="flex items-center space-x-2 mr-4">
                <Receipt className="w-6 h-6 md:w-8 md:h-8" />
                <span className="text-lg md:text-xl font-bold">BillSplit</span>
            </div>
            <div className="flex row justify-between items-center w-1/6" >
                <Button variant="link" onClick={() => {navigate("/profile")}} >Profile</Button>
                <Button variant="link" onClick={handleNewBillClick} >New Bill</Button>
                <Button variant="link" onClick={() => {navigate("/about")}} >About Us</Button>
            </div>
        </nav>
    );
}

export default Navbar;
