'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const EquityCalculator = () => {
  const [numUsers, setNumUsers] = useState(100);
  const [revenuePerUser, setRevenuePerUser] = useState(1000);
  const [valuationMultiple, setValuationMultiple] = useState(10);
  const [successProbability, setSuccessProbability] = useState(50);
  const [monthsOfDev, setMonthsOfDev] = useState(5);
  const [apiCostMonthly, setApiCostMonthly] = useState(25);
  
  const [equityData, setEquityData] = useState([
    { name: 'Developer (Daniel)', value: 35, color: '#4F46E5' },
    { name: 'Investment Group', value: 35, color: '#10B981' },
    { name: 'Designer (Isaac)', value: 5, color: '#F59E0B' },
    { name: 'Reserved', value: 25, color: '#6B7280' }
  ]);

  // Calculate dev pay based on equity percentage
  const calculateDevPay = (equity: number) => {
    const maxPay = 12000; // Monthly pay at 0% equity
    const standardPay = 4000; // Monthly pay at 35% equity
    const standardEquity = 35;
    
    if (equity >= 100) return 0;
    if (equity === 0) return maxPay;
    if (equity === standardEquity) return standardPay;
    
    // Linear interpolation between points
    if (equity < standardEquity) {
      return maxPay - (equity * (maxPay - standardPay) / standardEquity);
    } else {
      return standardPay * (1 - ((equity - standardEquity) / (100 - standardEquity)));
    }
  };

  const devPayMonthly = calculateDevPay(equityData[0].value);
  const annualRevenue = numUsers * revenuePerUser;
  const baseValuation = annualRevenue * valuationMultiple;
  const riskAdjustedValuation = baseValuation * (successProbability / 100);
  
  const totalDevCost = devPayMonthly * monthsOfDev;
  const totalApiCost = apiCostMonthly * monthsOfDev;
  const totalInvestmentCost = totalDevCost + totalApiCost;
  
  const investmentGroupEquity = equityData[1].value;
  const investmentGroupValue = riskAdjustedValuation * (investmentGroupEquity / 100);
  const investmentMultiple = investmentGroupValue / totalInvestmentCost;
  const perInvestorEquity = investmentGroupEquity / 3;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const handleEquityChange = (index: number, newValue: number) => {
    const newEquityData = [...equityData];
    const oldValue = newEquityData[index].value;
    const difference = newValue - oldValue;
    
    if (difference > 0) {
      const reservedIndex = newEquityData.findIndex(item => item.name === 'Reserved');
      if (reservedIndex !== -1 && newEquityData[reservedIndex].value >= difference) {
        newEquityData[index].value = newValue;
        newEquityData[reservedIndex].value -= difference;
        setEquityData(newEquityData);
      }
    } else if (difference < 0) {
      const reservedIndex = newEquityData.findIndex(item => item.name === 'Reserved');
      newEquityData[index].value = newValue;
      newEquityData[reservedIndex].value -= difference;
      setEquityData(newEquityData);
    }
  };

  return (
    <div className="w-full max-w-4xl p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenue & Valuation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Revenue & Valuation controls - same as before */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label>Number of Users: {numUsers}</label>
              <span>{formatCurrency(annualRevenue)} annual revenue</span>
            </div>
            <Slider 
              value={[numUsers]}
              min={10}
              max={1000}
              step={10}
              onValueChange={([value]) => setNumUsers(value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label>Revenue per User: {formatCurrency(revenuePerUser)}</label>
              <span>Valuation Multiple: {valuationMultiple}x</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Slider 
                value={[revenuePerUser]}
                min={100}
                max={2000}
                step={100}
                onValueChange={([value]) => setRevenuePerUser(value)}
              />
              <Slider 
                value={[valuationMultiple]}
                min={5}
                max={15}
                step={1}
                onValueChange={([value]) => setValuationMultiple(value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label>Success Probability: {formatPercent(successProbability)}</label>
            </div>
            <Slider 
              value={[successProbability]}
              min={10}
              max={100}
              step={5}
              onValueChange={([value]) => setSuccessProbability(value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-lg font-semibold p-3 rounded bg-gray-100">
              <div className="text-sm font-normal text-gray-600 mb-1">Base Valuation</div>
              {formatCurrency(baseValuation)}
            </div>
            <div className="text-lg font-semibold p-3 rounded bg-blue-100">
              <div className="text-sm font-normal text-gray-600 mb-1">Risk-Adjusted Valuation</div>
              {formatCurrency(riskAdjustedValuation)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Costs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label>Development Period: {monthsOfDev} months</label>
              <span>Monthly Dev Pay: {formatCurrency(devPayMonthly)}</span>
            </div>
            <Slider 
              value={[monthsOfDev]}
              min={3}
              max={12}
              step={1}
              onValueChange={([value]) => setMonthsOfDev(value)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label>Monthly API Cost: {formatCurrency(apiCostMonthly)}</label>
            </div>
            <Slider 
              value={[apiCostMonthly]}
              min={25}
              max={75}
              step={25}
              onValueChange={([value]) => setApiCostMonthly(value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 rounded bg-gray-100">
              <div className="text-sm text-gray-600">Total Development Cost</div>
              <div className="text-lg font-semibold">{formatCurrency(totalDevCost)}</div>
            </div>
            <div className="p-3 rounded bg-gray-100">
              <div className="text-sm text-gray-600">Total Investment Cost</div>
              <div className="text-lg font-semibold">{formatCurrency(totalInvestmentCost)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Equity Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={equityData}
                    innerRadius={60}
                    outerRadius={80}
                    dataKey="value"
                    isAnimationActive={false}
                  >
                    {equityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-8">
              {/* Developer Section */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label style={{ color: equityData[0].color }} className="font-medium">
                    Developer (Daniel)
                  </label>
                  <span className="font-medium">{formatPercent(equityData[0].value)}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2 w-full text-right">
                  {formatCurrency(riskAdjustedValuation * equityData[0].value / 100)}
                </div>
                <Slider 
                  value={[equityData[0].value]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => handleEquityChange(0, value)}
                />
              </div>

              {/* Investment Group Section */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label style={{ color: equityData[1].color }} className="font-medium">
                    Investment Group
                  </label>
                  <span className="font-medium">{formatPercent(equityData[1].value)}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2 w-full text-right">
                  {formatCurrency(riskAdjustedValuation * equityData[1].value / 100)}
                </div>
                <Slider 
                  value={[equityData[1].value]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => handleEquityChange(1, value)}
                />
                <div className="text-sm text-gray-600 space-y-1 mt-2">
                  <div className="flex justify-between">
                    <span>Per Investor Value:</span>
                    <span>{formatCurrency(investmentGroupValue / 3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investment Multiple:</span>
                    <span>{investmentMultiple.toFixed(1)}x</span>
                  </div>
                </div>
              </div>

              {/* Designer Section */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label style={{ color: equityData[2].color }} className="font-medium">
                    Designer (Isaac)
                  </label>
                  <span className="font-medium">{formatPercent(equityData[2].value)}</span>
                </div>
                <div className="text-sm text-gray-600 mb-2 w-full text-right">
                  {formatCurrency(riskAdjustedValuation * equityData[2].value / 100)}
                </div>
                <Slider 
                  value={[equityData[2].value]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([value]) => handleEquityChange(2, value)}
                />
              </div>

              {/* Reserved Section */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label style={{ color: equityData[3].color }} className="font-medium">
                    Reserved
                  </label>
                  <span className="font-medium">{formatPercent(equityData[3].value)}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(riskAdjustedValuation * equityData[3].value / 100)}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EquityCalculator;