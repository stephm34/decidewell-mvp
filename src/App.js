import React, { useState } from "react";

function App() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState('');
  const [values, setValues] = useState('');
  const [resources, setResources] = useState('');
  const [constraints, setConstraints] = useState('');
  const [nonNegos, setNonNegos] = useState('');
  const [decision, setDecision] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (goal && values && resources && constraints) {
      setStep(2);
    } else {
      alert('Please complete all required fields before proceeding.');
    }
  };

  const handleClear = () => {
    setGoal('');
    setValues('');
    setResources('');
    setConstraints('');
    setNonNegos('');
    setDecision('');
    setResult(null);
    setStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const prompt = `
You are a decision-making assistant. The user is trying to decide whether to move forward with a specific decision based on their overall goal, values, resources, constraints, and non-negotiables.

Analyze the decision based on the followin
