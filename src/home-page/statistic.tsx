import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { API_SERVER } from "./api";
import axios from "axios";
import { Select } from "antd";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Statistics: React.FC = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<("length" | "weight")[]>([]);
  const [showKoiList, setShowKoiList] = useState<boolean>(false);
  const [selectedKoi, setSelectedKoi] = useState<number>();
  const [selectedDuration, setSelectedDuration] = useState<string>("Last year");
  const [showDurationList, setShowDurationList] = useState<boolean>(false);
  const [kois, setKois] = useState<any[]>([]);
  const [data, setData] = useState<any>([]);
  const userId = localStorage.getItem("userId");

  const koiList: string[] = ["Koi 1", "Koi 2", "Koi 3"];
  const durations: string[] = ["Last month", "Last 3 months", "Last 6 months", "Last year", "Since first water measure...", "Since first koi measure...", "Custom"];

  const growthHistory = [
    { measurementDate: "2024-01-02", length: 20, weight: 30 },
    { measurementDate: "2024-02-02", length: 25, weight: 35 },
    { measurementDate: "2024-03-02", length: 30, weight: 40 },
    // Thêm nhiều dữ liệu vào đây nếu cần
  ];

  const handlePondChange = (value: any) => {
    setSelectedKoi(value);
  };

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(`${API_SERVER}api/growth-histories/koi/` + selectedKoi);
        setData(rs.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, [selectedKoi]);

  useEffect(() => {
    const get = async () => {
      try {
        const rs = await axios.get<any>(`${API_SERVER}api/kois/user/` + userId);
        setKois(rs.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    get();
  }, []);

  useEffect(() => {
    // Fetch hoặc cập nhật dữ liệu liên quan khi selectedKoi hoặc selectedDuration thay đổi
  }, [selectedKoi, selectedDuration]);

  const toggleMetric = (metric: "length" | "weight") => {
    setSelectedMetrics((prev) =>
      prev.includes(metric) ? prev.filter((m) => m !== metric) : [...prev, metric]
    );
  };

  // Dữ liệu biểu đồ dựa trên các metric đã chọn
  const chartData = {
    labels: data?.map((item: any) => item.measurementDate),
    datasets: selectedMetrics.map((metric) => ({
      label: metric === "length" ? "Length (cm)" : "Weight (g)",
      data: data?.map((item: any) => item[metric]),
      borderColor: metric === "length" ? "rgba(255, 99, 132, 1)" : "rgba(54, 162, 235, 1)",
      backgroundColor: metric === "length" ? "rgba(255, 99, 132, 0.2)" : "rgba(54, 162, 235, 0.2)",
      borderWidth: 2,
      tension: 0.3,
      fill: true,
    })),
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Koi Growth Over Time',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Measurement',
        },
      },
    },
  };

  return (
    <div className="bg-white min-h-screen flex flex-col items-center">
      <div className="relative">
        <img src="https://placehold.co/1920x300" alt="Koi fish swimming in a pond" className="w-full h-48 object-cover" />
        <div className="absolute top-0 right-0 p-4 text-white">
          <span className="font-bold">Dinh Phong</span>
        </div>
      </div>
      <div className="text-center mt-4">
        <h1 className="text-2xl font-bold">Statistics</h1>
        <p className="mt-2">Koi growth - {selectedMetrics.length > 0 ? selectedMetrics.join(", ") : "Select metric"}</p>
        <Select
          placeholder="Select pond id"
          value={selectedKoi}
          onChange={handlePondChange}
          style={{ width: 200 }}
        >
          {kois?.map((x) => (
            <Select.Option key={x?.koiId} value={x?.koiId}>
              {x?.name}
            </Select.Option>
          ))}
        </Select>

        <div className="flex justify-center space-x-4 mt-2">
          <button
            className={`py-1 px-4 rounded-full ${selectedMetrics.includes("length") ? "bg-orange-500 text-white" : "border border-orange-500 text-orange-500 bg-white hover:bg-orange-100"}`}
            onClick={() => toggleMetric("length")}
          >
            Length
          </button>
          <button
            className={`py-1 px-4 rounded-full ${selectedMetrics.includes("weight") ? "bg-orange-500 text-white" : "border border-orange-500 text-orange-500 bg-white hover:bg-orange-100"}`}
            onClick={() => toggleMetric("weight")}
          >
            Weight
          </button>
        </div>
        <div className="mt-4">
          <i className="fas fa-chevron-up text-orange-500"></i>
        </div>
      </div>
      <div className="border-t mt-4 pt-4 w-full max-w-2xl">
        <div className="flex justify-center items-center">
          <span className="mr-2">Duration:</span>
          <div className="relative inline-block text-left">
            <button
              type="button"
              className="inline-flex items-center text-orange-500 hover:text-orange-600"
              onClick={() => setShowDurationList(!showDurationList)}
            >
              {selectedDuration}
              <i className="fas fa-chevron-down text-orange-500 ml-1"></i>
            </button>
            {showDurationList && (
              <div className="absolute right-0 z-10 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                <div className="py-1" role="none">
                  {durations.map((duration) => (
                    <button
                      key={duration}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        setSelectedDuration(duration);
                        setShowDurationList(false);
                      }}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Line data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Statistics;
