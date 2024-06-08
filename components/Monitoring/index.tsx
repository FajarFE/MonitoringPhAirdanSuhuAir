"use client";

import { pusherClient } from "@/libs/pusher";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const Messages = () => {
  const [incomingMessages, setIncomingMessages] = useState<
    { phAir: string; suhuAir: string; dateTime: string }[]
  >([]);

  useEffect(() => {
    const loadMessagesFromLocalStorage = () => {
      const storedData = localStorage.getItem("messages");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (now - parsedData.timestamp < twentyFourHours) {
          setIncomingMessages(parsedData.messages);
        } else {
          localStorage.removeItem("messages");
        }
      }
    };

    loadMessagesFromLocalStorage();

    const subscription = pusherClient.subscribe("monitoring-channel");

    const handleMonitoringMessage = (data: any) => {
      setIncomingMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        const now = new Date().getTime();
        localStorage.setItem(
          "messages",
          JSON.stringify({ messages: updatedMessages, timestamp: now }),
        );
        return updatedMessages;
      });
    };

    pusherClient.bind("monitoring-message", handleMonitoringMessage);

    return () => {
      subscription.unbind("monitoring-message", handleMonitoringMessage);
      pusherClient.unsubscribe("monitoring-channel");
    };
  }, []);

  const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const data = {
    labels: incomingMessages.map((message) => formatTime(message.dateTime)),
    datasets: [
      {
        label: "pH Air",
        data: incomingMessages.map((message) =>
          parseFloat(message.phAir).toFixed(2),
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
      {
        label: "Suhu Air",
        data: incomingMessages.map((message) =>
          parseFloat(message.suhuAir).toFixed(2),
        ),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as "top", // Specify position as one of the acceptable string literals
      },
      title: {
        display: true,
        text: "Monitoring Data",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Value",
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default Messages;
