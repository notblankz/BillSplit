import { Receipt, ScanText, Share2, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function LoginPage() {

    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            navigate("/upload-bill");
        }
    }, [navigate]);

    const handleLoginSuccess = async (response) => {
        try {
            const decodedUserInfo = jwtDecode(response.credential);

            console.log("Decoded User Info:", decodedUserInfo);

            // Save user info to localStorage
            localStorage.setItem("user", JSON.stringify(decodedUserInfo));

            // Send user info to the backend
            await axios.post(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/db/users`,
                decodedUserInfo,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("User added to the database");

            // Navigate to the next page
            navigate("/upload-bill");
        } catch (error) {
            console.error("Error during login:", error);
            alert("Failed to log in. Please try again.");
            return null;
        }
    };

    const handleLoginFailure = (error) => {
        console.error("Login Failed:", error);
        alert("Login failed. Please try again.");
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
                <nav className="flex justify-between items-center mb-8 md:mb-16">
                    <div className="flex items-center space-x-2">
                        <Receipt className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-lg md:text-xl font-bold">BillSplit</span>
                    </div>
                </nav>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">
                            Split Bills Effortlessly with Friends
                        </h1>
                        <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                            Upload your receipt, let our AI extract items, and easily split expenses with friends. Share beautiful breakdowns and get paid faster.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <GoogleLogin
                                theme='filled_black'
                                text='signin'
                                size='medium'
                                onSuccess={handleLoginSuccess}
                                onError={handleLoginFailure}
                                className="p-5"
                            />
                            <Button variant="outline" onClick={() => navigate("/about")} >
                                Learn More
                            </Button>
                        </div>
                    </div>

                    <div className="relative mt-8 lg:mt-0">
                        <img
                            src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800&h=600"
                            alt="Receipt splitting"
                            className="rounded-lg shadow-2xl w-full"
                        />
                    </div>
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 mt-16 md:mt-24">
                    <div className="p-6 bg-card rounded-lg">
                        <ScanText className="w-8 h-8 md:w-10 md:h-10 mb-4 text-primary" />
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Smart OCR Scanning</h3>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Upload any receipt and our AI will automatically extract all items and prices with high accuracy.
                        </p>
                    </div>
                    <div className="p-6 bg-card rounded-lg">
                        <Share2 className="w-8 h-8 md:w-10 md:h-10 mb-4 text-primary" />
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Easy Sharing</h3>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Generate beautiful breakdowns and share them instantly with your friends via any messaging app.
                        </p>
                    </div>
                    <div className="p-6 bg-card rounded-lg">
                        <Wallet className="w-8 h-8 md:w-10 md:h-10 mb-4 text-primary" />
                        <h3 className="text-lg md:text-xl font-semibold mb-2">Track Payments (Coming Soon)</h3>
                        <p className="text-sm md:text-base text-muted-foreground">
                            Keep track of who has paid and who still owes money with our simple payment tracking system.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
