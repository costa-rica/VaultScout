// components/StackedHistogram.js
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrement des composants nécessaires de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackedHistogram = ({ data1, data2, labels }) => {
  // Configuration des données pour l'histogramme empilé
  const chartData = {
    labels: labels, // Les labels sur l'axe X
    datasets: [
      {
        //label: "Série 1", // Légende pour la première série
        label: "Total Deposit Amt", // Légende pour la première série
        data: data1, // Données de la première série
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Couleur des barres de la première série
        borderColor: "rgba(75, 192, 192, 1)", // Couleur de la bordure pour la première série
        borderWidth: 1, // Largeur de la bordure de la première série
        stack: "stack1", // Nom de la pile pour cette série
      },
      {
        label: "Current Balance", // Légende pour la deuxième série
        data: data2, // Données de la deuxième série
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Couleur des barres de la deuxième série
        borderColor: "rgba(255, 99, 132, 1)", // Couleur de la bordure pour la deuxième série
        borderWidth: 1, // Largeur de la bordure de la deuxième série
        stack: "stack1", // Nom de la pile pour cette série (doit être identique à celui de la première série)
      },
    ],
  };

  // Options de configuration pour l'histogramme empilé
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        // text: "Histogramme Empilé",
      },
    },
    scales: {
      x: {
        stacked: true, // Active l'empilement sur l'axe X
      },
      y: {
        stacked: true, // Active l'empilement sur l'axe Y
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default StackedHistogram;
