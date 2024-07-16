import React, { useState, useCallback, useEffect } from 'react';
import { ShoppingCart, Truck, ArrowLeftCircle, ArrowRightCircle, RotateCcw, Info } from 'lucide-react';

const ShoppingCartTwoPointers = () => {
  const [cartTotal, setCartTotal] = useState(80);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(100);
  const [leftPointer, setLeftPointer] = useState(-1);
  const [rightPointer, setRightPointer] = useState(-1);
  const [bestPairs, setBestPairs] = useState([]);
  const [closestPair, setClosestPair] = useState(null);
  const [currentPair, setCurrentPair] = useState(null);
  const [currentSum, setCurrentSum] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);
  const [suggestionsHistory, setSuggestionsHistory] = useState([]);
  const [currentListIndex, setCurrentListIndex] = useState(0);

  const productLists = [
    [
      { name: "Lipstick", price: 15 },
      { name: "Mascara", price: 12 },
      { name: "Foundation", price: 30 },
      { name: "Eyeshadow Palette", price: 25 },
      { name: "Blush", price: 18 },
      { name: "Eyeliner", price: 10 },
      { name: "Concealer", price: 20 },
      { name: "Makeup Brushes", price: 35 },
      { name: "Setting Powder", price: 22 },
      { name: "Highlighter", price: 28 }
    ],
    [
      { name: "Diapers", price: 25 },
      { name: "Baby Wipes", price: 5 },
      { name: "Baby Formula", price: 30 },
      { name: "Baby Bottle", price: 12 },
      { name: "Onesie", price: 15 },
      { name: "Baby Monitor", price: 50 },
      { name: "Pacifier", price: 8 },
      { name: "Baby Lotion", price: 10 },
      { name: "Teething Toy", price: 7 },
      { name: "Baby Shampoo", price: 9 }
    ],
    [
      { name: "Socks", price: 5 },
      { name: "Gloves", price: 8 },
      { name: "Hat", price: 10 },
      { name: "Scarf", price: 12 },
      { name: "Belt", price: 14 },
      { name: "T-shirt", price: 15 },
      { name: "Sunglasses", price: 18 },
      { name: "Jeans", price: 20 },
      { name: "Shoes", price: 25 },
      { name: "Jacket", price: 30 }
    ]
  ];

  const products = productLists[currentListIndex];

  const targetSum = freeShippingThreshold - cartTotal;

  const updateCurrentPairAndSum = useCallback(() => {
    if (leftPointer !== -1 && rightPointer !== -1 && leftPointer < rightPointer) {
      const newPair = [products[leftPointer], products[rightPointer]];
      setCurrentPair(newPair);
      setCurrentSum(newPair[0].price + newPair[1].price);
    } else {
      setCurrentPair(null);
      setCurrentSum(0);
    }
  }, [leftPointer, rightPointer, products]);

  useEffect(() => {
    updateCurrentPairAndSum();
  }, [leftPointer, rightPointer, updateCurrentPairAndSum]);

  const updateClosestPair = useCallback((left, right) => {
    const sum = products[left].price + products[right].price;
    if (!closestPair || Math.abs(sum - targetSum) < Math.abs(closestPair.sum - targetSum)) {
      const newClosestPair = { pair: [products[left], products[right]], sum };
      setClosestPair(newClosestPair);
      setSuggestionsHistory(prev => [...prev, { type: 'closest', ...newClosestPair }]);
    }
  }, [products, targetSum, closestPair]);

  const processStep = useCallback(() => {
    if (leftPointer === -1 && rightPointer === -1) {
      setLeftPointer(0);
      setRightPointer(products.length - 1);
      updateClosestPair(0, products.length - 1);
      return;
    }

    if (leftPointer >= rightPointer) {
      setFinished(true);
      return;
    }

    const sum = products[leftPointer].price + products[rightPointer].price;

    let action = '';
    let newLeftPointer = leftPointer;
    let newRightPointer = rightPointer;

    if (sum === targetSum) {
      const newPair = [products[leftPointer], products[rightPointer]];
      setBestPairs(prev => [...prev, newPair]);
      setSuggestionsHistory(prev => [...prev, { type: 'exact', pair: newPair, sum }]);
      action = 'Found a best pair';
      newLeftPointer = leftPointer + 1;
      newRightPointer = rightPointer - 1;
    } else if (sum < targetSum) {
      action = 'Moved left pointer';
      newLeftPointer = leftPointer + 1;
    } else {
      action = 'Moved right pointer';
      newRightPointer = rightPointer - 1;
    }

    updateClosestPair(leftPointer, rightPointer);

    setHistory(prev => [...prev, { 
      leftPointer,
      rightPointer,
      left: products[leftPointer].name,
      right: products[rightPointer].name,
      leftPrice: products[leftPointer].price,
      rightPrice: products[rightPointer].price,
      sum,
      action,
      bestPairs: [...bestPairs],
      closestPair: closestPair
    }]);

    setLeftPointer(newLeftPointer);
    setRightPointer(newRightPointer);

  }, [leftPointer, rightPointer, bestPairs, products, targetSum, updateClosestPair, closestPair]);

  const undoStep = () => {
    if (history.length > 0) {
      const previousState = history[history.length - 1];
      setLeftPointer(previousState.leftPointer);
      setRightPointer(previousState.rightPointer);
      setBestPairs(previousState.bestPairs);
      setClosestPair(previousState.closestPair);
      setHistory(prev => prev.slice(0, -1));
      setSuggestionsHistory(prev => prev.slice(0, -1));
      setFinished(false);
    } else {
      resetSimulation();
    }
  };

  const resetSimulation = () => {
    setLeftPointer(-1);
    setRightPointer(-1);
    setBestPairs([]);
    setClosestPair(null);
    setCurrentPair(null);
    setCurrentSum(0);
    setFinished(false);
    setHistory([]);
    setSuggestionsHistory([]);
  };

  const switchProductList = () => {
    setCurrentListIndex((prevIndex) => (prevIndex + 1) % productLists.length);
    resetSimulation();
  };

  const rules = [
    "If the sum is equal to the target, we've found a best pair. Move both pointers inward.",
    "If the sum is less than the target, move the left pointer to the right to increase the sum.",
    "If the sum is greater than the target, move the right pointer to the left to decrease the sum.",
    "The algorithm stops when the pointers meet or cross each other.",
    "If no exact match is found, the closest pair to the target sum is suggested."
  ];

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <ShoppingCart className="mr-2" /> Shopping Cart Two Pointers Algorithm
      </h2>
      <div className="mb-4">
        <p>Cart Total: ${cartTotal}</p>
        <p>Free Shipping Threshold: ${freeShippingThreshold}</p>
        <p>Amount Needed for Free Shipping: ${targetSum}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold flex items-center">
          <Info className="mr-2" /> Algorithm Rules:
        </h3>
        <ul className="list-disc list-inside">
          {rules.map((rule, index) => (
            <li key={index} className="text-sm">{rule}</li>
          ))}
        </ul>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Available Products:</h3>
        <div className="grid grid-cols-2 gap-2">
          {products.map((product, index) => (
            <div
              key={index}
              className={`p-2 border rounded ${
                index === leftPointer ? 'bg-blue-100 border-blue-500' :
                index === rightPointer ? 'bg-green-100 border-green-500' : ''
              }`}
            >
              {product.name} - ${product.price}
              {index === leftPointer && <ArrowRightCircle className="inline ml-2 text-blue-500" />}
              {index === rightPointer && <ArrowLeftCircle className="inline ml-2 text-green-500" />}
            </div>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Current Pair:</h3>
        {currentPair ? (
          <p>{currentPair[0].name} (${currentPair[0].price}) and {currentPair[1].name} (${currentPair[1].price})</p>
        ) : (
          <p>Not started or finished</p>
        )}
        <p>Current Sum: ${currentSum}</p>
        <p>Target Sum: ${targetSum}</p>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Best Suggestions History:</h3>
        <div className="max-h-40 overflow-y-auto">
          {suggestionsHistory.map((suggestion, index) => (
            <div key={index} className="text-sm">
              {suggestion.type === 'exact' ? (
                <p>Exact match: {suggestion.pair[0].name} (${suggestion.pair[0].price}) and {suggestion.pair[1].name} (${suggestion.pair[1].price})</p>
              ) : (
                <p>Closest pair: {suggestion.pair[0].name} (${suggestion.pair[0].price}) and {suggestion.pair[1].name} (${suggestion.pair[1].price}), Sum: ${suggestion.sum} (${suggestion.sum < targetSum ? 'under' : 'over'} by ${Math.abs(suggestion.sum - targetSum)})</p>
              )}
            </div>
          ))}
        </div>
      </div>
      {finished && (
        <div className="mb-4 font-bold text-green-600">
          Search completed! {bestPairs.length > 0 ? "Best pairs found." : "No exact matches found."}
        </div>
      )}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={undoStep}
          disabled={history.length === 0}
          className="px-4 py-2 bg-yellow-500 text-white rounded disabled:bg-gray-300"
        >
          Undo
        </button>
        <button
          onClick={processStep}
          disabled={finished}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          {leftPointer === -1 && rightPointer === -1 ? 'Start' : 'Next'}
        </button>
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-red-500 text-white rounded flex items-center"
        >
          <RotateCcw className="mr-2" /> Reset
        </button>
        <button
          onClick={switchProductList}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Switch List
        </button>
      </div>
      <div className="mb-4">
        <h3 className="font-bold">Algorithm Steps History:</h3>
        <div className="max-h-40 overflow-y-auto">
          {history.map((entry, index) => (
            <div key={index} className="text-sm">
              Step {index + 1}: {entry.left} (${entry.leftPrice}) - {entry.right} (${entry.rightPrice}), Sum: ${entry.sum}, Action: {entry.action}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center text-green-600">
        <Truck className="mr-2" />
        {cartTotal >= freeShippingThreshold ? "You qualify for free shipping!" : "Add more items for free shipping!"}
      </div>
    </div>
  );
};

export default ShoppingCartTwoPointers;