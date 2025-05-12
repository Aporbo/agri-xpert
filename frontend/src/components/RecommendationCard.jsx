import React from 'react';
import { FaSeedling, FaLeaf, FaTint } from 'react-icons/fa';

function RecommendationCard({ recommendation }) {
  if (!recommendation) return null;

  const { cropRecommendation, fertilizerRecommendation, irrigationRecommendation, score = 85 } = recommendation;

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-md shadow-sm">
      <h3 className="text-lg font-bold text-green-800 mb-3">🌾 Smart Recommendation</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Crop */}
        <div className="flex items-start gap-3">
          <FaSeedling className="text-green-600 text-xl mt-1" />
          <div>
            <p className="font-semibold">Recommended Crop:</p>
            <p className="text-gray-700">{cropRecommendation || 'N/A'}</p>
          </div>
        </div>

        {/* Fertilizer */}
        <div className="flex items-start gap-3">
          <FaLeaf className="text-yellow-600 text-xl mt-1" />
          <div>
            <p className="font-semibold">Fertilizer Suggestion:</p>
            <p className="text-gray-700">{fertilizerRecommendation || 'N/A'}</p>
          </div>
        </div>

        {/* Irrigation */}
        <div className="flex items-start gap-3">
          <FaTint className="text-blue-600 text-xl mt-1" />
          <div>
            <p className="font-semibold">Irrigation Advice:</p>
            <p className="text-gray-700">{irrigationRecommendation || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mt-5">
        <p className="text-sm text-gray-600 mb-1">Suitability Score</p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full ${score >= 70 ? 'bg-green-500' : 'bg-yellow-500'}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-right text-gray-500 mt-1">{score}%</p>
      </div>
    </div>
  );
}

export default RecommendationCard;
