import React, { useState } from "react";

function App() {
  const [step, setStep] = useState(1);
  const [decision, setDecision] = useState('');
  const [goal, setGoal] = useState('');
  const [values, setValues] = useState('');
  const [resources, setResources] = useState('');
  const [constraints, setConstraints] = useState('');
  const [nonNegos, setNonNegos] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    if (decision && goal && values && resources && constraints) {
      setStep(2);
    } else {
      alert('Please complete all required fields before proceeding.');
    }
  };

  const handleClear = () => {
    setDecision('');
    setGoal('');
    setValues('');
    setResources('');
    setConstraints('');
    setNonNegos('');
    setResult(null);
    setStep(1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const prompt = `
You are a decision-making assistant. The user is trying to decide whether to move forward with a specific decision based on their overall goal, values, resources, constraints, and non-negotiables.

Analyze the decision based on the following:
- Does the decision align with the user's goal?
- Does it respect their time/resource constraints?
- Does it align with their values?
- Are the necessary resources present?
- Are there any non-negotiables being violated?

Here is the context:
Decision: ${decision}
Goal: ${goal}
Values: ${values}
Resources: ${resources}
Constraints: ${constraints}
Non-Negotiables: ${nonNegos}

Return a clear answer using this structure:
Final Decision: [Yes / No / Proceed with caution]
Alignment Score: [0–100]% match with goal

Reasoning:
- Goal Fit: [Explanation]
- Resources: [Analysis]
- Constraints/Timeline: [Check]
- Values Alignment: [Yes/No + why]
- Non-Negotiables: [Any red flags?]

Checklist to move forward (or make it viable):
- [1]
- [2]
- [3]
`;

    try {
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>DecideWell Tool</h1>
      {step === 1 && (
        <>
          <textarea placeholder="What decision are you trying to make?" value={decision} onChange={(e) => setDecision(e.target.value)} /><br />
          <textarea placeholder="What goal(s) are you trying to achieve independent of this decision?" value={goal} onChange={(e) => setGoal(e.target.value)} /><br />
          <textarea placeholder="What are your 3-5 core values?" value={values} onChange={(e) => setValues(e.target.value)} /><br />
          <textarea placeholder="What resources do you have available to help you?" value={resources} onChange={(e) => setResources(e.target.value)} /><br />
          <textarea placeholder="What constraints are holding you back from moving forward with this decision?" value={constraints} onChange={(e) => setConstraints(e.target.value)} /><br />
          <textarea placeholder="What are your non-negotiables or deadlines that may impact this decision?" value={nonNegos} onChange={(e) => setNonNegos(e.target.value)} /><br />
          <button onClick={handleSave}>Save My Answers</button>
          <button onClick={handleClear}>Clear</button>
        </>
      )}
      {step === 2 && (
        <>
          <p>All context saved. Ready to analyze your decision:</p>
          <button onClick={handleSubmit}>Help Me Decide</button>
        </>
      )}
      {loading && <p>Analyzing your decision...</p>}
      {result && <pre>{result}</pre>}
    </div>
  );
}

export default App;
