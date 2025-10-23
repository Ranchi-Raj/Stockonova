import React from 'react';
import {NavBar} from '../components/navbar';
import {Footer} from '../components/footer';

const AboutPage = () => {
    return (
        <main className="min-h-screen bg-gray-50">
            <NavBar />
            
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About Stocknova</h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Connecting investors with SEBI-registered professionals for transparent and verified market guidance.
                    </p>
                </div>

                {/* About Section */}
                <section id="about" className="mb-12 scroll-mt-20">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h2 className="text-3xl font-semibold mb-6 text-blue-700 border-b pb-3">About Us</h2>
                        <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                            <p className="text-gray-800">
                                Stocknova is a platform that connects users with SEBI-registered professionals for learning, discussion, and guidance related to the stock market.
                            </p>
                            <p>
                                Our aim is to bridge the gap between market experts and retail investors by providing verified and transparent access to SEBI-registered advisors.
                            </p>
                            <p>
                                We focus on creating an environment where users can learn, interact, and make informed financial decisions through credible sources.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contact" className="mb-12 scroll-mt-20">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h2 className="text-3xl font-semibold mb-6 text-blue-700 border-b pb-3">Contact Us</h2>
                        <div className="space-y-4 text-gray-700">
                            <p className="text-lg">For any queries, suggestions, or support, please reach out to us:</p>
                            <div className="space-y-3 text-lg">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold min-w-24">Instagram:</span>
                                    <span className="text-blue-600">stocknova2025</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold min-w-24">LinkedIn:</span>
                                    <span className="text-blue-600">Stocknova</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold min-w-24">Website:</span>
                                    <a href="https://www.stocknova.co.in" className="text-blue-600 hover:underline">
                                        www.stocknova.co.in
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Terms & Conditions Section */}
                <section id="terms" className="mb-12 scroll-mt-20">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h2 className="text-3xl font-semibold mb-6 text-blue-700 border-b pb-3">Terms & Conditions</h2>
                        <div className="space-y-4 text-gray-700">
                            <p className="text-lg font-medium">By using Stocknova, you agree to the following terms:</p>
                            <ul className="list-disc pl-6 space-y-4 text-lg leading-relaxed">
                                <li>Stocknova is a technology platform that facilitates connections between users and SEBI-registered experts for educational and consultation purposes.</li>
                                <li>Stocknova does not provide any investment, trading, or financial advice.</li>
                                <li>All opinions, recommendations, or advice shared by SEBI-registered experts on the platform are solely their own responsibility.</li>
                                <li>Stocknova shall not be held liable for any financial decisions, losses, or outcomes resulting from actions taken based on expert sessions or communications.</li>
                                <li>The role of Stocknova is limited to verifying SEBI registration, providing a secure environment for sessions, and enabling users to book and interact with experts.</li>
                                <li>By using this platform, you acknowledge and accept that all advisory accountability rests entirely with the SEBI-registered expert you choose to engage with.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Privacy Policy Section */}
                <section id="privacy" className="mb-12 scroll-mt-20">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h2 className="text-3xl font-semibold mb-6 text-blue-700 border-b pb-3">Privacy Policy</h2>
                        <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
                            <p>We respect your privacy and are committed to protecting your personal information.</p>
                            <ul className="list-disc pl-6 space-y-4">
                                <li>We collect only the information necessary to provide our services and improve user experience.</li>
                                <li>Your data will not be sold, shared, or disclosed to third parties except when required by law or to facilitate expert sessions securely.</li>
                                <li>Stocknova uses standard security measures to safeguard your information.</li>
                                <li>By using our services, you consent to our privacy policy and data usage practices.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Disclaimer Section */}
                <section id="disclaimer" className="mb-8 scroll-mt-20">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-8">
                        <h2 className="text-2xl font-semibold mb-4 text-amber-800">Important Disclaimer</h2>
                        <div className="space-y-3 text-amber-800 text-lg leading-relaxed">
                            <p><strong>Stocknova is not a SEBI-registered advisor and does not provide investment advice.</strong></p>
                            <p>The views and opinions shared by SEBI-registered experts are their own.</p>
                            <p>Stocknova&nbsp;s role is limited to connecting users with verified SEBI-registered professionals, and it shall not be held responsible for any advice or actions taken based on such sessions.</p>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
};

export default AboutPage;