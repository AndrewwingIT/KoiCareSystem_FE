import React, { useState } from "react";
import { Input, Button, Form, Typography, message } from "antd";

const { Title, Text } = Typography;

const SaltCalculator: React.FC = () => {
  const [volume, setVolume] = useState<number | undefined>(undefined);
  const [concentration, setConcentration] = useState<number | undefined>(0.3); // Default to 0.3%
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    if (volume && concentration) {
      const saltAmount = (volume * concentration) / 100; // Salt calculation formula
      setResult(saltAmount);
    }
  };

  const handleConcentrationChange = (value: number) => {
    if (value >= 1 && value <= 2) {
      setConcentration(value);
    } else {
      message.warning("Please enter a concentration between 1% and 2%");
    }
  };

  return (
    <div
      style={{
        padding: 24,
        background: "#fff",
        borderRadius: 8,
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <Title level={3}>Salt Calculator</Title>
      <Form layout="vertical">
        <Form.Item label="Pond Volume (liters)">
          <Input
            type="number"
            placeholder="Enter pond volume"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </Form.Item>
        <Form.Item label="Desired Salt Concentration (%)">
          <Input
            type="number"
            placeholder="Enter salt concentration (1-2%)"
            value={concentration}
            onChange={(e) => handleConcentrationChange(Number(e.target.value))}
          />
        </Form.Item>
        <Button type="primary" onClick={handleCalculate}>
          Calculate
        </Button>
      </Form>
      {result !== null && (
        <div style={{ marginTop: 20 }}>
          <Text>Salt required: </Text>
          <Text strong>{result.toFixed(2)} kg</Text>
        </div>
      )}
    </div>
  );
};

export default SaltCalculator;
