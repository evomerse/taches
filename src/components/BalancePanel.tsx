import React from 'react';
import { Scale, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { BalanceCounter, FamilyMember } from '../types';

interface BalancePanelProps {
  balanceCounters: BalanceCounter[];
  familyMembers: FamilyMember[];
}

export const BalancePanel: React.FC<BalancePanelProps> = ({
  balanceCounters,
  familyMembers
}) => {
  const getMemberName = (id: string) => familyMembers.find(m => m.id === id)?.name || '';

  const sortedBalances = balanceCounters
    .map(counter => ({
      ...counter,
      name: getMemberName(counter.memberId)
    }))
    .sort((a, b) => b.netBalance - a.netBalance);

  const getBalanceIcon = (balance: number) => {
    if (balance > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (balance < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0) return 'text-green-700 bg-green-100';
    if (balance < 0) return 'text-red-700 bg-red-100';
    return 'text-gray-700 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Scale className="w-6 h-6 text-gray-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Équilibrage des tâches</h2>
            <p className="text-sm text-gray-600">Suivi des aides et remplacements</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {sortedBalances.map(balance => (
            <div key={balance.memberId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-semibold text-blue-700">
                    {balance.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">{balance.name}</span>
                  <div className="text-xs text-gray-500">
                    {balance.helpCount} aides • {balance.missedCount} remplacements
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {getBalanceIcon(balance.netBalance)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBalanceColor(balance.netBalance)}`}>
                  {balance.netBalance > 0 ? `+${balance.netBalance}` : balance.netBalance}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Comment ça marche ?</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• Balance positive (+) : a aidé plus que prévu</p>
            <p>• Balance négative (-) : a été aidé par d'autres</p>
            <p>• Balance nulle (0) : équilibre parfait</p>
          </div>
        </div>
      </div>
    </div>
  );
};