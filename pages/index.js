import { useState } from 'react';
import Head from 'next/head';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export default function GiveawayForm() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [subscriberId, setSubscriberId] = useState(null);
    const [phone, setPhone] = useState('');
    const [isYoutubeChecked, setIsYoutubeChecked] = useState(false);
    const [loading, setLoading] = useState(false);

    // Configuration (Pulled from .env via Next.js)
    const TAG_IDS = {
        replied: process.env.NEXT_PUBLIC_KIT_TAG_REPLIED || '13667607',
        whitelisted: process.env.NEXT_PUBLIC_KIT_TAG_WHITELISTED || '13667608',
        youtube: process.env.NEXT_PUBLIC_KIT_TAG_YOUTUBE || '13667609',
    };

    // --- ACTIONS ---

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.subscriberId) {
            setSubscriberId(data.subscriberId);
            setStep(2);
        } else {
            alert("Error: " + data.error);
        }
    };

    const handleTagAction = async (tagId, nextStep) => {
        setLoading(true);
        await fetch('/api/tag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, tagId }),
        });
        setLoading(false);
        setStep(nextStep);
    };

    const handlePhoneSubmit = async () => {
        setLoading(true);
        await fetch('/api/update-phone', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscriberId, phone }),
        });
        setLoading(false);
        setStep(3);
    };

    // --- RENDER HELPERS ---

    // A simple progress bar component
    const ProgressBar = ({ percent, label }) => (
        <div className="mb-6">
            <div className="flex justify-between text-sm font-bold mb-1">
                <span>Step {step} of 5</span>
                <span className="bg-yellow-200 px-2 rounded">{label}</span>
            </div>
            <div className="w-full bg-gray-200 h-4 border-2 border-black">
                <div className="bg-yellow-300 h-full" style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white text-black font-sans flex justify-center items-start pt-10">
            <Head>
                <title>The 2026 Kickoff Giveaway</title>
            </Head>

            <div className="w-full max-w-lg p-6">

                {/* HEADER */}
                <div className="text-center mb-8">

                    <h1 className="text-3xl font-bold mb-2">The 2026 Kickoff Giveaway</h1>
                    <p className="text-gray-700">7 Days | 7 Prizes | $7,000 in Tech</p>
                </div>

                {/* --- STEP 1: EMAIL --- */}
                {step === 1 && (
                    <div>
                        <ProgressBar percent={20} label="1X Entries" />
                        <h2 className="text-xl font-bold mb-2">✉️ Enter Your Email</h2>
                        <p className="text-gray-600 mb-4">Get access to daily content and enter to win amazing prizes!</p>
                        <form onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                className="w-full p-3 border-2 border-black mb-4"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-100 border-2 border-black py-3 font-bold hover:bg-green-200"
                            >
                                {loading ? "Processing..." : "ENTER GIVEAWAY"}
                            </button>
                        </form>
                    </div>
                )}

                {/* --- STEP 2: PHONE (WAS STEP 3) --- */}
                {step === 2 && (
                    <div>
                        <ProgressBar percent={40} label="2X Entries" />
                        <h2 className="text-xl font-bold mb-2">📱 Add Your Cellphone Number</h2>
                        <p className="text-gray-600 mb-2">Get text reminders for daily content + prizes!</p>
                        <p className="text-orange-600 font-bold mb-4">+1X Entries <span className="text-gray-500 font-normal">(You'll have 2X total!)</span></p>

                        <div className="mb-4">
                            <PhoneInput
                                defaultCountry="us"
                                value={phone}
                                onChange={(phone) => setPhone(phone)}
                                inputStyle={{
                                    width: '100%',
                                    paddingTop: '12px',
                                    paddingBottom: '12px',
                                    paddingLeft: '12px',
                                    height: '50px',
                                    fontSize: '16px',
                                    border: '2px solid black',
                                    borderRadius: '0px'
                                }}
                                countrySelectorStyleProps={{
                                    style: {
                                        height: '50px',
                                        border: '2px solid black',
                                        borderRight: 'none',
                                        borderRadius: '0px'
                                    }
                                }}
                            />
                        </div>

                        <button
                            onClick={handlePhoneSubmit}
                            disabled={loading || !phone}
                            className="w-full bg-green-100 border-2 border-black py-3 font-bold hover:bg-green-200 mb-2"
                        >
                            {loading ? "Processing..." : "Add My Number"}
                        </button>
                        <button
                            onClick={() => setStep(3)}
                            className="w-full bg-white border-2 border-black py-3 font-bold hover:bg-gray-100"
                        >
                            Skip This Step
                        </button>
                    </div>
                )}

                {/* --- STEP 3: REPLY (WAS STEP 2) --- */}
                {step === 3 && (
                    <div>
                        <ProgressBar percent={60} label="4X Entries" />
                        <div className="flex justify-center mb-4"><div className="text-4xl">✅</div></div>
                        <h2 className="text-xl font-bold mb-2">You're In! Now Confirm Your Email (The Email May Take a Minute To Arrive - Please Check Your "Promotions" Folder)</h2>
                        <p className="text-gray-600 mb-4"><span className="bg-yellow-100 font-bold text-orange-600">+2X Entries</span></p>

                        {/* IMAGE MOCKUP */}
                        <div className="bg-blue-50 p-4 border rounded mb-4 text-sm">
                            <p className="font-bold mb-2">📬 Check your inbox for this email:</p>
                            <div className="border bg-white p-2 mb-2">
                                {/* Ensure email-header.png is in your public folder */}
                                <img src="/email-header.png" alt="Email Header" className="w-full" />
                            </div>
                            <p className="mb-2">Reply to that email with:</p>
                            <p className="text-blue-600 font-mono font-bold mb-2">KICKOFF</p>
                            <div className="bg-yellow-100 p-2 text-gray-500 italic">Waiting for your reply...</div>
                        </div>

                        <button
                            onClick={() => handleTagAction(TAG_IDS.replied, 4)}
                            disabled={loading}
                            className="w-full bg-green-100 border-2 border-black py-3 font-bold hover:bg-green-200"
                        >
                            {loading ? "Processing..." : "I Replied, Show Me Step 4"}
                        </button>
                    </div>
                )}

                {/* --- STEP 4: WHITELIST (NEW STEP) --- */}
                {step === 4 && (
                    <div>
                        <ProgressBar percent={80} label="4X Entries" />
                        <h2 className="text-xl font-bold mb-2">✉️ Whitelist Our Email Address</h2>
                        <div className="bg-yellow-100 p-4 mb-6 text-sm">
                            The #1 way to make sure you see our prize announcements is to whitelist our email or move our email from “promotions” to “primary.” Need help?
                            <a href="https://onlinemarketingclassroom.com/whitelist-resource/" target="_blank" className="text-blue-600 underline font-bold ml-1">
                                Full list of instructions right here &gt;&gt;
                            </a>
                        </div>

                        <button
                            onClick={() => handleTagAction(TAG_IDS.whitelisted, 5)}
                            disabled={loading}
                            className="w-full bg-green-100 border-2 border-black py-3 font-bold hover:bg-green-200 mb-4"
                        >
                            {loading ? "Processing..." : "I Whitelisted, Show Me Step 5"}
                        </button>

                        <a href="https://onlinemarketingclassroom.com/whitelist-resource/" target="_blank" className="block w-full text-center border-2 border-black py-3 font-bold hover:bg-gray-100">
                            Need Help? Whitelist Instructions Here!
                        </a>
                    </div>
                )}

                {/* --- STEP 5: YOUTUBE --- */}
                {step === 5 && (
                    <div>
                        <ProgressBar percent={95} label="5X Entries" />
                        <h2 className="text-xl font-bold mb-2">🎬 Subscribe on YouTube</h2>
                        <p className="text-gray-600 mb-2">Follow us for daily updates all week long!</p>
                        <p className="text-orange-600 font-bold mb-6">+1X Entries <span className="text-gray-500 font-normal">(You'll have 5X total!)</span></p>

                        <a
                            href="http://www.youtube.com/c/TheGrowthBooth"
                            target="_blank"
                            className="block w-full text-center bg-green-100 border-2 border-black py-3 font-bold hover:bg-green-200 mb-6"
                        >
                            Open YouTube Channel
                        </a>

                        <div className="flex items-center mb-6">
                            <input
                                type="checkbox"
                                id="yt-check"
                                className="w-5 h-5 mr-2"
                                checked={isYoutubeChecked}
                                onChange={(e) => setIsYoutubeChecked(e.target.checked)}
                            />
                            <label htmlFor="yt-check" className="text-gray-700">Yes, I subscribed to your YouTube channel</label>
                        </div>

                        <button
                            onClick={() => handleTagAction(TAG_IDS.youtube, 6)}
                            disabled={loading || !isYoutubeChecked}
                            className={`w-full border-2 border-black py-3 font-bold mb-2 ${!isYoutubeChecked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-100 hover:bg-green-200'}`}
                        >
                            {loading ? "Processing..." : "Claim Your Extra Entry"}
                        </button>

                        <button
                            onClick={() => setStep(6)}
                            className="w-full bg-white border-2 border-black py-3 font-bold hover:bg-gray-100"
                        >
                            Skip This Step
                        </button>
                    </div>
                )}

                {/* --- STEP 6: SUCCESS --- */}
                {step === 6 && (
                    <div className="text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h1 className="text-3xl font-bold mb-4">All Done! Thanks For Entering!</h1>
                        <p className="text-xl font-bold text-gray-800">Keep a close eye on your inbox for important daily updates...</p>
                    </div>
                )}

            </div>
        </div>
    );
}
