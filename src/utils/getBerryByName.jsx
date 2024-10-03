import React, { useEffect, useState } from 'react';
import { getBerryByName } from '../utils/pokeApiUtils'; 

const BerryDetails = ({ berryName }) => {
  const [berryDetails, setBerryDetails] = useState(null);

  useEffect(() => {
    const fetchBerryDetails = async () => {
      const data = await getBerryByName(berryName);
      setBerryDetails(data);
    };

    fetchBerryDetails();
  }, [berryName]);

  return (
    <div>
      {berryDetails ? (
        <div>
          <h2>{berryDetails.name}</h2>
          <p>Firmness: {berryDetails.firmness.name}</p>
          <p>Flavor: {berryDetails.flavor?.name}</p>
          {/* Display other berry details */}
        </div>
      ) : (
        <p>Loading berry details...</p>
      )}
    </div>
  );
};

export default BerryDetails;
