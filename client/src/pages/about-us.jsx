import React from 'react';
import { Receipt, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function AboutUsPage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Navigation */}
                <nav className="flex justify-between items-center mb-12">
                    <div className="flex items-center space-x-2">
                        <Receipt className="w-6 h-6 md:w-8 md:h-8" />
                        <span className="text-lg md:text-xl font-bold">BillSplit</span>
                    </div>
                    <Button variant="outline" onClick={() => navigate("/")} >Back to Home</Button>
                </nav>

                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Story</h1>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-lg md:text-xl text-muted-foreground">
                            Born from a real problem, built with real passion
                        </p>
                    </div>
                </div>

                {/* Origin Story */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800&h=600"
                            alt="Friends at dinner"
                            className="rounded-lg shadow-2xl"
                        />
                    </div>

                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">The Meghana Visit that Started It All</h2>
                        <p className="text-muted-foreground mb-6">
                            It all began during a spontaneous group lunch at Meghana's in Singasandra. After an amazing meal with friends, we faced the familiar awkward moment - splitting a complex bill with shared starters and biryani, individual soft drinks, and that one friend who ordered a bit too much but couldn't finish it all.
                        </p>
                        <p className="text-muted-foreground mb-6">
                            As Engineers we thought, "There has to be a better way than telling everyone to open their calculators and ask to them to add their amount!" We were tired of using calculator apps and noting down amounts in our phones. That's when the idea for BillSplit was born - a smart, AI-powered solution that makes splitting bills as enjoyable as the meals we share.
                        </p>
                        <div className="flex items-center space-x-2">
                            <Heart className="w-5 h-5 text-red-500" />
                            <p className="text-sm text-muted-foreground">
                                Built with love in PES University by Aahan, Aarsh, and Aayush
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {[
                        {
                            title: "Simplicity First",
                            description: "We believe the best solutions are the ones that feel effortless to use."
                        },
                        {
                            title: "Built with Empathy",
                            description: "Every feature we build starts with understanding our users' needs."
                        },
                        {
                            title: "Trust & Transparency",
                            description: "We're committed to being clear about how we handle your data and bills."
                        }
                    ].map((value) => (
                        <div key={value.title} className="bg-card p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                            <p className="text-muted-foreground">{value.description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Section */}
                <div className="text-center bg-card p-12 rounded-lg">
                    <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Split Bills Smarter?</h2>
                    <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Join thousands of users who have already simplified their group expenses with BillSplit.
                    </p>
                    <Button size="lg" className="min-w-[200px]" onClick={() => navigate("/")} >
                        Get Started Free
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default AboutUsPage;
