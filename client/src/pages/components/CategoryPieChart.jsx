import  { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryPieChart({userId}) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 

  useEffect(() => {
   
    const fetchScores = async (userId) => {
      try {
        const response = await fetch("http://localhost:8080/scores/"+userId, {
          method: "GET",
          credentials: "include",
        });

        const scores = await response.json();

        const categoryData = scores.reduce((acc, score) => {
          const correctPercentage = (score.correctAnswers / score.questionsTotal) * 100;
          if (acc[score.categoryName]) {
            acc[score.categoryName] += correctPercentage;
          } else {
            acc[score.categoryName] = correctPercentage;
          }
          return acc;

          
        }, {});

        const data = {
          labels: Object.keys(categoryData),
          datasets: [
            {
              label: "Correct Answer Percentage",
              data: Object.values(categoryData),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
                "#FF9F40",
              ],
            },
          ],
        };

        setChartData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching scores:", error);
        setLoading(false);
      }
    };

    fetchScores(userId);

  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    elements: {
      arc: {
        radius: "70%", 
      },
    },
  };

  return (
    <div style={{ width: "50%", height: "60vh", margin: "20px auto" }}>
      <h2 style={{textAlign: 'center'}}>Correct Answer Percentage by Category</h2>
      <Pie data={chartData} options={options}/>
    </div>
  );
}

export default CategoryPieChart;
