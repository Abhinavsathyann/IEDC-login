import React, { useState } from "react";
import { Button } from "@/components/ui/button";

const ApiTest = () => {
  const [pingResult, setPingResult] = useState<string>("");
  const [loginResult, setLoginResult] = useState<string>("");
  const [eventsResult, setEventsResult] = useState<string>("");

  const testPing = async () => {
    try {
      const response = await fetch("/api/ping");
      const data = await response.json();
      setPingResult(`Success: ${JSON.stringify(data)}`);
    } catch (error) {
      setPingResult(`Error: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "admin@kptciedc.edu",
          password: "admin123",
          userType: "admin",
        }),
      });

      const responseText = await response.text();
      setLoginResult(`Status: ${response.status}, Body: ${responseText}`);
    } catch (error) {
      setLoginResult(`Error: ${error}`);
    }
  };

  const testEvents = async () => {
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEventsResult(`Success: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      setEventsResult(`Error: ${error}`);
    }
  };

  return (
    <div className="p-4 bg-white border rounded-lg space-y-4">
      <h3 className="font-bold">API Test</h3>

      <div>
        <Button onClick={testPing} size="sm">
          Test Ping
        </Button>
        <p className="text-sm mt-2">Ping: {pingResult}</p>
      </div>

      <div>
        <Button onClick={testLogin} size="sm">
          Test Login
        </Button>
        <p className="text-sm mt-2">Login: {loginResult}</p>
      </div>

      <div>
        <Button onClick={testEvents} size="sm">
          Test Events
        </Button>
        <p className="text-sm mt-2 max-h-32 overflow-auto">
          Events: {eventsResult}
        </p>
      </div>
    </div>
  );
};

export default ApiTest;
