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
  Title,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Title, Legend);

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

          const stars = data.stars || 0;
          const total = stars;

          if (total > prevTotal) {
            triggerCelebration();
            setPrevTotal(total);
          }

         const history = generateRewardHistory(stars);
         setRewardHistory(history);

        }
      };

      fetchChild();
    }
  }, [docId]);

  const triggerCelebration = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };
  const generateRewardHistory = (stars) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();

  const history = Array.from({ length: 5 }, (_, i) => {
    const offset = 4 - i;
    const dayIndex = (todayIndex - offset + 7) % 7;
    const label = i === 4 ? "Today" : daysOfWeek[dayIndex];
    const value = Math.max(stars - (4 - i), 0);
    return { day: label, value };
  });

  return history;
};


  const chartData = {
    labels: rewardHistory.map((entry) => entry.day),
    datasets: [
      {
        label: "Star Progress",
        data: rewardHistory.map((entry) => entry.value),
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        borderColor: "rgba(99, 102, 241, 1)",
        pointBackgroundColor: "rgba(99, 102, 241, 1)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `⭐ ${context.parsed.y} Stars`,
        },
      },
      title: {
        display: true,
        text: "Weekly Star Growth",
        font: {
          size: 16,
        },
        color: "#4f46e5",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
        grid: {
          color: "#e5e7eb",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 flex flex-col items-center justify-start py-10 px-4">
      {showConfetti && <Confetti />}

      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-xl w-full transition-all duration-300">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-4">
          🎉 Rewards Dashboard
        </h1>

        {child ? (
          <>
            <div className="text-center mb-4">
              <p className="text-lg text-gray-500"></p>
              <p className="text-2xl font-bold text-indigo-600 mt-2">
                ⭐ Stars Earned: {child.stars || 0}
              </p>
            </div>

            <div className="mt-6">
              <Line data={chartData} options={chartOptions} />
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              Keep up the great work! Your stars reflect your growth 🌟
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600 animate-pulse">Loading rewards...</p>
        )}
      </div>
    </div>
  );
};

export default RewardsPage;
