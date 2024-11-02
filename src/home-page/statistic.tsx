import React, { useEffect, useState } from "react";
import './statistic.css';

const Statistics: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<"length" | "weight">("length");
  const [showKoiList, setShowKoiList] = useState<boolean>(false);
  const [selectedKoi, setSelectedKoi] = useState<string>("Select koi");

  const koiList: string[] = ["Koi 1", "Koi 2", "Koi 3"];

  useEffect(() => {
    
  })
  return (
    <div className="statistics">
      <div className="statistics__content">
        <h1 className="statistics__title">Statistics</h1>
        <p className="statistics__subtitle">Koi Growth - {selectedMetric === "length" ? "Length" : "Weight"}</p>
        <button
          className="statistics__select-koi-button"
          onClick={() => setShowKoiList(!showKoiList)}
        >
          {selectedKoi}
        </button>
        {showKoiList && (
          <div className="statistics__koi-list">
            {koiList.map((koi, index) => (
              <div
                key={index}
                className="statistics__koi-item"
                onClick={() => {
                  setSelectedKoi(koi);
                  setShowKoiList(false);
                }}
              >
                {koi}
              </div>
            ))}
          </div>
        )}
        <p className="statistics__selected-count">{`${koiList.length} koi selected`}</p>
        <div className="statistics__metric-buttons">
          <button
            className={`statistics__metric-button ${selectedMetric === "length" ? "statistics__metric-button--active" : ""}`}
            onClick={() => setSelectedMetric("length")}
          >
            Length
          </button>
          <button
            className={`statistics__metric-button ${selectedMetric === "weight" ? "statistics__metric-button--active" : ""}`}
            onClick={() => setSelectedMetric("weight")}
          >
            Weight
          </button>
        </div>
        <div className="statistics__arrow">
          <i className="fas fa-chevron-up text-orange-500"></i>
        </div>
      </div>
      <div className="statistics__graph-section">
        <div className="statistics__duration">
          <span className="text-gray-500">Duration: </span>
          <span className="text-orange-500">Last year</span>
        </div>
        <div className="statistics__graph-placeholder">
          <p>No graph available</p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
