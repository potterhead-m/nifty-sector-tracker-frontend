const response = await axios.get("https://nifty-backend.onrender.com/api/getNiftySectors");
const response = await axios.get(`https://nifty-backend.onrender.com/api/getStocksBySector?sector=${sector}`);
