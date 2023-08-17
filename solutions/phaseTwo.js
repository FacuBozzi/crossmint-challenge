const axios = require("axios");

const baseUrl = "https://challenge.crossmint.io";
const candidateId = "bdf28f04-32b9-41e9-862b-9d5d61cc4743";

//delay function for the API calls (so requests dont fail)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const astralTypes = {
  BLUE_SOLOON: { type: "soloons", color: "blue" },
  RED_SOLOON: { type: "soloons", color: "red" },
  PURPLE_SOLOON: { type: "soloons", color: "purple" },
  WHITE_SOLOON: { type: "soloons", color: "white" },
  UP_COMETH: { type: "comeths", direction: "up" },
  DOWN_COMETH: { type: "comeths", direction: "down" },
  LEFT_COMETH: { type: "comeths", direction: "left" },
  RIGHT_COMETH: { type: "comeths", direction: "right" },
  POLYANET: { type: "polyanets" },
};

async function createAstral(row, column, astralType) {
  const { type, ...additionalArguments } = astralTypes[astralType];

  const apiUrl = `${baseUrl}/api/${type}`;

  try {
    await axios.post(apiUrl, {
      row,
      column,
      candidateId,
      ...additionalArguments,
    });

    console.log(`Created ${astralType} at row ${row}, column ${column}`);
  } catch (error) {
    console.error(
      `Failed to create ${astralType} at row ${row}, column ${column}`
    );
    throw error;
  }
}

async function callAPIsWithRateLimit(positions, delayMs, astralType) {
  for (const astral of positions) {
    await delay(delayMs);
    createAstral(astral.row, astral.column, astralType);
  }
}

// Main function to handle goal map result
async function handleGoalMapResult(result) {
  const astralPositions = {};

  //set up the data structure needed for subsequent API calls based on the type and position of astral entities
  for (let row = 0; row < result.length; row++) {
    for (let column = 0; column < result[row].length; column++) {
      const astralType = result[row][column];
      if (astralTypes[astralType]) {
        if (!astralPositions[astralType]) {
          astralPositions[astralType] = [];
        }
        astralPositions[astralType].push({ row, column });
      }
    }
  }

  // Wait for the specified delay before making the request
  const delayMs = 1000;

  for (const astralType in astralPositions) {
    await callAPIsWithRateLimit(
      astralPositions[astralType],
      delayMs,
      astralType
    );
  }
}

const goalMapAPI = {
  method: "get",
  maxBodyLength: Infinity,
  url: `${baseUrl}/api/map/${candidateId}/goal`,
  headers: {},
};

axios
  .request(goalMapAPI)
  .then((response) => {
    handleGoalMapResult(response.data.goal);
  })
  .catch((error) => {
    console.error(error);
  });
