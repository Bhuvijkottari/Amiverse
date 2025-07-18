import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Confetti from "react-confetti";
import { useLocation } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { toast } from "react-toastify";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const RewardsPage = () => {
  const location = useLocation();
  const docId = location.state?.docId;

  const [child, setChild] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [prevTotal, setPrevTotal] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([]);

  useEffect(() => {
    if (docId) {
      const fetchChild = async () => {
        const docRef = doc(db, "users", docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setChild(data);

          const stars = data?.rewards?.stars || 0;
          const total = stars;

          if (total > prevTotal) {
            triggerCelebration();
            setPrevTotal(total);
          }

          // Simulated history - replace this with real historical data if available
          const mockHistory = [
            { day: "Mon", value: Math.max(stars - 3, 0) },
            { day: "Tue", value: Math.max(stars - 2, 0) },
            { day: "Wed", value: Math.max(stars - 1, 0) },
            { day: "Today", value: stars },
          ];
          setRewardHistory(mockHistory);
        }
      };

      fetchChild();
    }
  }, [docId]);

  const triggerCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const chartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"], // Customize as needed
  datasets: [
    {
      label: "Stars",
      data: [2, 4, 3, 5, child?.rewards?.stars || 0], // Example values
      fill: false,
      borderColor: "rgba(75,192,192,1)",
      tension: 0.1,
    },
  ],
};

  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (context) => `⭐ ${context.parsed.y} Stars`,
        },
      },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex flex-col items-center justify-start py-10 px-4">
      {showConfetti && <Confetti />}
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🎉 Rewards Dashboard
        </h1>

        {child ? (
          <>
            <div className="text-center mb-6">
              <p className="text-2xl font-semibold text-indigo-600">
                ⭐ Stars: {child.rewards?.stars || 0}
              </p>
            </div>

            <div className="mt-6">
              <Line data={chartData} options={chartOptions} />
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">Loading rewards...</p>
        )}
      </div>
    </div>
  );
};

export default RewardsPage;
