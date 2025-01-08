"use client";
import React, { useState, useEffect } from "react"; // Added useEffect import
import { ChevronDown, ChevronRight } from "lucide-react";

const ComparisonCalculator = () => {
  const [formData, setFormData] = useState({
    currentAge: 30,
    monthlyInvestment: 50000,
    expectedReturn: 12,
    withdrawalYear: 10,
    monthlyWithdrawal: 100000,
  });

  const [yearlyDetails, setYearlyDetails] = useState([]);
  const [expandedYears, setExpandedYears] = useState(new Set());
  const currentYear = new Date().getFullYear();

  const calculateDetails = () => {
    const {
      currentAge,
      monthlyInvestment,
      expectedReturn,
      withdrawalYear,
      monthlyWithdrawal,
    } = formData;

    const annualRate = expectedReturn / 100;
    const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;

    const details = [];
    let corpusWithWithdrawal = 0;
    let corpusWithoutWithdrawal = 0;
    const planningYears = 30;

    for (let year = 1; year <= planningYears; year++) {
      let yearlyData = {
        investment: 0,
        returnsWithWithdrawal: 0,
        returnsWithoutWithdrawal: 0,
        withdrawal: 0,
        monthlyData: [],
      };

      for (let month = 1; month <= 12; month++) {
        const monthStart = {
          withWithdrawal: corpusWithWithdrawal,
          withoutWithdrawal: corpusWithoutWithdrawal,
        };

        // Calculate returns
        const returnWithWithdrawal = corpusWithWithdrawal * monthlyRate;
        const returnWithoutWithdrawal = corpusWithoutWithdrawal * monthlyRate;

        // Add to yearly totals
        yearlyData.returnsWithWithdrawal += returnWithWithdrawal;
        yearlyData.returnsWithoutWithdrawal += returnWithoutWithdrawal;

        if (year < withdrawalYear) {
          yearlyData.investment += monthlyInvestment;
          corpusWithWithdrawal += returnWithWithdrawal + monthlyInvestment;
          corpusWithoutWithdrawal +=
            returnWithoutWithdrawal + monthlyInvestment;
          yearlyData.monthlyData.push({
            investment: monthlyInvestment,
            returnsWithWithdrawal: returnWithWithdrawal,
            returnsWithoutWithdrawal: returnWithoutWithdrawal,
            withdrawal: 0,
            endCorpusWithWithdrawal: corpusWithWithdrawal,
            endCorpusWithoutWithdrawal: corpusWithoutWithdrawal,
          });
        } else {
          yearlyData.investment += monthlyInvestment;
          yearlyData.withdrawal += monthlyWithdrawal;
          corpusWithWithdrawal = Math.max(
            0,
            corpusWithWithdrawal + returnWithWithdrawal - monthlyWithdrawal
          );
          corpusWithoutWithdrawal +=
            returnWithoutWithdrawal + monthlyInvestment;
          yearlyData.monthlyData.push({
            investment: monthlyInvestment,
            returnsWithWithdrawal: returnWithWithdrawal,
            returnsWithoutWithdrawal: returnWithoutWithdrawal,
            withdrawal: monthlyWithdrawal,
            endCorpusWithWithdrawal: corpusWithWithdrawal,
            endCorpusWithoutWithdrawal: corpusWithoutWithdrawal,
          });
        }
      }

      details.push({
        year,
        age: currentAge + year - 1,
        calendarYear: currentYear + year - 1,
        yearlyInvestment: yearlyData.investment,
        yearlyReturnsWithWithdrawal: Math.round(
          yearlyData.returnsWithWithdrawal
        ),
        yearlyReturnsWithoutWithdrawal: Math.round(
          yearlyData.returnsWithoutWithdrawal
        ),
        yearlyWithdrawal: yearlyData.withdrawal,
        endCorpusWithWithdrawal: Math.round(corpusWithWithdrawal),
        endCorpusWithoutWithdrawal: Math.round(corpusWithoutWithdrawal),
        isWithdrawalPhase: year >= withdrawalYear,
        monthlyData: yearlyData.monthlyData,
      });
    }

    setYearlyDetails(details);
  };

  useEffect(() => {
    calculateDetails();
  }, [formData]);

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${Math.round(value).toLocaleString("en-IN")}`;
  };

  const toggleYearExpansion = (year) => {
    setExpandedYears((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(year)) {
        newSet.delete(year);
      } else {
        newSet.add(year);
      }
      return newSet;
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
      {/* Input fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Age
          </label>
          <input
            type="number"
            value={formData.currentAge}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                currentAge: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Investment
          </label>
          <input
            type="number"
            value={formData.monthlyInvestment}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                monthlyInvestment: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            value={formData.expectedReturn}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                expectedReturn: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Withdrawal in Year
          </label>
          <input
            type="number"
            value={formData.withdrawalYear}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                withdrawalYear: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Withdrawal
          </label>
          <input
            type="number"
            value={formData.monthlyWithdrawal}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                monthlyWithdrawal: parseFloat(e.target.value) || 0,
              }))
            }
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>

      {/* Table with expandable rows */}
      <div className="relative overflow-x-auto shadow-md rounded-lg">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-left bg-white">Age</th>
                <th className="px-4 py-2 text-left bg-white">Year</th>
                <th className="px-4 py-2 text-right bg-white">Investment</th>
                <th
                  colSpan={3}
                  className="text-center bg-blue-50 border-l border-r"
                >
                  With Withdrawal
                </th>
                <th colSpan={2} className="text-center bg-green-50">
                  Without Withdrawal
                </th>
                <th className="px-4 py-2 text-right bg-white">Difference</th>
              </tr>
              <tr className="bg-gray-50 border-t border-gray-200">
                <th className="px-4 py-2 text-left bg-white"></th>
                <th className="px-4 py-2 text-left bg-white"></th>
                <th className="px-4 py-2 text-right bg-white"></th>
                <th className="px-4 py-2 text-right bg-blue-50">Returns</th>
                <th className="px-4 py-2 text-right bg-blue-50">Withdrawal</th>
                <th className="px-4 py-2 text-right bg-blue-50">Corpus</th>
                <th className="px-4 py-2 text-right bg-green-50">Returns</th>
                <th className="px-4 py-2 text-right bg-green-50">Corpus</th>
                <th className="px-4 py-2 text-right bg-white"></th>
              </tr>
            </thead>
            <tbody>
              {yearlyDetails.map((yearData) => (
                <ExpandableRow
                  key={yearData.year}
                  yearData={yearData}
                  isExpanded={expandedYears.has(yearData.year)}
                  onToggle={() => toggleYearExpansion(yearData.year)}
                  formatCurrency={formatCurrency}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ExpandableRow = ({ yearData, isExpanded, onToggle, formatCurrency }) => {
  return (
    <>
      <tr
        className={`border-t ${
          yearData.isWithdrawalPhase ? "bg-gray-50" : ""
        } cursor-pointer hover:bg-gray-100`}
        onClick={onToggle}
      >
        <td className="px-4 py-2 flex items-center">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 mr-2" />
          ) : (
            <ChevronRight className="w-4 h-4 mr-2" />
          )}
          {yearData.age}
        </td>
        <td className="px-4 py-2">{yearData.calendarYear}</td>
        <td className="px-4 py-2 text-right">
          {formatCurrency(yearData.yearlyInvestment)}
        </td>
        <td className="px-4 py-2 text-right bg-blue-50">
          {formatCurrency(yearData.yearlyReturnsWithWithdrawal)}
        </td>
        <td className="px-4 py-2 text-right bg-blue-50 text-red-600">
          {formatCurrency(yearData.yearlyWithdrawal)}
        </td>
        <td className="px-4 py-2 text-right bg-blue-50 font-medium">
          {formatCurrency(yearData.endCorpusWithWithdrawal)}
        </td>
        <td className="px-4 py-2 text-right bg-green-50">
          {formatCurrency(yearData.yearlyReturnsWithoutWithdrawal)}
        </td>
        <td className="px-4 py-2 text-right bg-green-50 font-medium">
          {formatCurrency(yearData.endCorpusWithoutWithdrawal)}
        </td>
        <td className="px-4 py-2 text-right font-semibold">
          {formatCurrency(
            yearData.endCorpusWithoutWithdrawal -
              yearData.endCorpusWithWithdrawal
          )}
        </td>
      </tr>
      {isExpanded &&
        yearData.monthlyData.map((month, idx) => (
          <tr
            key={`${yearData.year}-${idx + 1}`}
            className="text-sm bg-gray-50"
          >
            <td className="px-4 py-1 pl-10" colSpan={2}>
              Month {idx + 1}
            </td>
            <td className="px-4 py-1 text-right">
              {formatCurrency(month.investment)}
            </td>
            <td className="px-4 py-1 text-right bg-blue-50/50">
              {formatCurrency(month.returnsWithWithdrawal)}
            </td>
            <td className="px-4 py-1 text-right bg-blue-50/50 text-red-600">
              {formatCurrency(month.withdrawal)}
            </td>
            <td className="px-4 py-1 text-right bg-blue-50/50">
              {formatCurrency(month.endCorpusWithWithdrawal)}
            </td>
            <td className="px-4 py-1 text-right bg-green-50/50">
              {formatCurrency(month.returnsWithoutWithdrawal)}
            </td>
            <td className="px-4 py-1 text-right bg-green-50/50">
              {formatCurrency(month.endCorpusWithoutWithdrawal)}
            </td>
            <td className="px-4 py-1 text-right">
              {formatCurrency(
                month.endCorpusWithoutWithdrawal - month.endCorpusWithWithdrawal
              )}
            </td>
          </tr>
        ))}
    </>
  );
};

export default ComparisonCalculator;
