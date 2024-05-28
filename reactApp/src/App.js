import logo from './logo.svg';
import './App.css';
import SearchForm from './Components/SearchForm';
import { useState } from 'react';
import axios from 'axios';
import OpportunityList from './Components/OpportunityList';

const App = () => {
  const [opportunities, setOpportunities] = useState([]);
  // const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const handleSearch = async (keyword) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/opportunities?keyword=${keyword}`);
      // const opportunitiesData = await Promise.all(response.data.map(async (item) => {
      //   const aiSummaryResponse = await axios.post('http://localhost:5000/api/summarize', { text: item.description });
      //   return {
      //     ...item,
      //     aiSummary: aiSummaryResponse.data.summary
      //   };
      // }));
      // setOpportunities(opportunitiesData);
      setOpportunities(response.data);
    } catch (error) {
      console.error(`Error Fetching opportunities, ${error}`);
    }
  }
  return (
    <>
      <h1>Government Contract Opportunities</h1>
      <SearchForm onSearch={handleSearch} />
      <OpportunityList opportunities={opportunities}/>
    </>
  )
};



export default App;
