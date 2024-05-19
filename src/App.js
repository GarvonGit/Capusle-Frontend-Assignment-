import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [selectedStrength, setSelectedStrength] = useState("");
  const [selectedPackaging, setSelectedPackaging] = useState("");

  // Function to handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  }

  // Function to handle input blur
  const handleInputBlur = () => {
    if (query === 'Medicine') {
      setQuery('');
    }
  }

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${query}&pharmacyIds=1,2,3`
      );
      setResults(response.data.data.saltSuggestions);
      // Reset selections
      setSelectedForm("");
      setSelectedStrength("");
      setSelectedPackaging("");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFormSelection = (form) => {
    setSelectedForm(form);
    setSelectedStrength("");
    setSelectedPackaging("");
  };

  const handleStrengthSelection = (strength) => {
    setSelectedStrength(strength);
    setSelectedPackaging("");
  };

  const handlePackagingSelection = (packaging) => {
    setSelectedPackaging(packaging);
  };
return(
  <div className="App">
  <header className="App-header">
    <h1>Cappsule Web Development Test</h1>
    <div className="search-container">
      <div className="search-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="black"
        >
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          <path fill="none" d="M0 0h24v24H0z"/>
        </svg>
      </div>
      <input
        type="text"
        placeholder="Type your medicine name here"
        className="search-input"
        value={query}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
      />
      <button className="search-button" onClick={handleSearch}>
        Search
      </button>
    </div>
    <p className="caption">Find medicines with amazing discount</p>
    <div className="results">
      {results.map((salt) => (
        <div key={salt.id} className="card">
              <div className="card-header">
                <div className="form-buttons">
                  {Object.keys(salt.salt_forms_json).map((form, index) => (
                    <button
                      key={index}
                      className={`form-button ${
                        selectedForm === form ? "selected" : ""
                      }`}
                      onClick={() => handleFormSelection(form)}
                    >
                      {form}
                    </button>
                  ))}
                </div>
                {selectedForm && (
                  <div className="strength-buttons">
                    {Object.keys(salt.salt_forms_json[selectedForm]).map(
                      (strength, index) => (
                        <button
                          key={index}
                          className={`strength-button ${
                            selectedStrength === strength ? "selected" : ""
                          }`}
                          onClick={() => handleStrengthSelection(strength)}
                        >
                          {strength}
                        </button>
                      )
                    )}
                  </div>
                )}
                {selectedStrength && (
                  <div className="packaging-buttons">
                    {Object.keys(
                      salt.salt_forms_json[selectedForm][selectedStrength]
                    ).map((packaging, index) => (
                      <button
                        key={index}
                        className={`packaging-button ${
                          selectedPackaging === packaging ? "selected" : ""
                        }`}
                        onClick={() => handlePackagingSelection(packaging)}
                      >
                        {packaging}
                      </button>
                    ))}
                  </div>
                )}
                <div className="salt-info">
                  <h2>{salt.salt}</h2>
                  <p>
                    {salt.most_common.Form} | {salt.most_common.Strength} |{" "}
                    {salt.most_common.Packing}
                  </p>
                </div>
                <div className="price-info">
                  {selectedForm &&
                  selectedStrength &&
                  selectedPackaging &&
                  salt.salt_forms_json[selectedForm][selectedStrength][
                    selectedPackaging
                  ] ? (
                    <p>
                      From ₹
                      {Math.min(
                        ...salt.salt_forms_json[selectedForm][selectedStrength][
                          selectedPackaging
                        ].map((item) => item.selling_price)
                      )}
                    </p>
                  ) : (
                    <p>No stores selling this product near you</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </header>
    </div>
  );
}

export default App;
