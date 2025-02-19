'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Switch } from '@/components/ui/switch';

const EquityCalculator = () => {
    const [numUsers, setNumUsers] = useState(100);
    const [revenuePerUser, setRevenuePerUser] = useState(1000);
    const [valuationMultiple, setValuationMultiple] = useState(10);
    const [successProbability, setSuccessProbability] = useState(50);
    const [monthsOfDev, setMonthsOfDev] = useState(4);
    const [apiCostMonthly, setApiCostMonthly] = useState(25);
    const [isHourlyMode, setIsHourlyMode] = useState(false);
    const [hourlyRate, setHourlyRate] = useState(62.50);
    const [designerWeeklyPay, setDesignerWeeklyPay] = useState(200);
    
    const [equityData, setEquityData] = useState([
      { name: 'Developer (Daniel)', value: 35, color: '#4F46E5' },
      { name: 'Investment Group', value: 35, color: '#10B981' },
      { name: 'Designer (Isaac)', value: 5, color: '#F59E0B' },
      { name: 'Reserved', value: 25, color: '#6B7280' }
    ]);
  
    // Calculate total hours
    const totalHours = monthsOfDev * 20 * 4; // 20 hours per week * ~4 weeks per month
    
    // Calculate designer monthly pay
      // Update cost calculations
  const designerMonthlyPay = designerWeeklyPay * 4;
  const designerTotalCost = designerMonthlyPay * monthsOfDev;
  
  const getStandardMonthlyPay = () => {
    const totalMonthlyBudget = 5000;
    return totalMonthlyBudget - designerMonthlyPay;
  };

  
    function calculateDevPayFromEquity(equity: number) {
      const standardMonthlyPay = getStandardMonthlyPay();
      const maxPay = standardMonthlyPay * (12000/5000); // Scale max pay proportionally
      const standardPay = standardMonthlyPay;
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
    }
  
    const devPayMonthly = isHourlyMode 
    ? hourlyRate * 20 * 4
    : calculateDevPayFromEquity(equityData[0].value);
  
  const devPayWeekly = devPayMonthly / 4;
  const devPayHourly = devPayMonthly / (20 * 4);
  const devTotalCost = devPayMonthly * monthsOfDev;

  const annualRevenue = numUsers * revenuePerUser;
  const baseValuation = annualRevenue * valuationMultiple;
  const riskAdjustedValuation = baseValuation * (successProbability / 100);
  
  // Update total development and investment costs
  const totalDevCost = devTotalCost + designerTotalCost;
  const totalApiCost = apiCostMonthly * monthsOfDev;
  const totalInvestmentCost = totalDevCost + totalApiCost;

  const investmentGroupEquity = equityData[1].value;
  const investmentGroupValue = riskAdjustedValuation * (investmentGroupEquity / 100);
  const investmentMultiple = investmentGroupValue / totalInvestmentCost;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };


  const breakdownSection = (
    <div className="grid grid-cols-4 gap-4 mt-4">
      <div className="p-3 rounded bg-gray-50 border">
        <div className="text-sm text-gray-600">Dev Total</div>
        <div className="text-lg font-semibold">{formatCurrency(devTotalCost)}</div>
        <div className="text-xs text-gray-500">
          {formatCurrency(devPayMonthly)}/mo
        </div>
      </div>
      <div className="p-3 rounded bg-gray-50 border">
        <div className="text-sm text-gray-600">Designer Total</div>
        <div className="text-lg font-semibold">{formatCurrency(designerTotalCost)}</div>
        <div className="text-xs text-gray-500">
          {formatCurrency(designerMonthlyPay)}/mo
        </div>
      </div>
      <div className="p-3 rounded bg-gray-50 border">
        <div className="text-sm text-gray-600">Dev Hourly</div>
        <div className="text-lg font-semibold">{formatCurrency(devPayHourly)}/hr</div>
        <div className="text-xs text-gray-500">
          {formatCurrency(devPayWeekly)}/wk
        </div>
      </div>
      <div className="p-3 rounded bg-gray-50 border">
        <div className="text-sm text-gray-600">Total Investment</div>
        <div className="text-lg font-semibold">{formatCurrency(totalInvestmentCost)}</div>
        <div className="text-xs text-gray-500">
          {monthsOfDev} months
        </div>
      </div>
    </div>
  );
    

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

      <Card className="border shadow-sm">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Investment Costs</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-normal">Equity-based pay</span>
              <Switch 
                checked={isHourlyMode}
                onCheckedChange={setIsHourlyMode}
              />
              <span className="text-sm font-normal">Hourly rate</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <label>Development Period: {monthsOfDev} months</label>
              <span>Total Hours: {totalHours}</span>
            </div>
            <Slider 
              value={[monthsOfDev]}
              min={3}
              max={12}
              step={1}
              onValueChange={([value]) => setMonthsOfDev(value)}
              className="[&>.relative>.bg-primary]:bg-blue-600"
            />
          </div>

          {isHourlyMode && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <label>Developer Hourly Rate: {formatCurrency(hourlyRate)}</label>
                <span>Weekly: {formatCurrency(devPayWeekly)}</span>
              </div>
              <Slider 
                value={[hourlyRate]}
                min={25}
                max={150}
                step={5}
                onValueChange={([value]) => setHourlyRate(value)}
                className="[&>.relative>.bg-primary]:bg-blue-600"
              />
            </div>
          )}

          <div className="space-y-2">
            <div className="flex justify-between">
              <label>Designer Weekly Pay: {formatCurrency(designerWeeklyPay)}</label>
              <span>Monthly: {formatCurrency(designerMonthlyPay)}</span>
            </div>
            <Slider 
              value={[designerWeeklyPay]}
              min={100}
              max={500}
              step={50}
              onValueChange={([value]) => setDesignerWeeklyPay(value)}
              className={`[&>.relative>.bg-primary]:bg-[${equityData[2].color}]`}
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
              className="[&>.relative>.bg-primary]:bg-blue-600"
            />
          </div>

          {breakdownSection}

        </CardContent>
      </Card>

      <Card className="border shadow-sm">
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
              {equityData.map((equity, index) => (
                index !== 3 && (
                  <div key={equity.name} className="space-y-2">
                    <div className="flex justify-between">
                      <label style={{ color: equity.color }} className="font-medium">
                        {equity.name}
                      </label>
                      <span className="font-medium">{formatPercent(equity.value)}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2 w-full text-right">
                      {formatCurrency(riskAdjustedValuation * equity.value / 100)}
                    </div>
                    <Slider 
                      value={[equity.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([value]) => handleEquityChange(index, value)}
                      className={`[&>.relative>.bg-primary]:bg-[${equity.color}]`}
                    />
                    {index === 1 && (
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
                    )}
                  </div>
                )
              ))}

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