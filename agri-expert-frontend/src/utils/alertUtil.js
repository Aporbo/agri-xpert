export function generateAlertMessage(soilTest, weather) {
    const alerts = [];
  
    if (soilTest && (soilTest.pH < 5.5 || soilTest.pH > 8.0)) {
      alerts.push(`⚠️ Abnormal soil pH (${soilTest.pH}). Consider liming or acidifying.`);
    }
  
    if (soilTest && soilTest.moisture < 30) {
      alerts.push('💧 Soil moisture is low. Irrigation recommended.');
    }
  
    if (weather && weather.humidity > 85) {
      alerts.push('🌫️ High humidity. Risk of fungal disease.');
    }
  
    return alerts;
  }
  