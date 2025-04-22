import { useEffect, useState } from "react";
import { XMLParser } from "fast-xml-parser";
import "./App.css";

function App() {
  const [cuaca, setCuaca] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [hasilFilter, setHasilFilter] = useState([]);

  useEffect(() => {
    const fetchCuaca = async () => {
      try {
        const response = await fetch(
          "https://api.allorigins.win/raw?url=" +
            encodeURIComponent(
              "https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml"
            )
        );
        const xmlText = await response.text();
        const parser = new XMLParser();
        const json = parser.parse(xmlText);
        setCuaca(json);
        console.log("Data cuaca mentah:", json);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };

    fetchCuaca();
  }, []);

  const handleSubmit = () => {
    cariKota();
  };

  const cariKota = () => {
    if (!cuaca) return;

    const areas = cuaca?.data?.forecast?.area || [];
    const filtered = areas.filter((area) => {
      return area.name?.some((n) =>
        n["#text"].toLowerCase().includes(keyword.toLowerCase())
      );
    });

    setHasilFilter(filtered);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Prakiraan Cuaca Jawa Barat</h1>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Cari kota atau kabupaten..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: "8px", width: "250px", marginRight: "10px" }}
        />
        <button onClick={handleSubmit} style={{ padding: "8px 16px" }}>
          Cari
        </button>
      </div>

      {hasilFilter.length > 0 ? (
        hasilFilter.map((area, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: "1rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "1rem",
            }}
          >
            <h3>{area.name.find((n) => n["@type"] === "name")?.["#text"]}</h3>
            <p>
              <strong>Latitude:</strong> {area.latitude}
            </p>
            <p>
              <strong>Longitude:</strong> {area.longitude}
            </p>
          </div>
        ))
      ) : (
        <p>
          {cuaca ? "Masukkan kata kunci untuk mencari." : "Loading data..."}
        </p>
      )}
    </div>
  );
}

export default App;
