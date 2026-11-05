import { useState } from "react";
import "./App.css";

function calculateBill(subtotal, taxPercent, tipPercent, peopleCount) {
  const taxAmount = subtotal * (taxPercent / 100);
  const tipAmount = subtotal * (tipPercent / 100);
  const totalAmount = subtotal + taxAmount + tipAmount;
  const amountPerPerson = totalAmount / peopleCount;

  return {
    taxAmount,
    tipAmount,
    totalAmount,
    amountPerPerson,
  };
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

function App() {
  const [subtotal, setSubtotal] = useState("");
  const [taxPercent, setTaxPercent] = useState("");
  const [tipPercent, setTipPercent] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  function updateInput(setterFunction, newValue) {
    setterFunction(newValue);
    setError("");
    setResult(null);
  }

  function handleReset() {
    setSubtotal("");
    setTaxPercent("");
    setTipPercent("");
    setPeopleCount("");
    setError("");
    setResult(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setResult(null);

    const subtotalNumber = Number(subtotal);
    const taxNumber = Number(taxPercent);
    const tipNumber = Number(tipPercent);
    const peopleNumber = Number(peopleCount);

    if (
      subtotal === "" ||
      taxPercent === "" ||
      tipPercent === "" ||
      peopleCount === ""
    ) {
      setError("Please complete all the fields.");
      return;
    }

    if (
      Number.isNaN(subtotalNumber) ||
      Number.isNaN(taxNumber) ||
      Number.isNaN(tipNumber) ||
      Number.isNaN(peopleNumber)
    ) {
      setError("Please enter valid numbers.");
      return;
    }

    if (subtotalNumber <= 0) {
      setError("Bill subtotal must be greater than zero.");
      return;
    }

    if (taxNumber < 0 || tipNumber < 0) {
      setError("Tax and tip percentages cannot be negative.");
      return;
    }

    if (peopleNumber < 1 || !Number.isInteger(peopleNumber)) {
      setError("Number of people must be a whole number of at least 1.");
      return;
    }

    setError("");

    const calculatedResult = calculateBill(
      subtotalNumber,
      taxNumber,
      tipNumber,
      peopleNumber,
    );

    setResult(calculatedResult);
  }

  return (
    <main className="app-shell">
      <section className="planner-card">
        <h1>Group Dinner Bill Planner</h1>
        <p>Enter the bill details and split the total fairly.</p>

        <form className="bill-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="subtotal">Bill subtotal</label>
            <input
              id="subtotal"
              type="number"
              min="0"
              step="0.01"
              placeholder="Example: 2500"
              value={subtotal}
              onChange={(event) => updateInput(setSubtotal, event.target.value)}
            />
          </div>

          <div className="form-field">
            <label htmlFor="tax">Tax percentage</label>
            <input
              id="tax"
              type="number"
              min="0"
              step="0.01"
              placeholder="Example: 5"
              value={taxPercent}
              onChange={(event) =>
                updateInput(setTaxPercent, event.target.value)
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="tip">Tip percentage</label>
            <input
              id="tip"
              type="number"
              min="0"
              step="0.01"
              placeholder="Example: 10"
              value={tipPercent}
              onChange={(event) =>
                updateInput(setTipPercent, event.target.value)
              }
            />
          </div>

          <div className="form-field">
            <label htmlFor="people">Number of people</label>
            <input
              id="people"
              type="number"
              min="1"
              step="1"
              placeholder="Example: 4"
              value={peopleCount}
              onChange={(event) =>
                updateInput(setPeopleCount, event.target.value)
              }
            />
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <div className="button-row">
            <button type="submit">Calculate split</button>

            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        {result && (
          <section className="summary-card" aria-live="polite">
            <h2>Bill summary</h2>

            <p>
              <span>Tax amount</span>
              <strong>{formatCurrency(result.taxAmount)}</strong>
            </p>

            <p>
              <span>Tip amount</span>
              <strong>{formatCurrency(result.tipAmount)}</strong>
            </p>

            <p>
              <span>Final total</span>
              <strong>{formatCurrency(result.totalAmount)}</strong>
            </p>

            <p>
              <span>Each person pays</span>
              <strong>{formatCurrency(result.amountPerPerson)}</strong>
            </p>
          </section>
        )}
      </section>
    </main>
  );
}

export default App;
