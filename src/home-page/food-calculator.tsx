import React, { useEffect, useState } from 'react';
import { API_SERVER, getAllPonds } from './api';
import { Select } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface PondType {
    pondId: string;
    name: string;
    volume: number;
    depth: number;
    drainCount: number;
    pumpCapacity: number;
}

const FoodCalculator: React.FC = () => {
    const [growth, setGrowth] = useState<string>('medium');
    const [temperature, setTemperature] = useState<string>('13-16');
    const [weight, setWeight] = useState(0);
    const [ponds, setPonds] = useState<PondType[]>([]);
    const [selectedPondId, setSelectedPondId] = useState(null);
    const [foodAmount, setFoodAmount] = useState(0);

    const navigate = useNavigate();
    useEffect(() => {
        const role = localStorage.getItem("Role");
        if (role !== "User" || role === null) {
            navigate("/");
        }
    }, []);

    const handlePondChange = (value: any) => {
        setSelectedPondId(value);
    };

    const fetchAllPonds = async () => {
        const userId = localStorage.getItem("userId");
        const rs = getAllPonds(userId);
        rs.then((x) => {
            setPonds(x.data);
            console.log(x);
        }).catch((error) => {
            console.error("Caught Error:", error);
        });
    }

    useEffect(() => {
        fetchAllPonds();
    }, []);

    useEffect(() => {
        const get = async () => {
            try {
                const rs = await axios.get<any>(API_SERVER + "api/ponds/pond/" + selectedPondId + "/total-weight");
                setWeight(rs.data.data);
            } catch (error) {
                console.error(error);
            }
        };
        if (selectedPondId) get();
    }, [selectedPondId]);

    useEffect(() => {
        const calculateFoodAmount = () => {
            let factor = 0;

            // Determine factor based on temperature and growth
            if (growth === 'low') {
                if (temperature === '6-8') factor = 0.01;
                else if (temperature === '9-12') factor = 0.02;
                else if (temperature === '13-16') factor = 0.03;
                else if (temperature === '17-20') factor = 0.04;
                else if (temperature === '21-28') factor = 0.05;
            } else if (growth === 'medium') {
                if (temperature === '6-8') factor = 0.02;
                else if (temperature === '9-12') factor = 0.03;
                else if (temperature === '13-16') factor = 0.04;
                else if (temperature === '17-20') factor = 0.05;
                else if (temperature === '21-28') factor = 0.06;
            } else if (growth === 'high') {
                if (temperature === '6-8') factor = 0.03;
                else if (temperature === '9-12') factor = 0.04;
                else if (temperature === '13-16') factor = 0.05;
                else if (temperature === '17-20') factor = 0.06;
                else if (temperature === '21-28') factor = 0.07;
            }

            setFoodAmount(weight * factor);
        };

        calculateFoodAmount();
    }, [weight, growth, temperature]);

    return (
        <div>
            <div className="food-calculator-container w-full h-48 bg-cover bg-center rounded-lg shadow-lg" style={{
                backgroundImage: "url('https://www.shutterstock.com/image-photo/koi-crystal-waters-showcases-enchanting-600nw-2500920849.jpg')"
            }}>
            </div>
            <div className="food-calculator-content w-full max-w-2xl p-6 bg-white rounded-lg shadow-md mt-4 mx-auto">
                <h1 className="food-calculator-title text-3xl font-semibold text-center mb-4 text-orange-600">Food Calculator</h1>
                <div className="food-calculator-pond-info text-center mb-4">
                    <Select
                        placeholder="Select pond id"
                        value={selectedPondId}
                        onChange={handlePondChange}
                        style={{ width: 200 }}
                    >
                        {ponds?.map((x) => (
                            <Select.Option key={x?.pondId} value={x?.pondId}>
                                {x?.name}
                            </Select.Option>
                        ))}
                    </Select>
                    <p className="text-lg">Total weight of kois in pond: <span className="font-semibold">{weight} g</span></p>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Desired growth</h3>
                    <div className="flex justify-center mt-2">
                        {['low', 'medium', 'high'].map((level) => (
                            <button
                                key={level}
                                className={`px-6 py-2 border border-gray-300 rounded-lg transition duration-300 ease-in-out ${growth === level ? 'bg-orange-500 text-white' : 'bg-white text-black hover:bg-orange-100'}`}
                                onClick={() => setGrowth(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Water temperature</h3>
                    <div className="flex justify-center mt-2">
                        {['6-8', '9-12', '13-16', '17-20', '21-28'].map((range) => (
                            <button
                                key={range}
                                className={`px-6 py-2 border border-gray-300 rounded-lg transition duration-300 ease-in-out ${temperature === range ? 'bg-orange-500 text-white' : 'bg-white text-black hover:bg-orange-100'}`}
                                onClick={() => setTemperature(range)}
                            >
                                {range}°
                            </button>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <h3 className="text-lg font-semibold">Feeding information</h3>
                    <p className="text-md">The recommended amount of food should be split evenly into <span className="font-semibold">3-5 feedings per day</span>. This way the koi will ingest the food better.</p>
                </div>
            </div>
            <div className="food-calculator-recommendation w-full bg-black text-white text-center py-4 mt-4 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">Recommended amount</h2>
                <p className="text-3xl">{foodAmount.toFixed(2)} g</p>
                <p>per day</p>
            </div>
        </div>
    );
};

export default FoodCalculator;
