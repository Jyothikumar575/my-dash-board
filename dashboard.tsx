import { useEffect, useState } from "react";
import Header from "../components/Header";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState<any>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetch('/data.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((json) => setData(json))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Download button functionality
  const handleDownload = async () => {
    if (!data || !data.api_secret) {
      console.error("API secret not available");
      return;
    }

    try {
      const response = await axios.post(
        "https://testd5-img.azurewebsites.net/api/imgdownload",
        { api: data.api_secret }
      );

      const base64Image = response.data; // Base64 image string

      // Create a downloadable link
      const link = document.createElement("a");
      link.href = `data:image/png;base64,${base64Image}`;
      link.download = "downloaded_image.png";
      link.click();
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  // Render a loading message until data is fetched
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <Header onDownload={handleDownload} />
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Dashboard;

