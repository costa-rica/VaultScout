import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Enregistrer les composants nécessaires pour Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const ScatterPlot = ({ data, highlightedIndex }) => {
  // Générer la couleur des points
  const pointColors = data.map((_, index) =>
    index === highlightedIndex ? "red" : "rgba(75, 192, 192, 1)"
  );

  // Configuration des données du graphique en nuage de points
  const chartData = {
    datasets: [
      {
        label: "Nuage de Points",
        data: data, // Coordonnées des points { x, y }
        backgroundColor: pointColors, // Affectation des couleurs aux points
        borderColor: pointColors, // Couleur de la bordure
        borderWidth: 1,
        pointRadius: 6, // Taille des points
      },
    ],
  };

  // Options du graphique
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Graphique en Nuage de Points avec Point Mis en Évidence",
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        beginAtZero: true,
      },
      y: {
        type: "linear",
        beginAtZero: true,
        suggestedMax: 10, // Ajoute un peu d'espace en haut
      },
    },
  };

  return <Scatter data={chartData} options={options} />;
};

export default ScatterPlot;
