import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Plus, DollarSign, Trash2, RefreshCw, Edit, Save } from "lucide-react";

const PokerPaymentCalculator = () => {
  const [players, setPlayers] = useState([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newPlayerBuyIn, setNewPlayerBuyIn] = useState("");
  const [settlements, setSettlements] = useState([]);
  const [additionalBuyIns, setAdditionalBuyIns] = useState({});
  const [finalBalances, setFinalBalances] = useState({});
  const [mismatchAmount, setMismatchAmount] = useState(0);
  const [auditHistory, setAuditHistory] = useState([]);
  const [editMode, setEditMode] = useState({});
  const [currency, setCurrency] = useState("₹");

  useEffect(() => {
    const savedData = localStorage.getItem("pokerGameData");
    if (savedData) {
      const { players, settlements, mismatchAmount, auditHistory } =
        JSON.parse(savedData);
      setPlayers(players);
      setSettlements(settlements);
      setMismatchAmount(mismatchAmount);
      setAuditHistory(auditHistory || []);
    }
  }, []);

  useEffect(() => {
    const dataToSave = { players, settlements, mismatchAmount, auditHistory };
    localStorage.setItem("pokerGameData", JSON.stringify(dataToSave));
  }, [players, settlements, mismatchAmount, auditHistory]);

  const addPlayer = () => {
    if (newPlayerName && newPlayerBuyIn) {
      setPlayers([
        ...players,
        {
          name: newPlayerName,
          initialBuyIn: parseFloat(newPlayerBuyIn),
          additionalBuyIns: [],
          finalBalance: null,
        },
      ]);
      setNewPlayerName("");
      setNewPlayerBuyIn("");
      addToAuditHistory(
        `Added player ${newPlayerName} with initial buy-in of ${currency}${newPlayerBuyIn}`
      );
    }
  };

  const addBuyIn = (index) => {
    const amount = additionalBuyIns[index];
    if (amount && !isNaN(parseFloat(amount))) {
      const updatedPlayers = [...players];
      updatedPlayers[index].additionalBuyIns.push({
        amount: parseFloat(amount),
        timestamp: new Date().toLocaleString(),
      });
      setPlayers(updatedPlayers);
      setAdditionalBuyIns({ ...additionalBuyIns, [index]: "" });
      addToAuditHistory(
        `Player ${players[index].name} added an additional buy-in of ${currency}${amount}`
      );
    }
  };

  const startEditBuyIn = (playerIndex, buyInIndex) => {
    setEditMode({ playerIndex, buyInIndex });
    const buyIn = players[playerIndex].additionalBuyIns[buyInIndex];
    setAdditionalBuyIns({
      ...additionalBuyIns,
      [`${playerIndex}-${buyInIndex}`]: buyIn.amount,
    });
  };

  const saveEditBuyIn = (playerIndex, buyInIndex) => {
    const amount = additionalBuyIns[`${playerIndex}-${buyInIndex}`];
    if (amount && !isNaN(parseFloat(amount))) {
      const updatedPlayers = [...players];
      updatedPlayers[playerIndex].additionalBuyIns[buyInIndex].amount =
        parseFloat(amount);
      setPlayers(updatedPlayers);
      setEditMode({});
      addToAuditHistory(
        `Player ${players[playerIndex].name} edited buy-in #${
          buyInIndex + 1
        } to ${currency}${amount}`
      );
    }
  };

  const setFinalBalance = (index) => {
    const amount = finalBalances[index];
    if (amount && !isNaN(parseFloat(amount))) {
      const updatedPlayers = [...players];
      updatedPlayers[index].finalBalance = parseFloat(amount);
      setPlayers(updatedPlayers);
      setFinalBalances({ ...finalBalances, [index]: "" });
      addToAuditHistory(
        `Player ${players[index].name} set final balance to ${currency}${amount}`
      );
    }
  };

  const removePlayer = (index) => {
    const updatedPlayers = players.filter((_, i) => i !== index);
    addToAuditHistory(`Removed player ${players[index].name}`);
    setPlayers(updatedPlayers);
  };

  const calculateSettlements = () => {
    const totalBuyIn = players.reduce(
      (sum, player) =>
        sum +
        player.initialBuyIn +
        player.additionalBuyIns.reduce((a, b) => a + b.amount, 0),
      0
    );

    const totalFinalBalance = players.reduce(
      (sum, player) => sum + (player.finalBalance || 0),
      0
    );

    const mismatch = totalFinalBalance - totalBuyIn;
    setMismatchAmount(mismatch);

    const netAmounts = players.map((player) => ({
      name: player.name,
      net:
        (player.finalBalance || 0) -
        (player.initialBuyIn +
          player.additionalBuyIns.reduce((a, b) => a + b.amount, 0)),
    }));

    const newSettlements = [];
    const debtors = netAmounts
      .filter((p) => p.net < 0)
      .sort((a, b) => a.net - b.net);
    const creditors = netAmounts
      .filter((p) => p.net > 0)
      .sort((a, b) => b.net - a.net);

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
      const amount = Math.min(
        -debtors[debtorIndex].net,
        creditors[creditorIndex].net
      );
      newSettlements.push({
        from: debtors[debtorIndex].name,
        to: creditors[creditorIndex].name,
        amount: amount.toFixed(2),
      });

      debtors[debtorIndex].net += amount;
      creditors[creditorIndex].net -= amount;

      if (Math.abs(debtors[debtorIndex].net) < 0.01) debtorIndex++;
      if (Math.abs(creditors[creditorIndex].net) < 0.01) creditorIndex++;
    }

    setSettlements(newSettlements);
    addToAuditHistory("Calculated settlements");
  };

  const resetGame = () => {
    setPlayers([]);
    setSettlements([]);
    setAdditionalBuyIns({});
    setFinalBalances({});
    setMismatchAmount(0);
    setAuditHistory([]);
    localStorage.removeItem("pokerGameData");
    addToAuditHistory("Reset the game");
  };

  const addToAuditHistory = (message) => {
    setAuditHistory((prevHistory) => [
      ...prevHistory,
      { message, timestamp: new Date().toLocaleString() },
    ]);
  };

  const totalMatchValue = players.reduce(
    (sum, player) =>
      sum +
      player.initialBuyIn +
      player.additionalBuyIns.reduce((a, b) => a + b.amount, 0),
    0
  );

  return (
    <>
      <Head>
        <title>Poker Payment Calculator</title>
      </Head>
      <div className="container mx-auto p-4">
        <div className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">
            Total Match Value: {currency}
            {totalMatchValue.toFixed(2)}
          </h2>
          <select
            className="border p-2 rounded"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="₹">Rupee (₹)</option>
            <option value="$">Dollar ($)</option>
          </select>
        </div>

        <div className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Add New Player</h2>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <input
              className="border p-2 rounded"
              placeholder="Player Name"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Initial Buy-In"
              value={newPlayerBuyIn}
              onChange={(e) => setNewPlayerBuyIn(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white p-2 rounded"
              onClick={addPlayer}
            >
              <Plus className="inline mr-2" /> Add Player
            </button>
          </div>
        </div>

        {players.map((player, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{player.name}</h2>
              <button
                className="bg-red-500 text-white p-2 rounded"
                onClick={() => removePlayer(index)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <p>
              Initial Buy-In: {currency}
              {player.initialBuyIn}
            </p>
            <p>
              Additional Buy-Ins: {currency}
              {player.additionalBuyIns.reduce((a, b) => a + b.amount, 0)}
            </p>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-2">
              <input
                className="border p-2 rounded"
                type="number"
                placeholder="Additional Buy-In"
                value={additionalBuyIns[index] || ""}
                onChange={(e) =>
                  setAdditionalBuyIns({
                    ...additionalBuyIns,
                    [index]: e.target.value,
                  })
                }
              />
              <button
                className="bg-green-500 text-white p-2 rounded"
                onClick={() => addBuyIn(index)}
              >
                Add Buy-In
              </button>
            </div>
            <div className="mt-2">
              <h3 className="text-lg font-semibold">
                Additional Buy-In History
              </h3>
              {player.additionalBuyIns.length > 0 ? (
                <ul className="list-disc list-inside">
                  {player.additionalBuyIns.map((buyIn, buyInIndex) => (
                    <li
                      key={buyInIndex}
                      className="flex justify-between items-center"
                    >
                      {editMode.playerIndex === index &&
                      editMode.buyInIndex === buyInIndex ? (
                        <>
                          <input
                            className="border p-1 rounded w-20"
                            type="number"
                            value={
                              additionalBuyIns[`${index}-${buyInIndex}`] ||
                              buyIn.amount
                            }
                            onChange={(e) =>
                              setAdditionalBuyIns({
                                ...additionalBuyIns,
                                [`${index}-${buyInIndex}`]: e.target.value,
                              })
                            }
                          />
                          <button
                            className="bg-blue-500 text-white p-2 rounded"
                            onClick={() => saveEditBuyIn(index, buyInIndex)}
                          >
                            <Save className="inline mr-2" /> Save
                          </button>
                        </>
                      ) : (
                        <>
                          <span>
                            {currency}
                            {buyIn.amount} at {buyIn.timestamp}
                          </span>
                          <button
                            className="bg-yellow-500 text-white p-2 rounded"
                            onClick={() => startEditBuyIn(index, buyInIndex)}
                          >
                            <Edit className="inline mr-2" /> Edit
                          </button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No additional buy-ins yet.</p>
              )}
            </div>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-2">
              <input
                className="border p-2 rounded"
                type="number"
                placeholder="Final Balance"
                value={finalBalances[index] || ""}
                onChange={(e) =>
                  setFinalBalances({
                    ...finalBalances,
                    [index]: e.target.value,
                  })
                }
              />
              <button
                className="bg-purple-500 text-white p-2 rounded"
                onClick={() => setFinalBalance(index)}
              >
                Set Final Balance
              </button>
            </div>
            {player.finalBalance !== null && (
              <p className="mt-2 font-semibold">
                Final Balance: {currency}
                {player.finalBalance}
              </p>
            )}
          </div>
        ))}

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={calculateSettlements}
          >
            <DollarSign className="inline mr-2" /> Calculate Settlements
          </button>
          <button
            className="bg-red-500 text-white p-2 rounded"
            onClick={resetGame}
          >
            <RefreshCw className="inline mr-2" /> Reset Game
          </button>
        </div>

        {mismatchAmount !== 0 && (
          <div
            className={`p-2 mb-4 rounded ${
              mismatchAmount > 0 ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <p>
              Mismatch Amount: {currency}
              {mismatchAmount.toFixed(2)}{" "}
              {mismatchAmount > 0 ? "(Excess)" : "(Shortage)"}
            </p>
          </div>
        )}

        {settlements.length > 0 && (
          <div className="border rounded p-4">
            <h2 className="text-xl font-semibold mb-2">Settlements</h2>
            {settlements.map((settlement, index) => (
              <div key={index} className="bg-gray-100 p-2 mb-2 rounded">
                <p className="font-semibold">
                  {settlement.from} pays {settlement.to}
                </p>
                <p>
                  {currency}
                  {settlement.amount}
                </p>
              </div>
            ))}
          </div>
        )}

        {auditHistory.length > 0 && (
          <div className="border rounded p-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">Audit History</h2>
            <ul className="list-disc list-inside">
              {auditHistory.map((entry, index) => (
                <li key={index}>
                  {entry.timestamp}: {entry.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default PokerPaymentCalculator;
