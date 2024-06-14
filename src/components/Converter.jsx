import React, { useEffect, useState } from "react";
import { Card, Form, Input, Select, message } from "antd";
import "./Converter.css";
import { RiCoinsLine } from "react-icons/ri";

const Converter = () => {
  const apiUrl = import.meta.env.VITE_CRYPTO_API_URL;

  const [cryptoList, setCryptoList] = useState([]);
  const [inputValue, setInputValue] = useState("0");
  const [firstSelect, setFirstSelect] = useState("");
  const [secondSelect, setSecondSelect] = useState("");
  const [result, setResult] = useState("0");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (cryptoList.length === 0 || !firstSelect || !secondSelect) {
      return;
    }

    const firstSelectRate =
      cryptoList.find((item) => item.value === firstSelect)?.rate || 1;
    const secondSelectRate =
      cryptoList.find((item) => item.value === secondSelect)?.rate || 1;

    const resultValue =
      (parseFloat(inputValue) * secondSelectRate) / firstSelectRate;

    setResult(resultValue.toFixed(6));
  }, [inputValue, firstSelect, secondSelect]);

  async function fetchData() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();
      const data = jsonData.rates;
      const tempArray = Object.entries(data).map((item) => ({
        value: item[1].name,
        label: item[1].name,
        rate: item[1].value,
      }));
      setCryptoList(tempArray);
      setFirstSelect(tempArray[0]?.value);
      setSecondSelect(tempArray[1]?.value);
    } catch (error) {
      message.error("Failed to fetch cryptocurrency data");
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className="container">
      <Card
        className="crypto-card"
        title={
          <h1>
            <RiCoinsLine /> Crypto Converter
          </h1>
        }
      >
        <Form size="large">
          <Form.Item>
            <Input
              type="number"
              min="0"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
          </Form.Item>
        </Form>
        <div className="select-box">
          <Select
            style={{ width: "200px" }}
            value={firstSelect}
            options={cryptoList}
            onChange={(value) => setFirstSelect(value)}
          />
          <Select
            style={{ width: "200px" }}
            value={secondSelect}
            options={cryptoList}
            onChange={(value) => setSecondSelect(value)}
          />
        </div>
        <p>
          {inputValue} {firstSelect} = {result} {secondSelect}
        </p>
      </Card>
    </div>
  );
};

export default Converter;
